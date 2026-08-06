import { useMemo } from "react";
import { useRegionSoato } from "@/features/auth/model/region-store";
import type { CadastralRecord } from "@/shared/api/culturalHeritageApi";
import type { LandItem, SavedFilterMode } from "../types";

/**
 * Joriy regionSoato va belgilanganlik filteriga (all/marked/unmarked) mos
 * yer (land) kadastr raqamlari ro'yxatini qaytaradi (list uchun).
 * Land "belgilangan" hisoblanadi — agar shu land bo'yicha kamida bitta
 * saqlangan yozuv (bino yoki qo'lda chizilgan poligon) bo'lsa.
 */
export function useFilteredCadastralNumbers(
  savedRecords: CadastralRecord[],
  savedFilter: SavedFilterMode,
  lands: LandItem[],
): string[] {
  const regionSoato = useRegionSoato();

  return useMemo(() => {
    const markedLandSet = new Set(
      savedRecords.map((record) => record.landCadastralNumber),
    );
    const numbers: string[] = [];
    for (const land of lands) {
      if (regionSoato !== null && land.regionSoato !== regionSoato) continue;
      const isMarked = markedLandSet.has(land.landCadastralNumber);
      if (savedFilter === "marked" && !isMarked) continue;
      if (savedFilter === "unmarked" && isMarked) continue;
      numbers.push(land.landCadastralNumber);
    }
    return numbers;
  }, [savedRecords, savedFilter, regionSoato, lands]);
}
