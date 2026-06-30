"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/navigation";
import { useI18n } from "@/i18n/I18nProvider";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const { locale, dict } = useI18n();

  return (
    <nav
      aria-label={dict.localeSwitcher.label}
      className="fixed right-4 top-4 z-40 flex gap-1 rounded-full border border-slate-800/80 bg-slate-950/90 p-1 text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur"
    >
      {locales.map((target) => {
        const active = target === locale;
        return (
          <Link
            key={target}
            href={switchLocalePath(pathname, target)}
            className={`rounded-full px-3 py-1.5 transition ${
              active
                ? "bg-brand-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
            lang={target === "de" ? "de-CH" : "en"}
          >
            {localeLabels[target]}
          </Link>
        );
      })}
    </nav>
  );
}

export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith("/de") ? "de" : "en";
}
