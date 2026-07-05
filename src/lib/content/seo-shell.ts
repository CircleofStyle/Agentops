import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { defaultLocale, type Locale } from "@/i18n/config";
import type { FaqItem } from "@/components/FaqSchema";

const SEO_SHELLS_DIR = path.join(process.cwd(), "content", "seo-shells");

/** P0 EN SEO shells — see content/seo-shells/ and NOV-253 seo-shells-p0 brief. */
export const P0_SEO_SHELL_SLUGS = [
  "auto-triage-customer-emails",
  "quote-follow-up-workflow",
  "google-review-request-workflow",
  "appointment-reminder-workflow",
] as const;

export type SeoShellSlug = (typeof P0_SEO_SHELL_SLUGS)[number];

export type SeoShellDocument = {
  slug: SeoShellSlug;
  seoTitle: string;
  seoDescription: string;
  publicSummary: string;
  faqs: FaqItem[];
  gateHeadline?: string;
  gateSubcopy?: string;
  /** Soft drip CTA for sample (public-body) playbooks. */
  dripTeaser?: string;
};

function parseSeoShellFile(filePath: string, raw: string): SeoShellDocument {
  const { data } = matter(raw);
  const slug = data.slug as string;
  const faqs = (data.faqs ?? []) as FaqItem[];

  if (!slug || !data.seoTitle || !data.seoDescription || !data.publicSummary) {
    throw new Error(`Invalid SEO shell frontmatter in ${filePath}`);
  }

  return {
    slug: slug as SeoShellSlug,
    seoTitle: String(data.seoTitle),
    seoDescription: String(data.seoDescription),
    publicSummary: String(data.publicSummary).trim(),
    faqs,
    gateHeadline: data.gateHeadline ? String(data.gateHeadline) : undefined,
    gateSubcopy: data.gateSubcopy ? String(data.gateSubcopy) : undefined,
    dripTeaser: data.dripTeaser ? String(data.dripTeaser) : undefined,
  };
}

export async function getSeoShell(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<SeoShellDocument | null> {
  if (locale !== defaultLocale) return null;
  if (!P0_SEO_SHELL_SLUGS.includes(slug as SeoShellSlug)) return null;

  const filePath = path.join(SEO_SHELLS_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parseSeoShellFile(filePath, raw);
  } catch {
    return null;
  }
}
