/**
 * Leaflet bilan ishlash uchun umumiy yordamchilar.
 * Xarita konstantalari va helper'lar shu yerda yashaydi.
 */

// ── Konstantalar ───────────────────────────────────────────────────────────────

/** Leaflet'ning standart OpenStreetMap tile qatlami (API key talab qilinmaydi) */
export const TILE_URL_LIGHT = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** O'zbekiston markazi [lat, lng] — Leaflet [lat, lng] tartibida ishlaydi */
export const UZ_CENTER: [number, number] = [41.3775, 64.5853];
export const UZ_ZOOM = 6.3;

/** Xaritaning maksimal zoomi (OSM tile'lari 19 dan keyin kattalashtirib ko'rsatiladi) */
export const MAP_MAX_ZOOM = 22;
/** OSM serveri tile beradigan eng yuqori zoom */
export const TILE_MAX_NATIVE_ZOOM = 19;

// ── Obyekt tozalash ──────────────────────────────────────────────────────────

/** Leaflet layer'ini (Polygon, Polyline, ...) xavfsiz xaritadan olib tashlaydi. */
export function destroyLeafletLayer(layer: { remove?: () => void } | null | undefined): void {
  try {
    layer?.remove?.();
  } catch {
    /* noop */
  }
}
