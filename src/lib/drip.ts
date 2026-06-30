import { getPublishedIssue } from "@/lib/content/storage";
import { logger } from "@/lib/logger";
import { PB3_DRIP_SLUG, sendTransactionalPlaybookEmail } from "@/lib/playbook-email";
import { getDripCadenceDays, getDripSequenceSlugs } from "@/lib/drip-sequence";
import {
  hydrateSubscriberDripState,
  loadDripStateFromResend,
  syncDripStateToResend,
} from "@/lib/resend-drip-state";
import { syncConfirmedAtToResend } from "@/lib/resend-subscribers";
import {
  exportSubscribers,
  findSubscriber,
  recordDripSend,
  type SubscriberRecord,
  updateSubscriber,
} from "@/lib/subscribers";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DRIP_SEND_DELAY_MS = 150;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type DripSendResult = {
  email: string;
  slug?: string;
  status: "sent" | "skipped" | "failed" | "complete";
  reason?: string;
  error?: string;
  messageId?: string;
};

export type DripSubscriberAudit = {
  email: string;
  status: "pending" | "confirmed";
  confirmedAt?: string;
  dripEnrolledAt?: string;
  dripSequenceIndex?: number;
  lastDripSentAt?: string;
  issuesSent?: string[];
  dueNow: boolean;
  behindBy: number;
  storage: "local" | "resend" | "missing";
};

export type DripAuditReport = {
  sequence: string[];
  cadenceDays: number;
  confirmedCount: number;
  dueCount: number;
  unmigratedCount: number;
  subscribers: DripSubscriberAudit[];
  timestamp: string;
};

function isDueForNextIssue(subscriber: SubscriberRecord, cadenceDays: number): boolean {
  if (!subscriber.dripEnrolledAt || subscriber.dripSequenceIndex == null) return false;
  if ((subscriber.dripSequenceIndex ?? 0) === 0) return false;

  if (!subscriber.lastDripSentAt) return false;

  const lastSent = new Date(subscriber.lastDripSentAt).getTime();
  return Date.now() >= lastSent + cadenceDays * MS_PER_DAY;
}

function expectedDripIndex(
  subscriber: SubscriberRecord,
  cadenceDays: number,
  sequenceLength: number,
): number {
  if (!subscriber.confirmedAt) return 0;

  const confirmedAt = new Date(subscriber.confirmedAt).getTime();
  const elapsedDays = Math.max(0, Math.floor((Date.now() - confirmedAt) / MS_PER_DAY));
  const dueCount = Math.min(sequenceLength, 1 + Math.floor(elapsedDays / cadenceDays));
  return dueCount;
}

async function hydrateConfirmedSubscribers(
  subscribers: SubscriberRecord[],
): Promise<SubscriberRecord[]> {
  return Promise.all(
    subscribers.map(async (subscriber) => {
      if (subscriber.status !== "confirmed") return subscriber;
      return hydrateSubscriberDripState(subscriber);
    }),
  );
}

/** Legacy subscribers without drip fields: assume #1 on confirm, continue the sequence. */
async function enrollLegacySubscriberForDrip(
  subscriber: SubscriberRecord,
  firstSlug: string | undefined,
  options?: { dryRun?: boolean },
): Promise<void> {
  if (options?.dryRun) return;

  const enrolledAt = subscriber.confirmedAt ?? new Date().toISOString();
  const updated = await updateSubscriber(subscriber.email, (record) => ({
    ...record,
    dripEnrolledAt: record.dripEnrolledAt ?? enrolledAt,
    dripSequenceIndex: record.dripSequenceIndex ?? 0,
    lastDripSentAt: record.lastDripSentAt,
    issuesSent: record.issuesSent?.length ? record.issuesSent : [],
  }));

  if (updated) {
    await syncDripStateToResend(updated.email, {
      dripEnrolledAt: updated.dripEnrolledAt,
      dripSequenceIndex: updated.dripSequenceIndex,
      lastDripSentAt: updated.lastDripSentAt,
    });
  }
}

