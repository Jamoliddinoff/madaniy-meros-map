import { useEffect } from "react";
import { destroyMapGLObject } from "@/shared/lib/mapgl";
import { UZ_COORDINATES } from "@/shared/constants/uzbekistanBoundary";
import type { MapRef } from "../types";

/**
 * O'zbekiston niqobi (uzbmask): butun dunyo poligoni, ichida O'zbekiston
 * hududlari "teshik" (hole) sifatida — natijada faqat O'zbekiston yorug', tashqarisi qora.
 */
export function useUzbekistanMask(mapRef: MapRef, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !mapRef.current || !window.mapgl) return;
    const map = mapRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mask: any = null;

    try {
      const worldRing: [number, number][] = [
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90],
        [-180, -90],
      ];
      const holes = UZ_COORDINATES.map((poly) => poly[0] as [number, number][]);
      mask = new window.mapgl.Polygon(map, {
        coordinates: [worldRing, ...holes],
        color: "rgba(0,0,0,0.25)",
        strokeColor: "rgba(0,0,0,0)",
        strokeWidth: 0,
      });
    } catch (e) {
      console.warn("2GIS UzbekistanMask error:", e);
    }

    return () => destroyMapGLObject(mask);
  }, [mapRef, enabled]);
}
