import type { MetadataRoute } from "next";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { listIssues } from "@/lib/content/storage";
import { isWebVisible } from "@/lib/content/visibility";
import { getSiteUrl } from "@/lib/resend";

/** Public marketing routes indexed in sitemap (excludes post-signup / confirmed). */
const STATIC_PATHS = [
  "/",
  "/issues",
  "/season-1",
  "/season-2",
  "/tools",
  "/sponsors",
  "/legal",
  "/kits",
  "/all-access",
  "/crown",
] as const;

export function absoluteUrl(path: string, locale: Locale = defaultLocale): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${localizedPath(path, locale)}`;
}

export function issuePageUrl(slug: string, locale: Locale = defaultLocale): string {
  return absoluteUrl(`/issues/${slug}`, locale);
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const published = await listIssues("published");
  const visibleIssues = published.filter(isWebVisible);
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: absoluteUrl(path, locale),
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/issues" ? 0.9 : 0.7,
      });
    }

    for (const issue of visibleIssues) {
      const slug = issue.frontmatter.slug;
      const lastModified = new Date(
        issue.frontmatter.publishedAt ?? issue.frontmatter.date,
      );
      entries.push({
        url: issuePageUrl(slug, locale),
        lastModified,
        changeFrequency: "monthly",
        priority: issue.frontmatter.visibility === "sample" ? 0.85 : 0.75,
      });
    }
  }

  return entries;
}

export function buildRobotsConfig(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/confirmed"],
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
