import { logger } from "@/lib/logger";
import { getAudienceId, getResendClient } from "@/lib/resend";
import type { SubscriberRecord } from "@/lib/subscribers";

const DRIP_INDEX_KEY = "drip_sequence_index";
const LAST_DRIP_KEY = "last_drip_sent_at";
const DRIP_ENROLLED_KEY = "drip_enrolled_at";

type ResendDripState = Pick<
  SubscriberRecord,
  "dripSequenceIndex" | "lastDripSentAt" | "dripEnrolledAt"
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

  logger.warn("Resend drip property setup failed", { key, status: response.status, body });
}

/** Idempotently register custom contact properties used for drip state on Vercel. */
export async function ensureDripContactProperties(): Promise<boolean> {
  if (propertiesReady || !getResendClient()) return Boolean(getResendClient());

  await Promise.all([
    ensureContactProperty(DRIP_INDEX_KEY, "number"),
    ensureContactProperty(LAST_DRIP_KEY, "string"),
    ensureContactProperty(DRIP_ENROLLED_KEY, "string"),
  ]);

  propertiesReady = true;
  return true;
}

export async function loadDripStateFromResend(email: string): Promise<ResendDripState | null> {
  const audienceId = getAudienceId();
  if (!audienceId) return null;

  const response = await resendFetch(
    `/audiences/${audienceId}/contacts/${encodeURIComponent(email.toLowerCase())}`,
  );
  if (!response?.ok) return null;

  const payload = (await response.json()) as {
    drip_sequence_index?: number;
    last_drip_sent_at?: string;
    drip_enrolled_at?: string;
    properties?: Record<string, string | number>;
  };

  const props = payload.properties ?? payload;
  const dripSequenceIndex =
    typeof props[DRIP_INDEX_KEY] === "number" ? props[DRIP_INDEX_KEY] : undefined;
  const lastDripSentAt =
    typeof props[LAST_DRIP_KEY] === "string" && props[LAST_DRIP_KEY]
      ? props[LAST_DRIP_KEY]
      : undefined;
  const dripEnrolledAt =
    typeof props[DRIP_ENROLLED_KEY] === "string" && props[DRIP_ENROLLED_KEY]
      ? props[DRIP_ENROLLED_KEY]
      : undefined;

  if (
    dripSequenceIndex == null &&
    lastDripSentAt == null &&
    dripEnrolledAt == null
  ) {
    return null;
  }

  return { dripSequenceIndex, lastDripSentAt, dripEnrolledAt };
}

export async function syncDripStateToResend(
  email: string,
  state: ResendDripState,
): Promise<boolean> {
  const audienceId = getAudienceId();
  if (!audienceId || !getResendClient()) return false;

  await ensureDripContactProperties();

  const properties: Record<string, string | number> = {};
  if (state.dripSequenceIndex != null) {
    properties[DRIP_INDEX_KEY] = state.dripSequenceIndex;
  }
  if (state.lastDripSentAt) {
    properties[LAST_DRIP_KEY] = state.lastDripSentAt;
  }
  if (state.dripEnrolledAt) {
    properties[DRIP_ENROLLED_KEY] = state.dripEnrolledAt;
  }

  if (Object.keys(properties).length === 0) return false;

  const response = await resendFetch(
    `/audiences/${audienceId}/contacts/${encodeURIComponent(email.toLowerCase())}`,
    {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    },
  );

  if (!response?.ok) {
    const body = await response?.text();
    logger.warn("Resend drip state sync failed", {
      email,
      status: response?.status,
      body,
    });
    return false;
  }

  return true;
}

export async function hydrateSubscriberDripState(
  subscriber: SubscriberRecord,
): Promise<SubscriberRecord> {
  if (
    subscriber.dripEnrolledAt &&
    subscriber.dripSequenceIndex != null &&
    subscriber.lastDripSentAt
  ) {
    return subscriber;
  }

  const remote = await loadDripStateFromResend(subscriber.email);
  if (!remote) return subscriber;

  return {
    ...subscriber,
    dripEnrolledAt: subscriber.dripEnrolledAt ?? remote.dripEnrolledAt,
    dripSequenceIndex: subscriber.dripSequenceIndex ?? remote.dripSequenceIndex,
    lastDripSentAt: subscriber.lastDripSentAt ?? remote.lastDripSentAt,
  };
}
