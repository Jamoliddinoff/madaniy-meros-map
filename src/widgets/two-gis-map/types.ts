import type { MutableRefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapRef = MutableRefObject<any>;

/** poligons.json ichidagi bino elementi */
export interface BuildingItem {
  cadastralNumber: string;
  geometry: string | null;
}

/** poligons.json ichidagi yer (land) elementi */
export interface LandItem {
  landCadastralNumber: string;
  geometry: string | null;
  buildings: BuildingItem[];
}

export interface PolygonsResponse {
  success: boolean;
  timestamp: string;
  data: LandItem[];
}

/**
 * Poligon bosilganda modalga uzatiladigan tanlov.
 * Building click → `cadastralNumbers` bitta elementli.
 * Land click → o'sha yerdagi barcha bino cadastralNumberlari (select uchun).
 */
export interface CadastralSelection {
  landCadastralNumber: string;
  cadastralNumbers: string[];
}
