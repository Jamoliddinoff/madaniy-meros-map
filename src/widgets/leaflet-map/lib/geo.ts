const EARTH_RADIUS_M = 6371000;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Ikki [lng, lat] nuqta orasidagi masofa (metr), haversine formulasi. */
export function distanceMeters(
  a: [number, number],
  b: [number, number],
): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dPhi = toRad(lat2 - lat1);
  const dLambda = toRad(lng2 - lng1);
  const sinDPhi = Math.sin(dPhi / 2);
  const sinDLambda = Math.sin(dLambda / 2);
  const h =
    sinDPhi * sinDPhi + Math.cos(phi1) * Math.cos(phi2) * sinDLambda * sinDLambda;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Markaz + radius (metr) asosida doirani ko'p burchakli poligon nuqtalariga aylantiradi. */
export function circleToPolygon(
  center: [number, number],
  radiusMeters: number,
  segments: number,
): [number, number][] {
  const [lng, lat] = center;
  const phi1 = toRad(lat);
  const lambda1 = toRad(lng);
  const angularDistance = radiusMeters / EARTH_RADIUS_M;
  const points: [number, number][] = [];
  for (let i = 0; i < segments; i++) {
    const bearing = (i / segments) * 2 * Math.PI;
    const phi2 = Math.asin(
      Math.sin(phi1) * Math.cos(angularDistance) +
        Math.cos(phi1) * Math.sin(angularDistance) * Math.cos(bearing),
    );
    const lambda2 =
      lambda1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(phi1),
        Math.cos(angularDistance) - Math.sin(phi1) * Math.sin(phi2),
      );
    points.push([toDeg(lambda2), toDeg(phi2)]);
  }
  return points;
}