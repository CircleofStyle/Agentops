import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { CrownUnlockForm } from "@/components/CrownUnlockForm";
import { GumroadCrownCta } from "@/components/GumroadCrownCta";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import { isCrownCommerceVisible } from "@/lib/commerce-visibility";
import { resolveCrownAccessFromCookie } from "@/lib/crown";
import { getCrownDisciplineIssue } from "@/lib/season-1";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.crown.metaTitle,
    description: dict.crown.metaDescription,
  };
}

export default async function CrownPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.crown;

  const cookieStore = await cookies();
  const hasAccess = await resolveCrownAccessFromCookie(cookieStore.get("atw_crown")?.value);
  const crown = getCrownDisciplineIssue();
  const showCommerce = isCrownCommerceVisible();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={localizedPath("/season-1", locale)}
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          {dict.common.backToSeason1}
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">{t.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.title}</h1>
          <p className="mt-4 text-lg text-slate-400">{t.subtitle}</p>
        </header>

        {hasAccess ? (
          <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {t.unlocked}
            </p>
            <h2 className="mt-3 text-xl font-bold text-white">{crown.title}</h2>
            <p className="mt-3 text-slate-400">{t.unlockedBody}</p>
          </section>
        ) : showCommerce ? (
          <div className="mt-10 space-y-8">
            <GumroadCrownCta surface="crown_page" />
            <CrownUnlockForm />
          </div>
        ) : (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {t.comingSoonEyebrow}
            </p>
            <p className="mt-3 text-slate-400">{t.comingSoonBody}</p>
          </section>
        )}

        <section
          id="compare"
          className="mt-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400"
        >
          <p className="font-medium text-slate-300">{t.separateFromAllAccess}</p>
          <p className="mt-4 text-xs text-slate-500">{t.purchaseNote}</p>
        </section>
      </div>
    </main>
  );
}
