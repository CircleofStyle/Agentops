import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { SeoShellDocument } from "@/lib/content/seo-shell";
import type { IssueDocument } from "@/lib/content/types";
import { getWorkflowDiagramUrl } from "@/lib/content/metadata";
import { issueDescription } from "@/lib/content/visibility";
import { getSiteUrl } from "@/lib/resend";
import { absoluteUrl, issuePageUrl } from "@/lib/seo";

export function buildIssuePageMetadata(
  issue: IssueDocument,
  locale: Locale,
  seoShell?: SeoShellDocument | null,
): Metadata {
  const title = seoShell
    ? `${seoShell.seoTitle} — Automate This Week`
    : `${issue.frontmatter.title} — Automate This Week`;
  const description = seoShell?.seoDescription ?? issueDescription(issue);
  const canonical = issuePageUrl(issue.frontmatter.slug, locale);
  const siteUrl = getSiteUrl();
  const diagram = getWorkflowDiagramUrl(issue.frontmatter, siteUrl);

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = issuePageUrl(issue.frontmatter.slug, loc);
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: issue.frontmatter.publishedAt ?? issue.frontmatter.date,
      images: diagram
        ? [{ url: diagram, alt: issue.frontmatter.title }]
        : [{ url: absoluteUrl("/og.svg", locale), alt: issue.frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: diagram ? [diagram] : [absoluteUrl("/og.svg", locale)],
    },
  };
}
