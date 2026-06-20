import { HELLO_INBOX } from "@/lib/resend-inbound";

const DOMAIN_NAME = "automatethisweek.com";
const WEBHOOK_ENDPOINT = "https://automatethisweek.com/api/webhooks/resend/inbound";

type ResendDomain = {
  id: string;
  name: string;
  capabilities?: { sending?: string; receiving?: string };
  records?: Array<{
    record: string;
    name: string;
    type: string;
    value: string;
    priority?: number;
    status?: string;
  }>;
};

type ResendWebhook = {
  id: string;
  endpoint: string;
  events: string[];
};

async function resendRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; body: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 0, body: "missing_resend_api_key" };
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`https://api.resend.com${path}`, { ...init, headers });
  const body = await response.text();

  if (!response.ok) {
    return { ok: false, status: response.status, body };
  }

  return { ok: true, data: body ? (JSON.parse(body) as T) : ({} as T) };
}

export type InboundSetupResult = {
  domainId: string;
  domainName: string;
  receivingEnabled: boolean;
  mxRecord: { name: string; type: "MX"; value: string; priority: number } | null;
  webhook: { id: string; endpoint: string; created: boolean; signingSecret: string | null };
};

function findReceivingMx(domain: ResendDomain) {
  const records = domain.records ?? [];
  const mx = records.find(
    (record) =>
      record.type === "MX" &&
      (record.record?.toLowerCase().includes("receiving") ||
        record.name === "@" ||
        record.name === "" ||
        record.name === DOMAIN_NAME),
  );
  if (!mx?.value) return null;
  return {
    name: mx.name === DOMAIN_NAME || mx.name === "" ? "@" : mx.name,
    type: "MX" as const,
    value: mx.value.endsWith(".") ? mx.value : `${mx.value}.`,
    priority: mx.priority ?? 10,
  };
}

export async function provisionResendInbound(): Promise<InboundSetupResult> {
  const listResult = await resendRequest<{ data: ResendDomain[] }>("/domains");
  if (!listResult.ok) {
    throw new Error(`Resend domains.list failed (${listResult.status}): ${listResult.body}`);
  }

  const domain = listResult.data.data.find((item) => item.name === DOMAIN_NAME);
  if (!domain) {
    throw new Error(`Resend domain not found: ${DOMAIN_NAME}`);
  }

  if (domain.capabilities?.receiving !== "enabled") {
    const updateResult = await resendRequest<ResendDomain>(`/domains/${domain.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        capabilities: { receiving: "enabled" },
      }),
    });
    if (!updateResult.ok) {
      throw new Error(`Resend domains.update failed (${updateResult.status}): ${updateResult.body}`);
    }
  }

  const domainResult = await resendRequest<ResendDomain>(`/domains/${domain.id}`);
  if (!domainResult.ok) {
    throw new Error(`Resend domains.get failed (${domainResult.status}): ${domainResult.body}`);
  }

  const refreshed = domainResult.data;
  const mxRecord = findReceivingMx(refreshed);

  const webhooksResult = await resendRequest<{ data: ResendWebhook[] }>("/webhooks");
  if (!webhooksResult.ok) {
    throw new Error(`Resend webhooks.list failed (${webhooksResult.status}): ${webhooksResult.body}`);
  }

  const existing = webhooksResult.data.data.find((hook) => hook.endpoint === WEBHOOK_ENDPOINT);
  let webhookId = existing?.id ?? "";
  let created = false;
  let signingSecret: string | null = null;

  if (!existing) {
    const createResult = await resendRequest<{ id: string; signing_secret: string }>("/webhooks", {
      method: "POST",
      body: JSON.stringify({
        endpoint: WEBHOOK_ENDPOINT,
        events: ["email.received"],
      }),
    });
    if (!createResult.ok) {
      throw new Error(`Resend webhooks.create failed (${createResult.status}): ${createResult.body}`);
    }
    webhookId = createResult.data.id;
    signingSecret = createResult.data.signing_secret;
    created = true;
  }

  return {
    domainId: refreshed.id,
    domainName: refreshed.name,
    receivingEnabled: refreshed.capabilities?.receiving === "enabled",
    mxRecord,
    webhook: {
      id: webhookId,
      endpoint: WEBHOOK_ENDPOINT,
      created,
      signingSecret,
    },
  };
}

export type InboundReplySummary = {
  emailId: string;
  from: string;
  to: string[];
  subject: string;
  receivedAt: string;
  snippet: string;
  positive: boolean;
};

export async function sendHelloInboxTestEmail(): Promise<{ id: string }> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL not configured");
  }

  const result = await resendRequest<{ id: string }>("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: fromEmail,
      to: [HELLO_INBOX],
      subject: "NOV-82 inbound receiving test",
      text: "CTO heartbeat test — yes interested in founding sponsor slot.",
    }),
  });

  if (!result.ok) {
    throw new Error(`Resend emails.send failed (${result.status}): ${result.body}`);
  }

  return result.data;
}

export async function listHelloInboundReplies(): Promise<InboundReplySummary[]> {
  const listResult = await resendRequest<{
    data: Array<{
      id: string;
      from: string;
      to: string[];
      subject: string;
      created_at: string;
    }>;
  }>("/emails/receiving");

  if (!listResult.ok) {
    throw new Error(`Resend receiving.list failed (${listResult.status}): ${listResult.body}`);
  }

  const { extractSnippet, fetchReceivedEmail, isHelloInboxRecipient, isPositiveReply } =
    await import("@/lib/resend-inbound");

  const summaries: InboundReplySummary[] = [];

  for (const item of listResult.data.data) {
    if (!isHelloInboxRecipient(item.to)) continue;

    const email = await fetchReceivedEmail(item.id);
    const bodyText = email?.text ?? email?.html?.replace(/<[^>]+>/g, " ") ?? "";
    summaries.push({
      emailId: item.id,
      from: item.from,
      to: item.to,
      subject: item.subject,
      receivedAt: item.created_at,
      snippet: extractSnippet(bodyText),
      positive: isPositiveReply(bodyText),
    });
  }

  return summaries;
}

export { DOMAIN_NAME, HELLO_INBOX, WEBHOOK_ENDPOINT };
