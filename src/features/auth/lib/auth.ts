import { ENV } from "@/shared/config/env";
import { sha256 } from "@/shared/lib/hash";

const AUTH_STORAGE_KEY = "mm_auth";

/** Basic-auth uslubida "login:password" ni SHA-256 bilan hashlaydi. */
function credentialsHash(login: string, password: string): Promise<string> {
  return sha256(`${login}:${password}`);
}

/** env'dagi kredensiallarning kutilgan hashi. */
function expectedHash(): Promise<string> {
  return credentialsHash(ENV.authLogin, ENV.authPassword);
}

/**
 * Login: kiritilgan kredensiallar hashi env hashiga teng bo'lsa —
 * hashni localStorage'ga saqlaydi va true qaytaradi.
 */
export async function login(
  loginValue: string,
  password: string,
): Promise<boolean> {
  const inputHash = await credentialsHash(loginValue, password);
  if (inputHash !== (await expectedHash())) return false;
  localStorage.setItem(AUTH_STORAGE_KEY, inputHash);
  return true;
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Sessiya: saqlangan hash env kredensiallar hashiga mos kelsa true. */
export async function checkAuth(): Promise<boolean> {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return false;
  return stored === (await expectedHash());
}
