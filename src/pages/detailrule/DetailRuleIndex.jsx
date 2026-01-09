import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Activity,
  Hash,
  Layers,
  Loader2,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function DetailRuleIndex() {
  // Mengambil id_rule dari URL params
  const { id_rule } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [penyakit, setPenyakit] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= TOAST STATE ================= */
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type, message: "" }), 3000);
  };

  /* ================= MODAL STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchDetailRules = async () => {
    try {
      setLoading(true);

      // 1. VALIDASI: Pastikan id_rule adalah angka sebelum dikirim ke database
      const numericId = parseInt(id_rule);
      if (isNaN(numericId)) {
        console.error("ID Rule tidak valid (bukan angka)");
        navigate("/detailrule"); // Kembalikan ke halaman daftar jika ID ngaco
        return;
      }

      // 2. Ambil nama penyakit dari tabel rule
      const { data: ruleData, error: ruleError } = await supabase
        .from("rule")
        .select(`id_rule, penyakit ( nama_penyakit )`)
        .eq("id_rule", numericId)
        .single();

      if (ruleError) throw ruleError;

      if (ruleData) {
        setPenyakit(
          ruleData.penyakit?.nama_penyakit || "Penyakit Tidak Diketahui"
        );
      }

      // 3. Ambil detail rules
      const { data, error } = await supabase
        .from("detail_rule")
        .select(
          `
          id_detail_rule,
          id_rule,
          gejala ( kode_gejala, deskripsi_gejala ),
          bobotcf ( nilaicf, bobotcf )
        `
        )
        .eq("id_rule", numericId)
        .order("id_detail_rule", { ascending: true });

      if (error) throw error;
      setDetails(data || []);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      showToast("error", "Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Jalankan fetch hanya jika id_rule ada
    if (id_rule) {
      fetchDetailRules();
    }
  }, [id_rule]);

  /* ================= DELETE HANDLER ================= */
  const confirmDelete = (idDetail) => {
    setSelectedId(idDetail);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("detail_rule")
        .delete()
        .eq("id_detail_rule", selectedId);

      setShowModal(false);
      setSelectedId(null);

      if (error) throw error;

      showToast("success", "Detail rule berhasil dihapus");
      fetchDetailRules();
    } catch (error) {
      showToast("error", "Gagal menghapus: " + error.message);
    }
  };

  return (
    <AdminLayout>
      {/* TOAST NOTIFICATION */}
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

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-950 rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-rose-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-10 font-medium">
              Data gejala ini akan dihapus dari rule penyakit secara permanen.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            {/* PERBAIKAN: Navigasi benar ke /detailrule (tanpa sub-path yang salah) */}
            <button
              onClick={() => navigate("/detailrule")}
              className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs tracking-widest hover:gap-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> KEMBALI PILIH RULE
            </button>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[0.9] uppercase italic">
              {penyakit || "Memuat..."}
            </h1>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  {details.length} Gejala Terkait
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl shadow-lg">
                <Hash className="w-4 h-4 text-white/70" />
                <span className="text-xs font-bold text-white uppercase font-mono">
                  RULE ID: {id_rule}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/detailrule/tambah/${id_rule}`}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.8rem] font-black shadow-xl transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" /> TAMBAH DETAIL
          </Link>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-slate-200 dark:bg-gray-900 rounded-[3rem] p-1.5 border border-white dark:border-gray-800 shadow-2xl">
          <div className="bg-white dark:bg-gray-950 rounded-[2.8rem] overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-gray-900/50">
                    <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      No
                    </th>
                    <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Gejala
                    </th>
                    <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      CF (Pakar)
                    </th>
                    <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-10 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          Sinkronisasi Data...
                        </span>
                      </td>
                    </tr>
                  ) : details.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-10 py-24 text-center">
                        <Activity className="w-16 h-16 text-slate-100 dark:text-gray-800 mx-auto mb-4" />
                        <p className="text-xl font-black text-slate-300 dark:text-gray-700 italic uppercase">
                          Belum ada gejala yang diatur.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    details.map((item, index) => (
                      <tr
                        key={item.id_detail_rule}
                        className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all"
                      >
                        <td className="px-10 py-8 font-black text-slate-300 dark:text-gray-700 group-hover:text-indigo-400 italic text-xl font-mono">
                          {(index + 1).toString().padStart(2, "0")}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-mono font-black text-sm rounded-lg border border-indigo-100 dark:border-indigo-900">
                              {item.gejala?.kode_gejala}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 font-bold uppercase text-sm">
                              {item.gejala?.deskripsi_gejala}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                            <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl italic tracking-tighter leading-none">
                              {item.bobotcf?.nilaicf}
                            </span>
                            <span className="text-[10px] text-gray-400 font-black uppercase mt-1">
                              {item.bobotcf?.bobotcf}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex justify-end gap-3">
                            <Link
                              to={`/detailrule/edit/${item.id_detail_rule}`}
                              className="p-3 bg-white dark:bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                            >
                              <Pencil className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(item.id_detail_rule)}
                              className="p-3 bg-white dark:bg-gray-800 hover:bg-rose-600 hover:text-white text-gray-400 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
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
        </div>
      </div>
    </AdminLayout>
  );
}
