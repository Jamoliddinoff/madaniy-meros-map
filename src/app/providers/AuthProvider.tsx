import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/features/auth/model/auth-context";
import { useMeQuery } from "@/features/auth/hooks/useMeQuery";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { useLogoutMutation } from "@/features/auth/hooks/useLogoutMutation";
import { getAccessToken } from "@/shared/api/tokenStorage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  // Mount'da: token bo'lsa GET /api/auth/me bilan sessiyani tiklaymiz
  useEffect(() => {
    if (!getAccessToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'da bir martalik boshlang'ich holat
      setChecking(false);
      return;
    }
    meQuery
      .refetch()
      .then((res) => setIsAuthenticated(!!res.data))
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- faqat mount'da bir marta
  }, []);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      try {
        await loginMutation.mutateAsync({ login: loginValue, password });
        setIsAuthenticated(true);
        return true;
      } catch {
        return false;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
    setIsAuthenticated(false);
  }, [logoutMutation]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
