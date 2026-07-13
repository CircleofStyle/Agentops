import { logger } from "@/lib/logger";
import { getAudienceId, getResendClient } from "@/lib/resend";
import type { SubscriberRecord } from "@/lib/subscribers";

export const ALL_ACCESS_KEY = "all_access";
export const ALL_ACCESS_GRANTED_AT_KEY = "all_access_granted_at";
export const ALL_ACCESS_SOURCE_KEY = "all_access_source";
export const CROWN_ACCESS_KEY = "crown_access";
export const CROWN_ACCESS_GRANTED_AT_KEY = "crown_access_granted_at";
export const CROWN_ACCESS_SOURCE_KEY = "crown_access_source";

const PAID_ACCESS_PROPERTY_KEYS = [
  ALL_ACCESS_KEY,
  ALL_ACCESS_GRANTED_AT_KEY,
  ALL_ACCESS_SOURCE_KEY,
  CROWN_ACCESS_KEY,
  CROWN_ACCESS_GRANTED_AT_KEY,
  CROWN_ACCESS_SOURCE_KEY,
] as const;

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

async function ensureGlobalContact(email: string): Promise<boolean> {
  const response = await resendFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email: email.toLowerCase(),
      unsubscribed: false,
    }),
  });

  if (!response) return false;
  if (response.ok || response.status === 409) return true;

  const body = await response.text();
  if (body.toLowerCase().includes("already")) return true;

  logger.warn("Resend global contact create for paid-access failed", {
    email,
    status: response.status,
    body,
  });
  return false;
}

/** Match Resend SDK path building — do not URL-encode the email local identity. */
function contactPath(email: string, audienceId?: string): string {
  const normalized = email.toLowerCase();
  if (audienceId) {
    return `/audiences/${audienceId}/contacts/${normalized}`;
  }
  return `/contacts/${normalized}`;
}

async function ensureContactProperty(key: string, type: "string" | "number"): Promise<boolean> {
  const response = await resendFetch("/contact-properties", {
    method: "POST",
    body: JSON.stringify({
      key,
      type,
      fallback_value: type === "number" ? 0 : key.endsWith("_access") ? "false" : "",
    }),
  });

  if (!response) return false;
  if (response.ok || response.status === 409) return true;

  const body = await response.text();
  if (body.toLowerCase().includes("already")) return true;

  logger.warn("Resend paid-access property setup failed", {
    key,
    status: response.status,
    body,
  });
  return false;
}

async function listContactPropertyKeys(): Promise<Set<string> | null> {
  const response = await resendFetch("/contact-properties");
  if (!response?.ok) {
    logger.warn("Resend contact-properties list failed", {
      status: response?.status,
      body: await response?.text(),
    });
    return null;
  }

  const payload = (await response.json()) as {
    data?: Array<{ key?: string }>;
  };
  const keys = new Set<string>();
  for (const item of payload.data ?? []) {
    if (item.key) keys.add(item.key);
  }
  return keys;
}

/** Idempotently register custom contact properties used for paid unlocks on Vercel. */
export async function ensurePaidAccessContactProperties(): Promise<boolean> {
  if (propertiesReady) return true;
  if (!getResendClient()) return false;

  const created = await Promise.all(
    PAID_ACCESS_PROPERTY_KEYS.map((key) => ensureContactProperty(key, "string")),
  );
  if (created.some((ok) => !ok)) {
    return false;
  }

  const existing = await listContactPropertyKeys();
  if (!existing) return false;

  const missing = PAID_ACCESS_PROPERTY_KEYS.filter((key) => !existing.has(key));
  if (missing.length > 0) {
    logger.warn("Resend paid-access properties missing after setup", { missing });
    return false;
  }

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

function contactPropertiesFromPayload(
  payload: Record<string, unknown>,
): Record<string, string | number> {
  const nested = payload.properties;
  const props: Record<string, string | number> = {};

  if (nested && typeof nested === "object") {
    for (const [key, value] of Object.entries(nested as Record<string, unknown>)) {
      if (typeof value === "string" || typeof value === "number") {
        props[key] = value;
      }
    }
  }

  for (const [key, value] of Object.entries(payload)) {
    if (key === "email" || key === "id" || key === "object" || key === "properties") continue;
    if (typeof value === "string" || typeof value === "number") {
      props[key] = value;
    }
  }

  return props;
}

async function readContactProperties(email: string): Promise<Record<string, string | number> | null> {
  const normalized = email.toLowerCase();
  const audienceId = getAudienceId();
  const paths = [contactPath(normalized), audienceId ? contactPath(normalized, audienceId) : null].filter(
    (path): path is string => Boolean(path),
  );

  for (const path of paths) {
    const response = await resendFetch(path);
    if (!response?.ok) continue;
    const payload = (await response.json()) as Record<string, unknown>;
    return contactPropertiesFromPayload(payload);
  }

  return null;
}

/** Public read helper for metrics hydration — prefers global contact properties. */
export async function readPaidAccessContactProperties(
  email: string,
): Promise<Record<string, string | number> | null> {
  return readContactProperties(email);
}

async function patchViaPath(
  path: string,
  properties: Record<string, string>,
): Promise<{ ok: boolean; status?: number; body?: string }> {
  const response = await resendFetch(path, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });

  if (!response) return { ok: false };
  if (response.ok) return { ok: true, status: response.status };

  return {
    ok: false,
    status: response.status,
    body: await response.text(),
  };
}

