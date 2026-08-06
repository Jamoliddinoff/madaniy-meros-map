import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/shared/api/authApi";
import { setTokens } from "@/shared/api/tokenStorage";
import { setRegionSoato } from "@/features/auth/model/region-store";

/** POST /api/auth/login — muvaffaqiyatli bo'lsa tokenlarni saqlaydi va regionSoato'ni store'ga yozadi. */
export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      loginRequest(login, password),
    onSuccess: (res) => {
      setTokens(res.accessToken, res.refreshToken);
      setRegionSoato(res.user.regionSoato);
    },
  });
}