export async function migrateExistingSubscribersToDrip(options?: {
  dryRun?: boolean;
}): Promise<{ migrated: number; emails: string[] }> {
  const sequence = await getDripSequenceSlugs();
  const subscribers = await hydrateConfirmedSubscribers(await exportSubscribers());
  const emails: string[] = [];

  for (const subscriber of subscribers) {
    if (subscriber.status !== "confirmed") continue;
    if (subscriber.dripEnrolledAt && subscriber.dripSequenceIndex != null) continue;

    const remote = await loadDripStateFromResend(subscriber.email);
    if (remote?.dripEnrolledAt && remote.dripSequenceIndex != null) {
      if (!options?.dryRun) {
        await updateSubscriber(subscriber.email, (record) => ({
          ...record,
          dripEnrolledAt: record.dripEnrolledAt ?? remote.dripEnrolledAt,
          dripSequenceIndex: record.dripSequenceIndex ?? remote.dripSequenceIndex,
          lastDripSentAt: record.lastDripSentAt ?? remote.lastDripSentAt,
        }));
      }
      continue;
    }

    emails.push(subscriber.email);
    await enrollLegacySubscriberForDrip(subscriber, sequence[0], options);
  }

  if (emails.length > 0) {
    logger.info("Migrated existing subscribers to drip sequence", {
      count: emails.length,
      strategy: "continue_from_confirm_assuming_issue_one",
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
    includeForwardReferralPs: slug === PB3_DRIP_SLUG,
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

export async function auditDripDelivery(): Promise<DripAuditReport> {
  const sequence = await getDripSequenceSlugs();
  const cadenceDays = getDripCadenceDays();
  const subscribers = await hydrateConfirmedSubscribers(await exportSubscribers());

  const audits: DripSubscriberAudit[] = [];
  let dueCount = 0;
  let unmigratedCount = 0;
  let confirmedCount = 0;

  for (const subscriber of subscribers) {
    if (subscriber.status !== "confirmed") {
      audits.push({
        email: subscriber.email,
        status: "pending",
        confirmedAt: subscriber.confirmedAt,
        dueNow: false,
        behindBy: 0,
        storage: "missing",
      });
      continue;
    }

    confirmedCount += 1;
    const hydrated = await hydrateSubscriberDripState(subscriber);
    const remote = await loadDripStateFromResend(subscriber.email);
    const storage =
      hydrated.dripEnrolledAt && subscriber.dripEnrolledAt
        ? "local"
        : remote?.dripEnrolledAt
          ? "resend"
          : "missing";

    if (!hydrated.dripEnrolledAt || hydrated.dripSequenceIndex == null) {
      unmigratedCount += 1;
    }

    const expected = expectedDripIndex(hydrated, cadenceDays, sequence.length);
    const actual = hydrated.dripSequenceIndex ?? 0;
    const dueNow = isDueForNextIssue(hydrated, cadenceDays);
    if (dueNow) dueCount += 1;

    audits.push({
      email: hydrated.email,
      status: "confirmed",
      confirmedAt: hydrated.confirmedAt,
      dripEnrolledAt: hydrated.dripEnrolledAt,
      dripSequenceIndex: hydrated.dripSequenceIndex,
      lastDripSentAt: hydrated.lastDripSentAt,
      issuesSent: hydrated.issuesSent,
      dueNow,
      behindBy: Math.max(0, expected - actual),
      storage,
    });
  }

  return {
    sequence,
    cadenceDays,
    confirmedCount,
    dueCount,
    unmigratedCount,
    subscribers: audits.sort((a, b) => (b.behindBy ?? 0) - (a.behindBy ?? 0)),
    timestamp: new Date().toISOString(),
  };
}

export async function catchUpSubscriberDrip(email: string): Promise<DripSendResult[]> {
  const sequence = await getDripSequenceSlugs();
  const cadenceDays = getDripCadenceDays();
  const existing = await findSubscriber(email);
  if (!existing) {
    return [{ email, status: "failed", error: "subscriber_not_found" }];
  }

  let base = existing;
  if (base.status !== "confirmed") {
    const confirmedAt = base.confirmedAt ?? new Date().toISOString();
    await syncConfirmedAtToResend(email, confirmedAt);
    base = { ...base, status: "confirmed", confirmedAt };
  }

  let subscriber = await hydrateSubscriberDripState(base);
  if (!subscriber.dripEnrolledAt || subscriber.dripSequenceIndex == null) {
    await enrollLegacySubscriberForDrip(subscriber, sequence[0]);
    subscriber = (await findSubscriber(email)) ?? subscriber;
    subscriber = await hydrateSubscriberDripState(subscriber);
  }

  if (!subscriber.issuesSent?.length && (subscriber.dripSequenceIndex ?? 0) > 0) {
    const reset = await updateSubscriber(email, (record) => ({
      ...record,
      dripSequenceIndex: 0,
      lastDripSentAt: undefined,
    }));
    subscriber = reset ? await hydrateSubscriberDripState(reset) : subscriber;
  }

  const expected = expectedDripIndex(subscriber, cadenceDays, sequence.length);
  const actual = subscriber.dripSequenceIndex ?? 0;
  const results: DripSendResult[] = [];

  for (let index = actual; index < expected && index < sequence.length; index += 1) {
    const slug = sequence[index];
    if (!slug) break;

    const fresh = (await findSubscriber(email)) ?? subscriber;
    const hydrated = await hydrateSubscriberDripState(fresh);
    results.push(await sendPlaybookDripToSubscriber(hydrated, slug));
    await sleep(DRIP_SEND_DELAY_MS);
  }

  if (results.length === 0) {
    results.push({ email, status: "skipped", reason: "already_caught_up" });
  }

  return results;
}

/** Send all missed drip playbooks for every confirmed subscriber behind schedule. */
export async function catchUpAllBehindDrip(): Promise<{
  caughtUp: number;
  results: DripSendResult[];
}> {
  const sequence = await getDripSequenceSlugs();
  const cadenceDays = getDripCadenceDays();
  const subscribers = await hydrateConfirmedSubscribers(await exportSubscribers());
  const results: DripSendResult[] = [];
  let caughtUp = 0;

  for (const subscriber of subscribers) {
    if (subscriber.status !== "confirmed") continue;

    const hydrated = await hydrateSubscriberDripState(subscriber);
    const expected = expectedDripIndex(hydrated, cadenceDays, sequence.length);
    const actual = hydrated.dripSequenceIndex ?? 0;
    if (expected <= actual) continue;

    const sendResults = await catchUpSubscriberDrip(hydrated.email);
    results.push(...sendResults);
    if (sendResults.some((r) => r.status === "sent")) {
      caughtUp += 1;
    }
  }

  return { caughtUp, results };
}

export async function processDueDripEmails(options?: {
  dryRun?: boolean;
  limit?: number;
}): Promise<{ processed: number; migrated: number; results: DripSendResult[] }> {
  const { dryRun = false, limit = 100 } = options ?? {};
  const migration = await migrateExistingSubscribersToDrip({ dryRun });
  const sequence = await getDripSequenceSlugs();
  const cadenceDays = getDripCadenceDays();
  const subscribers = await hydrateConfirmedSubscribers(await exportSubscribers());

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
