import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { IssueMetadataBadges } from "@/components/IssueMetadataBadges";
import { ALL_ACCESS_COOKIE, resolveAllAccessFromCookie } from "@/lib/all-access";
import { listIssues } from "@/lib/content/storage";
import { getSetupMinutes } from "@/lib/content/metadata";
import { isPublicBody, isWebVisible, issueDescription } from "@/lib/content/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.issues.metaTitle,
    description: dict.issues.metaDescription,
  };
}

export default async function IssuesArchivePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.issues;

  const issues = (await listIssues("published")).filter(isWebVisible);
  const cookieStore = await cookies();
  const hasAllAccess = await resolveAllAccessFromCookie(cookieStore.get(ALL_ACCESS_COOKIE)?.value);

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
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.title}</h1>
          <p className="mt-4 text-slate-400">
            {t.intro}
            {hasAllAccess ? (
              <>
                {" "}
                <span className="text-brand-300">{t.allAccessUnlocked}</span>
              </>
            ) : (
              <>
                {" "}
                <Link
                  href={localizedPath("/all-access", locale)}
                  className="text-brand-500 transition hover:text-brand-400"
                >
                  {dict.common.getAllAccess}
                </Link>
              </>
            )}
          </p>
        </header>

        {issues.length > 0 ? (
          <>
            <div
              className="mt-10 hidden gap-4 border-b border-slate-800 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-[1fr_auto_auto_auto]"
              aria-hidden
            >
              <span>{t.colWorkflow}</span>
              <span className="text-right">{t.colTime}</span>
              <span className="text-right">{t.colDifficulty}</span>
              <span className="text-right">{t.colOutcome}</span>
            </div>

            <ul className="mt-6 space-y-6">
              {issues.map((issue) => {
                const publicBody = isPublicBody(issue);
                const description = issueDescription(issue);
                const minutes = getSetupMinutes(issue.frontmatter);

                return (
                  <li
                    key={issue.frontmatter.slug}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                  >
                    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-start sm:gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                          {issue.frontmatter.date}
                          {!publicBody ? ` · ${t.emailOnly}` : ` · ${t.freeSample}`}
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-white">
                          <Link
                            href={localizedPath(`/issues/${issue.frontmatter.slug}`, locale)}
                            className="transition hover:text-brand-400"
                          >
                            {issue.frontmatter.title}
                          </Link>
                        </h2>
                        <p className="mt-3 text-slate-400 sm:hidden">{description}</p>
                      </div>

                      <p className="text-sm text-slate-300 sm:text-right">
                        {minutes ? `~${minutes} ${dict.common.min}` : "—"}
                      </p>

                      <p className="text-sm capitalize text-slate-300 sm:text-right">
                        {issue.frontmatter.difficulty ?? "—"}
                      </p>

                      <p className="text-sm text-brand-300 sm:text-right">
                        {issue.frontmatter.roiImpact ?? "—"}
                      </p>
                    </div>

                    <p className="mt-3 hidden text-slate-400 sm:block">{description}</p>
                    <IssueMetadataBadges frontmatter={issue.frontmatter} className="mt-4" />
                    <Link
                      href={localizedPath(`/issues/${issue.frontmatter.slug}`, locale)}
                      className="mt-4 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
                    >
                      {publicBody || hasAllAccess
                        ? publicBody
                          ? t.readSample
                          : t.readFull
                        : t.readTeaserSubscribe}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="mt-12 text-slate-500">{t.empty}</p>
        )}
      </div>
    </main>
  );
}
