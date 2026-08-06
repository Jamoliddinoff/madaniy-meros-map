import { httpGet, httpPost } from "./httpClient";

export interface MmUserDto {
  id: number;
  login: string;
  role: string;
  regionSoato: number | null;
  regionName: string | null;
}

export interface MmLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: MmUserDto;
}

/** POST /api/auth/login — Login/parol orqali Bearer token olish. */
export function loginRequest(login: string, password: string): Promise<MmLoginResponse> {
  return httpPost<MmLoginResponse>("/api/auth/login", { login, password });
}

/** GET /api/auth/me — Token bo'yicha joriy foydalanuvchi ma'lumoti (sahifa refresh uchun). */
export function meRequest(): Promise<MmUserDto> {
  return httpGet<MmUserDto>("/api/auth/me");
}

/** POST /api/auth/logout — Tokenni serverda bekor qilish. */
export function logoutRequest(): Promise<{ message: string }> {
  return httpPost<{ message: string }>("/api/auth/logout");
}
