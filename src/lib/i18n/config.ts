export const locales = ["uz", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";
export const localeCookieName = "locale";

export const localeLabels: Record<Locale, string> = {
  uz: "Oʻzbekcha",
  en: "English",
  ru: "Русский",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
