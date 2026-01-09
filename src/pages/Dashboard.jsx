// === Dashboard.jsx UPDATED PROFESSIONAL THEME ===
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  ClipboardList,
  Database,
  BarChart3,
  LogOut,
  Calendar,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { supabase } from "../lib/supabaseClient";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

export default function Dashboard({ role }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    penyakit: 0,
    gejala: 0,
    bobotcf: 0,
    rule: 0,
    detail_rule: 0,
    konsultasi: 0,
    detail_konsultasi: 0,
    pengguna: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [daysRange, setDaysRange] = useState(7);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("id-ID", { hour12: false })
  );
  const [showLogout, setShowLogout] = useState(false);

  // Ambil user dari localStorage dengan proteksi
  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === "admin" || role === "admin";

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const tables = [
        "penyakit",
        "gejala",
        "bobotcf",
        "rule",
        "detail_rule",
        "konsultasi",
        "detail_konsultasi",
        ...(isAdmin ? ["pengguna"] : []),
      ];

      const newCounts = {};
      // Menggunakan Promise.all untuk fetch lebih cepat
      await Promise.all(
        tables.map(async (t) => {
          const { count, error } = await supabase
            .from(t)
            .select("*", { count: "exact", head: true });
          newCounts[t] = error ? 0 : count ?? 0;
        })
      );

      setCounts((prev) => ({ ...prev, ...newCounts }));
      setError(null);
    } catch (err) {
      setError("Gagal mengambil statistik");
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async (days = 7) => {
    try {
      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - (days - 1));

      const { data, error } = await supabase
        .from("konsultasi")
        .select("tanggal_konsultasi")
        .gte("tanggal_konsultasi", start.toISOString().slice(0, 10));

      if (error) return setChartData([]);

      const countsByDate = {};
      for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        countsByDate[d.toISOString().slice(0, 10)] = 0;
      }

      data?.forEach((row) => {
        const key = row.tanggal_konsultasi; // Supabase biasanya mengembalikan YYYY-MM-DD
        if (countsByDate[key] !== undefined) countsByDate[key] += 1;
      });

      setChartData(
        Object.keys(countsByDate).map((k) => ({
          date: formatDate(k),
          value: countsByDate[k],
        }))
      );
    } catch (err) {
      setChartData([]);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchChart(daysRange);

    const channel = supabase
      .channel("dashboard-refresh")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "konsultasi" },
        () => {
          fetchCounts();
          fetchChart(daysRange);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [daysRange, isAdmin]);

  const cards = [
    ...(isAdmin
      ? [
          {
            id: "pengguna",
            title: "Pengguna",
            value: counts.pengguna,
            icon: Users,
            color: "from-cyan-500 to-blue-500",
            link: "/pengguna",
          },
        ]
      : []),
    {
      id: "penyakit",
      title: "Penyakit",
      value: counts.penyakit,
      icon: Database,
      color: "from-amber-400 to-orange-500",
      link: "/penyakit",
    },
    {
      id: "gejala",
      title: "Gejala",
      value: counts.gejala,
      icon: ClipboardList,
      color: "from-emerald-400 to-teal-600",
      link: "/gejala",
    },
    {
      id: "rule",
      title: "Rule",
      value: counts.rule,
      icon: Activity,
      color: "from-violet-500 to-purple-700",
      link: "/rule",
    },
    {
      id: "detail_rule",
      title: "Detail Rule",
      value: counts.detail_rule,
      icon: BarChart3,
      color: "from-pink-500 to-rose-600",
      link: "/detailrule",
    },
    {
      id: "bobotcf",
      title: "Bobot CF",
      value: counts.bobotcf,
      icon: TrendingUp,
      color: "from-lime-400 to-green-600",
      link: "/bobotcf",
    },
    {
      id: "konsultasi",
      title: "Konsultasi",
      value: counts.konsultasi,
      icon: Calendar,
      color: "from-orange-400 to-red-500",
      link: "/konsultasi",
    },
    {
      id: "detail_konsultasi",
      title: "Detail Konsultasi",
      value: counts.detail_konsultasi,
      icon: ClipboardList,
      color: "from-sky-400 to-indigo-500",
      link: "/detailkonsultasi",
    },
  ];

  return (
    <AdminLayout role={isAdmin ? "admin" : "user"}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white text-slate-900">
              Overview Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Selamat datang kembali,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {user?.nama_pengguna || "Admin"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
              <Clock className="text-blue-500" size={18} />
              <span className="text-sm font-bold font-mono tracking-wider text-slate-700 dark:text-slate-300">
                {time}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all border border-rose-200/50 dark:border-rose-900/50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse"
                  />
                ))
            : cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(card.link);
                  }}
                  className="group relative overflow-hidden rounded-[2rem] p-6 
                             bg-slate-200/60 dark:bg-slate-800
                             border-b-4 border-white dark:border-slate-800 
                             shadow-sm hover:shadow-xl
                             hover:-translate-y-1 transition-all duration-500 text-left"
                >
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-3">
                      <p className="text-[11px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-[0.2em]">
                        {card.title}
                      </p>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {card.value}
                      </h3>
                    </div>
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      <card.icon size={22} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Explore Data <ArrowUpRight size={14} className="ml-1" />
                  </div>

                  <div
                    className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${card.color} opacity-[0.05] blur-2xl group-hover:opacity-15 transition-opacity`}
                  />
                </button>
              ))}
        </div>

        {/* CHARTS & SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-200/60 dark:bg-slate-800 border border-white dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Trend Konsultasi
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Aktivitas diagnosa
                </p>
              </div>
              <select
                value={daysRange}
                onChange={(e) => setDaysRange(Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none"
              >
                <option value={7}>7 Hari</option>
                <option value={14}>14 Hari</option>
                <option value={30}>30 Hari</option>
              </select>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      fontWeight: "800",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === chartData.length - 1 ? "#3B82F6" : "#CBD5E1"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SUMMARY CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6 p-4 bg-white/10 rounded-2xl w-fit backdrop-blur-xl border border-white/10">
                <Activity size={24} className="text-blue-400 dark:text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2">Ringkasan Sistem</h3>
              <p className="text-slate-400 dark:text-blue-100 text-sm mb-8">
                Data master saat ini.
              </p>

              <div className="space-y-5 flex-1">
                {[
                  { label: "Total Penyakit", val: counts.penyakit },
                  { label: "Total Gejala", val: counts.gejala },
                  { label: "Basis Aturan", val: counts.rule },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">
                      {item.label}
                    </span>
                    <span className="text-2xl font-black">{item.val}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/konsultasi")}
                className="mt-8 w-full py-4 bg-white text-slate-900 dark:text-blue-700 rounded-[1.5rem] font-black text-xs shadow-lg hover:scale-[1.02] transition-transform uppercase"
              >
                Lihat Laporan
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100 animate-pulse">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-white dark:border-slate-800">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-[2rem] flex items-center justify-center mb-6 mx-auto">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2 dark:text-white text-center">
              Keluar Sistem?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-center">
              Sesi Anda akan berakhir.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="flex-1 py-4 rounded-2xl font-black text-slate-400"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="flex-1 py-4 bg-slate-900 dark:bg-rose-600 text-white rounded-2xl font-black shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
