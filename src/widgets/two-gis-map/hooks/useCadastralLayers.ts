import { useEffect, useState } from "react";
import { destroyMapGLObject } from "@/shared/lib/mapgl";
import { parseWktPolygon } from "@/shared/utils/parseWkt";
import polygonsData from "@/shared/constants/poligons.json";
import type { MapRef, PolygonsResponse, SelectedBuilding } from "../types";

const { data } = polygonsData as PolygonsResponse;

/**
 * poligons.json asosida qatlamlarni chizadi:
 *  - yer (land) geometriyasi → faqat chegara (ichi bo'yalmagan)
 *  - bino (building) geometriyasi → to'ldirilgan poligon
 * Bino poligoniga bosilganda tanlangan bino ma'lumotini qaytaradi.
 */
export function useCadastralLayers(mapRef: MapRef, enabled: boolean) {
  const [selected, setSelected] = useState<SelectedBuilding | null>(null);

  useEffect(() => {
    if (!enabled || !mapRef.current || !window.mapgl) return;
    const map = mapRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objects: any[] = [];

    for (const land of data) {
      // Yer chegarasi — faqat border, ichi shaffof
      if (land.geometry) {
        try {
          objects.push(
            new window.mapgl.Polygon(map, {
              coordinates: parseWktPolygon(land.geometry),
              color: "rgba(0,0,0,0)",
              strokeColor: "#2957a5",
              strokeWidth: 2,
              interactive: false,
              zIndex: 10,
            }),
          );
        } catch (e) {
          console.warn("Land polygon error:", e);
        }
      }

      // Binolar — to'ldirilgan poligon, bosiladigan
      for (const building of land.buildings) {
        if (!building.geometry) continue;
        try {
          const polygon = new window.mapgl.Polygon(map, {
            coordinates: parseWktPolygon(building.geometry),
            color: "rgba(0,176,240,0.35)",
            strokeColor: "#00b0f0",
            strokeWidth: 1,
            zIndex: 20,
          });
          polygon.on("click", () =>
            setSelected({
              landCadastralNumber: land.landCadastralNumber,
              cadastralNumber: building.cadastralNumber,
            }),
          );
          objects.push(polygon);
        } catch (e) {
          console.warn("Building polygon error:", e);
        }
      }
    }

    return () => {
      objects.forEach(destroyMapGLObject);
    };
  }, [mapRef, enabled]);

  return { selected, clearSelected: () => setSelected(null) };
}
