import { useSyncExternalStore } from "react";

const STORAGE_KEY = "mm_region_soato";

type Listener = () => void;
const listeners = new Set<Listener>();

function readFromStorage(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : (JSON.parse(raw) as number | null);
  } catch {
    return null;
  }
}

let regionSoato: number | null = readFromStorage();

/** Joriy foydalanuvchi bog'langan viloyat SOATO kodi (super admin uchun `null` — barchasi). */
export function getRegionSoato(): number | null {
  return regionSoato;
}

/** regionSoato'ni store'ga va localStorage'ga (persist) yozadi, tinglovchilarni xabardor qiladi. */
export function setRegionSoato(value: number | null): void {
  regionSoato = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  listeners.forEach((listener) => listener());
}

function subscribeRegionSoato(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Komponentlarda reaktiv o'qish uchun: joriy regionSoato (yoki super admin uchun `null`). */
export function useRegionSoato(): number | null {
  return useSyncExternalStore(subscribeRegionSoato, getRegionSoato);
}
