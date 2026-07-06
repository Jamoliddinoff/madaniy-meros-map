import { useCallback, useEffect, useState } from "react";
import { getCadastralList, type CadastralRecord } from "@/shared/api/sheetApi";

/**
 * Google Sheet'dan saqlangan kadastr yozuvlarini oladi.
 * `refetch` tashqaridan (saqlashdan keyin) chaqirilishi mumkin.
 * `cadastralSet` — ranglash uchun tezkor qidiruv to'plami.
 */
export function useCadastralData() {
  const [data, setData] = useState<CadastralRecord[]>([]);
  const [cadastralSet, setCadastralSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getCadastralList();
      setData(list);
      setCadastralSet(new Set(list.map((item) => item.cadastralNumber)));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mount'da bir marta yuklaymiz; setState async fetch'dan keyin bo'ladi
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [refetch]);

  return { data, cadastralSet, loading, error, refetch };
}
