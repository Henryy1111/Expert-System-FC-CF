import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Stethoscope,
  CheckCircle,
  XCircle,
  Hash,
  Activity,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenyakitCreate() {
  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [saving, setSaving] = useState(false);

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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kode || !nama) {
      showToast("error", "Harap lengkapi semua data wajib");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("penyakit")
      .insert([{ kode_penyakit: kode, nama_penyakit: nama }]);

    if (error) {
      showToast("error", "Database error: " + error.message);
      setSaving(false);
    } else {
      showToast("success", "Data penyakit berhasil didaftarkan");
      setTimeout(() => navigate("/penyakit"), 1500);
    }
  };

  return (
    <AdminLayout>
      {/* PREMIUM TOAST */}
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

      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-500/20"
          >
            <Stethoscope className="text-white w-8 h-8" />
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Tambah Penyakit
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Tambahkan entitas medis baru ke dalam basis pengetahuan.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            <div className="space-y-8">
              {/* KODE PENYAKIT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-slate-400 uppercase tracking-widest font-black text-[10px]">
                  <Hash size={14} className="text-indigo-500" />
                  <span>Kode Penyakit</span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value.toUpperCase())}
                    placeholder="Contoh: P001"
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      Wajib Diisi
                    </span>
                  </div>
                </div>
              </div>

              {/* NAMA PENYAKIT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-slate-400 uppercase tracking-widest font-black text-[10px]">
                  <Activity size={14} className="text-indigo-500" />
                  <span>Nama Penyakit</span>
                </div>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama penyakit secara detail..."
                  className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
              <Link
                to="/penyakit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all"
              >
                <ArrowLeft size={18} /> Kembali
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 shadow-2xl shadow-indigo-500/30 disabled:opacity-50 transition-all active:scale-95"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Memproses Data..." : "Simpan Penyakit"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* INFO FOOTER */}
        <p className="text-center text-slate-400 text-xs font-medium">
          Pastikan kode penyakit unik dan belum pernah digunakan sebelumnya
          untuk menjaga integritas basis pengetahuan.
        </p>
      </div>
    </AdminLayout>
  );
}
