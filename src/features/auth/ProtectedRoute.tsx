import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./model/auth-context";

/** Avtorizatsiyadan o'tmagan foydalanuvchini login sahifasiga yo'naltiradi. */
export function ProtectedRoute() {
  const { isAuthenticated, checking } = useAuth();

  // Hash tekshirilguncha redirect qilmaymiz (sahifa yangilanganda flash bo'lmasin)
  if (checking) {
    return (
      <div className="flex min-h-full items-center justify-center text-neutral-500">
        Yuklanmoqda...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
