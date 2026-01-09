import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Stethoscope,
  CheckCircle,
  XCircle,
  Hash,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function GejalaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kodeGejala, setKodeGejala] = useState("");
  const [deskripsiGejala, setDeskripsiGejala] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  /* ================= FETCH DATA ================= */
  const fetchGejala = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gejala")
      .select("*")
      .eq("id_gejala", id)
      .single();

    if (error || !data) {
      showToast("error", "Record medis tidak ditemukan");
      setLoading(false);
      return;
    }

    setKodeGejala(data.kode_gejala);
    setDeskripsiGejala(data.deskripsi_gejala);
    setLoading(false);
  };

  useEffect(() => {
    fetchGejala();
  }, [id]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kodeGejala || !deskripsiGejala) {
      showToast("error", "Harap lengkapi semua parameter klinis");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("gejala")
      .update({
        kode_gejala: kodeGejala.toUpperCase(),
        deskripsi_gejala: deskripsiGejala,
      })
      .eq("id_gejala", id);

    setSaving(false);

    if (error) {
      showToast("error", "Gagal menyinkronkan data: " + error.message);
    } else {
      showToast("success", "Data gejala berhasil diperbarui");
      setTimeout(() => navigate("/gejala"), 1500);
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
            <span className="font-bold tracking-wide text-sm">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20"
            >
              <Stethoscope className="text-white w-8 h-8" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Edit Gejala
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Internal ID: #{id}
              </p>
            </div>
          </div>

          <Link
            to="/gejala"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600 transition-all shadow-sm font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali
          </Link>
        </div>

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
              Memuat Data Gejala...
            </p>
          </div>
        ) : (
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
                  <input
                    type="text"
                    value={kodeGejala}
                    onChange={(e) => setKodeGejala(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400"
                  />
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
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-100 resize-none"
                  />
                </div>
              </div>

              {/* ACTION SECTION */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black hover:shadow-2xl hover:shadow-emerald-500/40 disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {saving ? "Memproses Data..." : "Perbarui Basis Pengetahuan"}
                </button>

                <div className="flex items-start gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                  <AlertCircle
                    className="text-red-500 shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-[11px] text-yellow-700/80 dark:text-yellow-400/80 leading-relaxed font-medium">
                    Peringatan: Mengubah deskripsi gejala akan mempengaruhi
                    pemahaman pengguna saat melakukan diagnosis mandiri.
                    Pastikan terminologi medis tetap mudah dipahami.
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* FOOTER INFO */}
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
            Secure Knowledge Management System
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
