import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName } from "./config";
import { getDictionary } from "./dictionaries";

export async function getLocale() {
  const store = await cookies();
  const value = store.get(localeCookieName)?.value;
  return value && isLocale(value) ? value : defaultLocale;
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
