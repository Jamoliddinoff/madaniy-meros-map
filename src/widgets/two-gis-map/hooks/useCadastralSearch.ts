import { useCallback } from "react";
import { parseWktPolygon, polygonCenter } from "@/shared/utils/parseWkt";
import type { MapRef, LandItem } from "../types";

const FOCUS_ZOOM = 18;
const ANIMATION_MS = 700;

/**
 * Kadastr raqami bo'yicha (land yoki bino) fokus markazini topadi.
 * Land topilsa — birinchi navbatda landning o'z geometriyasi ishlatiladi;
 * land geometriyasi bo'lmasa, uning binolari markazlari o'rtachasiga fokus qilinadi.
 */
function findFocusCenter(query: string, lands: LandItem[]): [number, number] | null {
  for (const land of lands) {
    if (land.landCadastralNumber === query) {
      if (land.geometry) {
        return polygonCenter(parseWktPolygon(land.geometry));
      }
      const buildingCenters = land.buildings
        .map((building) => building.geometry)
        .filter((geometry): geometry is string => geometry !== null)
        .map((geometry) => polygonCenter(parseWktPolygon(geometry)));
      if (buildingCenters.length === 0) return null;
      const lng =
        buildingCenters.reduce((sum, [c]) => sum + c, 0) /
        buildingCenters.length;
      const lat =
        buildingCenters.reduce((sum, [, c]) => sum + c, 0) /
        buildingCenters.length;
      return [lng, lat];
    }
    for (const building of land.buildings) {
      if (building.cadastralNumber === query && building.geometry) {
        return polygonCenter(parseWktPolygon(building.geometry));
      }
    }
  }
  return null;
}

/**
 * Kadastr raqami bo'yicha qidiradi va topilgan obyektga
 * zoom ~18 bilan animatsiyali fokus qiladi.
 */
export function useCadastralSearch(mapRef: MapRef, lands: LandItem[]) {
  const search = useCallback(
    (query: string): boolean => {
      const q = query.trim();
      const map = mapRef.current;
      if (!q || !map) return false;

      const center = findFocusCenter(q, lands);
      if (!center) return false;

      map.setCenter(center, { duration: ANIMATION_MS });
      map.setZoom(FOCUS_ZOOM, { duration: ANIMATION_MS });
      return true;
    },
    [mapRef, lands],
  );

  return { search };
}
