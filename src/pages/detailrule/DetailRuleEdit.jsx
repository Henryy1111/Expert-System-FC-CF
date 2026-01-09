import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Settings2,
  Loader2,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function DetailRuleEdit() {
  // id_detail diambil dari App.jsx route: /detailrule/edit/:id_detail
  const { id_detail } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bobotcfList, setBobotcfList] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [selectedCf, setSelectedCf] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = useCallback((type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Ambil list bobot CF untuk dropdown
      const { data: bobot, error: errorBobot } = await supabase
        .from("bobotcf")
        .select("*")
        .order("nilaicf", { ascending: true });

      if (errorBobot) throw errorBobot;
      setBobotcfList(bobot || []);

      // 2. Ambil data detail_rule spesifik
      // Perbaikan: Menggunakan penamaan eksplisit agar tidak terjadi error "gejala_1"
      const { data, error } = await supabase
        .from("detail_rule")
        .select(
          `
          id_detail,
          id_bobotcf,
          gejala:id_gejala (
            kode_gejala, 
            nama_gejala
          ),
          rule:id_rule (
            id_rule,
            penyakit:id_penyakit (
              nama_penyakit
            )
          )
        `
        )
        .eq("id_detail", id_detail)
        .single();

      if (error) throw error;

      if (data) {
        setDetailData(data);
        setSelectedCf(data.id_bobotcf);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      showToast("error", "Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [id_detail, showToast]);

  useEffect(() => {
    if (id_detail) {
      fetchData();
    }
  }, [id_detail, fetchData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCf) {
      showToast("error", "Pilih bobot CF terlebih dahulu!");
      return;
    }

    try {
      setSubmitting(true);

      // Update kolom id_bobotcf untuk baris id_detail ini saja
      const { error } = await supabase
        .from("detail_rule")
        .update({ id_bobotcf: parseInt(selectedCf) })
        .eq("id_detail", id_detail);

      if (error) throw error;

      showToast("success", "Nilai CF berhasil diperbarui!");

      // Kembali ke halaman list detail rule (berdasarkan id_rule-nya)
      setTimeout(() => {
        const idRuleRedirect = detailData?.rule?.id_rule;
        if (idRuleRedirect) {
          navigate(`/detailrule/${idRuleRedirect}`);
        } else {
          navigate(-1);
        }
      }, 1500);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-slate-500 font-bold animate-pulse">
              Menghubungkan ke Database...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* TOAST NOTIFIKASI */}
      <div
        className={`fixed top-10 right-10 z-[100] transition-all duration-500 ${
          toast.show
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-emerald-500/90 border-emerald-400"
              : "bg-rose-500/90 border-rose-400"
          } text-white`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-bold tracking-wide">{toast.message}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-8 group transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span className="font-bold uppercase tracking-widest text-[10px]">
            Kembali
          </span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
          {/* HEADER */}
          <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
            <div>
              <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                Knowledge Base System
              </p>
              <h1 className="text-2xl font-bold italic">UPDATE CF VALUE</h1>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Settings2 className="text-indigo-400" />
            </div>
          </div>

          <form onSubmit={handleUpdate} className="p-8 md:p-12 space-y-8">
            {/* INFO PANEL: PENYAKIT & GEJALA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Diagnosis Penyakit
                </span>
                <p className="text-lg font-bold text-slate-800">
                  {detailData?.rule?.penyakit?.nama_penyakit ||
                    "Tidak Diketahui"}
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Gejala Terdeteksi
                </span>
                <p className="text-lg font-bold text-slate-800 flex items-center">
                  <span className="bg-slate-800 text-white px-2 py-0.5 rounded-lg text-xs mr-3 font-mono">
                    {detailData?.gejala?.kode_gejala}
                  </span>
                  {detailData?.gejala?.nama_gejala}
                </p>
              </div>
            </div>

            {/* DROPDOWN SELECTION */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-2">
                Pilih Bobot Certainty Factor (CF) Baru
              </label>
              <div className="relative group">
                <select
                  value={selectedCf}
                  onChange={(e) => setSelectedCf(e.target.value)}
                  className="w-full p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">Pilih Nilai CF</option>
                  {bobotcfList.map((cf) => (
                    <option key={cf.id_bobotcf} value={cf.id_bobotcf}>
                      {cf.nilaicf} — ({cf.bobotcf})
                    </option>
                  ))}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* BUTTON SIMPAN */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all flex items-center justify-center gap-3
                  ${
                    submitting
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-indigo-600 text-white hover:-translate-y-2 active:scale-95 shadow-indigo-200"
                  }`}
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
                {submitting ? "Proses Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
