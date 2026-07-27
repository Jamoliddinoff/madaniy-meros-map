import { useEffect, useRef, useState } from "react";
import { destroyMapGLObject } from "@/shared/lib/mapgl";
import { parseWktPolygon } from "@/shared/utils/parseWkt";
import polygonsData from "@/shared/constants/poligons.json";
import type { CadastralRecord } from "@/shared/api/sheetApi";
import type { MapRef, PolygonsResponse, CadastralSelection } from "../types";

const { data } = polygonsData as PolygonsResponse;

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
 * `cadastralSet` o'zgarganda qatlamlar qayta chiziladi (redraw).
 * Bino poligoniga bosilganda tanlangan bino ma'lumotini qaytaradi.
 */
export function useCadastralLayers(
  mapRef: MapRef,
  enabled: boolean,
  cadastralSet: Set<string>,
  savedRecords: CadastralRecord[],
  suppressSelectRef?: { current: boolean },
) {
  const [selected, setSelected] = useState<CadastralSelection | null>(null);
  const internalSuppressRef = useRef(false);
  const suppress = suppressSelectRef ?? internalSuppressRef;

  useEffect(() => {
    if (!enabled || !mapRef.current || !window.mapgl) return;
    const map = mapRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objects: any[] = [];

    for (const land of data) {
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
            });
          });
          objects.push(polygon);
        } catch (e) {
          console.warn("Building polygon error:", e);
        }
      }
    }

    // Qo'lda chizib saqlangan poligonlar (cadastralNumber: "DRAWED") — sheet'dan olingan.
    for (const record of savedRecords) {
      if (!record.poligon) continue;
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
  }, [mapRef, enabled, cadastralSet, savedRecords, suppress]);

  return { selected, clearSelected: () => setSelected(null) };
}
