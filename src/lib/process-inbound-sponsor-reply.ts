import { logger } from "@/lib/logger";
import {
  appendSponsorInboundReply,
  isPaperclipConfigured,
  notifyCmoPositiveReply,
} from "@/lib/paperclip-client";
import {
  extractSnippet,
  fetchReceivedEmail,
  isPositiveReply,
  type ResendEmailReceivedEvent,
} from "@/lib/resend-inbound";

export type InboundProcessResult = {
  emailId: string;
  logged: boolean;
  positive: boolean;
  escalated: boolean;
  paperclipConfigured: boolean;
};

export async function processInboundSponsorReply(
  event: ResendEmailReceivedEvent,
): Promise<InboundProcessResult> {
  const { email_id: emailId, from, subject, created_at: receivedAt } = event.data;
  const email = await fetchReceivedEmail(emailId);
  const bodyText = email?.text ?? email?.html?.replace(/<[^>]+>/g, " ") ?? "";
  const snippet = extractSnippet(bodyText);
  const positive = isPositiveReply(bodyText);

  const entry = {
    emailId,
    receivedAt: receivedAt ?? new Date().toISOString(),
    from,
    subject,
    snippet,
    positive,
  };

  logger.info("Inbound sponsor reply received", {
    emailId,
    from,
    subject,
    positive,
    snippetLength: snippet.length,
  });

  const paperclipConfigured = isPaperclipConfigured();
  let logged = false;
  let escalated = false;

  if (paperclipConfigured) {
    logged = await appendSponsorInboundReply(entry);
    if (!logged) {
      logger.error("Failed to append sponsor inbound reply to Paperclip log", { emailId });
    }

    if (positive) {
      escalated = await notifyCmoPositiveReply(entry);
      if (!escalated) {
        logger.error("Failed to notify CMO for positive sponsor reply", { emailId });
      }
    }
  } else {
    logger.warn("Paperclip not configured; inbound reply not persisted", { emailId });
  }

  return {
    emailId,
    logged,
    positive,
    escalated,
    paperclipConfigured,
  };
}
