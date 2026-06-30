import Link from "next/link";

import { IssueMetadataBadges } from "@/components/IssueMetadataBadges";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import type { IssueFrontmatter } from "@/lib/content/types";

interface PlaybookPreviewCardProps {
  issueNumber: number;
  title: string;
  teaser: string;
  slug: string;
  isSample: boolean;
  frontmatter: IssueFrontmatter;
  locale: Locale;
}

export async function PlaybookPreviewCard({
  issueNumber,
  title,
  teaser,
  slug,
  isSample,
  frontmatter,
  locale,
}: PlaybookPreviewCardProps) {
  const dict = await getDictionary(locale);
  const t = dict.playbookCard;

  const eyebrow = isSample
    ? `${dict.season1.playbookLabel} #${issueNumber} · ${t.sample}`
    : `${dict.season1.playbookLabel} #${issueNumber} · ${t.emailOnly}`;
  const cta = isSample ? t.readSample : t.viewTeaserSubscribe;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">{eyebrow}</p>
      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
        {title}
      </h3>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">{teaser}</p>
      <IssueMetadataBadges frontmatter={frontmatter} className="mt-4" />
      <Link
        href={localizedPath(`/issues/${slug}`, locale)}
        className="mt-4 inline-block min-h-[44px] py-2 text-sm font-medium text-brand-500 transition hover:text-brand-400"
      >
        {cta}
      </Link>
    </article>
  );
}
