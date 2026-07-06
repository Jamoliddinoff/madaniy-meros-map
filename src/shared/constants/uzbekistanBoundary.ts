import lookupData from "./uzbekistan-geojson.json";

export const UZ_COORDINATES: [number, number][][][] = lookupData[0].geojson
  .coordinates as [number, number][][][];
