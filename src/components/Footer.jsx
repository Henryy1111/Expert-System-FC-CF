import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-20 pb-10 relative overflow-hidden">
      {/* Background Glow Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand/Logo Section */}
          <div className="space-y-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Membangun masa depan kesehatan digital yang lebih akurat melalui
              integrasi sistem pakar dan kasih pelayanan medis yang tulus.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: <FaFacebookF />,
                  link: "https://facebook.com/rsbkbokorturen/",
                  color: "hover:bg-blue-600",
                },
                {
                  icon: <FaInstagram />,
                  link: "https://instagram.com/rsbkbokorturen/",
                  color: "hover:bg-pink-600",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">
              Navigasi
            </h4>
            <ul className="space-y-4">
              {["Beranda", "Konsultasi", "Tentang Kami"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Beranda" ? "/" : `/${item.toLowerCase()}`}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Section */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">
              Hubungi Kami
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                  <FaEnvelope size={14} />
                </div>
                <a
                  href="mailto:rsbokorturen@gmail.com"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  rsbokorturen@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                  <FaPhoneAlt size={14} />
                </div>
                <span className="text-slate-400 text-sm">(0341) 824453</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="text-slate-400 text-sm">
                  Jl. Jendral Ahmad Yani No.91 Turen, Malang
                </span>
              </li>
            </ul>
          </div>

          {/* Badge Section */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
            </div>
            <h5 className="text-white font-bold text-sm mb-1">
              Terverifikasi Pakar
            </h5>
            <p className="text-slate-500 text-[10px] uppercase tracking-tighter">
              Medical Data Security Guaranteed
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-slate-300 font-bold">
              Henry Chris Ravindra
            </span>
            . All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-slate-600 hover:text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
