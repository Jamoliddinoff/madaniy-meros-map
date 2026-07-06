import { useCallback, useState, type ReactNode } from "react";
import { AuthContext } from "@/features/auth/model/auth-context";
import {
  clearAuth,
  persistAuth,
  readAuth,
  validateCredentials,
} from "@/features/auth/lib/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readAuth);

  const login = useCallback((loginValue: string, password: string) => {
    if (!validateCredentials(loginValue, password)) return false;
    persistAuth();
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
