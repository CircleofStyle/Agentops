import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";
import {
  listResendAudienceSubscribers,
  loadSubscriberFromResend,
  mergeSubscriberRecords,
  syncConfirmedAtToResend,
} from "@/lib/resend-subscribers";
import { syncDripStateToResend } from "@/lib/resend-drip-state";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { syncPreferredLocaleToResend } from "@/lib/resend-subscribers";
import { mergeUtmFields, type UtmParams } from "@/lib/utm";

export type SubscriberRecord = {
  email: string;
  status: "pending" | "confirmed";
  /** Preferred language for transactional and drip emails. */
  preferredLocale?: Locale;
  createdAt: string;
  confirmedAt?: string;
  token: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  /** ISO timestamp when subscriber entered the drip sequence. */
  dripEnrolledAt?: string;
  /** Count of playbook issues sent via drip (0 = enrolled, none sent yet). */
  dripSequenceIndex?: number;
  /** ISO timestamp of the last drip playbook email. */
  lastDripSentAt?: string;
  /** Slugs delivered via drip, in send order. */
  issuesSent?: string[];
  /** All Access Pass — immediate archive unlock on web. */
  allAccess?: boolean;
  /** ISO timestamp when all-access was granted. */
  allAccessGrantedAt?: string;
  /** Source of all-access grant (gumroad, code, manual). */
  allAccessSource?: "gumroad" | "code" | "manual";
  /** Crown Discipline — playbook #12 unlock on web. */
  crownAccess?: boolean;
  /** ISO timestamp when crown access was granted. */
  crownAccessGrantedAt?: string;
  /** Source of crown grant (gumroad, code, manual). */
  crownAccessSource?: "gumroad" | "code" | "manual";
};

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readSubscribers(): Promise<SubscriberRecord[]> {
  try {
    const raw = await readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(raw) as SubscriberRecord[];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: SubscriberRecord[]): Promise<boolean> {
  try {
    await ensureDataDir();
    await writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
    return true;
  } catch (error) {
    // Vercel/serverless runtimes expose a read-only filesystem outside /tmp.
    logger.warn("Subscriber file write skipped", {
      reason: error instanceof Error ? error.message : "unknown",
      storage: "filesystem_unavailable",
    });
    return false;
  }
}

async function persistDripFields(record: SubscriberRecord): Promise<void> {
  if (record.dripEnrolledAt == null && record.dripSequenceIndex == null && !record.lastDripSentAt) {
    return;
  }

  await syncDripStateToResend(record.email, {
    dripEnrolledAt: record.dripEnrolledAt,
    dripSequenceIndex: record.dripSequenceIndex,
    lastDripSentAt: record.lastDripSentAt,
  });
}

async function persistPreferredLocale(record: SubscriberRecord): Promise<void> {
  if (!record.preferredLocale) return;
  await syncPreferredLocaleToResend(record.email, record.preferredLocale);
}

async function loadAllSubscribers(): Promise<SubscriberRecord[]> {
  const local = await readSubscribers();
  const remote = await listResendAudienceSubscribers();
  if (remote.length === 0) return local;
  return mergeSubscriberRecords(local, remote);
}

export async function findSubscriber(email: string): Promise<SubscriberRecord | undefined> {
  const normalized = email.toLowerCase();
  const subscribers = await loadAllSubscribers();
  const match = subscribers.find((s) => s.email.toLowerCase() === normalized);
  if (match) return match;
  return (await loadSubscriberFromResend(normalized)) ?? undefined;
}

export async function findSubscriberByToken(token: string): Promise<SubscriberRecord | undefined> {
  const subscribers = await readSubscribers();
  return subscribers.find((s) => s.token === token);
}

export async function upsertPendingSubscriber(
  email: string,
  token: string,
  utm?: UtmParams,
  preferredLocale: Locale = defaultLocale,
): Promise<SubscriberRecord> {
  const subscribers = await readSubscribers();
  const normalized = email.toLowerCase();
  const existing = subscribers.find((s) => s.email === normalized);

  if (existing?.status === "confirmed") {
    return existing;
  }

  const attribution = mergeUtmFields(existing, utm);

  const record: SubscriberRecord = {
    email: normalized,
    status: "pending",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    token,
    preferredLocale: existing?.preferredLocale ?? preferredLocale,
    ...attribution,
  };

  const next = existing
    ? subscribers.map((s) => (s.email === normalized ? record : s))
    : [...subscribers, record];

  await writeSubscribers(next);
  await persistPreferredLocale(record);
  return record;
}

export async function confirmSubscriber(token: string): Promise<SubscriberRecord | null> {
  const subscribers = await readSubscribers();
  const index = subscribers.findIndex((s) => s.token === token);

  if (index === -1) return null;

  const confirmed: SubscriberRecord = {
    ...subscribers[index],
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  };

  subscribers[index] = confirmed;
  await writeSubscribers(subscribers);
  await syncConfirmedAtToResend(confirmed.email, confirmed.confirmedAt!);
  return confirmed;
}

export async function confirmSubscriberByEmail(email: string): Promise<SubscriberRecord | null> {
  const subscribers = await readSubscribers();
  const normalized = email.toLowerCase();
  const index = subscribers.findIndex((s) => s.email === normalized);
  const now = new Date().toISOString();

  if (index === -1) {
    const remote = await loadSubscriberFromResend(normalized);
    const confirmed: SubscriberRecord = {
      email: normalized,
      status: "confirmed",
      createdAt: remote?.createdAt ?? now,
      confirmedAt: now,
      token: remote?.token ?? newSubscriberToken(),
      dripEnrolledAt: remote?.dripEnrolledAt,
      dripSequenceIndex: remote?.dripSequenceIndex,
      lastDripSentAt: remote?.lastDripSentAt,
      issuesSent: remote?.issuesSent,
      utm_source: remote?.utm_source,
      utm_medium: remote?.utm_medium,
      utm_campaign: remote?.utm_campaign,
      preferredLocale: remote?.preferredLocale,
    };

    await writeSubscribers([...subscribers, confirmed]);
    await syncConfirmedAtToResend(normalized, now);
    return confirmed;
  }

  const confirmed: SubscriberRecord = {
    ...subscribers[index],
    status: "confirmed",
    confirmedAt: subscribers[index].confirmedAt ?? now,
  };

  subscribers[index] = confirmed;
  await writeSubscribers(subscribers);
  await syncConfirmedAtToResend(normalized, confirmed.confirmedAt!);
  return confirmed;
}

export async function updateSubscriber(
  email: string,
  updater: (record: SubscriberRecord) => SubscriberRecord,
): Promise<SubscriberRecord | null> {
  const normalized = email.toLowerCase();
  const subscribers = await readSubscribers();
  let index = subscribers.findIndex((s) => s.email === normalized);

  if (index === -1) {
    const remote = await loadSubscriberFromResend(normalized);
    if (!remote) return null;
    subscribers.push(remote);
    index = subscribers.length - 1;
  }

  subscribers[index] = updater(subscribers[index]);
  const updated = subscribers[index];
  await writeSubscribers(subscribers);
  await persistDripFields(updated);
  await persistPreferredLocale(updated);
  return updated;
}

export async function recordDripSend(email: string, slug: string): Promise<SubscriberRecord | null> {
  return updateSubscriber(email, (record) => ({
    ...record,
    dripEnrolledAt: record.dripEnrolledAt ?? new Date().toISOString(),
    dripSequenceIndex: (record.dripSequenceIndex ?? 0) + 1,
    lastDripSentAt: new Date().toISOString(),
    issuesSent: [...(record.issuesSent ?? []), slug],
  }));
}

export async function exportSubscribers(): Promise<SubscriberRecord[]> {
  return loadAllSubscribers();
}

function newSubscriberToken(): string {
  return randomBytes(24).toString("hex");
}

export async function grantAllAccess(
  email: string,
  source: SubscriberRecord["allAccessSource"] = "manual",
): Promise<SubscriberRecord> {
  const subscribers = await readSubscribers();
  const normalized = email.toLowerCase();
  const index = subscribers.findIndex((s) => s.email === normalized);
  const now = new Date().toISOString();

  if (index === -1) {
    const record: SubscriberRecord = {
      email: normalized,
      status: "confirmed",
      createdAt: now,
      confirmedAt: now,
      token: newSubscriberToken(),
      allAccess: true,
      allAccessGrantedAt: now,
      allAccessSource: source,
    };
    subscribers.push(record);
    await writeSubscribers(subscribers);
    return record;
  }

  const updated: SubscriberRecord = {
    ...subscribers[index],
    status: "confirmed",
    confirmedAt: subscribers[index].confirmedAt ?? now,
    allAccess: true,
    allAccessGrantedAt: subscribers[index].allAccessGrantedAt ?? now,
    allAccessSource: source,
  };

  subscribers[index] = updated;
  await writeSubscribers(subscribers);
  return updated;
}

export async function revokeAllAccess(email: string): Promise<SubscriberRecord | null> {
  return updateSubscriber(email, (record) => ({
    ...record,
    allAccess: false,
  }));
}

export async function grantCrownAccess(
  email: string,
  source: SubscriberRecord["crownAccessSource"] = "manual",
): Promise<SubscriberRecord> {
  const subscribers = await readSubscribers();
  const normalized = email.toLowerCase();
  const index = subscribers.findIndex((s) => s.email === normalized);
  const now = new Date().toISOString();

  if (index === -1) {
    const record: SubscriberRecord = {
      email: normalized,
      status: "confirmed",
      createdAt: now,
      confirmedAt: now,
      token: newSubscriberToken(),
      crownAccess: true,
      crownAccessGrantedAt: now,
      crownAccessSource: source,
    };
    subscribers.push(record);
    await writeSubscribers(subscribers);
    return record;
  }

  const updated: SubscriberRecord = {
    ...subscribers[index],
    status: "confirmed",
    confirmedAt: subscribers[index].confirmedAt ?? now,
    crownAccess: true,
    crownAccessGrantedAt: subscribers[index].crownAccessGrantedAt ?? now,
    crownAccessSource: source,
  };

  subscribers[index] = updated;
  await writeSubscribers(subscribers);
  return updated;
}

export async function revokeCrownAccess(email: string): Promise<SubscriberRecord | null> {
  return updateSubscriber(email, (record) => ({
    ...record,
    crownAccess: false,
  }));
}
