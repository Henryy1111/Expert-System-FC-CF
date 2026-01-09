// === AdminLayout.jsx FIXED NAVIGATION ===
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import {
  Menu,
  Home,
  Users,
  ClipboardList,
  Activity,
  Layers,
  Settings,
  FileSearch,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({ children, role }) {
  const location = useLocation();
  const navigate = useNavigate(); // Inisialisasi navigate
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const userData = useMemo(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return storedUser || { nama_pengguna: "Guest", role: role || "user" };
    } catch {
      return { nama_pengguna: "Guest", role: role || "user" };
    }
  }, [role]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setIsDark(saved === "dark");
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  // Pastikan LINK di sini SAMA PERSIS dengan yang ada di App.js
  const menu = [
    {
      title: "Utama",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
        // Perbaikan filter role: pastikan data link benar
        ...(role === "admin"
          ? [{ name: "Data Pengguna", icon: Users, link: "/pengguna" }]
          : []),
        { name: "Konsultasi", icon: Home, link: "/konsultasi" },
      ],
    },
    {
      title: "Manajemen Data",
      items: [
        { name: "Data Penyakit", icon: ClipboardList, link: "/penyakit" },
        { name: "Data Gejala", icon: Activity, link: "/gejala" },
        { name: "Data Rule", icon: Layers, link: "/rule" },
      ],
    },
    {
      title: "Sistem & Laporan",
      items: [
        { name: "Detail Rule", icon: FileSearch, link: "/detailrule" },
        { name: "Bobot CF", icon: Settings, link: "/bobotcf" },
        {
          name: "Detail Konsultasi",
          icon: FileSearch,
          link: "/detailkonsultasi",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  const NavItems = ({ isMobile = false }) => (
    <nav className={`space-y-6 ${isMobile ? "p-4" : "px-4"}`}>
      {menu.map((group, idx) => (
        <div key={idx} className="space-y-2">
          {(!collapsed || isMobile) && (
            <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {group.title}
            </h4>
          )}
          <div className="space-y-1">
            {group.items.map((m, i) => {
              const Icon = m.icon;
              const active = isActive(m.link);
              return (
                <button // Menggunakan button + navigate lebih stabil untuk beberapa case
                  key={i}
                  onClick={() => {
                    navigate(m.link);
                    if (isMobile) setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600"
                  } ${collapsed && !isMobile ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "animate-pulse" : ""}`}
                    strokeWidth={2.5}
                  />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-bold tracking-tight">
                      {m.name}
                    </span>
                  )}
                  {active && !isMobile && (
                    <div className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-r-full shadow-[0_0_10px_indigo]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-500 border-r ${
          collapsed ? "w-24" : "w-72"
        } ${
          isDark
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white/80 border-slate-200"
        } backdrop-blur-xl sticky top-0 h-screen z-40`}
      >
        <div className="h-24 flex items-center justify-center px-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                  SISTEM PAKAR
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Berbasis FC & CF
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
          <NavItems />
        </div>

        {/* FOOTER SIDEBAR */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-4 rounded-2xl h-12 ${
              collapsed ? "px-2 justify-center" : ""
            }`}
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
            {!collapsed && <span className="font-bold text-sm">Mode</span>}
          </Button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* HEADER & CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 border-b backdrop-blur-xl ${
            isDark
              ? "bg-[#0f172a]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl bg-slate-100 dark:bg-slate-800"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 p-0 bg-slate-900 border-slate-800 text-white"
                >
                  <div className="p-8 flex items-center gap-3 border-b border-slate-800">
                    <Activity className="h-8 w-8 text-indigo-500" />
                    <span className="text-xl font-black">SISTEM PAKAR</span>
                  </div>
                  <NavItems isMobile={true} />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {location.pathname === "/dashboard"
                ? "Overview"
                : location.pathname.substring(1).replace("-", " ")}
            </h2>
          </div>

          {/* USER PROFILE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-3 pl-4 pr-2 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all outline-none">
                <div className="text-right hidden sm:block leading-none">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {userData.nama_pengguna}
                  </p>
                  <p className="text-[10px] text-indigo-500 mt-1 font-bold uppercase tracking-widest">
                    {userData.role}
                  </p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <AvatarFallback className="bg-indigo-600 text-white font-black">
                    {userData.nama_pengguna.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 mt-4 rounded-[2rem] p-4 shadow-2xl border-slate-200 dark:border-slate-800"
            >
              <DropdownMenuLabel className="pb-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-black">
                    {userData.nama_pengguna}
                  </p>
                  <p className="text-xs font-bold text-slate-500 capitalize">
                    {userData.role} Account
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl py-3 gap-3 font-bold cursor-pointer mt-2">
                <User size={18} className="text-indigo-500" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl py-3 gap-3 font-bold cursor-pointer text-rose-500 focus:text-rose-500"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                <LogOut size={18} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 lg:p-10 overflow-auto">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
