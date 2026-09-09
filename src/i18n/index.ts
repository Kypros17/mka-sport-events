import en from "./en.json";
import ru from "./ru.json";

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** BCP-47 tags used in <html lang>, hreflang and Open Graph. */
export const localeTags: Record<Locale, { lang: string; og: string; hreflang: string }> = {
  en: { lang: "en", og: "en_GB", hreflang: "en" },
  ru: { lang: "ru", og: "ru_RU", hreflang: "ru" },
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

const dictionaries = { en, ru } as const;
export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

/**
 * Site routes, expressed once. `key` is the logical page, `path` the English
 * slug; Russian pages live under /ru/ with the same slugs.
 */
export const routes = {
  home: "/",
  about: "/about/",
  camps: "/training-camps/",
  events: "/events/",
  facilities: "/facilities/",
  contact: "/contact/",
} as const;

export type RouteKey = keyof typeof routes;

/** Absolute-from-root path for a page in a given locale. */
export function localePath(locale: Locale, key: RouteKey): string {
  const path = routes[key];
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

/** The same page in another locale (used by the language switch and hreflang). */
export function alternatePath(locale: Locale, key: RouteKey): string {
  return localePath(locale, key);
}

/** Read a locale from a pathname (/ru/... → ru, otherwise en). */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/ru" || pathname.startsWith("/ru/") ? "ru" : "en";
}
