import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { IssueDocument } from "@/lib/content/types";
import { getPublishedIssue } from "@/lib/content/storage";
import { logger } from "@/lib/logger";
import { getAudienceId, getFromEmail, getResendClient, getSiteUrl } from "@/lib/resend";

export type PlaybookBroadcastRecord = {
  slug: string;
  broadcastId: string;
  subject: string;
  sentAt: string;
  catchUp?: boolean;
  testEmail?: string;
};

export type PlaybookBroadcastStatus = "sent" | "skipped" | "dry_run" | "failed";

export type PlaybookBroadcastResult = {
  slug: string;
  status: PlaybookBroadcastStatus;
  subject?: string;
  summary?: string;
  issueUrl?: string;
  broadcastId?: string;
  reason?: string;
  error?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const BROADCAST_LOG_FILE = path.join(DATA_DIR, "playbook-broadcasts.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readBroadcastLog(): Promise<PlaybookBroadcastRecord[]> {
  try {
    const raw = await readFile(BROADCAST_LOG_FILE, "utf-8");
    return JSON.parse(raw) as PlaybookBroadcastRecord[];
  } catch {
    return [];
  }
}

async function writeBroadcastLog(records: PlaybookBroadcastRecord[]): Promise<boolean> {
  try {
    await ensureDataDir();
    await writeFile(BROADCAST_LOG_FILE, JSON.stringify(records, null, 2), "utf-8");
    return true;
  } catch (error) {
    logger.warn("Playbook broadcast log write skipped", {
      reason: error instanceof Error ? error.message : "unknown",
      storage: "filesystem_unavailable",
    });
    return false;
  }
}

export function extractIssueSummary(body: string, maxSentences = 2): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#"));

  const first = paragraphs[0] ?? "";
  const sentences = first.match(/[^.!?]+[.!?]+/g) ?? [first];
  return sentences
    .slice(0, maxSentences)
    .join(" ")
    .trim();
}

function buildSubject(issue: IssueDocument): string {
  return `This week: ${issue.frontmatter.title}`;
}

function buildIssueUrl(slug: string): string {
  return `${getSiteUrl()}/issues/${slug}`;
}

function buildBroadcastHtml(issue: IssueDocument, summary: string, issueUrl: string): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #0ea5e9; font-size: 22px;">Automate This Week</h1>
      <h2 style="font-size: 18px; line-height: 1.4;">${issue.frontmatter.title}</h2>
      <p style="font-size: 16px; line-height: 1.6;">${summary}</p>
      <p>
        <a href="${issueUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Read the playbook</a>
      </p>
      <p style="color: #64748b; font-size: 14px;">Or copy this link: ${issueUrl}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #64748b; font-size: 12px;">
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>
      </p>
    </div>
  `.trim();
}

function buildTestEmailHtml(issue: IssueDocument, summary: string, issueUrl: string): string {
  return buildBroadcastHtml(issue, summary, issueUrl).replace(
    '<a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>',
    "Reply to this email to opt out.",
  );
}

export async function findBroadcastForSlug(slug: string): Promise<PlaybookBroadcastRecord | undefined> {
  const records = await readBroadcastLog();
  return records.find((r) => r.slug === slug);
}

export async function sendPlaybookBroadcast(options: {
  slug: string;
  dryRun?: boolean;
  catchUp?: boolean;
  testEmail?: string;
}): Promise<PlaybookBroadcastResult> {
  const { slug, dryRun = false, catchUp = false, testEmail } = options;

  const issue = await getPublishedIssue(slug);
  if (!issue) {
    return {
      slug,
      status: "failed",
      error: `Published issue not found: ${slug}`,
    };
  }

  const existing = await findBroadcastForSlug(slug);
  if (existing && !catchUp && !testEmail) {
    return {
      slug,
      status: "skipped",
      reason: "already_sent",
      broadcastId: existing.broadcastId,
      subject: existing.subject,
      issueUrl: buildIssueUrl(slug),
    };
  }

  const summary = extractIssueSummary(issue.body);
  const subject = buildSubject(issue);
  const issueUrl = buildIssueUrl(slug);
  const html = testEmail
    ? buildTestEmailHtml(issue, summary, issueUrl)
    : buildBroadcastHtml(issue, summary, issueUrl);
  const text = `${issue.frontmatter.title}\n\n${summary}\n\nRead the playbook: ${issueUrl}`;

  if (dryRun) {
    return {
      slug,
      status: "dry_run",
      subject,
      summary,
      issueUrl,
      reason: testEmail ? "test_email" : catchUp ? "catch_up" : "broadcast",
    };
  }

  const resend = getResendClient();
  const audienceId = getAudienceId();
  const from = getFromEmail();

  if (!resend) {
    return {
      slug,
      status: "failed",
      subject,
      summary,
      issueUrl,
      error: "RESEND_API_KEY not configured",
    };
  }

  if (testEmail) {
    const { data, error } = await resend.emails.send({
      from,
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html,
      text,
    });

    if (error) {
      logger.error("Playbook test email failed", { slug, error: error.message });
      return {
        slug,
        status: "failed",
        subject,
        summary,
        issueUrl,
        error: error.message,
      };
    }

    return {
      slug,
      status: "sent",
      subject,
      summary,
      issueUrl,
      broadcastId: data?.id,
      reason: "test_email",
    };
  }

  if (!audienceId) {
    return {
      slug,
      status: "failed",
      subject,
      summary,
      issueUrl,
      error: "RESEND_AUDIENCE_ID not configured",
    };
  }

  const { data: createData, error: createError } = await resend.broadcasts.create({
    name: `playbook-${slug}-${issue.frontmatter.publishedAt ?? "unknown"}`,
    audienceId,
    from,
    replyTo: "hello@automatethisweek.com",
    subject,
    previewText: summary,
    html,
    text,
  });

  if (createError || !createData?.id) {
    const message = createError?.message ?? "Broadcast create failed";
    logger.error("Playbook broadcast create failed", { slug, error: message });
    return {
      slug,
      status: "failed",
      subject,
      summary,
      issueUrl,
      error: message,
    };
  }

  const { data: sendData, error: sendError } = await resend.broadcasts.send(createData.id);

  if (sendError) {
    const message = sendError.message ?? "Broadcast send failed";
    logger.error("Playbook broadcast send failed", { slug, broadcastId: createData.id, error: message });
    return {
      slug,
      status: "failed",
      subject,
      summary,
      issueUrl,
      broadcastId: createData.id,
      error: message,
    };
  }

  const broadcastId = sendData?.id ?? createData.id;
  const record: PlaybookBroadcastRecord = {
    slug,
    broadcastId,
    subject,
    sentAt: new Date().toISOString(),
    ...(catchUp ? { catchUp: true } : {}),
  };

  const records = await readBroadcastLog();
  const next = [...records.filter((r) => r.slug !== slug), record];
  await writeBroadcastLog(next);

  logger.info("Playbook broadcast sent", { slug, broadcastId, catchUp });

  return {
    slug,
    status: "sent",
    subject,
    summary,
    issueUrl,
    broadcastId,
    reason: catchUp ? "catch_up" : "broadcast",
  };
}
