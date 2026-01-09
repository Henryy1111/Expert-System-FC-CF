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
  Settings,
  UserCircle,
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
            ? "py-3 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* LOGO SECTION */}
          <Link to="/" className="relative z-[110] flex items-center group">
            <motion.img
              whileHover={{ scale: 1.02 }}
              src="/images/logo.png"
              alt="Logo"
              className="h-20 md:h-11 w-auto transition-all"
            />
          </Link>

          {/* DESKTOP MENU - Luxury Balanced Font */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[13px] font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
                    location.pathname === link.path
                      ? "text-blue-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-blue-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {user ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowDropdown(true)}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/10 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg">
                    {user.nama_pengguna?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[12px] font-semibold text-slate-200">
                    {user.nama_pengguna?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      onMouseLeave={() => setShowDropdown(false)}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[24px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                          Akses Akun
                        </p>
                        <p className="text-[13px] text-slate-300 truncate">
                          {user.email || "Member Terverifikasi"}
                        </p>
                      </div>
                      {(user.role === "admin" || user.role === "dokter") && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 transition-all text-xs font-bold uppercase"
                        >
                          <LayoutDashboard size={16} /> Dashboard Panel
                        </Link>
                      )}
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-xs font-bold uppercase"
                      >
                        <LogOut size={16} /> Logout Sistem
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  to="/login"
                  className="text-[11px] font-bold tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE - Clean Design */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-[110] w-11 h-11 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white active:scale-90 transition-transform"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE OVERLAY MENU - Professional & Clean */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 bg-slate-950 z-[105] lg:hidden flex flex-col"
            >
              <div className="flex flex-col pt-32 px-10 gap-8">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">
                  Main Navigation
                </span>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-light text-slate-200 hover:text-blue-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto p-10 bg-slate-900/50 border-t border-white/5">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-xl">
                        {user.nama_pengguna?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          {user.nama_pengguna}
                        </p>
                        <p className="text-xs text-slate-500">
                          Authorized User
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl border border-red-500/20 text-xs tracking-widest uppercase"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 bg-white/5 text-white text-center font-bold rounded-2xl border border-white/10 text-xs tracking-widest uppercase"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 bg-blue-600 text-white text-center font-bold rounded-2xl text-xs tracking-widest uppercase shadow-lg shadow-blue-600/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MODAL LOGOUT - Elegant Professional */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[32px] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <ShieldAlert size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Selesaikan Sesi?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Anda akan keluar dari sistem. Pastikan seluruh pekerjaan Anda
                sudah tersimpan.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest transition-all"
                >
                  Keluar Sekarang
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl text-[11px] uppercase tracking-widest transition-all"
                >
                  Batalkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
