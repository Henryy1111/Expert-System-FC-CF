import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Sesuaikan path lib kamu
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Loader2,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

// Import Komponen Hasil
import HasilKonsultasi from "./HasilKonsultasi";

const Konsultasi = () => {
  // --- States ---
  const [gejala, setGejala] = useState([]);
  const [jawabanOptions, setJawabanOptions] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({}); // Simpan { id_gejala: nilai_cf }
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasilDiagnosa, setHasilDiagnosa] = useState(null);
  const [user, setUser] = useState(null);

  // --- Load Initial Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil User Session
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);

        // Ambil Data Gejala
        const { data: dataGejala, error: errG } = await supabase
          .from("gejala")
          .select("*")
          .order("id_gejala", { ascending: true });

        // Ambil Data Opsi Jawaban (Bobot CF)
        const { data: dataBobot, error: errB } = await supabase
          .from("bobotcf")
          .select("*")
          .order("nilaicf", { ascending: true });

        if (errG || errB) throw errG || errB;

        setGejala(dataGejala);
        setJawabanOptions(dataBobot);
      } catch (error) {
        console.error("Error Fetching:", error.message);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, []);

  // --- Handlers ---
  const handleSelectJawaban = (idGejala, nilai) => {
    setJawabanUser((prev) => ({ ...prev, [idGejala]: nilai }));
  };

  const hitungCertaintyFactor = async () => {
    setIsCalculating(true);
    try {
      // 1. Ambil Knowledge Base / Rules
      const { data: rules, error: errR } = await supabase
        .from("detail_rule")
        .select("*, penyakit(nama_penyakit)");

      if (errR) throw errR;

      // 2. Kelompokkan & Hitung CF per Penyakit
      const groupPenyakit = {};

      rules.forEach((rule) => {
        const id_p = rule.id_penyakit;
        const cf_pakar = rule.nilaicf_pakar;
        const cf_user = jawabanUser[rule.id_gejala] || 0;

        // E x H (Evidence * Hypothesis)
        const cf_hasil = cf_pakar * cf_user;

        if (cf_hasil > 0) {
          if (!groupPenyakit[id_p]) {
            groupPenyakit[id_p] = {
              id_penyakit: id_p,
              nama_penyakit: rule.penyakit.nama_penyakit,
              cf_list: [],
            };
          }
          groupPenyakit[id_p].cf_list.push(cf_hasil);
        }
      });

      // 3. Gabungkan CF (Combine) menggunakan rumus: CFc = CF1 + CF2 * (1 - CF1)
      const listHasilPenyakit = Object.values(groupPenyakit).map((p) => {
        let cf_combine = 0;
        if (p.cf_list.length > 0) {
          cf_combine = p.cf_list[0];
          for (let i = 1; i < p.cf_list.length; i++) {
            cf_combine = cf_combine + p.cf_list[i] * (1 - cf_combine);
          }
        }
        return {
          id_penyakit: p.id_penyakit,
          nama_penyakit: p.nama_penyakit,
          cf: cf_combine * 100, // Ubah ke persen
        };
      });

      // 4. Sortir dari yang tertinggi
      const sortedHasil = listHasilPenyakit.sort((a, b) => b.cf - a.cf);

      // 5. Data Gejala yang dipilih (untuk laporan)
      const gejalaTerpilih = gejala
        .filter((g) => jawabanUser[g.id_gejala] > 0)
        .map((g) => ({
          id_gejala: g.id_gejala,
          deskripsi: g.nama_gejala || g.deskripsi_gejala,
          nilaiCF: jawabanUser[g.id_gejala],
        }));

      // 6. Set ke State Hasil
      setHasilDiagnosa({
        diagnosaUtama: sortedHasil[0] || {
          nama_penyakit: "Tidak Terdeteksi",
          cf: 0,
        },
        hasilSemua: sortedHasil,
        gejalaDipilih: gejalaTerpilih,
      });
    } catch (error) {
      alert("Proses Gagal: " + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi: pastikan semua pertanyaan dijawab
    if (Object.keys(jawabanUser).length < gejala.length) {
      alert("Mohon lengkapi semua jawaban agar diagnosa akurat.");
      return;
    }
    hitungCertaintyFactor();
  };

  // --- Render Logic ---

  // Loading Screen
  if (loading || isCalculating) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full" />
        <Loader2
          className="animate-spin text-blue-500 relative z-10"
          size={48}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 mt-4 font-medium tracking-widest uppercase text-xs z-10"
        >
          {isCalculating
            ? "Mengkalkulasi Probabilitas..."
            : "Menganalisa Data Medis"}
        </motion.p>
      </div>
    );
  }

  // Tampilan Hasil
  if (hasilDiagnosa) {
    return (
      <HasilKonsultasi
        dataHasil={hasilDiagnosa}
        onBack={() => setHasilDiagnosa(null)}
        idPengguna={user?.id}
      />
    );
  }

  // Tampilan Form Konsultasi
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-24 pt-24 md:pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left border-b border-white/5 pb-8"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <ClipboardCheck className="text-blue-500" size={24} />
            </div>
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">
              Medical Expert System
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Mulai{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Diagnosa Mandiri
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Berikan informasi akurat mengenai kondisi Anda. Sistem kami akan
            menganalisa gejala menggunakan metode Certainty Factor.
          </p>
        </motion.div>

        {/* Form Pertanyaan */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {gejala.map((g, index) => (
            <motion.div
              key={g.id_gejala}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative"
            >
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-xl md:text-2xl font-semibold text-slate-100 leading-snug mb-8 block">
                      Apakah Anda merasakan{" "}
                      <span className="text-blue-400 italic">
                        "{g.nama_gejala || g.deskripsi_gejala}"
                      </span>
                      ?
                    </label>

                    {/* Opsi Jawaban */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {jawabanOptions.map((opt) => {
                        const isActive =
                          jawabanUser[g.id_gejala] === opt.nilaicf;
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleSelectJawaban(g.id_gejala, opt.nilaicf)
                            }
                            className={`relative overflow-hidden py-4 px-2 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all duration-300 border ${
                              isActive
                                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                            }`}
                          >
                            {isActive && (
                              <Sparkles
                                size={10}
                                className="absolute top-1 right-1 text-blue-200"
                              />
                            )}
                            {opt.bobotcf}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Footer Actions */}
          <motion.div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
            <Link
              to="/home"
              className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group font-medium"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ChevronLeft size={20} />
              </div>
              Kembali ke Beranda
            </Link>

            <button
              type="submit"
              className="group relative w-full md:w-auto overflow-hidden px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="relative uppercase tracking-widest text-sm">
                Analisa Hasil Sekarang
              </span>
              <Send
                size={18}
                className="relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Konsultasi;
