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
  Eye,
  EyeOff,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      localStorage.setItem("user", JSON.stringify(data));
      setLoginUser(data);
      setShowSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        const targetPath =
          data.role === "admin" || data.role === "dokter"
            ? "/dashboard"
            : "/home";

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
    <div className="min-h-screen w-full flex items-start lg:items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* LUXURY BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-[10%] -left-[5%] w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      {/* MAIN WRAPPER: pt-20 ditambahkan agar konten turun sedikit dari atas */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pt-16 lg:pt-24 pb-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">
          {/* LEFT SIDE: BRANDING */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col flex-1 mt-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Cpu className="text-white h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">
                Expert System
              </h2>
            </div>
            <h1 className="text-6xl font-black text-white leading-[1] mb-6 tracking-tight">
              Diagnosa Penyakit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Pengambilan Keputusan Pertama.
              </span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Akses portal sistem pakar terintegrasi untuk hasil diagnosis medis
              yang akurat dan berbasis data.
            </p>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-white font-black text-3xl tracking-tighter">
                  90%
                </span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  Tingkat Kepercayaan
                </span>
              </div>
              <div className="w-px h-12 bg-slate-800/50"></div>
              <div className="flex flex-col">
                <span className="text-white font-black text-3xl tracking-tighter">
                  Aman
                </span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  Privasi Data
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: LOGIN CARD */}
          <div className="w-full max-w-md flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl mb-4">
                <Cpu className="text-white h-9 w-9" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase italic text-center">
                Expert.Sys
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-4xl text-center font-black text-white tracking-tight">
                  Log In
                </h2>
                <p className="text-slate-400 text-center font-medium mt-2">
                  Silahkan masukkan Username dan Password Anda!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Username
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none text-white placeholder:text-slate-700 font-bold text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-12 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none text-white placeholder:text-slate-700 font-bold text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-4.5 rounded-2xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all duration-300 flex items-center justify-center gap-3 mt-8 disabled:opacity-70 text-sm tracking-widest"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-5">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                >
                  <Home size={14} /> Kembali ke Home
                </Link>
                <p className="text-[11px] font-bold text-slate-500 tracking-tight">
                  Tidak punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-400 hover:underline"
                  >
                    Silahkan melakukan registrasi!
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="mt-10 text-center flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800">
                <ShieldCheck className="text-emerald-500" size={14} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Secured & Protected
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                © 2025 EXPERT SYSTEM. HCR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[3rem] p-12 max-w-sm w-full text-center shadow-[0_0_100px_rgba(79,70,229,0.2)]"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
                />
                <div className="relative bg-slate-950 rounded-full w-full h-full flex items-center justify-center border border-indigo-500/50">
                  <CheckCircle2
                    size={48}
                    className="text-indigo-400"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                Access Granted
              </h3>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed text-sm">
                Identity verified. Selamat Datang, <br />
                <span className="text-indigo-400 font-black text-lg">
                  {loginUser?.nama || loginUser?.username}
                </span>
              </p>

              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  Initializing Workstation
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
