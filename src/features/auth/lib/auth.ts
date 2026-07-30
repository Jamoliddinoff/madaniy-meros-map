import { ENV } from "@/shared/config/env";
import { sha256 } from "@/shared/lib/hash";
import { REGIONS } from "@/shared/constants/regions-list";
import { setRegionSoato } from "@/features/auth/model/region-store";

const AUTH_STORAGE_KEY = "mm_auth";

interface Credential {
  login: string;
  password: string;
  /** `null` — super admin (barcha viloyatlarni ko'radi). */
  regionSoato: number | null;
}

/** Basic-auth uslubida "login:password" ni SHA-256 bilan hashlaydi. */
function credentialsHash(login: string, password: string): Promise<string> {
  return sha256(`${login}:${password}`);
}

/** Super admin (env) + har bir viloyat uchun generatsiya qilingan kredensiallar. */
function allCredentials(): Credential[] {
  return [
    { login: ENV.authLogin, password: ENV.authPassword, regionSoato: null },
    ...REGIONS.map((region) => ({
      login: region.login,
      password: region.password,
      regionSoato: region.regionSoato,
    })),
  ];
}

/** Berilgan hash qaysi kredensialga mos kelishini topadi. */
async function findCredentialByHash(hash: string): Promise<Credential | null> {
  for (const credential of allCredentials()) {
    if (hash === (await credentialsHash(credential.login, credential.password))) {
      return credential;
    }
  }
  return null;
}

/**
 * Login: kiritilgan kredensiallar (super admin yoki viloyat) mos kelsa —
 * hashni localStorage'ga saqlaydi, regionSoato'ni store'ga (persist) yozadi va true qaytaradi.
 */
export async function login(
  loginValue: string,
  password: string,
): Promise<boolean> {
  const inputHash = await credentialsHash(loginValue, password);
  const matched = await findCredentialByHash(inputHash);
  if (!matched) return false;
  localStorage.setItem(AUTH_STORAGE_KEY, inputHash);
  setRegionSoato(matched.regionSoato);
  return true;
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  setRegionSoato(null);
}

/** Sessiya: saqlangan hash mos kredensialga ega bo'lsa true va regionSoato'ni qayta tiklaydi. */
export async function checkAuth(): Promise<boolean> {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return false;
  const matched = await findCredentialByHash(stored);
  if (!matched) return false;
  setRegionSoato(matched.regionSoato);
  return true;
}
