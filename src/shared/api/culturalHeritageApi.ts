import { httpGet, httpPost } from "./httpClient";

/**
 * Belgilangan (madaniy meros) kadastr yozuvi.
 * `poligon` — qo'lda chizilgan poligon uchun (cadastralNumber: "DRAWED"),
 * ring koordinatalari JSON.stringify qilingan holda saqlanadi.
 */
export interface CadastralRecord {
  landCadastralNumber: string;
  cadastralNumber: string;
  poligon?: string;
}

interface CulturalHeritageCreateResponse {
  success: boolean;
  landCadastralNumber: string;
  cadastralNumber: string;
  poligon: string;
}

/** GET /api/cultural-heritage — belgilangan obyektlar ro'yxati (har doim eng yangi holat). */
export function getCadastralList(): Promise<CadastralRecord[]> {
  return httpGet<CadastralRecord[]>("/api/cultural-heritage");
}

/** POST /api/cultural-heritage — yangi belgilangan obyekt qo'shadi. */
export function saveCadastral(
  record: CadastralRecord,
): Promise<CulturalHeritageCreateResponse> {
  return httpPost<CulturalHeritageCreateResponse>(
    "/api/cultural-heritage",
    record,
  );
}
