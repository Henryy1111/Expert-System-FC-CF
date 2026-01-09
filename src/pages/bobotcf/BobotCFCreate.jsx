import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Scale,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  LayoutGrid,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function BobotCFCreate() {
  const navigate = useNavigate();

  const [bobotCF, setBobotCF] = useState("");
  const [nilaiCF, setNilaiCF] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= TOAST STATE ================= */
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  /* ================= SUBMIT HANDLER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bobotCF || nilaiCF === "") {
      showToast("error", "Harap isi semua kolom yang tersedia");
      return;
    }

    const nilai = parseFloat(nilaiCF);
    if (isNaN(nilai) || nilai < 0 || nilai > 1) {
      showToast("error", "Nilai probabilitas wajib di rentang 0 - 1");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("bobotcf").insert([
      {
        bobotcf: bobotCF.toUpperCase(),
        nilaicf: nilai,
      },
    ]);

    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    showToast("success", "Data Bobot CF berhasil diabadikan");
    setTimeout(() => navigate("/bobotcf"), 1500);
  };

  return (
    <AdminLayout>
      {/* GLOBAL TOAST - FIXED POSITION */}
      <div
        className={`fixed top-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 z-[100] transition-all duration-500 ${
          toast.show
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
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

      <div className="max-w-4xl mx-auto px-4 py-10 lg:py-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-indigo-200">
                New Parameter
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              Tambah{" "}
              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                Bobot
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg font-medium max-w-md">
              Definisikan tingkat keyakinan baru untuk akurasi diagnosa sistem
              pakar.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700">
              <Scale className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-slate-200 dark:bg-gray-900 rounded-[3rem] p-1 shadow-2xl shadow-indigo-100 dark:shadow-none border border-white dark:border-gray-800">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-950 rounded-[2.8rem] p-8 md:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* LEFT SIDE: INPUTS */}
              <div className="space-y-8">
                {/* INPUT LABEL BOBOT */}
                <div className="group">
                  <label className="flex items-center gap-2 mb-3 text-sm font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">
                    <LayoutGrid className="w-4 h-4" /> Label Bobot
                  </label>
                  <input
                    type="text"
                    value={bobotCF}
                    onChange={(e) => setBobotCF(e.target.value)}
                    placeholder="E.g. SANGAT YAKIN"
                    className="w-full px-6 py-5 bg-slate-100 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.5rem] outline-none transition-all font-bold text-gray-800 dark:text-white placeholder:text-gray-300"
                  />
                </div>

                {/* INPUT NILAI CF */}
                <div className="group">
                  <label className="flex items-center gap-2 mb-3 text-sm font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">
                    <Zap className="w-4 h-4" /> Nilai Probabilitas (0 - 1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={nilaiCF}
                    onChange={(e) => setNilaiCF(e.target.value)}
                    placeholder="0.85"
                    className="w-full px-6 py-5 bg-slate-100 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.5rem] outline-none transition-all font-mono font-bold text-2xl text-indigo-600 placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* RIGHT SIDE: INFORMATION/GUIDE */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-8 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <Info className="w-6 h-6" />
                  <h3 className="font-black uppercase tracking-tighter text-lg">
                    Panduan Input
                  </h3>
                </div>
                <ul className="space-y-4 text-sm text-indigo-900/70 dark:text-indigo-300 font-medium">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    Gunakan nama bobot yang deskriptif dan mudah dipahami oleh
                    pengguna.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    Nilai CF merepresentasikan kekuatan keyakinan, dimana 1.0
                    adalah mutlak.
                  </li>
                  <li className="flex gap-3 text-indigo-600 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                    Sistem akan otomatis mengubah label menjadi huruf kapital.
                  </li>
                </ul>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
              <Link
                to="/bobotcf"
                className="flex items-center gap-3 text-gray-400 hover:text-gray-800 dark:hover:text-white font-bold transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                Kembali
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    SImpan Data CF
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
