import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import {
  User,
  Lock,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    nama_pengguna: "",
    tanggal_lahir: "",
    alamat: "",
    jenis_kelamin: "",
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (form.password.length < 4) {
      alert("⚠️ Password minimal 4 karakter!");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("pengguna").insert([
      {
        ...form,
        role: "user",
        buat_akun: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("Gagal registrasi: " + error.message);
      setIsLoading(false);
    } else {
      setShowSuccess(true);
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans text-slate-200 py-10 px-4">
      {/* Glow Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30rem] h-[30rem] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35rem] h-[35rem] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col lg:flex-row">
          {/* Panel Kiri (Informasi) */}
          <div className="lg:w-1/3 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 p-8 lg:p-12 flex flex-col justify-center items-center text-center border-b lg:border-b-0 lg:border-r border-slate-800">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-24 h-24 bg-slate-900 shadow-2xl rounded-[2rem] flex items-center justify-center mb-8 border border-slate-800"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-14 h-14 object-contain brightness-110"
              />
            </motion.div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">
              Bergabunglah
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              Mulai perjalanan Anda bersama Sistem Pakar RS Bala Keselamatan
              Bokor.
            </p>
            <div className="hidden lg:flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 text-left">
                <div className="text-blue-400 bg-blue-400/10 p-2 rounded-lg">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Akses Cepat
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Konsultasi pakar instan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Kanan (Form) */}
          <div className="lg:w-2/3 p-8 lg:p-12">
            <header className="mb-10">
              <h3 className="text-2xl font-bold text-white">Buat Akun Baru</h3>
              <p className="text-slate-500 text-sm mt-1 font-medium text-wrap">
                Lengkapi detail di bawah untuk mendaftar sistem.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Baris 1: Nama & Tanggal Lahir */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="nama_pengguna"
                      placeholder="Contoh: Henry Chris"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium"
                      value={form.nama_pengguna}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Tanggal Lahir
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="date"
                      name="tanggal_lahir"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium [color-scheme:dark]"
                      value={form.tanggal_lahir}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Alamat Domisili
                </label>
                <div className="relative group">
                  <MapPin
                    className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <textarea
                    name="alamat"
                    rows="2"
                    placeholder="Masukkan alamat lengkap"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium resize-none"
                    value={form.alamat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Jenis Kelamin
                </label>
                <div className="relative group">
                  <Users
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <select
                    name="jenis_kelamin"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium appearance-none cursor-pointer"
                    value={form.jenis_kelamin}
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-500">
                      Pilih Jenis Kelamin
                    </option>
                    <option value="Laki-laki" className="bg-slate-900">
                      Laki-laki
                    </option>
                    <option value="Perempuan" className="bg-slate-900">
                      Perempuan
                    </option>
                  </select>
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Username
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username unik"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimal 4 karakter"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white font-medium"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Daftar Akun</span> <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
                <Link
                  to="/"
                  className="flex-1 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <ArrowLeft size={18} /> Batal
                </Link>
              </div>
            </form>

            <p className="text-center text-sm font-medium text-slate-500 mt-10">
              Sudah memiliki akses?{" "}
              <Link
                to="/login"
                className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
              >
                Login ke Portal
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="mb-6 flex justify-center text-green-400">
                <CheckCircle2 size={60} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Registrasi Sukses
              </h3>
              <p className="text-slate-400 font-medium mb-8">
                Akun Anda berhasil dibuat. Mengalihkan ke halaman login...
              </p>
              <div className="inline-flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <Loader2 className="animate-spin" size={14} />
                Memproses Sesi...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
