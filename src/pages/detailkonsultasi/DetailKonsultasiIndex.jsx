import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  Activity,
  ShieldCheck,
  Search,
  AlertCircle,
  FileText,
  Layers,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function DetailKonsultasiIndex() {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchDetail = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("detail_konsultasi")
      .select(
        `
        id_detail,
        id_konsultasi,
        nilaicf_pengguna,
        gejala ( nama_gejala )
      `
      )
      .order("id_detail", { ascending: false });

    if (!error) setDetail(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const handleDelete = async (idDetail) => {
    if (window.confirm("Hapus rincian diagnosa ini?")) {
      const { error } = await supabase
        .from("detail_konsultasi")
        .delete()
        .eq("id_detail", idDetail);

      if (!error) {
        setToast({ show: true, message: "Entry successfully purged" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
        fetchDetail();
      }
    }
  };

  const filteredDetail = detail.filter(
    (item) =>
      item.gejala?.nama_gejala
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.id_konsultasi?.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      {/* PREMIUM FLOATING TOAST */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-12 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900/90 backdrop-blur-xl text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">
            {toast.message}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-10 py-16">
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600/80">
                Diagnostic Archive
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              Detail{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-900 dark:from-white dark:to-gray-500 italic">
                Analisis.
              </span>
            </h1>
            <p className="max-w-md text-gray-400 font-medium leading-relaxed">
              Manajemen parameter gejala dan validitas bobot kepastian pengguna
              dalam basis data.
            </p>
          </div>

          <Link
            to="/konsultasi"
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all underline-offset-8 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Back to Archive
          </Link>
        </div>

        {/* SEARCH BOX - PREMIUM STYLE */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-2 transition-all group-focus-within:border-gray-300 dark:group-focus-within:border-gray-600 shadow-sm">
            <Search className="ml-6 text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by symptom name or ID..."
              className="w-full bg-transparent py-5 px-6 outline-none text-sm font-bold tracking-tight text-gray-700 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DATA GRID */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] animate-pulse"
                />
              ))}
            </div>
          ) : filteredDetail.length === 0 ? (
            <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">
                No matching records found
              </p>
            </div>
          ) : (
            filteredDetail.map((item) => (
              <div
                key={item.id_detail}
                className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:hover:shadow-none hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex items-center gap-8">
                  {/* BIG ID INDICATOR */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors duration-500">
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-gray-500 uppercase tracking-tighter leading-none mb-1">
                        ID
                      </span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-gray-900 leading-none tracking-tighter">
                        {item.id_konsultasi}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em]">
                        Symptom Data
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {item.gejala?.nama_gejala || "Unknown Symptom"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 md:gap-16 pt-8 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-800">
                  <div className="text-left md:text-right space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      User Certainty
                    </span>
                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {item.nilaicf_pengguna}
                      </span>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id_detail)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-rose-500/5 text-rose-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-rose-500 hover:text-white shadow-xl shadow-rose-500/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Expert System v2.0
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            {filteredDetail.length} Detail Konsultasi
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
