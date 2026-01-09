import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Scale,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Edit3,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function BobotCFEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bobotCF, setBobotCF] = useState("");
  const [nilaiCF, setNilaiCF] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  /* ================= FETCH DATA ================= */
  const fetchBobotCF = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bobotcf")
      .select("*")
      .eq("id_bobotcf", id)
      .single();

    if (error || !data) {
      showToast("error", "Data bobot tidak ditemukan di database");
      setTimeout(() => navigate("/bobotcf"), 2000);
    } else {
      setBobotCF(data.bobotcf);
      setNilaiCF(data.nilaicf);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBobotCF();
  }, [id]);

  /* ================= SUBMIT HANDLER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bobotCF || nilaiCF === "") {
      showToast("error", "Harap lengkapi semua data");
      return;
    }

    const nilai = parseFloat(nilaiCF);
    if (isNaN(nilai) || nilai < 0 || nilai > 1) {
      showToast("error", "Nilai CF harus berada di rentang 0 sampai 1");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("bobotcf")
      .update({
        bobotcf: bobotCF.toUpperCase(),
        nilaicf: nilai,
      })
      .eq("id_bobotcf", id);

    setSaving(false);

    if (error) {
      showToast("error", "Gagal memperbarui data");
    } else {
      showToast("success", "Perubahan data berhasil disimpan");
      setTimeout(() => navigate("/bobotcf"), 1500);
    }
  };

  return (
    <AdminLayout>
      {/* TOAST NOTIFICATION */}
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
          <div className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-amber-100">
                Edit Mode
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              Edit{" "}
              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                Bobot
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-6 text-lg font-medium max-w-xl">
              Lakukan sinkronisasi atau pembaruan nilai Certainty Factor pada
              ID: <span className="text-indigo-600 font-bold">#{id}</span>
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="p-5 bg-slate-100 dark:bg-gray-800 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 animate-pulse">
              <RefreshCcw className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-slate-200 dark:bg-gray-900 rounded-[3rem] p-1 shadow-2xl shadow-indigo-100 dark:shadow-none border border-white dark:border-gray-800">
          <div className="bg-white dark:bg-gray-950 rounded-[2.8rem] p-8 md:p-12">
            {loading ? (
              <div className="space-y-10 py-10">
                <div className="h-16 bg-slate-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
                <div className="h-16 bg-slate-100 dark:bg-gray-900 rounded-2xl animate-pulse w-3/4" />
                <div className="h-20 bg-slate-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  {/* LEFT: FORM INPUTS */}
                  <div className="lg:col-span-3 space-y-10">
                    <div className="group">
                      <label className="flex items-center gap-2 mb-4 text-xs font-black text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                        <Edit3 className="w-4 h-4" /> Nama Bobot CF (Label)
                      </label>
                      <input
                        type="text"
                        value={bobotCF}
                        onChange={(e) => setBobotCF(e.target.value)}
                        className="w-full px-7 py-5 bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.8rem] outline-none transition-all font-black text-xl text-gray-800 dark:text-white shadow-sm"
                        placeholder="E.g. CUKUP YAKIN"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 mb-4 text-xs font-black text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                        <Scale className="w-4 h-4" /> Nilai CF
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={nilaiCF}
                        onChange={(e) => setNilaiCF(e.target.value)}
                        className="w-full px-7 py-5 bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.8rem] outline-none transition-all font-mono font-black text-3xl text-indigo-600 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* RIGHT: NOTIFICATION BOX */}
                  <div className="lg:col-span-2">
                    <div className="h-full bg-slate-50 dark:bg-gray-900/50 rounded-[2.2rem] p-8 border border-slate-100 dark:border-gray-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-20 h-20" />
                      </div>
                      <h4 className="text-gray-900 dark:text-white font-black uppercase text-sm mb-4 tracking-tighter">
                        Informasi Sistem
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        Perubahan pada nilai ini akan berdampak langsung pada
                        hasil perhitungan diagnosa akhir. Pastikan nilai
                        probabilitas sesuai dengan basis pengetahuan pakar.
                      </p>
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                          <span className="text-[10px] font-black text-indigo-500 uppercase">
                            Live Update Enabled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    to="/bobotcf"
                    className="flex items-center gap-3 text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-all group w-full sm:w-auto justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                    Kembali
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.8rem] font-black shadow-2xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update Data CF
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
