import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutRequest } from "@/shared/api/authApi";
import { clearTokens } from "@/shared/api/tokenStorage";
import { setRegionSoato } from "@/features/auth/model/region-store";

/** POST /api/auth/logout — serverdagi holatidan qat'i nazar, lokal tokenlar va query cache tozalanadi. */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      clearTokens();
      setRegionSoato(null);
      queryClient.clear();
    },
  });
}
