import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Stethoscope,
  CheckCircle,
  XCircle,
  ChevronDown,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function RuleCreate() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [penyakitList, setPenyakitList] = useState([]);
  const [idPenyakit, setIdPenyakit] = useState("");
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  /* ================= FETCH PENYAKIT ================= */
  const fetchPenyakit = async () => {
    const { data, error } = await supabase
      .from("penyakit")
      .select("id_penyakit, nama_penyakit")
      .order("nama_penyakit", { ascending: true });

    if (!error) setPenyakitList(data || []);
  };

  useEffect(() => {
    fetchPenyakit();
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("rule")
      .insert([{ id_penyakit: idPenyakit }]);
    setLoading(false);

    if (error) {
      showToast("error", "Gagal menyimpan: " + error.message);
      return;
    }

    showToast("success", "Rule baru berhasil diarsipkan");
    setTimeout(() => navigate("/rule"), 1500);
  };

  // Filter penyakit berdasarkan search
  const filteredPenyakit = penyakitList.filter((p) =>
    p.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* TOAST NOTIFICATION */}
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

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* BACK BUTTON */}
        <Link
          to="/rule"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-500 mb-8 transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Kembali ke Daftar</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* LEFT SIDE: INFO */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-10">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-none mb-6">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
                Tambah <br />
                Aturan Baru
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed font-medium">
                Sistem akan membuat fondasi logika baru untuk diagnosa pakar
                berdasarkan penyakit yang Anda pilih.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: FORM CARD */}
          <div className="w-full md:w-2/3">
            <div className="bg-slate-200 dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-all">
              <div className="space-y-8">
                {/* FIELD: PENYAKIT */}
                <div className="space-y-3" ref={dropdownRef}>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                    Pilih Penyakit
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(!openDropdown)}
                      className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] border-2 transition-all duration-300 outline-none
                        ${
                          openDropdown
                            ? "border-indigo-500 ring-4 ring-indigo-500/5 bg-white dark:bg-gray-800"
                            : "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedPenyakit
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            selectedPenyakit
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedPenyakit
                            ? selectedPenyakit.nama_penyakit
                            : "Pilih Penyakit..."}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          openDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* DROPDOWN MENU */}
                    {openDropdown && (
                      <div className="absolute z-50 mt-3 w-full bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-gray-50 dark:border-gray-800">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl outline-none border-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Cari nama penyakit..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {filteredPenyakit.length > 0 ? (
                            filteredPenyakit.map((p) => (
                              <button
                                key={p.id_penyakit}
                                type="button"
                                onClick={() => {
                                  setSelectedPenyakit(p);
                                  setIdPenyakit(p.id_penyakit);
                                  setOpenDropdown(false);
                                  setSearchTerm("");
                                }}
                                className="w-full text-left px-6 py-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 font-bold transition-colors flex items-center justify-between group"
                              >
                                {p.nama_penyakit}
                                <div className="h-2 w-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </button>
                            ))
                          ) : (
                            <div className="px-6 py-8 text-center text-gray-400 text-sm italic">
                              Penyakit tidak ditemukan...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* INFO BOX */}
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                    Menambahkan rule baru hanya akan mendaftarkan penyakit ke
                    dalam basis aturan. Pastikan Anda mengatur{" "}
                    <strong>bobot gejala</strong> setelah ini.
                  </p>
                </div>

                {/* ACTION BUTTON */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (!idPenyakit) {
                      showToast(
                        "error",
                        "Silakan pilih penyakit terlebih dahulu"
                      );
                      return;
                    }
                    setShowConfirm(true);
                  }}
                  className={`group relative w-full py-5 rounded-[1.5rem] font-black text-lg tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 shadow-indigo-200 dark:shadow-none"
                    }`}
                >
                  <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000"></div>
                  <Save className="w-6 h-6" />
                  {loading ? "Memproses..." : "Konfirmasi & Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LUXURY MODAL CONFIRMATION */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-indigo-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">
              Simpan Rule?
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium">
              Sistem akan mendaftarkan{" "}
              <span className="text-indigo-600 font-bold">
                {selectedPenyakit?.nama_penyakit}
              </span>{" "}
              ke dalam basis aturan pengetahuan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleSubmit();
                }}
                className="py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
