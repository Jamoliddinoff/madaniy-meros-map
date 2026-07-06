/**
 * Markazlashgan config. Qiymatlar avval env'dan (import.meta.env) o'qiladi;
 * env berilmagan bo'lsa (masalan Vercel'da env qo'yilmasa) — quyidagi default'ga tushadi.
 * Diqqat: bu default'lar build'ga singadi va client bundle'da ochiq ko'rinadi.
 */

const DEFAULT_AUTH_LOGIN = "Admin_madaniy_meros";
const DEFAULT_AUTH_PASSWORD = "madaniy123#@!";
const DEFAULT_2GIS_API_KEY = "75903a50-bc33-49ad-9ee3-288f7a81d90c";
const DEFAULT_SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbxEgAaIvVp4H93SlGRa3Ue78s3p6fXN6ZkMKReryPAxZQkWv9ToGhI6OpBzDUYKurSDnA/exec";

export const ENV = {
  authLogin: import.meta.env.VITE_AUTH_LOGIN ?? DEFAULT_AUTH_LOGIN,
  authPassword: import.meta.env.VITE_AUTH_PASSWORD ?? DEFAULT_AUTH_PASSWORD,
  twoGisApiKey: import.meta.env.VITE_2GIS_API_KEY ?? DEFAULT_2GIS_API_KEY,
  sheetApiUrl: import.meta.env.VITE_SHEET_API_URL ?? DEFAULT_SHEET_API_URL,
} as const;
