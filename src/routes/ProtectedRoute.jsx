import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allow }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role tidak diizinkan
  if (!allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
