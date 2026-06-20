import { getPublishedIssue } from "@/lib/content/storage";
import { logger } from "@/lib/logger";
import { sendTransactionalPlaybookEmail } from "@/lib/playbook-email";
import { getDripCadenceDays, getDripSequenceSlugs } from "@/lib/drip-sequence";
import {
  exportSubscribers,
  recordDripSend,
  type SubscriberRecord,
  updateSubscriber,
} from "@/lib/subscribers";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type DripSendResult = {
  email: string;
  slug?: string;
  status: "sent" | "skipped" | "failed" | "complete";
  reason?: string;
  error?: string;
  messageId?: string;
};

function isDueForNextIssue(subscriber: SubscriberRecord, cadenceDays: number): boolean {
  if (!subscriber.dripEnrolledAt || subscriber.dripSequenceIndex == null) return false;
  if ((subscriber.dripSequenceIndex ?? 0) === 0) return false;

  if (!subscriber.lastDripSentAt) return false;

  const lastSent = new Date(subscriber.lastDripSentAt).getTime();
  return Date.now() >= lastSent + cadenceDays * MS_PER_DAY;
}

/** Existing broadcast subscribers: mark caught up at current published count (no backfill). */
export async function migrateExistingSubscribersToDrip(options?: {
  dryRun?: boolean;
}): Promise<{ migrated: number; emails: string[] }> {
  const sequence = await getDripSequenceSlugs();
  const subscribers = await exportSubscribers();
  const emails: string[] = [];

  for (const subscriber of subscribers) {
    if (subscriber.status !== "confirmed") continue;
    if (subscriber.dripEnrolledAt) continue;

    emails.push(subscriber.email);
    if (options?.dryRun) continue;

    await updateSubscriber(subscriber.email, (record) => ({
      ...record,
      dripEnrolledAt: record.confirmedAt ?? new Date().toISOString(),
      dripSequenceIndex: sequence.length,
      lastDripSentAt: record.confirmedAt ?? new Date().toISOString(),
      issuesSent: [...sequence],
    }));
  }

  if (emails.length > 0) {
    logger.info("Migrated existing subscribers to drip sequence", {
      count: emails.length,
      strategy: "start_at_current_published_count",
      dryRun: options?.dryRun ?? false,
    });
  }

  return { migrated: emails.length, emails };
}

export async function sendPlaybookDripToSubscriber(
  subscriber: SubscriberRecord,
  slug: string,
): Promise<DripSendResult> {
  const issue = await getPublishedIssue(slug);
  if (!issue) {
    return { email: subscriber.email, slug, status: "failed", error: `Published issue not found: ${slug}` };
  }

  const sendResult = await sendTransactionalPlaybookEmail({
    email: subscriber.email,
    issue,
  });

  if (!sendResult.ok) {
    return { email: subscriber.email, slug, status: "failed", error: sendResult.error };
  }

  await recordDripSend(subscriber.email, slug);
  logger.info("Drip email sent", { email: subscriber.email, slug, messageId: sendResult.messageId });

  return { email: subscriber.email, slug, status: "sent", messageId: sendResult.messageId };
}

export async function enrollSubscriberInDrip(email: string): Promise<SubscriberRecord | null> {
  return updateSubscriber(email, (record) => ({
    ...record,
    dripEnrolledAt: record.dripEnrolledAt ?? new Date().toISOString(),
    dripSequenceIndex: record.dripSequenceIndex ?? 0,
    issuesSent: record.issuesSent ?? [],
  }));
}

export async function sendInitialDripIssue(email: string): Promise<DripSendResult> {
  const sequence = await getDripSequenceSlugs();
  if (sequence.length === 0) {
    return { email, status: "skipped", reason: "empty_sequence" };
  }

  const subscriber = await enrollSubscriberInDrip(email);
  if (!subscriber) {
    return { email, status: "failed", error: "subscriber_not_found" };
  }

  if ((subscriber.dripSequenceIndex ?? 0) > 0) {
    return { email, status: "skipped", reason: "already_started" };
  }

  return sendPlaybookDripToSubscriber(subscriber, sequence[0]);
}

export async function processDueDripEmails(options?: {
  dryRun?: boolean;
  limit?: number;
}): Promise<{ processed: number; migrated: number; results: DripSendResult[] }> {
  const { dryRun = false, limit = 100 } = options ?? {};
  const migration = await migrateExistingSubscribersToDrip({ dryRun });
  const sequence = await getDripSequenceSlugs();
  const cadenceDays = getDripCadenceDays();
  const subscribers = await exportSubscribers();

  const due = subscribers.filter(
    (s) =>
      s.status === "confirmed" &&
      s.dripEnrolledAt &&
      s.dripSequenceIndex != null &&
      (s.dripSequenceIndex ?? 0) < sequence.length &&
      isDueForNextIssue(s, cadenceDays),
  );

  const batch = due.slice(0, limit);
  const results: DripSendResult[] = [];

  for (const subscriber of batch) {
    const index = subscriber.dripSequenceIndex ?? 0;
    const slug = sequence[index];

    if (!slug) {
      results.push({ email: subscriber.email, status: "complete", reason: "sequence_finished" });
      continue;
    }

    if (dryRun) {
      results.push({ email: subscriber.email, slug, status: "skipped", reason: "dry_run" });
      continue;
    }

    results.push(await sendPlaybookDripToSubscriber(subscriber, slug));
  }

  return { processed: batch.length, migrated: migration.migrated, results };
}
