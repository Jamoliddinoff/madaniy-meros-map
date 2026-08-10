/**
 * Markazlashgan config. Qiymatlar avval env'dan (import.meta.env) o'qiladi;
 * env berilmagan bo'lsa (masalan Vercel'da env qo'yilmasa) — quyidagi default'ga tushadi.
 * Diqqat: bu default'lar build'ga singadi va client bundle'da ochiq ko'rinadi.
 */

const DEFAULT_API_BASE_URL = "https://mohiyat.techstack.uz/file-repo";

export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
} as const;
