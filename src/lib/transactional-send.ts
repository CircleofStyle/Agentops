import { logger } from "@/lib/logger";
import { getFromEmail, getResendClient } from "@/lib/resend";

export type TransactionalSendInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  dryRun?: boolean;
};

export type TransactionalSendResult = {
  ok: boolean;
  dryRun?: boolean;
  resendId?: string;
  to?: string;
  subject?: string;
  error?: string;
};

const DEFAULT_REPLY_TO = "hello@automatethisweek.com";

export async function sendTransactionalEmail(
  input: TransactionalSendInput,
): Promise<TransactionalSendResult> {
  const { to, subject, text, replyTo = DEFAULT_REPLY_TO, dryRun = false } = input;

  if (dryRun) {
    return { ok: true, dryRun: true, to, subject };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to,
    replyTo,
    subject,
    text,
  });

  if (error) {
    logger.error("Transactional send failed", { to, error: error.message });
    return { ok: false, error: error.message };
  }

  return { ok: true, resendId: data?.id, to, subject };
}
