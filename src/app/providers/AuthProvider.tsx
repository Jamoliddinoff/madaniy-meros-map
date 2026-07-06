import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/features/auth/model/auth-context";
import {
  checkAuth,
  login as loginRequest,
  logout as logoutRequest,
} from "@/features/auth/lib/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Mount'da localStorage'dagi hashni env kredensiallari hashiga tekshiramiz
  useEffect(() => {
    checkAuth().then((ok) => {
      setIsAuthenticated(ok);
      setChecking(false);
    });
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    const ok = await loginRequest(loginValue, password);
    if (ok) setIsAuthenticated(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
