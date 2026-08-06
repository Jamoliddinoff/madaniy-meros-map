import { useQuery } from "@tanstack/react-query";
import { meRequest } from "@/shared/api/authApi";

/**
 * GET /api/auth/me — sahifa yuklanganda sessiyani tiklash uchun.
 * `enabled: false` — avtomatik ishga tushmaydi, faqat `refetch()` orqali (AuthProvider mount'da chaqiradi).
 */
export function useMeQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: meRequest,
    enabled: false,
    retry: false,
  });
}
