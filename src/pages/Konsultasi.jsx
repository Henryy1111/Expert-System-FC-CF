import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HasilKonsultasi from "./HasilKonsultasi";

const AMBANG_CF = 0.4;

const Konsultasi = () => {
  const navigate = useNavigate();
  const [gejala, setGejala] = useState([]);
  const [jawabanOptions, setJawabanOptions] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasilDiagnosa, setHasilDiagnosa] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Ambil data user dari localStorage (asumsi login manual menyimpan data di sini)
  // Jika Anda menyimpan data login dengan nama lain, silakan ganti 'user'
  const userSession = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cek Sesi (Manual Check)
        if (!userSession) {
          alert("Silakan login terlebih dahulu.");
          navigate("/login");
          return;
        }

        // 2. Load Data Gejala & Bobot
        const { data: dataGejala } = await supabase
          .from("gejala")
          .select("*")
          .order("id_gejala");

        const { data: dataBobot } = await supabase
          .from("bobotcf")
          .select("*")
          .order("nilaicf", { ascending: true });

        setGejala(dataGejala || []);
        setJawabanOptions(dataBobot || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userSession]);

  const handleSelectJawaban = (idGejala, nilai) => {
    setJawabanUser((prev) => ({ ...prev, [idGejala]: nilai }));
  };

  const hitungCF = async () => {
    setIsCalculating(true);
    try {
      // 1. Ambil Data Master Database
      const { data: dataRules } = await supabase.from("rule").select("*");
      const { data: dataDetailRules } = await supabase
        .from("detail_rule")
        .select("*");
      const { data: dataPenyakit } = await supabase
        .from("penyakit")
        .select("*");
      const { data: dataBobotMaster } = await supabase
        .from("bobotcf")
        .select("*");

      const bobotMap = Object.fromEntries(
        dataBobotMaster.map((b) => [b.id_bobotcf, b.nilaicf || b.nilaiCF])
      );

      // 2. Filter Jawaban User
      const fakta = {};
      Object.entries(jawabanUser).forEach(([id, nilai]) => {
        const val = parseFloat(nilai);
        if (val >= AMBANG_CF) fakta[id] = val;
      });

      if (Object.keys(fakta).length === 0) {
        alert("Pilih gejala dengan tingkat keyakinan minimal 'Sedikit Yakin'.");
        setIsCalculating(false);
        return;
      }

      // 3. Algoritma Certainty Factor
      const cf_hasil_per_penyakit = {};
      dataRules.forEach((rule) => {
        const details = dataDetailRules.filter(
          (d) => d.id_rule === rule.id_rule
        );
        let cf_array = [];
        details.forEach((detail) => {
          const cf_pakar = parseFloat(bobotMap[detail.id_bobotcf] || 0);
          if (fakta[detail.id_gejala]) {
            cf_array.push(fakta[detail.id_gejala] * cf_pakar);
          }
        });

        if (cf_array.length > 0) {
          let cf_final = cf_array[0];
          for (let i = 1; i < cf_array.length; i++) {
            cf_final = cf_final + cf_array[i] * (1 - cf_final);
          }
          cf_hasil_per_penyakit[rule.id_penyakit] = Math.max(
            cf_hasil_per_penyakit[rule.id_penyakit] || 0,
            cf_final
          );
        }
      });

      // 4. Urutkan Hasil
      const hasilSemua = dataPenyakit
        .map((p) => ({
          id_penyakit: p.id_penyakit,
          nama_penyakit: p.nama_penyakit,
          cf: Number(
            ((cf_hasil_per_penyakit[p.id_penyakit] || 0) * 100).toFixed(2)
          ),
        }))
        .sort((a, b) => b.cf - a.cf);

      // 5. PROSES SIMPAN (MENGGUNAKAN ID DARI LOCALSTORAGE)
      // Karena Hendrik (ID 6) sudah login, kita ambil ID-nya langsung dari session
      if (!userSession || !userSession.id_pengguna) {
        throw new Error("ID Pengguna tidak ditemukan. Silakan login ulang.");
      }

      const currentUserId = userSession.id_pengguna; // Otomatis angka 6 jika Hendrik
      const diagnosaUtama = hasilSemua[0];

      // A. Simpan ke Tabel Konsultasi
      const { data: insertedKonsul, error: errorK } = await supabase
        .from("konsultasi")
        .insert([
          {
            id_pengguna: currentUserId,
            id_penyakit: diagnosaUtama.id_penyakit,
            tanggal_konsultasi: new Date().toISOString(),
            cf_total: diagnosaUtama.cf / 100,
          },
        ])
        .select();

      if (errorK) throw new Error("Gagal simpan konsultasi: " + errorK.message);

      // B. Simpan ke Tabel Detail Konsultasi
      const idKonsulBaru = insertedKonsul[0].id_konsultasi;
      const detailInserts = Object.entries(jawabanUser).map(([idG, nilai]) => ({
        id_konsultasi: idKonsulBaru,
        id_gejala: idG,
        nilaicf_pengguna: parseFloat(nilai),
      }));

      await supabase.from("detail_konsultasi").insert(detailInserts);

      // 6. Tampilkan Hasil Ke Layar
      setHasilDiagnosa({
        diagnosaUtama,
        hasilSemua,
        gejalaDipilih: gejala
          .filter((g) => jawabanUser[g.id_gejala])
          .map((g) => ({
            id_gejala: g.id_gejala,
            deskripsi: g.deskripsi_gejala,
            nilaicf: jawabanUser[g.id_gejala],
          })),
      });
    } catch (err) {
      console.error("Error Detail:", err);
      alert("Proses Gagal: " + err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(jawabanUser).length !== gejala.length) {
      alert("Mohon lengkapi semua pertanyaan gejala.");
      return;
    }
    hitungCF();
  };

  if (loading || isCalculating) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-blue-500" size={64} />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {isCalculating ? "Menghitung & Menyimpan..." : "Memuat Data..."}
        </h2>
      </div>
    );
  }

  if (hasilDiagnosa) {
    return (
      <HasilKonsultasi
        dataHasil={hasilDiagnosa}
        onBack={() => setHasilDiagnosa(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Konten UI tetap sama */}
        <header className="mb-12">
          <Link
            to="/home"
            className="inline-flex items-center text-slate-400 hover:text-blue-400 gap-2 mb-4"
          >
            <ChevronLeft size={20} /> Kembali ke Home
          </Link>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="text-blue-400" size={32} />
            <h1 className="text-3xl font-extrabold text-white">
              Form Konsultasi
            </h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {gejala.map((g, i) => (
              <motion.div
                key={g.id_gejala}
                className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-3xl"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-blue-500 uppercase">
                      Gejala {i + 1}
                    </span>
                    <h3 className="text-lg font-medium text-slate-200 mt-2">
                      Apakah Anda mengalami{" "}
                      <span className="text-blue-400">
                        "{g.deskripsi_gejala}"
                      </span>
                      ?
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {jawabanOptions.map((opt) => (
                      <button
                        key={opt.id_bobotcf}
                        type="button"
                        onClick={() =>
                          handleSelectJawaban(g.id_gejala, opt.nilaicf)
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          jawabanUser[g.id_gejala] === opt.nilaicf
                            ? "bg-blue-600 border-blue-400 text-white"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {opt.nilaicf === 1
                          ? "Sangat Yakin"
                          : opt.nilaicf === 0.8
                          ? "Yakin"
                          : opt.nilaicf === 0.6
                          ? "Cukup Yakin"
                          : opt.nilaicf === 0.4
                          ? "Sedikit Yakin"
                          : opt.nilaicf === 0.2
                          ? "Mungkin"
                          : "Tidak"}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="sticky bottom-8 p-6 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-between shadow-2xl backdrop-blur-md">
            <p className="text-sm text-slate-400">
              Terjawab {Object.keys(jawabanUser).length} dari {gejala.length}
            </p>
            <button
              type="submit"
              disabled={Object.keys(jawabanUser).length !== gejala.length}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2"
            >
              <Sparkles size={18} /> Kirim Diagnosa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Konsultasi;
