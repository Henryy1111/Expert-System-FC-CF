import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Tambahkan ini
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion"; // Tambahkan AnimatePresence
import {
  ArrowRight,
  BrainCircuit,
  Zap,
  MapPin,
  Clock,
  BarChart3,
  UserCheck,
  ClipboardList,
  FileSearch,
  CheckCircle2, // Tambahkan icon check
} from "lucide-react";

export default function Home() {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // 1. Logika Smooth Scroll (Bawaan kamu)
    if (window.location.hash === "#tentang") {
      const element = document.getElementById("tentang");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }

    // 2. Logika Menangkap Login Success dari state
    if (location.state?.loginSuccess) {
      setUserName(location.state.userName);
      setShowToast(true);

      // Hilangkan notifikasi setelah 5 detik
      const timer = setTimeout(() => {
        setShowToast(false);
        // Bersihkan state agar notifikasi tidak muncul lagi saat refresh
        window.history.replaceState({}, document.title);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* --- TOAST NOTIFICATION SUCCESS --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed top-20 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/50 p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-2xl">
                <CheckCircle2 className="text-green-400" size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-black text-sm uppercase tracking-wider">
                  Login Berhasil!
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Selamat datang kembali,{" "}
                  <span className="text-blue-400 font-bold">{userName}</span>.
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
              >
                <Zap size={14} className="fill-current" /> Sistem Pakar FC & CF
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-8"
              >
                Cerdas. Akurat. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Terpercaya.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
              >
                Revolusi deteksi dini penyakit lambung menggunakan kecerdasan
                buatan yang menggabungkan logika pakar medis dengan perhitungan
                statistik presisi.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <a
                  href="/konsultasi"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black transition-all duration-300 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  MULAI DIAGNOSA <ArrowRight size={20} />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full flex justify-center lg:justify-end"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-blue-500/30 transition-all" />
                <img
                  src="/images/hero2.gif"
                  alt="Medical AI"
                  className="relative z-10 w-full max-w-[500px] h-auto rounded-[3rem] border border-slate-800 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ALUR KERJA SECTION --- */}
      <section className="py-24 bg-slate-950/50 border-y border-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">
              Workflow
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-white">
              Alur Kerja Sistem
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                img: "/images/hero3.gif",
                title: "Registrasi Pasien",
                desc: "Masuk atau buat akun untuk memulai diagnosa dan menyimpan riwayat.",
                icon: <UserCheck className="text-blue-500" />,
              },
              {
                img: "/images/hero4.gif",
                title: "Input Keluhan",
                desc: "Berikan data gejala yang Anda rasakan melalui kuesioner cerdas kami.",
                icon: <ClipboardList className="text-blue-500" />,
              },
              {
                img: "/images/hero5.gif",
                title: "Analisa Pakar",
                desc: "Dapatkan hasil diagnosa akurat beserta tingkat keyakinan (CF).",
                icon: <FileSearch className="text-blue-500" />,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-8 p-4 bg-slate-900 rounded-[2.5rem] border border-slate-800 group-hover:border-blue-500/50 transition-all">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-48 object-contain rounded-xl"
                  />
                </div>
                <div className="mb-4">{step.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- METODOLOGI SECTION --- */}
      <section id="metodologi" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-7 bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-sm"
            >
              <BrainCircuit size={40} className="text-blue-500 mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">
                Forward Chaining
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Logika penalaran dimulai dari kumpulan data gejala menuju
                kesimpulan penyakit. Sistem secara cerdas menautkan setiap fakta
                untuk menemukan hasil akhir yang logis.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-5 bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[3rem] shadow-xl shadow-blue-900/20"
            >
              <BarChart3 size={40} className="text-white mb-6 opacity-80" />
              <h3 className="text-3xl font-black text-white mb-4">
                Certainty Factor
              </h3>
              <p className="text-blue-100 font-medium leading-relaxed">
                Menghitung tingkat kepastian diagnosis. Metode ini memberikan
                hasil berupa persentase (%) keyakinan, sehingga diagnosa menjadi
                lebih terukur secara matematis.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- INSTITUTION SECTION --- */}
      <section id="tentang" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src="/images/instansi.jpg"
                  alt="RS"
                  className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="lg:w-1/2">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                RS Bala Keselamatan <br /> "Bokor" Turen
              </h3>
              <p className="text-slate-400 text-lg mb-8">
                Pusat layanan kesehatan modern di Kabupaten Malang yang
                mendukung penuh digitalisasi kesehatan dan melayani seluruh
                lapisan masyarakat.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <MapPin className="text-blue-500 shrink-0" />
                  <div>
                    <h5 className="text-white font-bold">Alamat</h5>
                    <p className="text-slate-500 text-sm">
                      Jl. Jendral Ahmad Yani No. 91 Turen, Malang.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <Clock className="text-blue-500 shrink-0" />
                  <div>
                    <h5 className="text-white font-bold">
                      Operasional Poliklinik
                    </h5>
                    <p className="text-slate-500 text-sm">
                      Senin - Jumat: 08:30 - 19:00 WIB (Sabtu-Minggu Tutup)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 relative z-10 tracking-tighter">
            Cek Kesehatan Anda Sekarang.
          </h2>
          <a
            href="/register"
            className="relative z-10 inline-flex items-center gap-3 bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl"
          >
            Mulai Sekrang <ArrowRight size={22} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
