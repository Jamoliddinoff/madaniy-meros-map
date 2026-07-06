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

/** Bino poligoni bosilganda deviderda ko'rsatiladigan ma'lumot */
export interface SelectedBuilding {
  landCadastralNumber: string;
  cadastralNumber: string;
}
