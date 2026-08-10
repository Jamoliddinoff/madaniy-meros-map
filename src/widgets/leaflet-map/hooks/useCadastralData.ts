import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCadastralList } from "@/shared/api/culturalHeritageApi";

/** GET /api/cultural-heritage — saqlangan kadastr yozuvlari. `cadastralSet` — ranglash uchun tezkor qidiruv to'plami. */
export function useCadastralData() {
  const query = useQuery({
    queryKey: ["cultural-heritage"],
    queryFn: getCadastralList,
  });

  const cadastralSet = useMemo(
    () => new Set((query.data ?? []).map((item) => item.cadastralNumber)),
    [query.data],
  );

  return {
    data: query.data ?? [],
    cadastralSet,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
