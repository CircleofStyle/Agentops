import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";
import { mergeUtmFields, type UtmParams } from "@/lib/utm";

export type SubscriberRecord = {
  email: string;
  status: "pending" | "confirmed";
  createdAt: string;
  confirmedAt?: string;
  token: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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

export async function findSubscriber(email: string): Promise<SubscriberRecord | undefined> {
  const subscribers = await readSubscribers();
  return subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
}

export async function findSubscriberByToken(token: string): Promise<SubscriberRecord | undefined> {
  const subscribers = await readSubscribers();
  return subscribers.find((s) => s.token === token);
}

export async function upsertPendingSubscriber(
  email: string,
  token: string,
  utm?: UtmParams,
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
    ...attribution,
  };

  const next = existing
    ? subscribers.map((s) => (s.email === normalized ? record : s))
    : [...subscribers, record];

  await writeSubscribers(next);
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
  return confirmed;
}

export async function exportSubscribers(): Promise<SubscriberRecord[]> {
  return readSubscribers();
}
