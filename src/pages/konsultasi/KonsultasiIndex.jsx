import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Search,
  Activity,
  ChevronRight,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function KonsultasiIndex() {
  const [konsultasi, setKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const fetchKonsultasi = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("konsultasi")
      .select(`*`)
      .order("tanggal_konsultasi", { ascending: false });
    if (!error) setKonsultasi(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchKonsultasi();
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("konsultasi")
      .delete()
      .eq("id_konsultasi", selectedId);
    setShowModal(false);
    if (error) showToast("error", "Gagal menghapus data");
    else {
      showToast("success", "Data berhasil dihapus");
      fetchKonsultasi();
    }
  };

  const filteredData = useMemo(() => {
    return konsultasi.filter(
      (item) =>
        item.nama_pengguna?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_penyakit?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [konsultasi, searchTerm]);

  return (
    <AdminLayout>
      {/* MINIMALIST TOAST */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === "success" ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          <span className="text-sm font-bold tracking-tight">
            {toast.message}
          </span>
        </div>
      </div>

      {/* MODERN DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-black/10">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Hapus Rekaman?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Data konsultasi ini akan dihapus permanen. Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Konsultasi Records
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              Data Konsultasi
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Monitoring hasil diagnosa pasien secara sistematis.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-gray-900 transition-colors" />
            <input
              type="text"
              placeholder="Cari pasien atau penyakit..."
              className="pl-11 pr-6 py-3.5 bg-gray-200 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl w-full md:w-[320px] focus:bg-slate-200 focus:ring-4 focus:ring-gray-900/5 transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CLEAN TABLE SECTION */}
        <div className="bg-slate-200 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                  <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Informasi Pasien
                  </th>
                  <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Diagnosa
                  </th>
                  <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Kepastian (CF)
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-gray-400 animate-pulse font-medium"
                    >
                      Memuat Data Konsultasi...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-gray-400 font-medium"
                    >
                      Tidak ada data konsultasi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <tr
                      key={row.id_konsultasi}
                      className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                            {row.nama_pengguna.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {row.nama_pengguna}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {new Date(
                                row.tanggal_konsultasi
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 italic">
                          <Activity className="w-3.5 h-3.5 text-gray-400" />
                          {row.nama_penyakit}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900 dark:text-white text-base">
                            {(row.CF_total * 100).toFixed(1)}%
                          </span>
                          <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-gray-900 dark:bg-white"
                              style={{ width: `${row.CF_total * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedId(row.id_konsultasi);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIMPLE FOOTER */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800 pt-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 font-bold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {filteredData.length} Total Data
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
