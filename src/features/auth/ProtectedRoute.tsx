import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./model/auth-context";

/** Avtorizatsiyadan o'tmagan foydalanuvchini login sahifasiga yo'naltiradi. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
