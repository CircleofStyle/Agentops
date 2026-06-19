import { Webhook } from "svix";
import { logger } from "@/lib/logger";

export const HELLO_INBOX = "hello@automatethisweek.com";

export type ResendEmailReceivedEvent = {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
  };
};

export type ReceivedEmailBody = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string | null;
  html: string | null;
  created_at: string;
};

const POSITIVE_PATTERNS = [
  /\byes\b/i,
  /\binterested\b/i,
  /\bsounds good\b/i,
  /\bcount me in\b/i,
  /\bhold a slot\b/i,
  /\bhappy to\b/i,
  /\blet.s do/i,
  /\bgo ahead\b/i,
  /\bsign me up\b/i,
  /\bwould love\b/i,
  /\bkeen\b/i,
];

const NEGATIVE_PATTERNS = [
  /\bno thanks\b/i,
  /\bnot interested\b/i,
  /\bunsubscribe\b/i,
  /\bremove me\b/i,
  /\bpass on this\b/i,
  /\bnot at this time\b/i,
];

export function verifyResendWebhook(payload: string, headers: Headers): ResendEmailReceivedEvent {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("RESEND_WEBHOOK_SECRET not configured");
  }

  const wh = new Webhook(secret);
  return wh.verify(payload, {
    "svix-id": headers.get("svix-id") ?? "",
    "svix-timestamp": headers.get("svix-timestamp") ?? "",
    "svix-signature": headers.get("svix-signature") ?? "",
  }) as ResendEmailReceivedEvent;
}

export function isHelloInboxRecipient(to: string[]): boolean {
  return to.some((addr) => addr.toLowerCase().includes(HELLO_INBOX));
}

export function extractSnippet(text: string | null | undefined, maxLen = 160): string {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLen) return compact;
  return `${compact.slice(0, maxLen - 1)}…`;
}

export function isPositiveReply(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;
  if (NEGATIVE_PATTERNS.some((pattern) => pattern.test(normalized))) return false;
  return POSITIVE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export async function fetchReceivedEmail(emailId: string): Promise<ReceivedEmailBody | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.error("Cannot fetch received email", { emailId, reason: "missing_resend_api_key" });
    return null;
  }

  const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    logger.error("Resend receiving.get failed", {
      emailId,
      status: response.status,
    });
    return null;
  }

  return (await response.json()) as ReceivedEmailBody;
}