export type PaidAccessSyncResult = {
  ok: boolean;
  path?: string;
  status?: number;
  body?: string;
  storedKeys?: string[];
  mismatched?: string[];
  reason?: string;
};

async function patchContactProperties(
  email: string,
  properties: Record<string, string>,
): Promise<PaidAccessSyncResult> {
  if (!getResendClient()) {
    return { ok: false, reason: "resend_client_missing" };
  }

  // Best-effort registration. Read-after-write is the durability gate.
  const propertiesOk = await ensurePaidAccessContactProperties();
  if (!propertiesOk) {
    logger.warn("Resend paid-access properties not fully ready; attempting patch anyway", {
      email,
    });
  }

  const normalized = email.toLowerCase();
  const audienceId = getAudienceId();
  const paths = [contactPath(normalized), audienceId ? contactPath(normalized, audienceId) : null].filter(
    (path): path is string => Boolean(path),
  );

  let lastFailure: PaidAccessSyncResult = {
    ok: false,
    reason: "no_paths",
  };

  for (const path of paths) {
    let result = await patchViaPath(path, properties);

    if (result.status === 404) {
      if (path.startsWith("/contacts/")) {
        await ensureGlobalContact(normalized);
      } else {
        await ensureAudienceContact(normalized);
      }
      result = await patchViaPath(path, properties);
    }

    if (result.ok) {
      const stored = await readContactProperties(normalized);
      if (stored) {
        const mismatched = Object.entries(properties)
          .filter(([key, expected]) => String(stored[key] ?? "") !== expected)
          .map(([key]) => key);

        if (mismatched.length === 0) {
          return { ok: true, path, status: result.status, storedKeys: Object.keys(stored) };
        }

        // Audience GET payloads often omit custom properties even when PATCH stuck.
        // Prefer the global contacts write; treat PATCH 200 as success with a warning.
        logger.warn("Resend paid-access read-after-write incomplete; accepting PATCH 200", {
          email: normalized,
          path,
          mismatched,
          storedKeys: Object.keys(stored),
        });
      } else {
        logger.warn("Resend paid-access patch ok but contact unreadable; accepting PATCH 200", {
          email: normalized,
          path,
        });
      }

      return {
        ok: true,
        path,
        status: result.status,
        reason: "patch_accepted",
        storedKeys: stored ? Object.keys(stored) : undefined,
        mismatched: stored
          ? Object.entries(properties)
              .filter(([key, expected]) => String(stored[key] ?? "") !== expected)
              .map(([key]) => key)
          : undefined,
      };
    }

    lastFailure = {
      ok: false,
      path,
      status: result.status,
      body: result.body?.slice(0, 500),
      reason: "patch_failed",
    };
  }

  logger.warn("Resend paid-access sync failed", {
    email: normalized,
    status: lastFailure.status,
    body: lastFailure.body,
    path: lastFailure.path,
    reason: lastFailure.reason,
  });
  return lastFailure;
}

export async function syncAllAccessToResend(
  email: string,
  granted: boolean,
  meta?: { grantedAt?: string; source?: PaidAccessSource },
): Promise<boolean> {
  const result = await syncAllAccessToResendDetailed(email, granted, meta);
  return result.ok;
}

export async function syncAllAccessToResendDetailed(
  email: string,
  granted: boolean,
  meta?: { grantedAt?: string; source?: PaidAccessSource },
): Promise<PaidAccessSyncResult> {
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
  const result = await syncCrownAccessToResendDetailed(email, granted, meta);
  return result.ok;
}

export async function syncCrownAccessToResendDetailed(
  email: string,
  granted: boolean,
  meta?: { grantedAt?: string; source?: PaidAccessSource },
): Promise<PaidAccessSyncResult> {
  const properties: Record<string, string> = {
    [CROWN_ACCESS_KEY]: granted ? "true" : "false",
  };

  if (granted) {
    properties[CROWN_ACCESS_GRANTED_AT_KEY] = meta?.grantedAt ?? new Date().toISOString();
    if (meta?.source) properties[CROWN_ACCESS_SOURCE_KEY] = meta.source;
  }

  return patchContactProperties(email, properties);
}
