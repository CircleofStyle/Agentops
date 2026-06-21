export const AFFILIATE_DISCLOSURE =
  "Some links in this playbook are affiliate links. If you sign up through them, Automate This Week may earn a small commission at no extra cost to you. We only recommend tools we use in the playbooks. Including NovaRho affiliate links where noted.";

export type AffiliateToolId = "zapier" | "make" | "openai" | "cursor" | "paperclip";

export interface AffiliateTool {
  id: AffiliateToolId;
  name: string;
  description: string;
}

export const AFFILIATE_TOOLS: AffiliateTool[] = [
  {
    id: "zapier",
    name: "Zapier",
    description: "No-code automation for Gmail triggers, routing, and drafts.",
  },
  {
    id: "make",
    name: "Make.com",
    description: "Visual alternative if you prefer Make over Zapier for the same workflow.",
  },
  {
    id: "openai",
    name: "OpenAI API",
    description: "GPT classification step for intent and urgency labels.",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-native editor for custom automations when Zapier hits its limits.",
  },
  {
    id: "paperclip",
    name: "Paperclip",
    description: "Agent control plane for running and coordinating automation workflows.",
  },
];

const DEFAULT_AFFILIATE_URLS: Record<AffiliateToolId, string> = {
  zapier: "https://zapier.com/sign-up",
  make: "https://www.make.com/en/register?pc=automatethisweek",
  openai: "https://platform.openai.com/signup",
  cursor: "https://cursor.com",
  paperclip: "https://paperclip.ing",
};

const AFFILIATE_ENV_KEYS: Record<AffiliateToolId, string> = {
  zapier: "AFFILIATE_URL_ZAPIER",
  make: "AFFILIATE_URL_MAKE",
  openai: "AFFILIATE_URL_OPENAI",
  cursor: "AFFILIATE_URL_CURSOR",
  paperclip: "AFFILIATE_URL_PAPERCLIP",
};

/** Per-issue affiliate tools surfaced on full-body pages. */
const ISSUE_AFFILIATE_TOOLS: Record<string, AffiliateToolId[]> = {
  "auto-triage-customer-emails": ["zapier", "make", "openai"],
  "quote-follow-up-workflow": ["zapier", "make"],
  "agent-assisted-automation-stack": ["cursor", "paperclip"],
};

/** Tools page surfaces NovaRho affiliate links only. */
export const TOOLS_PAGE_AFFILIATE_IDS: AffiliateToolId[] = ["cursor", "paperclip"];

export function getAffiliateToolsForIssue(slug: string): AffiliateToolId[] {
  return ISSUE_AFFILIATE_TOOLS[slug] ?? [];
}

export function issueHasAffiliateTools(slug: string): boolean {
  return getAffiliateToolsForIssue(slug).length > 0;
}

function resolveAffiliateBaseUrl(toolId: AffiliateToolId): string {
  const envKey = AFFILIATE_ENV_KEYS[toolId];
  const fromEnv = process.env[envKey]?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_AFFILIATE_URLS[toolId];
}

export function buildAffiliateUrl(toolId: AffiliateToolId): string {
  const url = new URL(resolveAffiliateBaseUrl(toolId));
  url.searchParams.set("utm_campaign", `affiliate_${toolId}`);
  return url.toString();
}

export function getAffiliateToolsByIds(ids: AffiliateToolId[]): AffiliateTool[] {
  return AFFILIATE_TOOLS.filter((tool) => ids.includes(tool.id));
}
