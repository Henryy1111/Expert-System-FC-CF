import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  ArrowLeft,
  Search,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function PilihRule() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("rule")
        .select(
          `
          id_rule,
          penyakit (
            nama_penyakit
          )
        `
        )
        .order("id_rule", { ascending: true });

      if (fetchError) throw fetchError;
      setRules(data || []);
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  /* ================= SEARCH LOGIC ================= */
  const filteredRules = rules.filter((r) =>
    r.penyakit?.nama_penyakit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Knowledge Base Configuration
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
              Pilih{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Rule
              </span>{" "}
              Penyakit
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Pilih penyakit untuk mengelola detail gejala dan bobot kepastian
              (CF).
            </p>
          </div>

          <div className="relative group min-w-[320px] md:min-w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari diagnosa penyakit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-8 p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-[2rem] flex items-center gap-4 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-bold">Gagal sinkronisasi data: {error}</p>
          </div>
        )}

        {/* CONTENT CONTAINER */}
        <div className="bg-slate-200 dark:bg-gray-900 rounded-[3rem] p-1.5 border border-white dark:border-gray-800 shadow-2xl overflow-hidden">
          <div className="bg-white dark:bg-gray-950 rounded-[2.8rem] overflow-hidden">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                    <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] w-24">
                      No
                    </th>
                    <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      Nama Penyakit
                    </th>
                    <th className="px-10 py-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] w-64">
                      Aksi Manajemen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-10 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredRules.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-10 py-20 text-center text-gray-400 font-bold italic uppercase"
                      >
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredRules.map((rule, index) => (
                      <tr
                        key={rule.id_rule}
                        className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all group"
                      >
                        <td className="px-10 py-8 font-mono font-black text-gray-300 group-hover:text-indigo-400 transition-colors text-lg">
                          {(index + 1).toString().padStart(2, "0")}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                              <Activity className="w-6 h-6 text-indigo-500" />
                            </div>
                            <span className="text-md font-black text-gray-800 dark:text-gray-100 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                              {rule.penyakit?.nama_penyakit ||
                                "Tidak Diketahui"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          {/* DISESUAIKAN: Menuju ke Index Detail Rule menggunakan ID Rule */}
                          <Link
                            to={`/detailrule/${rule.id_rule}`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:translate-x-2 active:scale-95 uppercase tracking-tighter"
                          >
                            <Eye className="w-4 h-4" />
                            Lihat Detail Rule
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden p-6 space-y-4">
              {filteredRules.map((rule) => (
                <div
                  key={rule.id_rule}
                  className="bg-slate-50 dark:bg-gray-900 rounded-[2.5rem] p-8 border border-white dark:border-gray-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full text-[10px] font-black text-indigo-500 shadow-sm">
                      ID: {rule.id_rule}
                    </span>
                    <Activity className="w-6 h-6 text-indigo-200" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-8 leading-tight italic uppercase">
                    {rule.penyakit?.nama_penyakit}
                  </h3>
                  <Link
                    to={`/detailrule/${rule.id_rule}`}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 uppercase"
                  >
                    <Eye className="w-5 h-5" /> Lihat Detail Rule
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-4 text-gray-400 hover:text-indigo-600 font-black transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:border-indigo-100 shadow-sm transition-all group-hover:scale-110">
              <ArrowLeft className="w-6 h-6" />
            </div>
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {filteredRules.length} Penyakit Terdaftar
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
