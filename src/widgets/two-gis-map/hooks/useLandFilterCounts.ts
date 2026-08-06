import { useMemo } from "react";
import { useRegionSoato } from "@/features/auth/model/region-store";
import type { CadastralRecord } from "@/shared/api/culturalHeritageApi";
import type { LandItem } from "../types";

export interface LandFilterCounts {
  all: number;
  marked: number;
  unmarked: number;
}

/** Joriy regionSoato bo'yicha har bir filter (all/marked/unmarked) uchun land sonini hisoblaydi. */
export function useLandFilterCounts(
  savedRecords: CadastralRecord[],
  lands: LandItem[],
): LandFilterCounts {
  const regionSoato = useRegionSoato();

  return useMemo(() => {
    const markedLandSet = new Set(
      savedRecords.map((record) => record.landCadastralNumber),
    );
    let total = 0;
    let marked = 0;
    for (const land of lands) {
      if (regionSoato !== null && land.regionSoato !== regionSoato) continue;
      total++;
      if (markedLandSet.has(land.landCadastralNumber)) marked++;
    }
    return { all: total, marked, unmarked: total - marked };
  }, [savedRecords, regionSoato, lands]);
}
