import { defaultLocale, type Locale } from "@/i18n/config";

/** Build a locale-aware path. English keeps unprefixed URLs for backward compatibility. */
export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized;
  }
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/** Strip locale prefix from pathname, returning the base path and detected locale. */
export function splitLocalePath(pathname: string): { locale: Locale; pathname: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "de") {
    const rest = segments.slice(1).join("/");
    return { locale: "de", pathname: rest ? `/${rest}` : "/" };
  }
  return { locale: "en", pathname: pathname || "/" };
}

/** Switch current path to another locale. */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const { pathname: base } = splitLocalePath(pathname);
  return localizedPath(base, targetLocale);
}
