import Link from "next/link";

import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

type StartHereCardsProps = {
  locale: Locale;
};

export async function StartHereCards({ locale }: StartHereCardsProps) {
  const dict = await getDictionary(locale);
  const t = dict.startHere;

  const hrefs = [
    "/issues/auto-triage-customer-emails",
    "/issues/quote-follow-up-workflow",
    "/issues/google-review-request-workflow",
  ] as const;

  return (
    <section className="mt-20 lg:mt-28">
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{t.heading}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">{t.subtitle}</p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.cards.map((card, index) => (
          <li key={hrefs[index]}>
            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                {card.label}
              </p>
              <h3 className="mt-3 text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm text-slate-400">{card.outcome}</p>
              <p className="mt-4 text-xs text-slate-500">
                {[15, 20, 25][index]} {dict.common.min}
              </p>
              <Link
                href={localizedPath(hrefs[index], locale)}
                className="mt-4 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
              >
                {card.cta}
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
