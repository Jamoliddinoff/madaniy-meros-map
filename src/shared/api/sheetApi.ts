import { ENV } from "@/shared/config/env";

/** Google Sheet'da saqlanadigan kadastr yozuvi */
export interface CadastralRecord {
  landCadastralNumber: string;
  cadastralNumber: string;
}

const API_URL = ENV.sheetApiUrl;

/** Barcha saqlangan (madaniy meros) yozuvlarni oladi. */
export async function getCadastralList(): Promise<CadastralRecord[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Ma'lumotlarni olishda xatolik");
  return res.json();
}

/**
 * Yangi yozuv qo'shadi.
 * CORS preflight'dan qochish uchun Content-Type: text/plain (Apps Script JSON sifatida parse qiladi).
 */
export async function saveCadastral(record: CadastralRecord): Promise<unknown> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Saqlashda xatolik");
  return res.json();
}
