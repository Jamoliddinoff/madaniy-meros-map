import { ENV } from "@/shared/config/env";

const AUTH_STORAGE_KEY = "mm_auth";

/** Kiritilgan login/parolni env qiymatlari bilan solishtiradi. */
export function validateCredentials(login: string, password: string): boolean {
  return login === ENV.authLogin && password === ENV.authPassword;
}

export function persistAuth(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, "1");
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function readAuth(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
}
