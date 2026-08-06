import { ENV } from "@/shared/config/env";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokenStorage";

const AUTH_PATH_PREFIX = "/api/auth/";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/** /api/auth/refresh orqali yangi access token oladi; muvaffaqiyatsiz bo'lsa tokenlarni tozalaydi. */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${ENV.apiBaseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RefreshResponse;
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${ENV.apiBaseUrl}${path}`;
  let res = await fetch(url, { ...options, headers, cache: "no-store" });

  // Access token muddati o'tgan (401) — refresh token bilan yangilab, so'rovni bir marta qaytadan yuboramiz.
  if (res.status === 401 && !path.startsWith(AUTH_PATH_PREFIX)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers, cache: "no-store" });
    } else {
      clearTokens();
    }
  }

  if (!res.ok) {
    throw new Error(`So'rovda xatolik yuz berdi (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function httpGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function httpPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
