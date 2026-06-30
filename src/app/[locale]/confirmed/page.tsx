import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConfirmedPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.confirmed;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">{t.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-bold text-white">{t.title}</h1>
        <p className="mt-4 text-slate-400">
          {t.body}{" "}
          <Link
            href={localizedPath("/season-1", locale)}
            className="text-brand-400 hover:text-brand-300"
          >
            {t.seasonLink}
          </Link>{" "}
          or read the{" "}
          <Link
            href={localizedPath("/issues/auto-triage-customer-emails", locale)}
            className="text-brand-400 hover:text-brand-300"
          >
            {t.sampleLink}
          </Link>
          .
        </p>
        <Link
          href={localizedPath("/", locale)}
          className="mt-8 inline-block rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600"
        >
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
