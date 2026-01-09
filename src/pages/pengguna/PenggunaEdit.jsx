import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  UserCircle,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenggunaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id_pengguna", id)
        .single();

      if (error) {
        showToast("error", "Gagal mengambil data: " + error.message);
      } else {
        setForm(data);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const { error } = await supabase
      .from("pengguna")
      .update({
        nama_pengguna: form.nama_pengguna,
        tanggal_lahir: form.tanggal_lahir,
        alamat: form.alamat,
        jenis_kelamin: form.jenis_kelamin,
        username: form.username,
        password: form.password,
        role: form.role,
      })
      .eq("id_pengguna", id);

    if (error) {
      showToast("error", error.message);
    } else {
      showToast("success", "Profil berhasil diperbarui");
      setTimeout(() => navigate("/pengguna"), 1500);
    }
    setUpdating(false);
  };

  return (
    <AdminLayout>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="h-20 w-20 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl"
            >
              <UserCircle className="text-blue-600 w-12 h-12" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Edit Profil
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                ID Pengguna:{" "}
                <span className="font-mono text-blue-500">#{id}</span>
              </p>
            </div>
          </div>

          <Link
            to="/pengguna"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-sm">Kembali</span>
          </Link>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse">
              Menyiapkan Data...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
              {/* SECTION: IDENTITAS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <User className="text-blue-500" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    Identitas Diri
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama_pengguna"
                      value={form.nama_pengguna}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest text-left block">
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
                        value={form.tanggal_lahir || ""}
                        onChange={handleChange}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
                      Jenis Kelamin
                    </label>
                    <select
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
                      Role Sistem
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
                  <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
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
                      value={form.alamat || ""}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: KEAMANAN */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Lock className="text-blue-500" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    Keamanan Akun
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
                      Username
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:shadow-2xl hover:shadow-blue-500/40 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {updating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {updating
                    ? "Menyimpan Perubahan..."
                    : "Perbarui Data Pengguna"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
