import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  Search,
  Activity,
  Hash,
  Stethoscope,
  Layers,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function DetailKonsultasiIndex() {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
  const fetchDetail = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("detail_konsultasi")
      .select(
        `
        id_detail,
        id_konsultasi,
        nilaicf_pengguna,
        gejala ( deskripsi_gejala )
      `
      )
      .order("id_detail", { ascending: false });

    if (error) {
      showToast("error", "Gagal mengambil rincian data");
    } else {
      setDetail(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  /* ================= DELETE HANDLER ================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("detail_konsultasi")
      .delete()
      .eq("id_detail", selectedId);

    setShowModal(false);
    if (error) {
      showToast("error", "Gagal menghapus rincian");
    } else {
      showToast("success", "Rincian diagnosa berhasil dihapus");
      fetchDetail();
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return detail.filter(
      (item) =>
        item.gejala?.deskripsi_gejala
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.id_konsultasi?.toString().includes(searchTerm)
    );
  }, [detail, searchTerm]);

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

      {/* MODAL DELETE */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md text-center"
            >
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 italic">
                Hapus Detail?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Data parameter gejala ini akan dihapus secara permanen. Tindakan
                ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
              <Layers size={12} /> Diagnostic Parameters
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Detail Analisis
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Rincian bobot gejala yang diinputkan pengguna.
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari ID atau Gejala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    ID Konsultasi
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Deskripsi Gejala
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    User Certainty
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-bold italic animate-pulse"
                    >
                      Sedang memproses data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-medium"
                    >
                      Data rincian tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <motion.tr
                      key={row.id_detail}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
                    >
                      {/* ID KONSULTASI */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-800 dark:group-hover:bg-white dark:group-hover:text-slate-900 group-hover:text-white transition-all shadow-inner">
                            <Hash size={16} />
                          </div>
                          <span className="font-black text-slate-800 dark:text-slate-200 tracking-tight">
                            {row.id_konsultasi}
                          </span>
                        </div>
                      </td>

                      {/* GEJALA */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="text-indigo-500">
                            <Stethoscope size={20} />
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-200 leading-relaxed max-w-md">
                            {row.gejala?.deskripsi_gejala ||
                              "Deskripsi tidak tersedia"}
                          </p>
                        </div>
                      </td>

                      {/* NILAI CF */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-end gap-1">
                            <span className="text-xl font-black text-slate-800 dark:text-white italic">
                              {row.nilaicf_pengguna}
                            </span>
                            <ShieldCheck
                              size={14}
                              className="text-emerald-500 mb-1"
                            />
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(row.nilaicf_pengguna + 1) * 50}%`,
                              }} // Visualisasi skala -1 ke 1
                              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                            />
                          </div>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => confirmDelete(row.id_detail)}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/konsultasi"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-all text-sm group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <BarChart3 size={12} /> {filteredData.length} Total Detail
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
