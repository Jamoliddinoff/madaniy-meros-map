/**
 * WKT `POLYGON((lng lat, lng lat, ...))` matnini 2GIS uchun ring massiviga aylantiradi.
 * Koordinatalar allaqachon [lng, lat] tartibida — 2GIS aynan shuni kutadi.
 * Ko'p ringli (teshikli) poligonlarni ham qo'llab-quvvatlaydi.
 */
export function parseWktPolygon(wkt: string): [number, number][][] {
  const start = wkt.indexOf("((");
  const end = wkt.lastIndexOf("))");
  if (start === -1 || end === -1) return [];

  const body = wkt.slice(start + 2, end);
  return body.split(/\)\s*,\s*\(/).map((ring) =>
    ring
      .trim()
      .split(",")
      .map((pair) => {
        const [lng, lat] = pair.trim().split(/\s+/).map(Number);
        return [lng, lat] as [number, number];
      }),
  );
}
