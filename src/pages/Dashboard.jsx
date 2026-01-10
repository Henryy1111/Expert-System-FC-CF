import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  ClipboardList,
  Database,
  LogOut,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Network,
  FileSearch,
  Calendar,
  PieChart,
  BarChart3,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

const colorStyles = {
  indigo: {
    text: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-500/20",
    border: "border-indigo-500/30",
    neon: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    neon: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    neon: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/20",
    border: "border-violet-500/30",
    neon: "shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]",
  },
  pink: {
    text: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/20",
    border: "border-pink-500/30",
    neon: "shadow-[0_0_20px_rgba(236,72,153,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    neon: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/20",
    border: "border-rose-500/30",
    neon: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]",
  },
  sky: {
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/20",
    border: "border-sky-500/30",
    neon: "shadow-[0_0_20px_rgba(14,165,233,0.2)]",
    hover: "group-hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]",
  },
};

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
  const [chartData, setChartData] = useState([]);
  const [daysRange, setDaysRange] = useState(7);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("id-ID", { hour12: false })
  );
  const [showLogout, setShowLogout] = useState(false);

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
    const t = setInterval(
      () => setTime(new Date().toLocaleTimeString("id-ID", { hour12: false })),
      1000
    );
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
      await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase
            .from(t)
            .select("*", { count: "exact", head: true });
          newCounts[t] = count ?? 0;
        })
      );
      setCounts((prev) => ({ ...prev, ...newCounts }));
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async (days = 7) => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - (days - 1));
    const { data } = await supabase
      .from("konsultasi")
      .select("tanggal_konsultasi")
      .gte("tanggal_konsultasi", start.toISOString().slice(0, 10));
    const countsByDate = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      countsByDate[d.toISOString().slice(0, 10)] = 0;
    }
    data?.forEach((row) => {
      if (countsByDate[row.tanggal_konsultasi] !== undefined)
        countsByDate[row.tanggal_konsultasi] += 1;
    });
    setChartData(
      Object.keys(countsByDate).map((k) => ({
        date: formatDate(k),
        value: countsByDate[k],
      }))
    );
  };

  useEffect(() => {
    fetchCounts();
    fetchChart(daysRange);
  }, [daysRange, isAdmin]);

  const cards = [
    ...(isAdmin
      ? [
          {
            id: "pengguna",
            title: "Data Pengguna",
            value: counts.pengguna,
            icon: Users,
            color: "indigo",
            link: "/pengguna",
          },
        ]
      : []),
    {
      id: "penyakit",
      title: "Data Penyakit",
      value: counts.penyakit,
      icon: Database,
      color: "blue",
      link: "/penyakit",
    },
    {
      id: "gejala",
      title: "Data Gejala",
      value: counts.gejala,
      icon: ClipboardList,
      color: "emerald",
      link: "/gejala",
    },
    {
      id: "rule",
      title: "Data Rule",
      value: counts.rule,
      icon: Activity,
      color: "violet",
      link: "/rule",
    },
    {
      id: "detail_rule",
      title: "Data Detail Rule",
      value: counts.detail_rule,
      icon: Network,
      color: "pink",
      link: "/detailrule",
    },
    {
      id: "bobotcf",
      title: "Data Bobot CF",
      value: counts.bobotcf,
      icon: TrendingUp,
      color: "amber",
      link: "/bobotcf",
    },
    {
      id: "konsultasi",
      title: "Data Konsultasi",
      value: counts.konsultasi,
      icon: Calendar,
      color: "rose",
      link: "/konsultasi",
    },
    {
      id: "detail_konsultasi",
      title: "Data Detail Konsultasi",
      value: counts.detail_konsultasi,
      icon: FileSearch,
      color: "sky",
      link: "/detailkonsultasi",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-8">
        {/* --- COMPACT HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Dashboard{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Sistem
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2 uppercase tracking-widest">
              <ShieldCheck size={16} className="text-emerald-500" /> Authorized:{" "}
              {user?.nama_pengguna || "Administrator"}
            </p>
          </motion.div>

          <motion.div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hidden md:block">
              <span className="text-[10px] font-black text-indigo-600 block leading-none mb-1 uppercase tracking-widest">
                Global Server Time
              </span>
              <span className="text-xl font-mono font-black dark:text-white leading-none">
                {time}
              </span>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="p-4 bg-rose-500 text-white rounded-2xl hover:rotate-6 hover:scale-110 transition-all shadow-xl shadow-rose-500/30"
            >
              <LogOut size={24} />
            </button>
          </motion.div>
        </div>

        {/* --- NEON COMPACT GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, idx) => {
            const style = colorStyles[card.color];
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(card.link)}
                className={`group relative cursor-pointer overflow-hidden rounded-[2rem] p-6 border bg-white dark:bg-slate-900 transition-all duration-500 ${style.border} ${style.neon} ${style.hover} hover:-translate-y-2`}
              >
                <div className="relative z-10 flex flex-col gap-6">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl ${style.bg} ${style.text} ring-1 ring-current/20 group-hover:scale-110 transition-transform`}
                  >
                    <card.icon size={26} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-2">
                      {card.title}
                    </h4>
                    <p className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter">
                      {loading ? "..." : card.value}
                    </p>
                  </div>
                </div>
                <div
                  className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${style.bg}`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* --- ANALYTICS & PREMIUM SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <motion.div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h3 className="text-2xl font-black dark:text-white tracking-tight">
                  Tabel Konsultasi
                </h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Hasil Konsultasi Diagnosis
                </p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDaysRange(d)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                      daysRange === d
                        ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xl"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {d}Hari
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 800, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 800, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "24px",
                      border: "none",
                      backgroundColor: "#1e293b",
                      color: "#fff",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
                    }}
                    itemStyle={{ color: "#818cf8", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#chartColor)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* --- THE PREMIUM QUICK SUMMARY --- */}
          <motion.div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40 group">
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700"></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <PieChart size={24} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black bg-emerald-400 text-emerald-900 px-3 py-1 rounded-full uppercase tracking-widest">
                    Live Sync
                  </span>
                </div>

                <h4 className="text-2xl font-black tracking-tight mb-2">
                  Ringkasan Sistem
                </h4>
                <p className="text-indigo-100 text-sm font-medium mb-8 opacity-80 uppercase tracking-widest">
                  Database Real-Time Overview
                </p>

                <div className="space-y-6 flex-1">
                  {/* Item 1: Rules Ratio */}
                  <div className="group/item cursor-default">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-black uppercase tracking-widest opacity-70 italic">
                        Data Detail Rule
                      </span>
                      <span className="text-xl font-black">
                        {(counts.rule + counts.detail_rule).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (counts.rule /
                              (counts.rule + counts.detail_rule || 1)) *
                            100
                          }%`,
                        }}
                        className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold opacity-60">
                      <span>{counts.rule} Rules</span>
                      <span>{counts.detail_rule} Details</span>
                    </div>
                  </div>

                  {/* Item 2: Knowledge Base */}
                  <div className="group/item cursor-default">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-black uppercase tracking-widest opacity-70 italic">
                        Data Gejala
                      </span>
                      <span className="text-xl font-black">
                        {(counts.penyakit + counts.gejala).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (counts.penyakit /
                              (counts.penyakit + counts.gejala || 1)) *
                            100
                          }%`,
                        }}
                        className="h-full bg-emerald-300 rounded-full shadow-[0_0_10px_rgba(110,231,183,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold opacity-60">
                      <span>{counts.penyakit} Penyakit</span>
                      <span>{counts.gejala} Gejala</span>
                    </div>
                  </div>

                  {/* Item 3: System Interactions */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-400 rounded-lg text-amber-900">
                        <Zap size={18} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-60">
                          Total Konsultasi
                        </p>
                        <p className="text-lg font-black leading-tight">
                          {counts.konsultasi.toLocaleString()} Records
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/konsultasi")}
                  className="w-full mt-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-400/20 hover:-translate-y-1 active:scale-95 transition-all"
                >
                  Lihat Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MODAL LOGOUT --- */}
      <AnimatePresence>
        {showLogout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-12 text-center shadow-3xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto ring-8 ring-rose-50">
                <LogOut size={32} />
              </div>
              <h3 className="text-3xl font-black dark:text-white tracking-tight">
                Terminate Session?
              </h3>
              <p className="text-slate-500 font-medium mt-3 mb-10 px-4 leading-relaxed">
                Sesi anda akan segera berakhir. Pastikan semua perubahan data
                telah disimpan sebelum keluar.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase text-xs tracking-widest"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-2xl shadow-rose-500/40 hover:bg-rose-600 transition-all uppercase text-xs tracking-widest"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
