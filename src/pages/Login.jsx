import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import {
  User,
  Lock,
  ArrowRight,
  Home,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("username", username.trim())
        .maybeSingle();

      if (error || !data || data.password !== password) {
        alert("Username atau password salah!");
        setIsLoading(false);
        return;
      }

      // Simpan data ke localStorage
      localStorage.setItem("user", JSON.stringify(data));

      setLoginUser(data);
      setShowSuccess(true);
      setIsLoading(false);

      // Delay 2 detik untuk menampilkan modal sukses sebelum pindah halaman
      setTimeout(() => {
        const targetPath =
          data.role === "admin" || data.role === "dokter"
            ? "/dashboard"
            : "/home";

        // Mengirim state ke halaman tujuan
        navigate(targetPath, {
          state: {
            loginSuccess: true,
            userName: data.nama || data.username,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan pada sistem.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans text-slate-200">
      {/* Background Glow Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto w-full">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-20 h-20 bg-slate-900 shadow-2xl rounded-3xl flex items-center justify-center mb-6 border border-slate-800">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-20 h-20 object-contain brightness-110"
              />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight text-center">
              Portal <span className="text-blue-400">Pakar</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2 text-center text-sm">
              RS Bala Keselamatan “Bokor” Turen
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                  User Access
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white placeholder:text-slate-600 font-medium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Security Key
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none text-white placeholder:text-slate-600 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-400 transition-colors"
              >
                <Home size={16} /> Beranda Utama
              </Link>
              <p className="text-sm font-medium text-slate-500">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
              Rumah Sakit Bala Keselamatan Bokor
            </p>
            <p className="text-xs text-slate-500 mt-2">
              © 2025 Expert System by{" "}
              <span className="text-slate-300 font-bold">
                Henry Chris Ravindra
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="mb-6 flex justify-center text-green-400">
                <CheckCircle2 size={60} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Login Berhasil
              </h3>
              <p className="text-slate-400 font-medium mb-8">
                Selamat bekerja, <br />
                <span className="text-blue-400 font-bold">
                  {loginUser?.nama || loginUser?.username}
                </span>
              </p>
              <div className="flex items-center justify-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <Loader2 className="animate-spin" size={14} />
                Menyiapkan Ruang Kerja...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
