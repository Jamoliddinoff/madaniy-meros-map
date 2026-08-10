import { useQuery } from "@tanstack/react-query";
import { getLands, type PolygonsResponse } from "@/shared/api/landsApi";

const LANDS_CACHE_KEY = "lands-cache";

/** Xarita birinchi marta ochilganda darhol ko'rsatish uchun oldingi javobni sessionStorage'dan o'qiydi. */
function getCachedLands(): PolygonsResponse | undefined {
  try {
    const raw = sessionStorage.getItem(LANDS_CACHE_KEY);
    return raw ? (JSON.parse(raw) as PolygonsResponse) : undefined;
  } catch {
    return undefined;
  }
}

function setCachedLands(data: PolygonsResponse): void {
  try {
    sessionStorage.setItem(LANDS_CACHE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage to'lgan yoki mavjud emas — jim o'tkazib yuboriladi
  }
}

/**
 * GET /api/lands — yer/bino poligonlari. Viloyat admini uchun filtr
 * serverda (tokendagi regionSoato bo'yicha) majburiy qo'llanadi.
 *
 * Xarita tezroq render bo'lishi uchun avval sessionStorage'dagi oldingi
 * javob ko'rsatiladi, so'ng API'dan yangi ma'lumot kelib uni almashtiradi.
 */
export function useLandsData() {
  const query = useQuery({
    queryKey: ["lands"],
    queryFn: async () => {
      const data = await getLands();
      setCachedLands(data);
      return data;
    },
    initialData: getCachedLands,
  });

  return {
    lands: query.data?.data ?? [],
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
