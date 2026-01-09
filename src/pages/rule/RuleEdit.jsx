import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Stethoscope,
  CheckCircle,
  XCircle,
  ChevronDown,
  Search,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function RuleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [penyakitList, setPenyakitList] = useState([]);
  const [idPenyakit, setIdPenyakit] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRule(), fetchPenyakit()]);
      setLoading(false);
    };
    loadData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  const fetchRule = async () => {
    const { data, error } = await supabase
      .from("rule")
      .select("id_rule, id_penyakit, penyakit(nama_penyakit)")
      .eq("id_rule", id)
      .single();

    if (!error && data) {
      setIdPenyakit(data.id_penyakit);
      setSelectedName(data.penyakit?.nama_penyakit || "");
    }
  };

  const fetchPenyakit = async () => {
    const { data, error } = await supabase
      .from("penyakit")
      .select("id_penyakit, nama_penyakit")
      .order("nama_penyakit", { ascending: true });

    if (!error) setPenyakitList(data);
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idPenyakit) {
      showToast("error", "Penyakit harus dipilih");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("rule")
      .update({ id_penyakit: idPenyakit })
      .eq("id_rule", id);

    setSaving(false);

    if (error) {
      showToast("error", "Gagal memperbarui database");
    } else {
      showToast("success", "Perubahan berhasil disimpan");
      setTimeout(() => navigate("/rule"), 1500);
    }
  };

  const filteredPenyakit = penyakitList.filter((p) =>
    p.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* LUXURY TOAST */}
      <div
        className={`fixed top-10 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 z-[100] transition-all duration-500 transform ${
          toast.show
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-12 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            toast.type === "success"
              ? "bg-indigo-600/90 border-indigo-400"
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

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-none rotate-3">
              <ShieldCheck className="text-white w-10 h-10 -rotate-3" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black uppercase tracking-tighter">
                  Editor Mode
                </span>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                  ID: #{id}
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-all">
                Penyesuaian{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                  Logika Aturan
                </span>
              </h1>
            </div>
          </div>

          <Link
            to="/rule"
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Kembali</span>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative">
          {/* DECORATIVE ELEMENTS */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: FORM BOX */}
            <div className="lg:col-span-2">
              <div className="bg-slate-200 dark:bg-gray-800 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-white dark:border-gray-800">
                {loading ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-gray-400 font-bold animate-pulse">
                      Memuat Data Rule...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-4" ref={dropdownRef}>
                      <div className="flex justify-between items-end px-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                          Penyakit Terkait
                        </label>
                        {selectedName && (
                          <span className="text-[10px] font-bold text-indigo-400 italic">
                            Current: {selectedName}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(!openDropdown)}
                          className={`w-full flex items-center justify-between px-8 py-6 rounded-[2rem] border-2 transition-all duration-500 outline-none
                            ${
                              openDropdown
                                ? "border-indigo-500 ring-8 ring-indigo-500/5 bg-white dark:bg-gray-800"
                                : "border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-indigo-100"
                            }`}
                        >
                          <div className="flex items-center gap-5">
                            <div
                              className={`p-3 rounded-2xl ${
                                idPenyakit
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              <Stethoscope className="w-6 h-6" />
                            </div>
                            <span
                              className={`text-xl font-bold ${
                                idPenyakit
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400"
                              }`}
                            >
                              {selectedName || "Pilih Relasi Baru..."}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-6 h-6 text-gray-300 transition-transform duration-500 ${
                              openDropdown ? "rotate-180 text-indigo-500" : ""
                            }`}
                          />
                        </button>

                        {/* DROPDOWN MENU */}
                        {openDropdown && (
                          <div className="absolute z-50 mt-4 w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-5 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800">
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  className="w-full pl-12 pr-6 py-4 text-sm bg-slate-200 dark:bg-gray-800 rounded-2xl outline-none shadow-inner border-none focus:ring-2 focus:ring-indigo-500/20"
                                  placeholder="Cari penyakit dalam database..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto custom-scrollbar">
                              {filteredPenyakit.length > 0 ? (
                                filteredPenyakit.map((p) => (
                                  <button
                                    key={p.id_penyakit}
                                    type="button"
                                    onClick={() => {
                                      setIdPenyakit(p.id_penyakit);
                                      setSelectedName(p.nama_penyakit);
                                      setOpenDropdown(false);
                                    }}
                                    className="w-full text-left px-8 py-5 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center justify-between group"
                                  >
                                    <span className="text-lg">
                                      {p.nama_penyakit}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-[0_0_10px_white]"></div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-10 text-center text-gray-400 font-bold italic text-sm">
                                  Data tidak ditemukan
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className={`group relative w-full py-6 rounded-[2rem] font-black text-xl tracking-wide shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden
                        ${
                          saving
                            ? "bg-gray-100 text-gray-400"
                            : "bg-indigo-600 dark:bg-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-200 dark:shadow-none"
                        }`}
                    >
                      {saving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT: SUMMARY BOX */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                <h3 className="font-black text-xl mb-4">Ringkasan Update</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-1 text-center">
                      ID Aturan
                    </p>
                    <p className="text-3xl font-black text-center tracking-tighter">
                      #00{id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest text-center">
                      Status Keamanan
                    </p>
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-400/20 text-emerald-300 rounded-full border border-emerald-400/30 text-xs font-bold">
                      <ShieldCheck className="w-3 h-3" /> Encrypted & Secure
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Tips
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic font-medium">
                  "Mengubah relasi penyakit di sini akan secara instan
                  memperbarui alur diagnosa pada seluruh sesi konsultasi
                  pengguna."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
