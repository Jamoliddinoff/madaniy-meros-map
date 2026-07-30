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
  regionSoato: number;
  buildings: BuildingItem[];
}

export interface PolygonsResponse {
  success: boolean;
  timestamp: string;
  data: LandItem[];
}

/**
 * Poligon bosilganda modalga uzatiladigan tanlov.
 * Building click → `isLand: false`, `cadastralNumbers` bitta elementli.
 * Land click → `isLand: true`, o'sha yerdagi barcha bino cadastralNumberlari (select uchun).
 */
export interface CadastralSelection {
  landCadastralNumber: string;
  cadastralNumbers: string[];
  isLand: boolean;
}

/**
 * Binolarni belgilanganlik bo'yicha filterlash rejimi:
 *  - all: barchasi ko'rsatiladi
 *  - marked: faqat belgilangan (google sheet'da cadastralNumberi bor) binolar
 *  - unmarked: faqat belgilanmagan binolar (belgilanganlar hide qilinadi)
 */
export type SavedFilterMode = "all" | "marked" | "unmarked";
