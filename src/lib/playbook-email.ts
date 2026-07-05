import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { IssueDocument } from "@/lib/content/types";
import { markdownToHtml } from "@/lib/content/markdown";
import {
  formatIssueMetadataLine,
  formatToolRequirements,
  getDifficultyEmoji,
  getDifficultyLabel,
  getSetupMinutes,
  getWorkflowDiagramAlt,
  getWorkflowDiagramUrl,
} from "@/lib/content/metadata";
import { extractTeaser } from "@/lib/content/visibility";
import { getTransactionalEmailCopy } from "@/lib/email-i18n";
import {
  buildGumroadKitCatalogLink,
  formatKitPriceCents,
  resolveKitCheckoutUrl,
} from "@/lib/gumroad";
import { kitByPlaybookSlug } from "@/lib/kit-catalog";
import { logger } from "@/lib/logger";
import { getFromEmail, getResendClient, getSiteUrl } from "@/lib/resend";

/** Playbook #3 in the free drip sequence — google review request workflow. */
export const PB3_DRIP_SLUG = "google-review-request-workflow";

export function buildPb3ForwardReferralSignupUrl(
  siteUrl?: string,
  locale: Locale = "en",
): string {
  const url = new URL(siteUrl ?? getSiteUrl());
  url.pathname = localizedPath("/", locale);
  url.search = "";
  url.searchParams.set("utm_source", "referral");
  url.searchParams.set("utm_medium", "email_forward");
  url.searchParams.set("utm_campaign", "pb3");
  return url.toString();
}

