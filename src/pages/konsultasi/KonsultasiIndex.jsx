import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  Search,
  Activity,
  Calendar,
  User,
  History,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function KonsultasiIndex() {
  const [konsultasi, setKonsultasi] = useState([]);
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
  const fetchKonsultasi = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("konsultasi")
      .select(
        `
        id_konsultasi,
        tanggal_konsultasi,
        cf_total,
        pengguna (nama_pengguna),
        penyakit (nama_penyakit)
      `
      )
      .order("tanggal_konsultasi", { ascending: false });

    if (error) {
      showToast("error", "Gagal mengambil data histori");
    } else {
      const formattedData = data.map((item) => ({
        id_konsultasi: item.id_konsultasi,
        tanggal_konsultasi: item.tanggal_konsultasi,
        cf_total: item.cf_total,
        nama_pengguna: item.pengguna?.nama_pengguna || "Anonim",
        nama_penyakit: item.penyakit?.nama_penyakit || "Tidak Terdiagnosa",
      }));
      setKonsultasi(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKonsultasi();
  }, []);

  /* ================= DELETE HANDLER ================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("konsultasi")
      .delete()
      .eq("id_konsultasi", selectedId);
    setShowModal(false);
    if (error) {
      showToast("error", "Gagal menghapus rekaman");
    } else {
      showToast("success", "Rekaman konsultasi berhasil dihapus");
      fetchKonsultasi();
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return konsultasi.filter(
      (item) =>
        item.nama_pengguna?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_penyakit?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [konsultasi, searchTerm]);

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
                Hapus Histori?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Data konsultasi ini akan dihapus secara permanen dari server.
                Tindakan ini tidak dapat dibatalkan.
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
              <History size={12} /> Consultation Logs
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Histori Konsultasi
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Data rekam medis hasil diagnosa sistem pakar.
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari pasien atau penyakit..."
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
                    Pasien
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Hasil Diagnosa
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Tingkat Keyakinan
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
                      Tidak ada rekaman konsultasi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <motion.tr
                      key={row.id_konsultasi}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
                    >
                      {/* PASIEN */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-slate-200 tracking-tight">
                              {row.nama_pengguna}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <Calendar size={10} />
                              {new Date(
                                row.tanggal_konsultasi
                              ).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DIAGNOSA */}
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-tight">
                          <Activity size={14} />
                          {row.nama_penyakit}
                        </div>
                      </td>

                      {/* CF TOTAL */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-end gap-1">
                            <span className="text-xl font-black text-slate-800 dark:text-white italic">
                              {(row.cf_total * 100).toFixed(1)}
                            </span>
                            <span className="text-[10px] font-black text-indigo-500 mb-1">
                              %
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${row.cf_total * 100}%` }}
                              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                            />
                          </div>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => confirmDelete(row.id_konsultasi)}
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
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-all text-sm group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <BarChart3 size={12} /> {filteredData.length} Total Rekaman
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
