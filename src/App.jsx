import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

/* ================= ROUTE GUARD ================= */
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Konsultasi from "./pages/Konsultasi"; // Halaman Form untuk User

/* ================= PENYAKIT ================= */
import PenyakitIndex from "./pages/penyakit/PenyakitIndex";
import PenyakitCreate from "./pages/penyakit/PenyakitCreate";
import PenyakitEdit from "./pages/penyakit/PenyakitEdit";

/* ================= GEJALA ================= */
import GejalaIndex from "./pages/gejala/GejalaIndex";
import GejalaCreate from "./pages/gejala/GejalaCreate";
import GejalaEdit from "./pages/gejala/GejalaEdit";

/* ================= RULE ================= */
import RuleIndex from "./pages/rule/RuleIndex";
import RuleCreate from "./pages/rule/RuleCreate";
import RuleEdit from "./pages/rule/RuleEdit";

/* ================= DETAIL RULE ================= */
import PilihRule from "./pages/detailrule/PilihRule";
import DetailRuleIndex from "./pages/detailrule/DetailRuleIndex";
import DetailRuleCreate from "./pages/detailrule/DetailRuleCreate";
import DetailRuleEdit from "./pages/detailrule/DetailRuleEdit";

/* ================= BOBOT CF ================= */
import BobotCFIndex from "./pages/bobotcf/BobotCFIndex";
import BobotCFCreate from "./pages/bobotcf/BobotCFCreate";
import BobotCFEdit from "./pages/bobotcf/BobotCFEdit";

/* ================= PENGGUNA ================= */
import PenggunaIndex from "./pages/pengguna/PenggunaIndex";
import PenggunaCreate from "./pages/pengguna/PenggunaCreate";
import PenggunaEdit from "./pages/pengguna/PenggunaEdit";

/* ================= KONSULTASI (MANAGEMENT) ================= */
import KonsultasiIndex from "./pages/konsultasi/KonsultasiIndex"; // Tabel untuk Admin/Dokter
import DetailKonsultasiIndex from "./pages/detailkonsultasi/DetailKonsultasiIndex";

export default function App() {
  /* ================= DARK MODE STATE ================= */
  const [darkMode, setDarkMode] = useState(false);

  /* ================= DYNAMIC USER DATA ================= */
  const user = useMemo(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const role = user?.role;

  /* ================= THEME LOGIC ================= */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allow={["admin", "dokter", "user"]}>
              <Dashboard role={role} />
            </ProtectedRoute>
          }
        />

        {/* ================= FITUR KONSULTASI (KONDISIONAL ROLE) ================= */}
        <Route
          path="/konsultasi"
          element={
            <ProtectedRoute allow={["admin", "dokter", "user"]}>
              {/* Jika role adalah user, arahkan ke halaman Form Diagnosa.
                  Jika role adalah admin/dokter, arahkan ke halaman Tabel Laporan.
              */}
              {role === "user" ? <Konsultasi /> : <KonsultasiIndex />}
            </ProtectedRoute>
          }
        />

        {/* ================= PENYAKIT ================= */}
        <Route
          path="/penyakit"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <PenyakitIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/penyakit/tambah"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <PenyakitCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/penyakit/edit/:id"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <PenyakitEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= GEJALA ================= */}
        <Route
          path="/gejala"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <GejalaIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gejala/tambah"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <GejalaCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gejala/edit/:id"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <GejalaEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= RULE ================= */}
        <Route
          path="/rule"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <RuleIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rule/tambah"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <RuleCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rule/edit/:id"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <RuleEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= DETAIL RULE ================= */}
        <Route
          path="/detailrule"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <PilihRule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailrule/:id_rule"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <DetailRuleIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailrule/tambah/:id_rule"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <DetailRuleCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailrule/edit/:id_detail"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <DetailRuleEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= BOBOT CF ================= */}
        <Route
          path="/bobotcf"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <BobotCFIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bobotcf/tambah"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <BobotCFCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bobotcf/edit/:id"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <BobotCFEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= PENGGUNA ================= */}
        <Route
          path="/pengguna"
          element={
            <ProtectedRoute allow={["admin"]}>
              <PenggunaIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengguna/tambah"
          element={
            <ProtectedRoute allow={["admin"]}>
              <PenggunaCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengguna/edit/:id"
          element={
            <ProtectedRoute allow={["admin"]}>
              <PenggunaEdit />
            </ProtectedRoute>
          }
        />

        {/* ================= DETAIL KONSULTASI (ADMIN/DOKTER) ================= */}
        <Route
          path="/detailkonsultasi"
          element={
            <ProtectedRoute allow={["admin", "dokter"]}>
              <DetailKonsultasiIndex />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
