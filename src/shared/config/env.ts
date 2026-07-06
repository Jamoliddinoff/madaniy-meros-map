/**
 * Markazlashgan env config. Barcha env o'zgaruvchilar shu yerdan o'qiladi —
 * komponentlar ichida import.meta.env ga to'g'ridan-to'g'ri murojaat qilinmaydi.
 */
export const ENV = {
  authLogin: import.meta.env.VITE_AUTH_LOGIN,
  authPassword: import.meta.env.VITE_AUTH_PASSWORD,
  twoGisApiKey: import.meta.env.VITE_2GIS_API_KEY,
} as const;
