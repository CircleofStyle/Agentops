import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import {
  SEASON_2_ISSUES,
  season2IssuePillar,
  season2IssueTitle,
  season2Progress,
  season2Promise,
  season2Subtitle,
  season2Title,
} from "@/lib/season-2";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.season2.metaTitle,
    description: dict.season2.metaDescription,
  };
}

export default async function Season2Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.season2;

  const { published, total } = season2Progress();

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
            {season2Title(locale)}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {season2Subtitle(locale)}
          </h1>
          <p className="mt-4 text-lg text-slate-400">{season2Promise(locale)}</p>
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
          <p className="mt-2 text-slate-400">{t.progressBody}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">{t.arcTitle}</h2>
          <p className="mt-3 text-slate-400">{t.arcBody}</p>

          <ol className="mt-8 space-y-4">
            {SEASON_2_ISSUES.map((issue) => (
              <li
                key={issue.number}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:flex sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t.playbookLabel} #{issue.number} · {season2IssuePillar(issue.pillar, locale)}
                    {issue.status === "published" ? ` · ${t.live}` : ` · ${t.comingSoon}`}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {issue.status === "published" && issue.slug ? (
                      <Link
                        href={localizedPath(`/issues/${issue.slug}`, locale)}
                        className="transition hover:text-brand-400"
                      >
                        {season2IssueTitle(issue, locale)}
                      </Link>
                    ) : (
                      season2IssueTitle(issue, locale)
                    )}
                  </h3>
                </div>
                <span
                  className={`mt-3 inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${
                    issue.status === "published"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {issue.status === "published" ? t.published : t.planned}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-xl font-bold text-white">{t.season1LinkTitle}</h2>
          <p className="mt-3 text-slate-400">{t.season1LinkBody}</p>
          <div className="mt-6">
            <Link
              href={localizedPath("/season-1", locale)}
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
            >
              {t.season1LinkCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
