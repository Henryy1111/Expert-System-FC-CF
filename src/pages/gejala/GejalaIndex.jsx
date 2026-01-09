import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Activity,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Hash,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function GejalaIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* =============== TOAST =============== */
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

  /* =============== MODAL DELETE =============== */
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* =============== FETCH DATA =============== */
  const fetchGejala = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gejala")
      .select("*")
      .order("id_gejala", { ascending: true });

    if (error) showToast("error", "Gagal mengambil data gejala");
    else setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGejala();
  }, []);

  /* =============== DELETE =============== */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("gejala")
      .delete()
      .eq("id_gejala", selectedId);
    setShowModal(false);
    setSelectedId(null);

    if (error) {
      showToast("error", "Gagal menghapus data");
    } else {
      showToast("success", "Gejala berhasil dihapus dari sistem");
      fetchGejala();
    }
  };

  // Filter Search
  const filteredData = data.filter(
    (item) =>
      item.deskripsi_gejala.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_gejala.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* MODERN MODAL DELETE */}
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
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                Hapus Gejala?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Menghapus gejala akan mempengaruhi kalkulasi pada basis
                pengetahuan sistem pakar.
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <Activity size={12} /> Symptom Inventory
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Data Gejala
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Data Gejala untuk akurasi diagnosis sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari kode atau gejala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-sm font-medium"
              />
            </div>
            <Link
              to="/gejala/tambah"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
            >
              <Plus size={20} /> Tambah
            </Link>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center w-20">
                    No
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">
                    ID Kode
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Deskripsi Klinis Gejala
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-medium italic"
                    >
                      Memuat Data Gejala...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-medium italic"
                    >
                      Gejala tidak ditemukan dalam database.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={row.id_gejala}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-8 py-6 text-center font-mono text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-500/20 tracking-tighter">
                          <Hash size={12} /> {row.kode_gejala}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                            <FileText size={18} />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-relaxed">
                            {row.deskripsi_gejala}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/gejala/edit/${row.id_gejala}`}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all text-slate-400 hover:text-emerald-600"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => confirmDelete(row.id_gejala)}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-500 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all text-slate-400 hover:text-white"
                          >
                            <Trash2 size={16} />
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

        {/* FOOTER NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-all text-sm group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali
          </Link>
          <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {filteredData.length} Data Gejala
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
