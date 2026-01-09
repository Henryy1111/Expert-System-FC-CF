import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Stethoscope,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Hash,
  Activity,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenyakitEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchPenyakit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("penyakit")
      .select("*")
      .eq("id_penyakit", id)
      .single();

    if (error || !data) {
      setToast({
        type: "error",
        message: "Data medis tidak ditemukan di database",
      });
      setLoading(false);
      return;
    }

    setKode(data.kode_penyakit);
    setNama(data.nama_penyakit);
    setLoading(false);
  };

  useEffect(() => {
    fetchPenyakit();
  }, [id]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kode || !nama) {
      setToast({
        type: "error",
        message: "Harap lengkapi semua parameter medis",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("penyakit")
      .update({ kode_penyakit: kode, nama_penyakit: nama })
      .eq("id_penyakit", id);

    setSaving(false);
    if (error) {
      setToast({
        type: "error",
        message: "Gagal menyinkronkan data: " + error.message,
      });
    } else {
      setToast({
        type: "success",
        message: "Data penyakit berhasil diperbarui",
      });
      setTimeout(() => navigate("/penyakit"), 1500);
    }
  };

  return (
    <AdminLayout>
      {/* PREMIUM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-6 right-6 z-[100]"
          >
            <div
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                toast.type === "success"
                  ? "bg-emerald-500/90 border-emerald-400 text-white"
                  : "bg-rose-500/90 border-rose-400 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <span className="font-bold tracking-wide">{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="ml-2 hover:rotate-90 transition-transform"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-500/20"
            >
              <Stethoscope className="text-white w-8 h-8" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Edit Penyakit
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                Record ID: {id}
              </p>
            </div>
          </div>

          <Link
            to="/penyakit"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-all shadow-sm font-bold text-sm uppercase tracking-wider"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali
          </Link>
        </div>

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
              Mengambil Data Penyakit...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
              <div className="grid grid-cols-1 gap-8">
                {/* KODE PENYAKIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1 text-slate-400 uppercase tracking-widest font-black text-[10px]">
                    <Hash size={14} className="text-indigo-500" />
                    <span>Kode Penyakit</span>
                  </div>
                  <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value.toUpperCase())}
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400"
                  />
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
                    className="w-full px-6 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-50 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {saving ? "Menyimpan Perubahan..." : "Update Data Medis"}
                </button>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                  Perubahan pada data penyakit akan berdampak langsung pada
                  seluruh basis pengetahuan dan hasil diagnosis sistem pakar.
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
