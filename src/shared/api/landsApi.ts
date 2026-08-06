import { httpGet } from "./httpClient";

/** poligons.json o'rnini bosuvchi API'dagi bino elementi */
export interface BuildingItem {
  cadastralNumber: string;
  geometry: string | null;
}

/** poligons.json o'rnini bosuvchi API'dagi yer (land) elementi */
export interface LandItem {
  landCadastralNumber: string;
  geometry: string | null;
  regionSoato: number;
  buildings: BuildingItem[];
}

export interface PolygonsResponse {
  success: boolean;
  timestamp: string;
  data: LandItem[];
}

/** GET /api/lands — Yer uchastkalari va binolar. Viloyat admini uchun filtr serverda majburiy qo'llanadi. */
export function getLands(): Promise<PolygonsResponse> {
  return httpGet<PolygonsResponse>("/api/lands");
}
