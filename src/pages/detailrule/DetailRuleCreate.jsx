import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  ClipboardList,
  Loader2,
  CheckCircle,
  XCircle,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function DetailRuleCreate() {
  const { id_rule } = useParams();
  const navigate = useNavigate();

  const [gejalaList, setGejalaList] = useState([]);
  const [bobotcfList, setBobotcfList] = useState([]);
  const [ruleInfo, setRuleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [cfValues, setCfValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const targetId = parseInt(id_rule);

      const { data: ruleData } = await supabase
        .from("rule")
        .select(`id_rule, penyakit(nama_penyakit)`)
        .eq("id_rule", targetId)
        .single();
      setRuleInfo(ruleData);

      const { data: gejalaData } = await supabase.from("gejala").select("*");
      const sortedGejala = (gejalaData || []).sort((a, b) => {
        const numA = parseInt(a.kode_gejala.replace(/\D/g, ""));
        const numB = parseInt(b.kode_gejala.replace(/\D/g, ""));
        return numA - numB;
      });

      const { data: bobotData } = await supabase
        .from("bobotcf")
        .select("*")
        .order("nilaicf", { ascending: true });

      setGejalaList(sortedGejala);
      setBobotcfList(bobotData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_rule && id_rule !== "undefined") fetchInitialData();
  }, [id_rule]);

  const toggleGejala = (id) => {
    setSelectedGejala((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedGejala.length === 0) {
      showToast("error", "Pilih minimal satu gejala!");
      return;
    }
    const isValid = selectedGejala.every((gId) => cfValues[gId]);
    if (!isValid) {
      showToast("error", "Lengkapi semua nilai CF yang dipilih!");
      return;
    }

    try {
      setSubmitting(true);
      const payload = selectedGejala.map((gId) => ({
        id_rule: parseInt(id_rule),
        id_gejala: gId,
        id_bobotcf: parseInt(cfValues[gId]),
      }));

      const { error } = await supabase.from("detail_rule").insert(payload);
      if (error) throw error;

      showToast("success", "Detail rule berhasil dikonfigurasi!");
      setTimeout(() => navigate(`/detailrule/${id_rule}`), 1500);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGejala = gejalaList.filter(
    (g) =>
      g.nama_gejala?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.kode_gejala?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* TOAST: Identik dengan RuleCreate */}
      <div
        className={`fixed top-10 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 z-[100] transition-all duration-500 ${
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

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* BACK BUTTON */}
        <Link
          to={`/detailrule/${id_rule}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-500 mb-8 transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Kembali ke Detail</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT SIDE: INFO */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-10">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight uppercase">
                Atur Bobot <br /> Gejala
              </h1>
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">
                  Target Penyakit:
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
                  {ruleInfo?.penyakit?.nama_penyakit || "Memuat..."}
                </p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-6 leading-relaxed font-medium">
                Pilih gejala yang relevan dan tentukan nilai keyakinan (CF)
                sesuai standar pakar.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: TABLE/FORM CARD */}
          <div className="w-full lg:w-2/3">
            <div className="bg-slate-200 dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-10 transition-all">
              {/* SEARCH BOX */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama gejala..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-gray-700 dark:text-white shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* GEJALA LIST */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center py-20 opacity-20">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-black uppercase tracking-widest">
                      Menyiapkan Data...
                    </p>
                  </div>
                ) : (
                  filteredGejala.map((gejala) => (
                    <div
                      key={gejala.id_gejala}
                      className={`p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${
                        selectedGejala.includes(gejala.id_gejala)
                          ? "bg-white dark:bg-gray-900 border-indigo-500 shadow-lg shadow-indigo-500/5"
                          : "bg-gray-50/50 dark:bg-gray-900/50 border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={selectedGejala.includes(gejala.id_gejala)}
                            onChange={() => toggleGejala(gejala.id_gejala)}
                          />
                          <div>
                            <span className="text-[10px] font-black px-2 py-0.5 bg-gray-900 text-white rounded-md mb-1 inline-block">
                              {gejala.kode_gejala}
                            </span>
                            <p
                              className={`font-bold leading-tight ${
                                selectedGejala.includes(gejala.id_gejala)
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-500"
                              }`}
                            >
                              {gejala.nama_gejala || gejala.deskripsi_gejala}
                            </p>
                          </div>
                        </div>

                        <div className="sm:w-48">
                          <select
                            disabled={
                              !selectedGejala.includes(gejala.id_gejala)
                            }
                            value={cfValues[gejala.id_gejala] || ""}
                            onChange={(e) =>
                              setCfValues((prev) => ({
                                ...prev,
                                [gejala.id_gejala]: e.target.value,
                              }))
                            }
                            className={`w-full p-3 rounded-xl border-2 font-bold text-sm outline-none transition-all ${
                              selectedGejala.includes(gejala.id_gejala)
                                ? "border-indigo-100 bg-indigo-50/50 text-indigo-700"
                                : "border-transparent bg-gray-100 text-gray-400 opacity-50"
                            }`}
                          >
                            <option value="">Nilai CF</option>
                            {bobotcfList.map((b) => (
                              <option key={b.id_bobotcf} value={b.id_bobotcf}>
                                {b.nilaicf} ({b.bobotcf})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* INFO & ACTION */}
              <div className="mt-8 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                    Pastikan semua gejala terpilih sudah memiliki bobot CF
                    sebelum menyimpan.
                    <span className="block mt-1 font-black underline uppercase text-[10px]">
                      Terpilih: {selectedGejala.length} Gejala
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={submitting || selectedGejala.length === 0}
                  onClick={handleSave}
                  className={`group relative w-full py-5 rounded-[1.5rem] font-black text-lg tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
                    ${
                      submitting || selectedGejala.length === 0
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 shadow-indigo-200 dark:shadow-none"
                    }`}
                >
                  <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000"></div>
                  {submitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Save className="w-6 h-6" />
                  )}
                  {submitting ? "Menyimpan..." : "Simpan Konfigurasi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
