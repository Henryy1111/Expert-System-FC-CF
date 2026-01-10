import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ShieldAlert,
  User,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const confirmLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    setShowLogoutModal(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Beranda", path: "/home" },
    { name: "Konsultasi", path: "/konsultasi" },
    { name: "Tentang", path: "#tentang" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          scrolled
            ? "py-4 bg-slate-950/40 backdrop-blur-3xl border-b border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            : "py-10 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center justify-between">
          {/* LOGO SECTION - PREMIUM BRANDING */}
          <Link
            to="/"
            className="flex items-center gap-5 group relative z-[110]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/40 transition-all duration-700" />
              <motion.img
                whileHover={{ rotate: 5, scale: 1.05 }}
                src="/images/logo.png"
                alt="Logo"
                className="relative h-12 w-auto object-contain brightness-110 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-[-0.05em] leading-none uppercase italic">
                Expert<span className="text-indigo-500">.</span>System
              </span>
              <span className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase leading-none mt-1 group-hover:text-indigo-400 transition-colors">
                Sistem Pakar
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU - HIGH END SPACING */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-14">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-500 group ${
                    location.pathname === link.path
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location.pathname === link.path ? (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                    />
                  ) : (
                    <div className="absolute -bottom-3 left-0 w-0 h-[2px] bg-indigo-500/50 group-hover:w-full transition-all duration-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* DIVIDER LUXE */}
            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

            {user ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowDropdown(true)}
                  className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] pl-2 pr-5 py-2 rounded-full hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-105 transition-transform duration-500">
                    {user.nama_pengguna?.charAt(0).toUpperCase() || (
                      <User size={14} />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-slate-200 tracking-widest uppercase">
                      {user.nama_pengguna?.split(" ")[0]}
                    </span>
                    <span className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-tighter">
                      Member
                    </span>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-slate-600 transition-transform duration-700 ${
                      showDropdown ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      onMouseLeave={() => setShowDropdown(false)}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute right-0 mt-6 w-72 bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden"
                    >
                      <div className="px-6 py-5 border-b border-white/5 mb-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Sparkles className="text-indigo-500" size={40} />
                        </div>
                        <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.4em] mb-1">
                          Authenticated
                        </p>
                        <p className="text-[13px] font-bold text-white truncate uppercase tracking-tight">
                          {user.nama_pengguna}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {user.email || "Official Account"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {(user.role === "admin" || user.role === "dokter") && (
                          <Link
                            to="/dashboard"
                            className="flex items-center justify-between px-6 py-4 rounded-[1.5rem] hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all group"
                          >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                              Panel Dashboard
                            </span>
                            <LayoutDashboard
                              size={16}
                              className="group-hover:text-indigo-500 transition-colors"
                            />
                          </Link>
                        )}
                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] hover:bg-red-500/5 text-slate-400 hover:text-red-400 transition-all group"
                        >
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            End Session
                          </span>
                          <LogOut
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  to="/login"
                  className="text-[10px] font-black tracking-[0.4em] text-slate-500 hover:text-white transition-all uppercase"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group relative px-8 py-3.5 overflow-hidden rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Registrasi</span>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-[110] w-14 h-14 flex items-center justify-center bg-white/[0.03] rounded-[2rem] border border-white/10 text-white active:scale-90 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU - FULLSCREEN LUXE */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-slate-950 z-[105] lg:hidden flex flex-col justify-center px-12"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px]" />
              </div>

              <div className="flex flex-col gap-8 relative z-10">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] mb-4">
                  Navigation
                </span>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-6xl font-black text-white italic tracking-tighter uppercase hover:text-indigo-500 transition-all duration-500 block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 relative z-10 border-t border-white/5 pt-10">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-[12px] font-black text-white uppercase tracking-[0.4em] border-b-2 border-indigo-500 pb-2"
                >
                  Create Account →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MODAL LOGOUT - SENADA DENGAN LOGIN */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-3xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[400px] bg-slate-900 border border-white/10 rounded-[3.5rem] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20 rotate-12">
                <ShieldAlert size={44} className="text-red-500 -rotate-12" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">
                Selesai<span className="text-red-500">?</span>
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-2">
                Anda akan memutuskan koneksi aman dari pusat sistem pakar.
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={confirmLogout}
                  className="w-full py-5 bg-white text-black hover:bg-red-600 hover:text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all duration-500"
                >
                  Terminate Session
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
