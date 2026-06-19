const SPONSOR_OUTREACH_ISSUE_ID = "c896b654-b38b-4a33-a053-49403583330d";
const CMO_AGENT_ID = "fc7f00b6-7292-4b36-9c0e-cc07e0674cdd";
const SPONSOR_LOG_KEY = "sponsor-outreach-log";

type PaperclipConfig = {
  apiUrl: string;
  apiKey: string;
};

function getPaperclipConfig(): PaperclipConfig | null {
  const apiUrl = process.env.PAPERCLIP_API_URL;
  const apiKey = process.env.PAPERCLIP_API_KEY;
  if (!apiUrl || !apiKey) return null;
  return { apiUrl, apiKey };
}

async function paperclipRequest<T>(
  path: string,
  init: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; status: number; body: string }> {
  const config = getPaperclipConfig();
  if (!config) {
    return { ok: false, status: 0, body: "paperclip_not_configured" };
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${config.apiKey}`);
  if (init.body) headers.set("Content-Type", "application/json");
  const runId = process.env.PAPERCLIP_RUN_ID;
  if (runId) headers.set("X-Paperclip-Run-Id", runId);

  const response = await fetch(`${config.apiUrl}${path}`, { ...init, headers });
  const body = await response.text();

  if (!response.ok) {
    return { ok: false, status: response.status, body };
  }

  return { ok: true, data: body ? (JSON.parse(body) as T) : ({} as T) };
}

type IssueDocument = {
  body: string;
  latestRevisionId: string;
  title: string;
};

export function isPaperclipConfigured(): boolean {
  return getPaperclipConfig() !== null;
}

export async function getSponsorOutreachLog(): Promise<IssueDocument | null> {
  const result = await paperclipRequest<IssueDocument>(
    `/api/issues/${SPONSOR_OUTREACH_ISSUE_ID}/documents/${SPONSOR_LOG_KEY}`,
    { method: "GET" },
  );
  return result.ok ? result.data : null;
}

export type InboundReplyLogEntry = {
  emailId: string;
  receivedAt: string;
  from: string;
  subject: string;
  snippet: string;
  positive: boolean;
};

const INBOUND_SECTION = "## Inbound replies";

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function buildInboundRow(entry: InboundReplyLogEntry): string {
  const sentiment = entry.positive ? "**positive**" : "neutral";
  return `| ${entry.receivedAt} | ${escapeTableCell(entry.from)} | ${escapeTableCell(entry.subject)} | ${escapeTableCell(entry.snippet)} | \`${entry.emailId}\` | ${sentiment} |`;
}

function appendInboundReply(body: string, entry: InboundReplyLogEntry): string {
  if (body.includes(entry.emailId)) return body;

  const row = buildInboundRow(entry);
  const header =
    "| Received | From | Subject | Snippet | Email ID | Sentiment |\n|----------|------|---------|---------|----------|-----------|";

  if (body.includes(INBOUND_SECTION)) {
    const [before, after = ""] = body.split(INBOUND_SECTION, 2);
    const sectionBody = after.trimStart();
    const lines = sectionBody.split("\n");
    const tableEnd = lines.findIndex((line, idx) => idx > 1 && line.startsWith("## "));
    const tableLines = tableEnd === -1 ? lines : lines.slice(0, tableEnd);
    const rest = tableEnd === -1 ? "" : lines.slice(tableEnd).join("\n");
    const updatedTable = [...tableLines.filter(Boolean), row].join("\n");
    const rebuilt = `${before}${INBOUND_SECTION}\n\n${updatedTable}${rest ? `\n\n${rest}` : ""}`;
    return updatePositiveReplyMetric(rebuilt, entry.positive);
  }

  const appended = `${body.trimEnd()}\n\n${INBOUND_SECTION}\n\n${header}\n${row}\n`;
  return updatePositiveReplyMetric(appended, entry.positive);
}

function updatePositiveReplyMetric(body: string, incrementPositive: boolean): string {
  if (!incrementPositive) return body;
  return body.replace(
    /\| Positive replies \| ≥3 \| (\d+) \|/,
    (_match, current: string) => `| Positive replies | ≥3 | ${Number(current) + 1} |`,
  );
}

export async function appendSponsorInboundReply(entry: InboundReplyLogEntry): Promise<boolean> {
  const doc = await getSponsorOutreachLog();
  if (!doc) return false;

  const nextBody = appendInboundReply(doc.body, entry);
  if (nextBody === doc.body) return true;

  const result = await paperclipRequest<IssueDocument>(
    `/api/issues/${SPONSOR_OUTREACH_ISSUE_ID}/documents/${SPONSOR_LOG_KEY}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: doc.title,
        format: "markdown",
        body: nextBody,
        baseRevisionId: doc.latestRevisionId,
      }),
    },
  );

  return result.ok;
}

export async function notifyCmoPositiveReply(entry: InboundReplyLogEntry): Promise<boolean> {
  const comment = [
    "## Positive sponsor reply (auto-detected)",
    "",
    `- **From:** ${entry.from}`,
    `- **Subject:** ${entry.subject}`,
    `- **Snippet:** ${entry.snippet}`,
    `- **Email ID:** \`${entry.emailId}\``,
    "",
    "[@CMO](agent://fc7f00b6-7292-4b36-9c0e-cc07e0674cdd) — escalate per pack (CEO/board for invoice if they confirm).",
    "",
    `Logged on [NOV-77](/NOV/issues/NOV-77#document-sponsor-outreach-log).`,
  ].join("\n");

  const result = await paperclipRequest<{ id: string }>(
    `/api/issues/${SPONSOR_OUTREACH_ISSUE_ID}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ body: comment }),
    },
  );

  return result.ok;
}

export { CMO_AGENT_ID, SPONSOR_OUTREACH_ISSUE_ID };
