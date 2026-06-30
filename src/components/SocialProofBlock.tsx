import { getPublicSiteStats } from "@/lib/public-stats";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

type SocialProofBlockProps = {
  locale: Locale;
};

export async function SocialProofBlock({ locale }: SocialProofBlockProps) {
  const stats = await getPublicSiteStats();
  const { confirmedSubscribers, publishedWorkflows } = stats;
  const dict = await getDictionary(locale);
  const t = dict.socialProof;

  return (
    <section
      className="mx-auto mt-12 max-w-xl rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-6 text-center"
      aria-live="polite"
    >
      <h2 className="text-base font-semibold text-slate-200">{t.heading}</h2>

      {confirmedSubscribers === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{t.empty}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">
            {confirmedSubscribers.toLocaleString(locale === "de" ? "de-CH" : "en")}+ {t.subscribers}
          </span>
        </p>
      )}

      {publishedWorkflows > 0 ? (
        <p className="mt-2 text-sm text-slate-500">
          {publishedWorkflows}{" "}
          {publishedWorkflows === 1 ? t.playbookReady : t.playbooksReady}
        </p>
      ) : null}
    </section>
  );
}
