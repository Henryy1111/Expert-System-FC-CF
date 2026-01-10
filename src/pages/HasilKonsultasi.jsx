import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Download,
  AlertCircle,
  Stethoscope,
  Activity,
  Pill,
  FileText,
  ArrowRight,
} from "lucide-react";

const rekomendasiObat = {
  Maag: "Obat Mylanta Sirup, Promag, Polysilane. Hindari makanan pedas, jangan langsung tiduran setelah makan, dan minum jahe hangat.",
  Gastritis:
    "Antasida seperti Promag atau Mylanta, Famotidine. Kurangi alkohol, hindari pedas, dan jangan telat makan.",
  Dispepsia:
    "Prokinetik, Antasida, Omeprazole. Jaga pola makan dan hindari stres berlebihan.",
  "Dispepsia Fungsional":
    "Mylanta, Tagamet HB, Pepcid AC. Hindari kopi dan makanan pedas.",
  Gastroparesis:
    "Metoclopramide, Domperidone. Hindari soda dan konsumsi makanan lembut.",
  GERD: "Omeprazole, Polysilane. Hindari makanan asam & pedas, jangan telat makan.",
  Gastroenteritis: "Obat antidiare. Perbanyak cairan dan istirahat.",
  "Kanker Lambung":
    "Kemoterapi sesuai anjuran dokter. Jaga pola makan dan kontrol rutin.",
  "Tukak Lambung":
    "PPI seperti Omeprazole dan antibiotik jika diperlukan. Hindari makan larut malam.",
  "Tumor Lambung": "Penanganan medis lanjutan dan operasi bila diperlukan.",
};

const HasilKonsultasi = ({ dataHasil, onBack }) => {
  const { diagnosaUtama, hasilSemua, gejalaDipilih } = dataHasil;

  const saran =
    rekomendasiObat[diagnosaUtama.nama_penyakit] ||
    "Segera konsultasikan dengan tenaga medis ahli untuk penanganan lebih lanjut.";

  // Animasi Variabel
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Navigation */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* LEFT COLUMN: MAIN DIAGNOSIS */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              variants={itemVars}
              className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/20 shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Stethoscope size={120} />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Activity size={14} /> Analysis Complete
                </div>

                <h1 className="text-sm font-medium text-emerald-400/80 mb-1">
                  Hasil Diagnosa Utama:
                </h1>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  {diagnosaUtama.nama_penyakit}
                </h2>

                <div className="flex items-end gap-4">
                  <div className="text-6xl font-black text-white italic tracking-tighter">
                    {diagnosaUtama.cf.toFixed(1)}
                    <span className="text-2xl text-emerald-500/60">%</span>
                  </div>
                  <div className="mb-2 text-slate-400 text-sm font-medium">
                    Tingkat Keyakinan (Certainty Factor)
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVars}
              className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Pill className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Rekomendasi Medis
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">{saran}</p>
              <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs text-amber-500/80 leading-snug">
                  Peringatan: Hasil ini bersifat analitik sistem berdasarkan
                  data yang Anda masukkan. Tetap konsultasikan ke dokter untuk
                  validasi klinis saat kondisi kronis.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: LISTS */}
          <div className="lg:col-span-5 space-y-6">
            {/* OTHER POSSIBILITIES */}
            <motion.div
              variants={itemVars}
              className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-400" /> Kemungkinan
                Lain
              </h3>
              <div className="space-y-3">
                {hasilSemua.slice(1, 4).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-colors"
                  >
                    <span className="text-slate-300 font-medium">
                      {h.nama_penyakit}
                    </span>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                      {h.cf.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SYMPTOMS SUMMARY */}
            <motion.div
              variants={itemVars}
              className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Gejala yang Terdeteksi
              </h3>
              <div className="flex flex-wrap gap-2">
                {gejalaDipilih.map((g, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-xl bg-slate-800/50 border border-white/5 text-[11px] font-medium text-slate-400 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {g.deskripsi}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ACTION BUTTON */}
            <motion.div variants={itemVars} className="grid grid-cols-1 gap-4">
              <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-blue-400 transition-all hover:scale-[1.02] active:scale-95">
                <Download size={20} />
                Simpan Hasil Diagnosis
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HasilKonsultasi;
