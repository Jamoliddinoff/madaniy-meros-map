import { ENV } from "@/shared/config/env";

/** Google Sheet'da saqlanadigan kadastr yozuvi */
export interface CadastralRecord {
  landCadastralNumber: string;
  cadastralNumber: string;
}

// Dev'da CORS'dan qochish uchun Vite proxy (/sheet-api) orqali; prod'da to'g'ridan-to'g'ri.
const API_URL = import.meta.env.DEV ? "/sheet-api" : ENV.sheetApiUrl;

/** Barcha saqlangan (madaniy meros) yozuvlarni oladi. */
export async function getCadastralList(): Promise<CadastralRecord[]> {
  // cache: no-store — saqlashdan keyin doim yangi ma'lumot (eski kesh emas)
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Ma'lumotlarni olishda xatolik");
  return res.json();
}

/**
 * Yangi yozuv qo'shadi.
 * mode: "no-cors" — Apps Script POST javobi googleusercontent'ga redirect bo'ladi va
 * uni brauzer o'qiy olmaydi (CORS). Javob kerak emas: yozuv serverda amalga oshadi,
 * so'ng ro'yxatni GET (refetch) orqali yangilaymiz.
 * Content-Type: text/plain — preflight bo'lmaydi (simple request).
 */
export async function saveCadastral(record: CadastralRecord): Promise<void> {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(record),
  });
}
