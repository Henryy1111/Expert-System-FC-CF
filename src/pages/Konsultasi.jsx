import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Loader2,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

// 1. IMPORT KOMPONEN HASIL
import HasilKonsultasi from "./HasilKonsultasi";

const Konsultasi = () => {
  const [gejala, setGejala] = useState([]);
  const [jawabanOptions, setJawabanOptions] = useState([]);
  const [jawabanUser, setJawabanUser] = useState({});
  const [loading, setLoading] = useState(true);

  // --- STATE UNTUK HASIL ---
  const [hasilDiagnosa, setHasilDiagnosa] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataGejala } = await supabase
          .from("gejala")
          .select("*")
          .order("id_gejala", { ascending: true });
        const { data: dataBobot } = await supabase
          .from("bobotcf")
          .select("*")
          .order("nilaicf", { ascending: true });

        setGejala(dataGejala || []);
        setJawabanOptions(dataBobot || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const handleSelectJawaban = (idGejala, nilai) => {
    setJawabanUser({ ...jawabanUser, [idGejala]: nilai });
  };

  // --- LOGIKA HITUNG CERTAINTY FACTOR ---
  const hitungCF = async () => {
    setIsCalculating(true);
    try {
      // Ambil data rule dari database
      const { data: rules } = await supabase
        .from("detail_rule")
        .select("*, penyakit(nama_penyakit)");

      const skorPenyakit = {};

      rules.forEach((rule) => {
        const cf_pakar = rule.nilaicf_pakar;
        const cf_user = jawabanUser[rule.id_gejala] || 0;
        const cf_hasil = cf_pakar * cf_user;

        if (cf_hasil > 0) {
          if (!skorPenyakit[rule.id_penyakit]) {
            skorPenyakit[rule.id_penyakit] = {
              id_penyakit: rule.id_penyakit,
              nama_penyakit: rule.penyakit.nama_penyakit,
              cf_list: [],
            };
          }
          skorPenyakit[rule.id_penyakit].cf_list.push(cf_hasil);
        }
      });

      // Gabungkan CF: CFcombine = CFold + CFnew * (1 - CFold)
      const finalResult = Object.values(skorPenyakit)
        .map((p) => {
          let cf_combine = p.cf_list[0];
          for (let i = 1; i < p.cf_list.length; i++) {
            cf_combine = cf_combine + p.cf_list[i] * (1 - cf_combine);
          }
          return {
            id_penyakit: p.id_penyakit,
            nama_penyakit: p.nama_penyakit,
            cf: cf_combine * 100,
          };
        })
        .sort((a, b) => b.cf - a.cf);

      // Siapkan data untuk dikirim ke komponen hasil
      setHasilDiagnosa({
        diagnosaUtama: finalResult[0],
        hasilSemua: finalResult,
        gejalaDipilih: gejala
          .filter((g) => jawabanUser[g.id_gejala] > 0)
          .map((g) => ({
            id_gejala: g.id_gejala,
            deskripsi: g.deskripsi_gejala,
            nilaiCF: jawabanUser[g.id_gejala],
          })),
      });
    } catch (error) {
      alert("Terjadi kesalahan hitung: " + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(jawabanUser).length < gejala.length) {
      alert("Mohon lengkapi semua jawaban agar diagnosa akurat.");
      return;
    }
    hitungCF();
  };

  // --- LOGIC TAMPILAN ---

  // 1. Jika sedang loading awal atau sedang menghitung
  if (loading || isCalculating) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full" />
        <Loader2
          className="animate-spin text-blue-500 relative z-10"
          size={48}
        />
        <p className="text-slate-400 mt-4 font-medium tracking-widest uppercase text-xs z-10">
          {isCalculating
            ? "Mengkalkulasi Probabilitas..."
            : "Menganalisa Data Medis"}
        </p>
      </div>
    );
  }

  // 2. Jika diagnosa sudah selesai, tampilkan komponen HASIL
  if (hasilDiagnosa) {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    return (
      <HasilKonsultasi
        dataHasil={hasilDiagnosa}
        onBack={() => setHasilDiagnosa(null)}
        idPengguna={savedUser?.id}
      />
    );
  }

  // 3. Tampilan Form Utama (Tampilan Default)
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-24 pt-24 md:pt-32">
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
            Berikan informasi yang akurat mengenai kondisi Anda.
          </p>
        </motion.div>

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
                        "{g.nama_gejala}"
                      </span>
                      ?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {jawabanOptions.map((opt) => {
                        const isActive =
                          jawabanUser[g.id_gejala] === opt.nilaicf;
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleSelectJawaban(g.id_gejala, opt.nilaicf)
                            }
                            className={`relative py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                              isActive
                                ? "bg-blue-600 border-blue-400 text-white shadow-lg"
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

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
            <Link
              to="/home"
              className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-medium"
            >
              <ChevronLeft size={20} /> Kembali ke Beranda
            </Link>
            <button
              type="submit"
              className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-3xl shadow-2xl transition-all flex items-center gap-3"
            >
              <span className="uppercase tracking-widest text-sm">
                Analisa Hasil Sekarang
              </span>
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Konsultasi;
