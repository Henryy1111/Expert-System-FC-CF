import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Users,
  Search,
  Shield,
  User,
  Stethoscope,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PenggunaIndex() {
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
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH ================= */
  const fetchPengguna = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pengguna")
      .select(
        "id_pengguna, nama_pengguna, tanggal_lahir, alamat, jenis_kelamin, username, role"
      )
      .order("id_pengguna", { ascending: true });

    if (error) showToast("error", error.message);
    else setData(data || []);
    setLoading(false);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    const { error } = await supabase
      .from("pengguna")
      .delete()
      .eq("id_pengguna", deleteId);
    if (error) showToast("error", error.message);
    else {
      showToast("success", "Pengguna berhasil dihapus");
      fetchPengguna();
    }
    setShowModal(false);
    setDeleteId(null);
  };

  useEffect(() => {
    fetchPengguna();
  }, []);

  // Filter Data
  const filteredData = data.filter(
    (item) =>
      item.nama_pengguna.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
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
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                Hapus Pengguna?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Tindakan ini permanen. Data pengguna{" "}
                <span className="text-rose-500 font-bold underline">
                  tidak dapat dikembalikan
                </span>
                .
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
              <Shield size={12} /> Access Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Data Pengguna
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Kelola hak akses admin, dokter, dan pasien.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all"
              />
            </div>
            <Link
              to="/pengguna/tambah"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={20} /> Tambah
            </Link>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-600 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    No
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Nama Pengguna
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Username
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Role
                  </th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-slate-400 font-medium tracking-widest"
                    >
                      Memproses data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-slate-400 font-medium"
                    >
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id_pengguna}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-8 py-6 font-mono text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 dark:text-slate-200">
                              {item.nama_pengguna}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.jenis_kelamin === "L"
                                ? "Laki-laki"
                                : "Perempuan"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-medium text-slate-500">
                        @{item.username}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            item.role === "admin"
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                              : item.role === "dokter"
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                              : "bg-slate-500/10 border-slate-500/20 text-slate-500"
                          }`}
                        >
                          {item.role === "dokter" && <Stethoscope size={10} />}
                          {item.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/pengguna/edit/${item.id_pengguna}`}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all text-slate-400 hover:text-blue-500"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => {
                              setDeleteId(item.id_pengguna);
                              setShowModal(true);
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-500 hover:border-rose-500 hover:shadow-lg transition-all text-slate-400 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="flex items-center justify-between pt-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <p className="text-xs text-slate-400 font-medium italic">
            Total: {filteredData.length} records
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
