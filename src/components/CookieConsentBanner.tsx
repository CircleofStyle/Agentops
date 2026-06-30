"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  COOKIE_CATEGORY_DEFINITIONS,
  ConsentCategory,
  ConsentPreferences,
  DEFAULT_CONSENT,
  OPTIONAL_CONSENT_CATEGORIES,
  readConsentCookie,
  writeConsentCookie,
} from "@/lib/compliance/consent";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedPath } from "@/i18n/navigation";

export function CookieConsentBanner() {
  const { locale, dict } = useI18n();
  const t = dict.cookies;
  const [preferences, setPreferences] = useState<ConsentPreferences>({ ...DEFAULT_CONSENT });
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const categoryLabels: Record<ConsentCategory, { label: string; description: string }> = {
    analytics: {
      label: t.analyticsLabel,
      description: t.analyticsDescription,
    },
    marketing: {
      label: t.marketingLabel,
      description: t.marketingDescription,
    },
  };

  useEffect(() => {
    const stored = readConsentCookie();
    if (stored) {
      setPreferences(stored);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setIsInitialized(true);
  }, []);

  const handleAcceptAll = () => {
    const allOn: ConsentPreferences = {
      analytics: true,
      marketing: true,
    };
    setPreferences(allOn);
    writeConsentCookie(allOn);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    writeConsentCookie(preferences);
    setIsVisible(false);
  };

  const toggleCategory = (category: ConsentCategory) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 rounded-3xl border border-slate-800/70 bg-slate-950/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl md:inset-x-8 md:bottom-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">{t.eyebrow}</p>
          <h2 className="text-lg font-bold text-white">{t.title}</h2>
          <p className="text-sm text-slate-300">{t.body}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t.essentialLabel}</p>
          <p className="text-sm text-slate-400">{t.essentialBody}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
            onClick={handleAcceptAll}
          >
            {t.acceptAll}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
            onClick={handleSavePreferences}
          >
            {t.savePreferences}
          </button>
          <Link
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:text-white"
            href={localizedPath("/legal#cookies", locale)}
          >
            {t.manageCookies}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {OPTIONAL_CONSENT_CATEGORIES.map((category) => {
          const definition = categoryLabels[category] ?? COOKIE_CATEGORY_DEFINITIONS[category];
          const enabled = preferences[category];
          return (
            <div
              key={category}
              className="flex flex-col gap-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{definition.label}</p>
                  <p className="text-xs text-slate-400">{definition.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => toggleCategory(category)}
                  className={`flex h-8 w-14 items-center rounded-full p-1 transition ${
                    enabled ? "bg-brand-500" : "bg-slate-700/70"
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white transition ${
                      enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