function buildPb3ForwardReferralPostscript(
  locale: Locale,
  siteUrl?: string,
): { html: string; text: string } {
  const copy = getTransactionalEmailCopy(locale);
  const signupUrl = buildPb3ForwardReferralSignupUrl(siteUrl, locale);
  const signupDisplay = signupUrl.replace(/^https?:\/\//, "");

  return {
    html: `<p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;"><strong>${copy.pb3ReferralPs}</strong> <a href="${signupUrl}" style="color: #0ea5e9;">${signupDisplay}</a></p>`,
    text: `${copy.pb3ReferralPs} ${signupDisplay}`,
  };
}

export function buildKitCatalogUrl(
  playbookSlug: string,
  locale: Locale = "en",
  siteUrl?: string,
): string {
  const url = new URL(siteUrl ?? getSiteUrl());
  url.pathname = localizedPath(`/kits/${playbookSlug}`, locale);
  url.search = "";
  url.searchParams.set("utm_source", "atw");
  url.searchParams.set("utm_medium", "drip_email");
  url.searchParams.set("utm_campaign", playbookSlug);
  return url.toString();
}

function buildKitPromoPostscript(
  playbookSlug: string,
  locale: Locale,
  siteUrl?: string,
): { html: string; text: string } | null {
  const kit = kitByPlaybookSlug(playbookSlug);
  if (!kit) return null;

  const copy = getTransactionalEmailCopy(locale);
  const kitShortName = kit.name.replace(/^Automate This Week — /, "");
  const price = formatKitPriceCents(kit.priceCents);
  const promoLine = copy.kitPromoPs
    .replace("{kitName}", kitShortName)
    .replace("{price}", price);

  const catalogUrl = buildKitCatalogUrl(playbookSlug, locale, siteUrl);
  const checkoutBase = resolveKitCheckoutUrl(playbookSlug);
  const checkoutUrl = checkoutBase
    ? buildGumroadKitCatalogLink(checkoutBase, playbookSlug, "drip_email")
    : catalogUrl;

  return {
    html: `<p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;"><strong>${promoLine}</strong> <a href="${catalogUrl}" style="color: #0ea5e9;">${copy.kitPromoCatalogLink}</a> · <a href="${checkoutUrl}" style="color: #0ea5e9;">${copy.kitPromoCheckoutLink}</a></p>`,
    text: `${promoLine} ${copy.kitPromoCatalogLink}: ${catalogUrl} · ${copy.kitPromoCheckoutLink}: ${checkoutUrl}`,
  };
}

export function buildPlaybookSubject(issue: IssueDocument): string {
  if (issue.frontmatter.emailSubject) {
    return issue.frontmatter.emailSubject;
  }
  return issue.frontmatter.title;
}

function buildPlaybookEmailMetadataLine(
  issue: IssueDocument,
  locale: Locale,
): string | undefined {
  const minutes = getSetupMinutes(issue.frontmatter);
  const label = getDifficultyLabel(issue.frontmatter.difficulty, locale);
  const emoji = getDifficultyEmoji(issue.frontmatter.difficulty);
  const tools = formatToolRequirements(issue.frontmatter.toolRequirements);
  const roi = issue.frontmatter.roiImpact;
  const copy = getTransactionalEmailCopy(locale);

  const parts: string[] = [];
  if (minutes) parts.push(`⏱ ${minutes} ${locale === "de" ? "Min." : "min"}`);
  if (emoji && label) parts.push(`${label} ${emoji}`);
  if (tools) parts.push(`${copy.playbookToolsPrefix} ${tools}`);
  if (roi) parts.push(`${copy.playbookRoiPrefix} ${roi}`);

  return parts.length > 0 ? parts.join(" · ") : formatIssueMetadataLine(issue.frontmatter);
}

export function buildIssueUrl(slug: string, locale: Locale = "en"): string {
  return `${getSiteUrl()}${localizedPath(`/issues/${slug}`, locale)}`;
}

export function buildPlaybookEmailHtml(
  issue: IssueDocument,
  summary: string,
  issueUrl: string,
  bodyHtml: string,
  locale: Locale = "en",
  options?: { includeUnsubscribe?: boolean; includeForwardReferralPs?: boolean; includeKitPromoPs?: boolean },
): string {
  const copy = getTransactionalEmailCopy(locale);
  const unsubscribe = options?.includeUnsubscribe !== false
    ? `<a href="{{{RESEND_UNSUBSCRIBE_URL}}}">${copy.playbookUnsubscribe}</a>`
    : copy.playbookOptOutReply;

  const metadataLine = buildPlaybookEmailMetadataLine(issue, locale);
  const metadataHtml = metadataLine
    ? `<p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">${metadataLine}</p>`
    : "";

  const diagramUrl = getWorkflowDiagramUrl(issue.frontmatter, getSiteUrl());
  const diagramCallout = diagramUrl
    ? `<p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">${copy.playbookDiagramReady}</p>`
    : `<p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">${copy.playbookDiagramSoon}</p>`;

  const diagramHtml = diagramUrl
    ? `<img src="${diagramUrl}" alt="${getWorkflowDiagramAlt(issue.frontmatter)}" width="560" height="420" style="display:block;max-width:100%;height:auto;border-radius:16px;margin:0 auto 24px;" />`
    : "";

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #0ea5e9; font-size: 22px;">${copy.playbookBrand}</h1>
      <h2 style="font-size: 18px; line-height: 1.4;">${issue.frontmatter.title}</h2>
      ${metadataHtml}
      ${diagramCallout}
      ${diagramHtml}
      <p style="font-size: 16px; line-height: 1.6;">${summary}</p>
      <div style="font-size: 15px; line-height: 1.6; margin: 24px 0;">
        ${bodyHtml}
      </div>
      <p>
        <a href="${issueUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">${copy.playbookOpenCta}</a>
      </p>
      <p style="color: #64748b; font-size: 14px;">${copy.playbookCopyLink} ${issueUrl}</p>
      ${options?.includeForwardReferralPs ? buildPb3ForwardReferralPostscript(locale).html : ""}
      ${options?.includeKitPromoPs ? buildKitPromoPostscript(issue.frontmatter.slug, locale)?.html ?? "" : ""}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #64748b; font-size: 12px;">
        ${unsubscribe}
      </p>
    </div>
  `.trim();
}

export function buildPlaybookEmailText(
  issue: IssueDocument,
  summary: string,
  issueUrl: string,
  locale: Locale = "en",
  options?: { includeForwardReferralPs?: boolean; includeKitPromoPs?: boolean },
): string {
  const postscriptParts: string[] = [];
  if (options?.includeForwardReferralPs) {
    postscriptParts.push(buildPb3ForwardReferralPostscript(locale).text);
  }
  if (options?.includeKitPromoPs) {
    const kitPs = buildKitPromoPostscript(issue.frontmatter.slug, locale);
    if (kitPs) postscriptParts.push(kitPs.text);
  }
  const postscript = postscriptParts.length > 0 ? `\n\n${postscriptParts.join("\n\n")}` : "";
  return `${issue.frontmatter.title}\n\n${summary}\n\n${issue.body}\n\n${getTransactionalEmailCopy(locale).playbookOpenCta.replace(" →", "")}: ${issueUrl}${postscript}`;
}

export async function buildPlaybookEmailContent(
  issue: IssueDocument,
  locale: Locale = "en",
  options?: { includeUnsubscribe?: boolean; includeForwardReferralPs?: boolean; includeKitPromoPs?: boolean },
): Promise<{
  subject: string;
  summary: string;
  issueUrl: string;
  html: string;
  text: string;
}> {
  const summary = extractTeaser(issue.body);
  const subject = buildPlaybookSubject(issue);
  const issueUrl = buildIssueUrl(issue.frontmatter.slug, locale);
  const bodyHtml = await markdownToHtml(issue.body);
  const html = buildPlaybookEmailHtml(issue, summary, issueUrl, bodyHtml, locale, options);
  const text = buildPlaybookEmailText(issue, summary, issueUrl, locale, options);

  return { subject, summary, issueUrl, html, text };
}

export async function sendTransactionalPlaybookEmail(options: {
  email: string;
  issue: IssueDocument;
  locale?: Locale;
  subjectPrefix?: string;
  includeForwardReferralPs?: boolean;
  includeKitPromoPs?: boolean;
}): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const locale = options.locale ?? "en";
  const { subject, html, text } = await buildPlaybookEmailContent(options.issue, locale, {
    includeUnsubscribe: false,
    includeForwardReferralPs: options.includeForwardReferralPs,
    includeKitPromoPs: options.includeKitPromoPs,
  });
  const prefix = options.subjectPrefix ?? "";

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: options.email,
    subject: `${prefix}${subject}`,
    html,
    text,
  });

  if (error) {
    logger.error("Transactional playbook email failed", {
      email: options.email,
      slug: options.issue.frontmatter.slug,
      locale,
      error: error.message,
    });
    return { ok: false, error: error.message };
  }

  return { ok: true, messageId: data?.id };
}
