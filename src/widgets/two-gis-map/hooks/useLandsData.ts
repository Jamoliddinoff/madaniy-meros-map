import { useQuery } from "@tanstack/react-query";
import { getLands } from "@/shared/api/landsApi";

/**
 * GET /api/lands — yer/bino poligonlari. Viloyat admini uchun filtr
 * serverda (tokendagi regionSoato bo'yicha) majburiy qo'llanadi.
 */
export function useLandsData() {
  const query = useQuery({
    queryKey: ["lands"],
    queryFn: getLands,
  });

  return {
    lands: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
