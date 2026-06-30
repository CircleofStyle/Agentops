"use client";

import { buildGumroadCrownLink, getGumroadCrownUrl } from "@/lib/gumroad";
import { useI18n } from "@/i18n/I18nProvider";

type GumroadCrownCtaProps = {
  surface?: string;
};

export function GumroadCrownCta({ surface = "crown_page" }: GumroadCrownCtaProps) {
  const { dict } = useI18n();
  const t = dict.crown;
  const checkoutUrl = getGumroadCrownUrl();

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">{t.ctaEyebrow}</p>
      <p className="mt-3 text-3xl font-bold text-white">{t.price}</p>
      <p className="mt-3 text-slate-400">
        {t.separateFromAllAccess} — Playbook #12.
      </p>
      {checkoutUrl ? (
        <a
          href={buildGumroadCrownLink(checkoutUrl, surface)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          {t.ctaButton}
        </a>
      ) : (
        <p className="mt-6 text-sm text-slate-400">
          {t.checkoutSoon}{" "}
          <a href="mailto:hello@novarho.com" className="text-amber-400 hover:text-amber-300">
            {dict.common.emailUs}
          </a>{" "}
          for early access.
        </p>
      )}
    </div>
  );
}
