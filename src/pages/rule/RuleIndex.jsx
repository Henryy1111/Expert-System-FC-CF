import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Search,
  Database,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function RuleIndex() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= TOAST STATE ================= */
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  /* ================= DELETE MODAL STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchRules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rule")
      .select(`id_rule, penyakit ( nama_penyakit )`)
      .order("id_rule", { ascending: true });

    if (!error) setRules(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  /* ================= DELETE HANDLER ================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("rule")
      .delete()
      .eq("id_rule", selectedId);
    setShowModal(false);
    if (error) {
      showToast("error", "Gagal menghapus rule");
    } else {
      showToast("success", "Rule berhasil dihapus");
      fetchRules();
    }
  };

  const filteredRules = rules.filter(
    (r) =>
      r.penyakit?.nama_penyakit
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.id_rule.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      {/* GLOBAL TOAST */}
      <div
        className={`fixed top-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 z-[100] transition-all duration-500 ${
          toast.show
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            toast.type === "success"
              ? "bg-emerald-500/90 border-emerald-400 text-white"
              : "bg-rose-500/90 border-rose-400 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <p className="font-bold tracking-wide">{toast.message}</p>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-rose-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-800 dark:text-white mb-2">
              Hapus Data?
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Tindakan ini permanen dan tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-bold bg-rose-600 text-white shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Rule Management
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              Data Rule
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Konfigurasi aturan sistem pakar penyakit
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari rule atau penyakit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 bg-slate-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
              />
            </div>
            <Link
              to="/rule/tambah"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:-translate-y-1 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah</span>
            </Link>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-slate-200 dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                    No
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                    Rule ID
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                    Nama Penyakit
                  </th>
                  <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                    Aksi Manajemen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {loading
                  ? [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-8 py-10">
                          <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                        </td>
                      </tr>
                    ))
                  : filteredRules.map((rule, index) => (
                      <tr
                        key={rule.id_rule}
                        className="hover:bg-gray-50/80 dark:hover:bg-indigo-900/5 transition-colors"
                      >
                        <td className="px-8 py-6 font-bold text-gray-400">
                          {(index + 1).toString().padStart(2, "0")}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 font-mono text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg w-fit">
                            <Database className="w-3 h-3" />
                            ID-{rule.id_rule}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-gray-800 dark:text-gray-100 font-bold text-lg">
                            {rule.penyakit?.nama_penyakit || "Tidak Terhubung"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center items-center gap-3">
                            <Link
                              to={`/rule/edit/${rule.id_rule}`}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-100 transition-all font-bold text-sm"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </Link>
                            <button
                              onClick={() => confirmDelete(rule.id_rule)}
                              className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-100 transition-all font-bold text-sm"
                            >
                              <Trash2 className="w-4 h-4" /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
            {filteredRules.map((rule, index) => (
              <div
                key={rule.id_rule}
                className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-mono text-[10px] font-bold rounded-full">
                    RULE #{rule.id_rule}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 leading-tight">
                  {rule.penyakit?.nama_penyakit}
                </h3>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <Link
                    to={`/rule/edit/${rule.id_rule}`}
                    className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => confirmDelete(rule.id_rule)}
                    className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!loading && filteredRules.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Tidak ada data
              </h3>
              <p className="text-gray-500">Coba kata kunci pencarian lain</p>
            </div>
          )}
        </div>

        {/* FOOTER NAV */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800 pt-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 font-bold transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {filteredRules.length} Aturan Aktif dalam Sistem
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
