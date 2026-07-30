import { useMemo } from "react";
import polygonsData from "@/shared/constants/poligons.json";
import { useRegionSoato } from "@/features/auth/model/region-store";
import type { PolygonsResponse, SavedFilterMode } from "../types";

const { data } = polygonsData as PolygonsResponse;

/**
 * Joriy regionSoato va belgilanganlik filteriga (all/marked/unmarked) mos
 * bino kadastr raqamlari ro'yxatini qaytaradi (list uchun).
 */
export function useFilteredCadastralNumbers(
  cadastralSet: Set<string>,
  savedFilter: SavedFilterMode,
): string[] {
  const regionSoato = useRegionSoato();

  return useMemo(() => {
    const numbers: string[] = [];
    for (const land of data) {
      if (regionSoato !== null && land.regionSoato !== regionSoato) continue;
      for (const building of land.buildings) {
        if (!building.geometry) continue;
        const isSaved = cadastralSet.has(building.cadastralNumber);
        if (savedFilter === "marked" && !isSaved) continue;
        if (savedFilter === "unmarked" && isSaved) continue;
        numbers.push(building.cadastralNumber);
      }
    }
    return numbers;
  }, [cadastralSet, savedFilter, regionSoato]);
}
