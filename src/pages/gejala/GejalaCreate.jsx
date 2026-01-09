import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Stethoscope,
  CheckCircle,
  XCircle,
  Hash,
  FileText,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function GejalaCreate() {
  const navigate = useNavigate();

  const [kodeGejala, setKodeGejala] = useState("");
  const [deskripsiGejala, setDeskripsiGejala] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= TOAST STATE ================= */
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

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kodeGejala || !deskripsiGejala) {
      showToast("error", "Harap lengkapi Kode dan Deskripsi klinis");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("gejala").insert([
      {
        kode_gejala: kodeGejala.toUpperCase(),
        deskripsi_gejala: deskripsiGejala,
      },
    ]);

    if (error) {
      showToast("error", "Database Error: " + error.message);
      setLoading(false);
    } else {
      showToast("success", "Gejala klinis berhasil didaftarkan");
      setTimeout(() => navigate("/gejala"), 1500);
    }
  };

  return (
    <AdminLayout>
      {/* PREMIUM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
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
            initial={{ rotate: -15, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20"
          >
            <PlusCircle className="text-white w-8 h-8" />
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Tambah Gejala
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Tambah gejala baru ke dalam sistem pakar.
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
              {/* KODE GEJALA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-slate-400 uppercase tracking-[0.2em] font-black text-[10px]">
                  <Hash size={14} className="text-emerald-500" />
                  <span>Kode Gejala</span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={kodeGejala}
                    onChange={(e) => setKodeGejala(e.target.value)}
                    placeholder="Contoh: G001"
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Wajib
                    </span>
                  </div>
                </div>
              </div>

              {/* DESKRIPSI GEJALA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-slate-400 uppercase tracking-[0.2em] font-black text-[10px]">
                  <FileText size={14} className="text-emerald-500" />
                  <span>Deskripsi Gejala</span>
                </div>
                <textarea
                  rows="3"
                  value={deskripsiGejala}
                  onChange={(e) => setDeskripsiGejala(e.target.value)}
                  placeholder="Jelaskan detail gejala klinis di sini..."
                  className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-100 resize-none"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/gejala"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all text-sm uppercase tracking-widest"
              >
                <ArrowLeft size={18} /> Kembali
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black hover:shadow-2xl hover:shadow-emerald-500/30 disabled:opacity-50 transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {loading ? "Sinkronisasi..." : "Simpan Gejala"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* INFO FOOTER */}
        <div className="flex justify-center">
          <div className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Secure Knowledge Management System
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
