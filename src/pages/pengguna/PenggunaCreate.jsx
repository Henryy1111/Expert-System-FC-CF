import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  UserPlus,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Lock,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenggunaCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    nama_pengguna: "",
    tanggal_lahir: "",
    alamat: "",
    jenis_kelamin: "",
    username: "",
    password: "",
    role: "user",
  });

  /* ================= TOAST ================= */
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(
      () => setToast({ show: false, type: "success", message: "" }),
      3000
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nama_pengguna ||
      !form.username ||
      !form.password ||
      !form.jenis_kelamin ||
      !form.role
    ) {
      showToast("error", "Harap isi semua bidang wajib (*)");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("pengguna").insert([
      {
        nama_pengguna: form.nama_pengguna,
        tanggal_lahir: form.tanggal_lahir || null,
        alamat: form.alamat,
        jenis_kelamin: form.jenis_kelamin,
        username: form.username,
        password: form.password,
        role: form.role,
      },
    ]);

    if (error) {
      showToast("error", error.message);
    } else {
      showToast("success", "Pengguna baru berhasil dibuat");
      setTimeout(() => navigate("/pengguna"), 1500);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.type === "success"
                ? "bg-emerald-500/90 border-emerald-400 text-white"
                : "bg-rose-500/90 border-rose-400 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/20"
          >
            <UserPlus className="text-white w-8 h-8" />
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Tambah Pengguna
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">
              Tambah data pengguna baru ke dalam sistem
            </p>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            {/* SECTION: INFORMASI DASAR */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="text-blue-500" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  Informasi Dasar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="nama_pengguna"
                    placeholder="Masukkan nama lengkap..."
                    value={form.nama_pengguna}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase text-left block">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={form.tanggal_lahir}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                    Jenis Kelamin *
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={form.jenis_kelamin}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Gender</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                    Hak Akses (Role) *
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="user">Pengguna</option>
                      <option value="dokter">Dokter</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                  Alamat
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />
                  <textarea
                    name="alamat"
                    rows="2"
                    placeholder="Masukkan alamat lengkap..."
                    value={form.alamat}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SECTION: KREDENSIAL KEAMANAN */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Lock className="text-blue-500" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  Kredensial Login
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                    Username *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="contoh: admin_baru"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">
                    Secure Password *
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                to="/pengguna"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all"
              >
                <ArrowLeft size={18} /> Kembali
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 shadow-2xl shadow-blue-500/40 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Simpan Data
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
