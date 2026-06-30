import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AllAccessUnlockForm } from "@/components/AllAccessUnlockForm";
import { GumroadAllAccessCta } from "@/components/GumroadAllAccessCta";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import { isAllAccessCommerceVisible, isCrownCommerceVisible } from "@/lib/commerce-visibility";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.allAccess.metaTitle,
    description: dict.allAccess.metaDescription,
  };
}

export default async function AllAccessPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.allAccess;
  const showCommerce = isAllAccessCommerceVisible();
  const showCrownHint = isCrownCommerceVisible();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={localizedPath("/", locale)}
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          {dict.common.backToHome}
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">{t.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.title}</h1>
          <p className="mt-4 text-lg text-slate-400">{t.subtitle}</p>
        </header>

        <div className="mt-10 space-y-8">
          {showCommerce ? (
            <>
              <GumroadAllAccessCta />
              <AllAccessUnlockForm />
            </>
          ) : (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                {t.comingSoonEyebrow}
              </p>
              <p className="mt-3 text-slate-400">{t.comingSoonBody}</p>
            </section>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
            <p className="font-medium text-slate-300">{t.freePathTitle}</p>
            <p className="mt-2">{t.freePathBody}</p>
          </div>

          {showCrownHint ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-sm text-slate-400">
              <p className="font-medium text-slate-300">{t.crownHintTitle}</p>
              <p className="mt-2">
                {t.crownHintBody}{" "}
                <Link
                  href={localizedPath("/crown", locale)}
                  className="text-amber-400 hover:text-amber-300"
                >
                  {t.crownLink}
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
