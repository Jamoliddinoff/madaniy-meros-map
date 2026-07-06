import { createContext, useContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  /** localStorage'dagi hash tekshirilayotgan boshlang'ich holat. */
  checking: boolean;
  /** Login/parolni tekshiradi; muvaffaqiyatli bo'lsa true qaytaradi. */
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
  return ctx;
}
