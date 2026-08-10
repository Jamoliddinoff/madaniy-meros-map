import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { destroyLeafletLayer } from "@/shared/lib/leaflet";
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
const SAVED_FILL = "#FF8C00";
const SAVED_STROKE = "#FF8C00";
const DROWED_FILL = "#d15cff";
const DROWED_STROKE = "#790095";
// Standart bino rangi
const DEFAULT_FILL = "#00b0f0";
const DEFAULT_STROKE = "#00b0f0";

/** WKT (lng,lat) ringlarni Leaflet uchun (lat,lng) ga aylantiradi. */
function toLatLngRings(rings: [number, number][][]): [number, number][][] {
  return rings.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number]));
}

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
    if (!enabled || !mapRef.current) return;
    const map = mapRef.current;
    const layers: L.Layer[] = [];

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
          const landPolygon = L.polygon(
            toLatLngRings(parseWktPolygon(land.geometry)),
            {
              fillOpacity: 0,
              color: "#2957a5",
              weight: 2,
            },
          ).addTo(map);
          landPolygon.on("click", () => {
            if (suppress.current) return;
            setSelected({
              landCadastralNumber: land.landCadastralNumber,
              cadastralNumbers: land.buildings.map((b) => b.cadastralNumber),
              isLand: true,
            });
          });
          layers.push(landPolygon);
        } catch (e) {
          console.warn("Land polygon error:", e);
        }
      }

      // Binolar — to'ldirilgan poligon, bosiladigan
      for (const building of land.buildings) {
        if (!building.geometry) continue;
        const isSaved = cadastralSet.has(building.cadastralNumber);
        try {
          const polygon = L.polygon(
            toLatLngRings(parseWktPolygon(building.geometry)),
            {
              fillColor: isSaved ? SAVED_FILL : DEFAULT_FILL,
              fillOpacity: isSaved ? 0.5 : 0.35,
              color: isSaved ? SAVED_STROKE : DEFAULT_STROKE,
              weight: isSaved ? 2 : 1,
            },
          ).addTo(map);
          polygon.on("click", () => {
            if (suppress.current) return;
            setSelected({
              landCadastralNumber: land.landCadastralNumber,
              cadastralNumbers: [building.cadastralNumber],
              isLand: false,
            });
          });
          layers.push(polygon);
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
        const drawnPolygon = L.polygon(
          toLatLngRings(coordinates as [number, number][][]),
          {
            fillColor: DROWED_FILL,
            fillOpacity: 1,
            color: DROWED_STROKE,
            weight: 2,
          },
        ).addTo(map);
        layers.push(drawnPolygon);
      } catch (e) {
        console.warn("Drawn polygon parse error:", e);
      }
    }

    return () => {
      layers.forEach(destroyLeafletLayer);
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
