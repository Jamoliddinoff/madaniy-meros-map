import { useEffect, useRef, useState } from "react";
import { destroyMapGLObject } from "@/shared/lib/mapgl";
import { parseWktPolygon } from "@/shared/utils/parseWkt";
import { useRegionSoato } from "@/features/auth/model/region-store";
import type { CadastralRecord } from "@/shared/api/culturalHeritageApi";
import type {
  MapRef,
  LandItem,
  CadastralSelection,
  SavedFilterMode,
} from "../types";

// Saqlangan (madaniy meros) bino rangi
const SAVED_COLOR = "rgba(255,140,0,0.5)";
const SAVED_STROKE = "#FF8C00";
const DROWED_COLOR = "#d15cff";
const DROWED_STROKE = "#790095";
// Standart bino rangi
const DEFAULT_COLOR = "rgba(0,176,240,0.35)";
const DEFAULT_STROKE = "#00b0f0";

/**
 * poligons.json asosida qatlamlarni chizadi:
 *  - yer (land) geometriyasi → faqat chegara (ichi bo'yalmagan)
 *  - bino (building) geometriyasi → to'ldirilgan poligon
 * Saqlangan (`cadastralSet` ichidagi) binolar oranj rangda chiziladi.
 * `savedFilter` (marked/unmarked) — landCadastralNumber bo'yicha ishlaydi: land
 * "belgilangan" hisoblanadi agar shu land bo'yicha kamida bitta saqlangan yozuv
 * (bino yoki qo'lda chizilgan poligon) bo'lsa; shunga qarab butun land (barcha
 * binolari bilan) ko'rsatiladi yoki hide qilinadi.
 * Bino poligoniga bosilganda tanlangan bino ma'lumotini qaytaradi.
 */
export function useCadastralLayers(
  mapRef: MapRef,
  enabled: boolean,
  cadastralSet: Set<string>,
  savedRecords: CadastralRecord[],
  lands: LandItem[],
  suppressSelectRef?: { current: boolean },
  savedFilter: SavedFilterMode = "all",
) {
  const [selected, setSelected] = useState<CadastralSelection | null>(null);
  const internalSuppressRef = useRef(false);
  const suppress = suppressSelectRef ?? internalSuppressRef;
  const regionSoato = useRegionSoato();

  useEffect(() => {
    if (!enabled || !mapRef.current || !window.mapgl) return;
    const map = mapRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objects: any[] = [];

    // Land "belgilangan" hisoblanadi — shu land bo'yicha kamida bitta saqlangan yozuv bo'lsa
    const markedLandSet = new Set(
      savedRecords.map((record) => record.landCadastralNumber),
    );

    // regionSoato `null` bo'lsa (super admin) — barcha viloyatlar; aks holda faqat o'z viloyati
    // savedFilter — land bo'yicha ishlaydi (marked/unmarked butun landni ko'rsatadi/hide qiladi)
    const filteredData = lands.filter((land) => {
      if (regionSoato !== null && land.regionSoato !== regionSoato) return false;
      if (savedFilter === "all") return true;
      const isMarked = markedLandSet.has(land.landCadastralNumber);
      return savedFilter === "marked" ? isMarked : !isMarked;
    });
    const filteredLandIds = new Set(
      filteredData.map((land) => land.landCadastralNumber),
    );

    for (const land of filteredData) {
      // Yer chegarasi — faqat border, ichi shaffof; bosilganda land modal (select)
      if (land.geometry) {
        try {
          const landPolygon = new window.mapgl.Polygon(map, {
            coordinates: parseWktPolygon(land.geometry),
            color: "rgba(0,0,0,0)",
            strokeColor: "#2957a5",
            strokeWidth: 2,
            zIndex: 10,
          });
          landPolygon.on("click", () => {
            if (suppress.current) return;
            setSelected({
              landCadastralNumber: land.landCadastralNumber,
              cadastralNumbers: land.buildings.map((b) => b.cadastralNumber),
              isLand: true,
            });
          });
          objects.push(landPolygon);
        } catch (e) {
          console.warn("Land polygon error:", e);
        }
      }

      // Binolar — to'ldirilgan poligon, bosiladigan
      for (const building of land.buildings) {
        if (!building.geometry) continue;
        const isSaved = cadastralSet.has(building.cadastralNumber);
        try {
          const polygon = new window.mapgl.Polygon(map, {
            coordinates: parseWktPolygon(building.geometry),
            color: isSaved ? SAVED_COLOR : DEFAULT_COLOR,
            strokeColor: isSaved ? SAVED_STROKE : DEFAULT_STROKE,
            strokeWidth: isSaved ? 2 : 1,
            zIndex: 20,
          });
          polygon.on("click", () => {
            if (suppress.current) return;
            setSelected({
              landCadastralNumber: land.landCadastralNumber,
              cadastralNumbers: [building.cadastralNumber],
              isLand: false,
            });
          });
          objects.push(polygon);
        } catch (e) {
          console.warn("Building polygon error:", e);
        }
      }
    }

    // Qo'lda chizib saqlangan poligonlar (cadastralNumber: "DRAWED") — sheet'dan olingan.
    // Faqat joriy filterdan o'tgan (ko'rsatilayotgan) landlarga tegishlilari chiziladi.
    for (const record of savedRecords) {
      if (!record.poligon) continue;
      if (!filteredLandIds.has(record.landCadastralNumber)) continue;
      try {
        const coordinates = JSON.parse(record.poligon) as number[][][];
        const drawnPolygon = new window.mapgl.Polygon(map, {
          coordinates,
          color: DROWED_COLOR,
          strokeColor: DROWED_STROKE,
          strokeWidth: 2,
          zIndex: 20,
        });
        objects.push(drawnPolygon);
      } catch (e) {
        console.warn("Drawn polygon parse error:", e);
      }
    }

    return () => {
      objects.forEach(destroyMapGLObject);
    };
  }, [
    mapRef,
    enabled,
    cadastralSet,
    savedRecords,
    lands,
    suppress,
    regionSoato,
    savedFilter,
  ]);

  return { selected, clearSelected: () => setSelected(null) };
}
