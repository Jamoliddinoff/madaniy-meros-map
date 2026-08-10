/**
 * Leaflet bilan ishlash uchun umumiy yordamchilar.
 * Xarita konstantalari va helper'lar shu yerda yashaydi.
 */

// ── Konstantalar ───────────────────────────────────────────────────────────────

/** CARTO light (no-labels-friendly) asosiy qatlam */
export const TILE_URL_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** O'zbekiston markazi [lat, lng] — Leaflet [lat, lng] tartibida ishlaydi */
export const UZ_CENTER: [number, number] = [41.3775, 64.5853];
export const UZ_ZOOM = 6.3;

// ── Obyekt tozalash ──────────────────────────────────────────────────────────

/** Leaflet layer'ini (Polygon, Polyline, ...) xavfsiz xaritadan olib tashlaydi. */
export function destroyLeafletLayer(layer: { remove?: () => void } | null | undefined): void {
  try {
    layer?.remove?.();
  } catch {
    /* noop */
  }
}
