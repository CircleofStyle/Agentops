import { randomBytes } from "crypto";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { logger } from "@/lib/logger";
import { getAudienceId, getResendClient } from "@/lib/resend";
import { normalizePreferredLocale } from "@/lib/subscriber-locale";
import type { SubscriberRecord } from "@/lib/subscribers";

export const CONFIRMED_AT_KEY = "confirmed_at";
export const PREFERRED_LOCALE_KEY = "preferred_locale";

type ResendContact = {
  email: string;
  created_at?: string;
  unsubscribed?: boolean;
  properties?: Record<string, string | number>;
};

function placeholderToken(): string {
  return randomBytes(24).toString("hex");
}

function contactConfirmedAt(contact: ResendContact): string | undefined {
  const props = contact.properties ?? {};
  const confirmed = props[CONFIRMED_AT_KEY];
  if (typeof confirmed === "string" && confirmed) return confirmed;

  const dripEnrolled = props.drip_enrolled_at;
  if (typeof dripEnrolled === "string" && dripEnrolled) return dripEnrolled;

  return undefined;
}

function contactToSubscriberRecord(contact: ResendContact): SubscriberRecord | null {
  if (!contact.email || contact.unsubscribed) return null;

  const confirmedAt = contactConfirmedAt(contact);
  const props = contact.properties ?? {};
  const dripSequenceIndex =
    typeof props.drip_sequence_index === "number" ? props.drip_sequence_index : undefined;
  const lastDripSentAt =
    typeof props.last_drip_sent_at === "string" ? props.last_drip_sent_at : undefined;
  const dripEnrolledAt =
    typeof props.drip_enrolled_at === "string" ? props.drip_enrolled_at : undefined;
  const preferredLocale =
    normalizePreferredLocale(props[PREFERRED_LOCALE_KEY]) ?? defaultLocale;
  const createdAt = contact.created_at ?? confirmedAt ?? new Date().toISOString();

  return {
    email: contact.email.toLowerCase(),
    status: "confirmed",
    createdAt,
    confirmedAt: confirmedAt ?? createdAt,
    token: placeholderToken(),
    dripEnrolledAt,
    dripSequenceIndex,
    lastDripSentAt,
    preferredLocale,
  };
}

export function mergeSubscriberRecords(
  local: SubscriberRecord[],
  remote: SubscriberRecord[],
): SubscriberRecord[] {
  const byEmail = new Map<string, SubscriberRecord>();

  for (const record of remote) {
    byEmail.set(record.email.toLowerCase(), record);
  }

  for (const record of local) {
    const key = record.email.toLowerCase();
    const existing = byEmail.get(key);
    if (!existing) {
      byEmail.set(key, record);
      continue;
    }

    byEmail.set(key, {
      ...existing,
      ...record,
      status: record.status === "confirmed" || existing.status === "confirmed" ? "confirmed" : "pending",
      confirmedAt: record.confirmedAt ?? existing.confirmedAt,
      dripEnrolledAt: record.dripEnrolledAt ?? existing.dripEnrolledAt,
      dripSequenceIndex: record.dripSequenceIndex ?? existing.dripSequenceIndex,
      lastDripSentAt: record.lastDripSentAt ?? existing.lastDripSentAt,
      issuesSent: record.issuesSent?.length ? record.issuesSent : existing.issuesSent,
      utm_source: record.utm_source ?? existing.utm_source,
      utm_medium: record.utm_medium ?? existing.utm_medium,
      utm_campaign: record.utm_campaign ?? existing.utm_campaign,
      allAccess: record.allAccess ?? existing.allAccess,
      allAccessGrantedAt: record.allAccessGrantedAt ?? existing.allAccessGrantedAt,
      allAccessSource: record.allAccessSource ?? existing.allAccessSource,
      crownAccess: record.crownAccess ?? existing.crownAccess,
      crownAccessGrantedAt: record.crownAccessGrantedAt ?? existing.crownAccessGrantedAt,
      crownAccessSource: record.crownAccessSource ?? existing.crownAccessSource,
      preferredLocale: record.preferredLocale ?? existing.preferredLocale,
      token: record.token || existing.token,
      createdAt: record.createdAt || existing.createdAt,
    });
  }

  return Array.from(byEmail.values());
}

export async function listResendAudienceSubscribers(): Promise<SubscriberRecord[]> {
  const resend = getResendClient();
  const audienceId = getAudienceId();
  if (!resend || !audienceId) return [];

  const { data, error } = await resend.contacts.list({ audienceId });
  if (error || !data?.data) {
    logger.warn("Resend subscriber list failed", { error: error?.message });
    return [];
  }

  const records = data.data
    .map((contact) => contactToSubscriberRecord(contact as ResendContact))
    .filter((record): record is SubscriberRecord => record !== null);

  return Promise.all(records.map((record) => hydrateResendSubscriberRecord(record)));
}

async function hydrateResendSubscriberRecord(record: SubscriberRecord): Promise<SubscriberRecord> {
  if (record.dripSequenceIndex != null && record.lastDripSentAt && record.dripEnrolledAt) {
    return record;
  }

  const audienceId = getAudienceId();
  if (!getResendClient() || !audienceId) return record;

  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(record.email)}`,
    {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    },
  );

  if (!response.ok) return record;

  const contact = (await response.json()) as ResendContact;
  const hydrated = contactToSubscriberRecord({ ...contact, email: record.email });
  if (!hydrated) return record;

  return {
    ...record,
    dripEnrolledAt: record.dripEnrolledAt ?? hydrated.dripEnrolledAt,
    dripSequenceIndex: record.dripSequenceIndex ?? hydrated.dripSequenceIndex,
    lastDripSentAt: record.lastDripSentAt ?? hydrated.lastDripSentAt,
    confirmedAt: record.confirmedAt ?? hydrated.confirmedAt,
    preferredLocale: record.preferredLocale ?? hydrated.preferredLocale,
  };
}

export async function loadSubscriberFromResend(
  email: string,
): Promise<SubscriberRecord | undefined> {
  const normalized = email.toLowerCase();
  const records = await listResendAudienceSubscribers();
  return records.find((record) => record.email === normalized);
}

export async function syncConfirmedAtToResend(
  email: string,
  confirmedAt: string,
): Promise<boolean> {
  const audienceId = getAudienceId();
  if (!getResendClient() || !audienceId) return false;

  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email.toLowerCase())}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { [CONFIRMED_AT_KEY]: confirmedAt },
      }),
    },
  );

  if (!response.ok) {
    logger.warn("Resend confirmed_at sync failed", {
      email,
      status: response.status,
      body: await response.text(),
    });
    return false;
  }

  return true;
}

export async function syncPreferredLocaleToResend(
  email: string,
  preferredLocale: Locale,
): Promise<boolean> {
  const audienceId = getAudienceId();
  if (!getResendClient() || !audienceId) return false;

  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email.toLowerCase())}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { [PREFERRED_LOCALE_KEY]: preferredLocale },
      }),
    },
  );

  if (!response.ok) {
    logger.warn("Resend preferred_locale sync failed", {
      email,
      preferredLocale,
      status: response.status,
      body: await response.text(),
    });
    return false;
  }

  return true;
}
