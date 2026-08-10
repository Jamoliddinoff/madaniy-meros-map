/**
 * Markazlashgan config. Qiymatlar avval env'dan (import.meta.env) o'qiladi;
 * env berilmagan bo'lsa (masalan Vercel'da env qo'yilmasa) — quyidagi default'ga tushadi.
 * Diqqat: bu default'lar build'ga singadi va client bundle'da ochiq ko'rinadi.
 */

const DEFAULT_2GIS_API_KEY = "d7848be1-6401-4e03-b3e3-17b7f780a361";
const DEFAULT_API_BASE_URL = "https://mohiyat.techstack.uz/file-repo";

export const ENV = {
  twoGisApiKey: DEFAULT_2GIS_API_KEY,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
} as const;
