import Link from "next/link";
import { notFound } from "next/navigation";

import { RecentPlaybooks } from "@/components/RecentPlaybooks";
import { SignupForm } from "@/components/SignupForm";
import { SocialProofBlock } from "@/components/SocialProofBlock";
import { StartHereCards } from "@/components/StartHereCards";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            {dict.home.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {dict.home.title}
            <span className="block text-brand-500">{dict.home.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            {dict.home.subtitle}
          </p>
        </header>

        <section className="mt-12 flex flex-col items-center gap-8 lg:mt-16">
          <SignupForm />
        </section>

        <SocialProofBlock locale={locale} />

        <StartHereCards locale={locale} />

        <RecentPlaybooks locale={locale} />

        <section className="mt-20 lg:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
              {dict.home.seasonEyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {dict.home.seasonTitle}
            </h2>
            <p className="mt-4 text-slate-400">{dict.home.seasonBody}</p>
            <Link
              href={localizedPath("/season-1", locale)}
              className="mt-6 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
            >
              {dict.home.seasonLink}
            </Link>
          </div>
        </section>

        <p className="mt-12 text-center lg:mt-16">
          <Link
            href={localizedPath("/issues", locale)}
            className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
          >
            {dict.home.browseAll}
          </Link>
        </p>
      </div>
    </main>
  );
}
