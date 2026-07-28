import type { Locale } from "./config";

function ruPlural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/** Returns the right word form for a count, per-locale plural rules. */
export function plural(
  locale: Locale,
  n: number,
  forms: { uz: string; en: [string, string]; ru: [string, string, string] }
) {
  if (locale === "uz") return forms.uz;
  if (locale === "en") return n === 1 ? forms.en[0] : forms.en[1];
  return ruPlural(n, forms.ru[0], forms.ru[1], forms.ru[2]);
}
