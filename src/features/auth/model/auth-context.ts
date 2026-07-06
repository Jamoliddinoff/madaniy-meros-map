import { createContext, useContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  /** Login/parolni tekshiradi; muvaffaqiyatli bo'lsa true qaytaradi. */
  login: (login: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
  return ctx;
}
