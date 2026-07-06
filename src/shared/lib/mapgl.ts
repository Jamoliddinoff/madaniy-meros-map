/**
 * 2GIS MapGL JS API bilan ishlash uchun umumiy yordamchilar.
 * Xarita konstantalari, script yuklash va helper'lar shu yerda yashaydi.
 */
import { ENV } from "@/shared/config/env";

// ── Global type ───────────────────────────────────────────────────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapgl: any;
  }
}

// ── Konstantalar ───────────────────────────────────────────────────────────────

export const MAPGL_API_KEY = ENV.twoGisApiKey;
export const MAPGL_SCRIPT_URL = "https://mapgl.2gis.com/api/js/v1";

/** O'zbekiston markazi [lng, lat] */
export const UZ_CENTER: [number, number] = [64.5853, 41.3775];
export const UZ_ZOOM = 5.5;

// ── Script yuklovchi (idempotent) ───────────────────────────────────────────────

let _scriptPromise: Promise<void> | null = null;

export function loadMapGlScript(): Promise<void> {
  if (window.mapgl) return Promise.resolve();
  if (_scriptPromise) return _scriptPromise;

  _scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${MAPGL_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = MAPGL_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = (e) => {
      _scriptPromise = null;
      reject(e);
    };
    document.head.appendChild(script);
  });

  return _scriptPromise;
}

// ── Obyekt tozalash ──────────────────────────────────────────────────────────

/** 2GIS obyektini (Polygon, Map, ...) xavfsiz destroy qiladi. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function destroyMapGLObject(obj: any): void {
  try {
    obj?.destroy();
  } catch {
    /* noop */
  }
}
