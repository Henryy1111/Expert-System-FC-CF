import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Stethoscope,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  LayoutGrid,
  ClipboardList,
} from "lucide-react";
import {
  Plus as PlusIcon,
  Pencil as PencilIcon,
  Trash2 as TrashIcon,
  Stethoscope as StethoscopeIcon,
  ArrowLeft as ArrowLeftIcon,
  AlertTriangle as AlertIcon,
  CheckCircle as CheckIcon,
  XCircle as XIcon,
  Search as SearchIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenyakitIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  /* ================= MODAL DELETE ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= FETCH ================= */
  const fetchPenyakit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("penyakit")
      .select("*")
      .order("id_penyakit", { ascending: true });

    if (error) showToast("error", "Gagal mengambil data penyakit");
    else setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPenyakit();
  }, []);

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("penyakit")
      .delete()
      .eq("id_penyakit", selectedId);
    setShowModal(false);
    setSelectedId(null);

    if (error) {
      showToast("error", "Gagal menghapus data");
    } else {
      showToast("success", "Data penyakit berhasil dihapus");
      fetchPenyakit();
    }
  };

  // Filter Data
  const filteredData = data.filter(
    (item) =>
      item.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_penyakit.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <CheckIcon size={20} />
            ) : (
              <XIcon size={20} />
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
                <AlertIcon size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                Hapus Penyakit?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Tindakan ini permanen. Data penyakit yang terhubung dengan basis
                pengetahuan mungkin akan ikut terpengaruh.
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
                  Hapus Sekarang
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
              <ClipboardList size={12} /> Medical Database
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Data Penyakit
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Manajemen klasifikasi penyakit untuk sistem pakar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari kode atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
              />
            </div>
            <Link
              to="/penyakit/tambah"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider"
            >
              <PlusIcon size={20} /> Tambah
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
                    Kode
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Klasifikasi Penyakit
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40">
                    Aksi
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
                      Memuat data penyakit...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-slate-400 font-medium italic"
                    >
                      Data penyakit tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={row.id_penyakit}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-8 py-6 text-center font-mono text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs border border-indigo-500/20 tracking-tighter">
                          {row.kode_penyakit}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                            <StethoscopeIcon size={18} />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                            {row.nama_penyakit}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/penyakit/edit/${row.id_penyakit}`}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all text-slate-400 hover:text-indigo-600"
                          >
                            <PencilIcon size={16} />
                          </Link>
                          <button
                            onClick={() => confirmDelete(row.id_penyakit)}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-500 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all text-slate-400 hover:text-white"
                          >
                            <TrashIcon size={16} />
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
            <ArrowLeftIcon
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Dashboard
          </Link>
          <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {filteredData.length} Data Penyakit
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
