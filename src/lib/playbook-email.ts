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
import { logger } from "@/lib/logger";
import { getFromEmail, getResendClient, getSiteUrl } from "@/lib/resend";

/** Playbook #3 in the free drip sequence — google review request workflow. */
export const PB3_DRIP_SLUG = "google-review-request-workflow";

export function buildPb3ForwardReferralSignupUrl(siteUrl?: string): string {
  const url = new URL(siteUrl ?? getSiteUrl());
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("utm_source", "referral");
  url.searchParams.set("utm_medium", "email_forward");
  url.searchParams.set("utm_campaign", "pb3");
  return url.toString();
}

function buildPb3ForwardReferralPostscript(siteUrl?: string): { html: string; text: string } {
  const signupUrl = buildPb3ForwardReferralSignupUrl(siteUrl);
  const signupDisplay = signupUrl.replace(/^https?:\/\//, "");

  return {
    html: `<p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;"><strong>P.S.</strong> Know someone who'd use this? Forward this email — signup link: <a href="${signupUrl}" style="color: #0ea5e9;">${signupDisplay}</a></p>`,
    text: `P.S. Know someone who'd use this? Forward this email — signup link: ${signupDisplay}`,
  };
}

export function buildPlaybookSubject(issue: IssueDocument): string {
  if (issue.frontmatter.emailSubject) {
    return issue.frontmatter.emailSubject;
  }
  return `This week: ${issue.frontmatter.title}`;
}

function buildPlaybookEmailMetadataLine(issue: IssueDocument): string | undefined {
  const minutes = getSetupMinutes(issue.frontmatter);
  const label = getDifficultyLabel(issue.frontmatter.difficulty);
  const emoji = getDifficultyEmoji(issue.frontmatter.difficulty);
  const tools = formatToolRequirements(issue.frontmatter.toolRequirements);
  const roi = issue.frontmatter.roiImpact;

  const parts: string[] = [];
  if (minutes) parts.push(`⏱ ${minutes} min`);
  if (emoji && label) parts.push(`${label} ${emoji}`);
  if (tools) parts.push(`Tools: ${tools}`);
  if (roi) parts.push(`ROI: ${roi}`);

  return parts.length > 0 ? parts.join(" · ") : formatIssueMetadataLine(issue.frontmatter);
}

export function buildIssueUrl(slug: string): string {
  return `${getSiteUrl()}/issues/${slug}`;
}

export function buildPlaybookEmailHtml(
  issue: IssueDocument,
  summary: string,
  issueUrl: string,
  bodyHtml: string,
  options?: { includeUnsubscribe?: boolean; includeForwardReferralPs?: boolean },
): string {
  const unsubscribe = options?.includeUnsubscribe !== false
    ? '<a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>'
    : "Reply to this email to opt out.";

  const metadataLine = buildPlaybookEmailMetadataLine(issue);
  const metadataHtml = metadataLine
    ? `<p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">${metadataLine}</p>`
    : "";

  const diagramUrl = getWorkflowDiagramUrl(issue.frontmatter, getSiteUrl());
  const diagramCallout = diagramUrl
    ? `<p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">See the workflow diagram below — or follow the step-by-step.</p>`
    : `<p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">Workflow diagram coming soon — text steps below are complete.</p>`;

  const diagramHtml = diagramUrl
    ? `<img src="${diagramUrl}" alt="${getWorkflowDiagramAlt(issue.frontmatter)}" width="560" height="420" style="display:block;max-width:100%;height:auto;border-radius:16px;margin:0 auto 24px;" />`
    : "";

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #0ea5e9; font-size: 22px;">Automate This Week</h1>
      <h2 style="font-size: 18px; line-height: 1.4;">${issue.frontmatter.title}</h2>
      ${metadataHtml}
      ${diagramCallout}
      ${diagramHtml}
      <p style="font-size: 16px; line-height: 1.6;">${summary}</p>
      <div style="font-size: 15px; line-height: 1.6; margin: 24px 0;">
        ${bodyHtml}
      </div>
      <p>
        <a href="${issueUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Open full playbook →</a>
      </p>
      <p style="color: #64748b; font-size: 14px;">Or copy this link: ${issueUrl}</p>
      ${options?.includeForwardReferralPs ? buildPb3ForwardReferralPostscript().html : ""}
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
  options?: { includeForwardReferralPs?: boolean },
): string {
  const postscript = options?.includeForwardReferralPs
    ? `\n\n${buildPb3ForwardReferralPostscript().text}`
    : "";
  return `${issue.frontmatter.title}\n\n${summary}\n\n${issue.body}\n\nOpen full playbook: ${issueUrl}${postscript}`;
}

export async function buildPlaybookEmailContent(
  issue: IssueDocument,
  options?: { includeUnsubscribe?: boolean; includeForwardReferralPs?: boolean },
): Promise<{
  subject: string;
  summary: string;
  issueUrl: string;
  html: string;
  text: string;
}> {
  const summary = extractTeaser(issue.body);
  const subject = buildPlaybookSubject(issue);
  const issueUrl = buildIssueUrl(issue.frontmatter.slug);
  const bodyHtml = await markdownToHtml(issue.body);
  const html = buildPlaybookEmailHtml(issue, summary, issueUrl, bodyHtml, options);
  const text = buildPlaybookEmailText(issue, summary, issueUrl, options);

  return { subject, summary, issueUrl, html, text };
}

export async function sendTransactionalPlaybookEmail(options: {
  email: string;
  issue: IssueDocument;
  subjectPrefix?: string;
  includeForwardReferralPs?: boolean;
}): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const { subject, html, text } = await buildPlaybookEmailContent(options.issue, {
    includeUnsubscribe: false,
    includeForwardReferralPs: options.includeForwardReferralPs,
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
      error: error.message,
    });
    return { ok: false, error: error.message };
  }

  return { ok: true, messageId: data?.id };
}
