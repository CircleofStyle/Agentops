"use client";

import { buildGumroadAllAccessLink, getGumroadAllAccessUrl } from "@/lib/gumroad";
import { useI18n } from "@/i18n/I18nProvider";

type GumroadAllAccessCtaProps = {
  surface?: string;
};

export function GumroadAllAccessCta({ surface = "all_access_page" }: GumroadAllAccessCtaProps) {
  const { dict } = useI18n();
  const t = dict.allAccess;
  const checkoutUrl = getGumroadAllAccessUrl();

  return (
    <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">{t.ctaEyebrow}</p>
      <p className="mt-3 text-3xl font-bold text-white">{t.price}</p>
      <p className="mt-3 text-slate-400">{t.ctaBody}</p>
      {checkoutUrl ? (
        <a
          href={buildGumroadAllAccessLink(checkoutUrl, surface)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {t.ctaButton}
        </a>
      ) : (
        <p className="mt-6 text-sm text-slate-400">
          {t.checkoutSoon}{" "}
          <a href="mailto:hello@novarho.com" className="text-brand-400 hover:text-brand-300">
            {dict.common.emailUs}
          </a>{" "}
          {t.earlyAccessSuffix}
        </p>
      )}
    </div>
  );
}
