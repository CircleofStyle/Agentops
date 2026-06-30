import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AllAccessCta } from "@/components/AllAccessCta";
import { SignupForm } from "@/components/SignupForm";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import {
  isAllAccessCommerceVisible,
  isCrownCommerceVisible,
} from "@/lib/commerce-visibility";
import {
  FREE_DRIP_ISSUE_COUNT,
  SEASON_1_ISSUES,
  season1IssuePillar,
  season1IssueTeaser,
  season1IssueTitle,
  season1Promise,
  season1Progress,
  season1Subtitle,
  season1Title,
} from "@/lib/season-1";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.season1.metaTitle,
    description: dict.season1.metaDescription,
  };
}

export default async function Season1Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.season1;

  const { published, total } = season1Progress();
  const showCrownCommerce = isCrownCommerceVisible();
  const showAllAccessCommerce = isAllAccessCommerceVisible();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={localizedPath("/", locale)}
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          {dict.common.backToHome}
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            {season1Title(locale)}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {season1Subtitle(locale)}
          </h1>
          <p className="mt-4 text-lg text-slate-400">{season1Promise(locale)}</p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            {t.progressLabel}
          </p>
          <p className="mt-3 text-2xl font-bold text-white">
            {t.progressHeadline
              .replace("{published}", String(published))
              .replace("{total}", String(total))}
          </p>
          <p className="mt-2 text-slate-400">
            {t.progressBody.replace("{freeCount}", String(FREE_DRIP_ISSUE_COUNT))}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">{t.arcTitle}</h2>
          <p className="mt-3 text-slate-400">{t.arcBody}</p>

          <ol className="mt-8 space-y-4">
            {SEASON_1_ISSUES.map((issue) => (
              <li
                key={issue.number}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:flex sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t.playbookLabel} #{issue.number} · {season1IssuePillar(issue.pillar, locale)}
                    {issue.paidOnly ? ` · ${t.paidAddon}` : ""}
                    {issue.status === "published" ? ` · ${t.live}` : ` · ${t.comingSoon}`}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {issue.paidOnly ? (
                      season1IssueTitle(issue, locale)
                    ) : issue.slug ? (
                      <Link
                        href={localizedPath(`/issues/${issue.slug}`, locale)}
                        className="transition hover:text-brand-400"
                      >
                        {season1IssueTitle(issue, locale)}
                      </Link>
                    ) : (
                      season1IssueTitle(issue, locale)
                    )}
                  </h3>
                  {season1IssueTeaser(issue, locale) ? (
                    <p className="mt-2 text-sm text-slate-400">
                      {season1IssueTeaser(issue, locale)}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`mt-3 inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${
                    issue.paidOnly
                      ? "bg-amber-500/15 text-amber-300"
                      : issue.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {issue.paidOnly
                    ? t.paidAddon
                    : issue.status === "published"
                      ? t.published
                      : t.planned}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            {t.season2TeaserEyebrow}
          </p>
          <p className="mt-3 text-slate-400">{dict.season2.season1LinkBody}</p>
          <Link
            href={localizedPath("/season-2", locale)}
            className="mt-4 inline-block text-sm font-medium text-brand-400 transition hover:text-brand-300"
          >
            {dict.season2.metaTitle} →
          </Link>
        </section>

        {showCrownCommerce ? (
          <section id="crown" className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
            <h2 className="text-2xl font-bold text-white">{t.crownSectionTitle}</h2>
            <p className="mt-4 text-slate-400">{t.crownSectionBody}</p>
            <p className="mt-3 text-sm text-slate-500">{t.crownSectionNote}</p>
            <div className="mt-6">
              <Link
                href={localizedPath("/crown", locale)}
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                {t.crownSectionCta}
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              <Link
                href={localizedPath("/crown#compare", locale)}
                className="font-medium text-amber-400 hover:text-amber-300"
              >
                {t.crownSectionCompare}
              </Link>
            </p>
          </section>
        ) : null}

        <section className="mt-16 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">{t.startFreeTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            {t.startFreeBody.replace("{freeCount}", String(FREE_DRIP_ISSUE_COUNT))}
          </p>
          <div className="mt-8 flex flex-col items-center">
            <SignupForm />
          </div>
          {showAllAccessCommerce ? (
            <p className="mt-6 text-sm text-slate-500">
              {t.startFreeCantWait}{" "}
              <Link
                href={localizedPath("/all-access", locale)}
                className="font-medium text-brand-400 hover:text-brand-300"
              >
                {dict.common.getAllAccess}
              </Link>{" "}
              {t.startFreeAllAccess}
            </p>
          ) : null}
        </section>

        {showAllAccessCommerce ? (
          <section className="mt-12 text-center">
            <p className="text-slate-400">{t.allAccessPrompt}</p>
            <div className="mt-4">
              <AllAccessCta surface="season_1_page" />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
