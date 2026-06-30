import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getPublishedIssue } from "@/lib/content/storage";
import { extractTeaser } from "@/lib/content/visibility";
import { logger } from "@/lib/logger";
import {
  buildIssueUrl,
  buildPlaybookEmailContent,
} from "@/lib/playbook-email";
import { isDripSequenceEnabled } from "@/lib/drip-sequence";
import { getAudienceId, getFromEmail, getResendClient } from "@/lib/resend";

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

/** @deprecated Use buildPlaybookSubject from playbook-email.ts */
export function extractIssueSummary(body: string, maxSentences = 2): string {
  return extractTeaser(body, maxSentences);
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

  if (isDripSequenceEnabled() && !catchUp && !testEmail && !dryRun) {
    return {
      slug,
      status: "skipped",
      reason: "drip_sequence_active",
      issueUrl: buildIssueUrl(slug),
    };
  }

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

  const { subject, summary, issueUrl, html, text } = await buildPlaybookEmailContent(issue, {
    includeUnsubscribe: !testEmail,
  });

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
