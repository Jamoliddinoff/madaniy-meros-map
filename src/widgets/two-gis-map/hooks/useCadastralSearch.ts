import { useCallback } from "react";
import { parseWktPolygon, polygonCenter } from "@/shared/utils/parseWkt";
import polygonsData from "@/shared/constants/poligons.json";
import type { MapRef, PolygonsResponse } from "../types";

const { data } = polygonsData as PolygonsResponse;

const FOCUS_ZOOM = 18;
const ANIMATION_MS = 700;

/** Kadastr raqami bo'yicha (land yoki bino) geometriyani topadi. */
function findGeometry(query: string): string | null {
  for (const land of data) {
    if (land.landCadastralNumber === query && land.geometry) {
      return land.geometry;
    }
    for (const building of land.buildings) {
      if (building.cadastralNumber === query && building.geometry) {
        return building.geometry;
      }
    }
  }
  return null;
}

/**
 * Kadastr raqami bo'yicha qidiradi va topilgan obyektga
 * zoom ~18 bilan animatsiyali fokus qiladi.
 */
export function useCadastralSearch(mapRef: MapRef) {
  const search = useCallback(
    (query: string): boolean => {
      const q = query.trim();
      const map = mapRef.current;
      if (!q || !map) return false;

      const geometry = findGeometry(q);
      if (!geometry) return false;

      const center = polygonCenter(parseWktPolygon(geometry));
      map.setCenter(center, { duration: ANIMATION_MS });
      map.setZoom(FOCUS_ZOOM, { duration: ANIMATION_MS });
      return true;
    },
    [mapRef],
  );

  return { search };
}
