import { logger } from "@/lib/logger";
import { getAudienceId, getResendClient } from "@/lib/resend";
import type { SubscriberRecord } from "@/lib/subscribers";

export const ALL_ACCESS_KEY = "all_access";
export const ALL_ACCESS_GRANTED_AT_KEY = "all_access_granted_at";
export const ALL_ACCESS_SOURCE_KEY = "all_access_source";
export const CROWN_ACCESS_KEY = "crown_access";
export const CROWN_ACCESS_GRANTED_AT_KEY = "crown_access_granted_at";
export const CROWN_ACCESS_SOURCE_KEY = "crown_access_source";

type PaidAccessSource = NonNullable<
  SubscriberRecord["allAccessSource"] | SubscriberRecord["crownAccessSource"]
>;

let propertiesReady = false;

async function resendFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

async function ensureAudienceContact(email: string): Promise<boolean> {
  const resend = getResendClient();
  const audienceId = getAudienceId();
  if (!resend || !audienceId) return false;

  const { error } = await resend.contacts.create({
    audienceId,
    email: email.toLowerCase(),
    unsubscribed: false,
  });

  if (error && !error.message?.toLowerCase().includes("already")) {
    logger.warn("Resend contact create for paid-access failed", {
      email,
      error: error.message,
    });
    return false;
  }

  return true;
}

async function ensureContactProperty(key: string, type: "string" | "number"): Promise<void> {
  const response = await resendFetch("/contact-properties", {
    method: "POST",
    body: JSON.stringify({
      key,
      type,
      fallback_value: type === "number" ? 0 : "",
    }),
  });

  if (!response) return;
  if (response.ok || response.status === 409) return;

  const body = await response.text();
  if (body.toLowerCase().includes("already")) return;

  logger.warn("Resend paid-access property setup failed", {
    key,
    status: response.status,
    body,
  });
}

/** Idempotently register custom contact properties used for paid unlocks on Vercel. */
export async function ensurePaidAccessContactProperties(): Promise<boolean> {
  if (propertiesReady || !getResendClient()) return Boolean(getResendClient());

  await Promise.all([
    ensureContactProperty(ALL_ACCESS_KEY, "string"),
    ensureContactProperty(ALL_ACCESS_GRANTED_AT_KEY, "string"),
    ensureContactProperty(ALL_ACCESS_SOURCE_KEY, "string"),
    ensureContactProperty(CROWN_ACCESS_KEY, "string"),
    ensureContactProperty(CROWN_ACCESS_GRANTED_AT_KEY, "string"),
    ensureContactProperty(CROWN_ACCESS_SOURCE_KEY, "string"),
  ]);

  propertiesReady = true;
  return true;
}

function truthyFlag(value: string | number | undefined): boolean {
  if (typeof value === "number") return value === 1;
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function parseSource(value: string | number | undefined): PaidAccessSource | undefined {
  if (typeof value !== "string") return undefined;
  if (value === "gumroad" || value === "code" || value === "manual") return value;
  return undefined;
}

export function paidAccessFieldsFromProperties(
  props: Record<string, string | number> | undefined,
): Pick<
  SubscriberRecord,
  | "allAccess"
  | "allAccessGrantedAt"
  | "allAccessSource"
  | "crownAccess"
  | "crownAccessGrantedAt"
  | "crownAccessSource"
> {
  const properties = props ?? {};
  const allAccess = truthyFlag(properties[ALL_ACCESS_KEY]);
  const crownAccess = truthyFlag(properties[CROWN_ACCESS_KEY]);

  return {
    allAccess: allAccess || undefined,
    allAccessGrantedAt:
      allAccess && typeof properties[ALL_ACCESS_GRANTED_AT_KEY] === "string"
        ? properties[ALL_ACCESS_GRANTED_AT_KEY]
        : undefined,
    allAccessSource: allAccess ? parseSource(properties[ALL_ACCESS_SOURCE_KEY]) : undefined,
    crownAccess: crownAccess || undefined,
    crownAccessGrantedAt:
      crownAccess && typeof properties[CROWN_ACCESS_GRANTED_AT_KEY] === "string"
        ? properties[CROWN_ACCESS_GRANTED_AT_KEY]
        : undefined,
    crownAccessSource: crownAccess ? parseSource(properties[CROWN_ACCESS_SOURCE_KEY]) : undefined,
  };
}

async function patchContactProperties(
  email: string,
  properties: Record<string, string>,
): Promise<boolean> {
  const audienceId = getAudienceId();
  if (!audienceId || !getResendClient()) return false;

  await ensurePaidAccessContactProperties();

  const normalized = email.toLowerCase();
  const path = `/audiences/${audienceId}/contacts/${encodeURIComponent(normalized)}`;
  let response = await resendFetch(path, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });

  if (response?.status === 404) {
    await ensureAudienceContact(normalized);
    response = await resendFetch(path, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }

  if (!response?.ok) {
    logger.warn("Resend paid-access sync failed", {
      email: normalized,
      status: response?.status,
      body: await response?.text(),
    });
    return false;
  }

  return true;
}

export async function syncAllAccessToResend(
  email: string,
  granted: boolean,
  meta?: { grantedAt?: string; source?: PaidAccessSource },
): Promise<boolean> {
  const properties: Record<string, string> = {
    [ALL_ACCESS_KEY]: granted ? "true" : "false",
  };

  if (granted) {
    properties[ALL_ACCESS_GRANTED_AT_KEY] = meta?.grantedAt ?? new Date().toISOString();
    if (meta?.source) properties[ALL_ACCESS_SOURCE_KEY] = meta.source;
  }

  return patchContactProperties(email, properties);
}

export async function syncCrownAccessToResend(
  email: string,
  granted: boolean,
  meta?: { grantedAt?: string; source?: PaidAccessSource },
): Promise<boolean> {
  const properties: Record<string, string> = {
    [CROWN_ACCESS_KEY]: granted ? "true" : "false",
  };

  if (granted) {
    properties[CROWN_ACCESS_GRANTED_AT_KEY] = meta?.grantedAt ?? new Date().toISOString();
    if (meta?.source) properties[CROWN_ACCESS_SOURCE_KEY] = meta.source;
  }

  return patchContactProperties(email, properties);
}
