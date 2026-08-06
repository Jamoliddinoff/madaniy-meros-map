import type { MutableRefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapRef = MutableRefObject<any>;

export type {
  BuildingItem,
  LandItem,
  PolygonsResponse,
} from "@/shared/api/landsApi";

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
