import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { UZ_COORDINATES } from "@/shared/constants/uzbekistanBoundary";

/**
 * O'zbekiston niqobi: butun dunyo poligoni, ichida O'zbekiston
 * hududlari "teshik" (hole) sifatida — natijada faqat O'zbekiston yorug', tashqarisi qora.
 * Leaflet [lat, lng] tartibida ishlaydi — WKT/GeoJSON'dagi [lng, lat] shu yerda flip qilinadi.
 */
export function UzbekistanMask() {
  const map = useMap();
  const maskRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    const worldRing: [number, number][] = [
      [-90, -180],
      [-90, 180],
      [90, 180],
      [90, -180],
      [-90, -180],
    ];
    const holes: [number, number][][] = [];
    UZ_COORDINATES.forEach((polygon) =>
      polygon.forEach((ring) =>
        holes.push(ring.map(([lng, lat]) => [lat, lng] as [number, number])),
      ),
    );

    try {
      maskRef.current = L.polygon([worldRing, ...holes], {
        color: "rgba(0,0,0,0)",
        weight: 0,
        fillColor: "#000000",
        fillOpacity: 0.25,
        interactive: false,
      }).addTo(map);
    } catch (e) {
      console.warn("Leaflet UzbekistanMask error:", e);
    }

    return () => {
      if (maskRef.current) {
        map.removeLayer(maskRef.current);
        maskRef.current = null;
      }
    };
  }, [map]);

  return null;
}
