// === AdminLayout.jsx LUXURY EDITION ===
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
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
  Database,
  Zap,
  ShieldCheck,
  Sparkles,
  Command,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children, role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Sync theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setIsDark(saved === "dark");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const userData = useMemo(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return (
        storedUser || { nama_pengguna: "Administrator", role: role || "admin" }
      );
    } catch {
      return { nama_pengguna: "Administrator", role: role || "admin" };
    }
  }, [role]);

  const menu = [
    {
      title: "Control Center",
      items: [
        { name: "Dashboard Sistem", icon: LayoutDashboard, link: "/dashboard" },
        ...(role === "admin"
          ? [{ name: "Data Pengguna", icon: Users, link: "/pengguna" }]
          : []),
        { name: "Data Konsultasi", icon: Activity, link: "/konsultasi" },
      ],
    },
    {
      title: "Knowledge Base Management",
      items: [
        { name: "Data Penyakit", icon: ClipboardList, link: "/penyakit" },
        { name: "Data Gejala", icon: Database, link: "/gejala" },
        { name: "Data Rule", icon: Layers, link: "/rule" },
      ],
    },
    {
      title: "Engine Analytics",
      items: [
        { name: "Data Detail Rule", icon: Zap, link: "/detailrule" },
        { name: "Data Bobot CF", icon: Settings, link: "/bobotcf" },
        {
          name: "Data Detail Konsultasi",
          icon: FileSearch,
          link: "/detailkonsultasi",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Reusable Nav Component with Perfect Alignment
  const NavItems = ({ isMobile = false }) => (
    <nav className={`space-y-8 ${isMobile ? "p-6" : "px-4"}`}>
      {menu.map((group, idx) => (
        <div key={idx} className="space-y-3">
          {(!collapsed || isMobile) && (
            <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              {group.title}
            </h4>
          )}
          <div className="space-y-1.5">
            {group.items.map((m, i) => {
              const active = isActive(m.link);
              return (
                <button
                  key={i}
                  onClick={() => {
                    navigate(m.link);
                    if (isMobile) setMobileOpen(false);
                  }}
                  className={`w-full flex items-center transition-all duration-300 group relative rounded-2xl
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                        : "text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 hover:text-indigo-600"
                    } 
                    ${
                      collapsed && !isMobile
                        ? "justify-center h-12 w-12 mx-auto"
                        : "px-4 py-3.5 gap-4"
                    }`}
                >
                  <m.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      active
                        ? "animate-pulse"
                        : "group-hover:scale-110 transition-transform"
                    }`}
                    strokeWidth={2.2}
                  />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {m.name}
                    </span>
                  )}
                  {active && !isMobile && !collapsed && (
                    <motion.div
                      layoutId="pill"
                      className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                    />
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
        isDark ? "bg-[#020617] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* --- SIDEBAR DESKTOP --- */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen z-50 transition-all duration-500 border-r
        ${collapsed ? "w-24" : "w-80"} 
        ${
          isDark ? "bg-[#020617] border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-6 mb-4">
          <div
            className={`flex items-center gap-4 mx-auto ${
              collapsed ? "" : "w-full"
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-2xl flex items-center justify-center shrink-0">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 uppercase italic">
                  Expert System
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Dashboard Expert System
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
          <NavItems />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Theme Toggle Button - Fixed Text Visibility */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all border
              ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              } ${collapsed ? "justify-center" : ""}`}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
            {!collapsed && (
              <span className="text-xs font-black uppercase tracking-widest">
                Mode Tampilan
              </span>
            )}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-10 flex items-center justify-center rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar Header */}
        <header
          className={`h-20 flex items-center justify-between px-6 lg:px-12 shrink-0 border-b backdrop-blur-md z-40 transition-all
          ${
            isDark
              ? "bg-[#020617]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-6">
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl bg-slate-100 dark:bg-slate-800 h-11 w-11"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className={`w-80 p-0 border-r ${
                    isDark
                      ? "bg-[#020617] border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Cpu className="h-8 w-8 text-indigo-600" />
                    <span className="text-xl font-black dark:text-white uppercase italic">
                      Expert.Sys
                    </span>
                  </div>
                  <div className="overflow-y-auto h-full">
                    <NavItems isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumb style path */}
            <div className="hidden md:flex items-center gap-2">
              <Command size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                System
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                {location.pathname === "/dashboard"
                  ? "Overview"
                  : location.pathname.split("/")[1]}
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all outline-none">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black dark:text-white leading-none">
                      {userData.nama_pengguna}
                    </p>
                    <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-1">
                      {userData.role}
                    </p>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-indigo-500/20">
                    <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                      {userData.nama_pengguna.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 mt-2 rounded-3xl p-4 shadow-2xl border-slate-200 dark:border-slate-800"
              >
                <DropdownMenuLabel className="px-2 pb-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Active Session
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl py-3 gap-3 font-bold cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                  <User size={18} className="text-indigo-500" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl py-3 gap-3 font-bold cursor-pointer text-rose-500 focus:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  <LogOut size={18} /> Logout Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-[1600px] mx-auto pb-20"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }

        /* Smooth transition for sidebar items */
        aside button span {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
