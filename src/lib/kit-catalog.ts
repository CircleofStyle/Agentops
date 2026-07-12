/**
 * Workflow Kit Store catalog — playbooks #1–#3 plus optional starter bundle.
 *
 * Commerce doctrine (NOV-303 / NOV-311): Stripe Payment Links on ATW are the default.
 * `gumroadPermalink` is legacy metadata for migrate-or-sunset only — do not provision
 * new Gumroad SKUs unless the board explicitly overrides doctrine.
 */

export type WorkflowKitSpec = {
  issueNumber: number;
  playbookSlug: string;
  /** Legacy Gumroad permalink — sunset path only; Stripe uses playbookSlug as Payment Link key. */
  gumroadPermalink: string;
  /** Stable Stripe Dashboard product code. */
  skuCode: string;
  name: string;
  priceCents: number;
  shortDescription: string;
  setupMinutes: number;
  /** Public static ZIP path after payment (`/kits/thank-you?sku=`). */
  downloadPath: string;
};

export const WORKFLOW_KITS: WorkflowKitSpec[] = [
  {
    issueNumber: 1,
    playbookSlug: "auto-triage-customer-emails",
    gumroadPermalink: "inbox-triage-kit",
    skuCode: "ATW-KIT-INBOX-TRIAGE",
    name: "Automate This Week — Inbox Triage Kit",
    priceCents: 1900,
    shortDescription:
      "Zapier export + GPT classification prompt + setup checklist for shared inbox triage.",
    setupMinutes: 15,
    downloadPath: "/downloads/kits/auto-triage-customer-emails.zip",
  },
  {
    issueNumber: 2,
    playbookSlug: "quote-follow-up-workflow",
    gumroadPermalink: "quote-follow-up-kit",
    skuCode: "ATW-KIT-QUOTE-FOLLOW-UP",
    name: "Automate This Week — Quote Follow-Up Kit",
    priceCents: 1900,
    shortDescription:
      "Google Sheets tracker template + timed Gmail nudges on day 3 and day 7.",
    setupMinutes: 20,
    downloadPath: "/downloads/kits/quote-follow-up-workflow.zip",
  },
  {
    issueNumber: 3,
    playbookSlug: "google-review-request-workflow",
    gumroadPermalink: "google-review-request-kit",
    skuCode: "ATW-KIT-GOOGLE-REVIEW",
    name: "Automate This Week — Google Review Request Kit",
    priceCents: 1900,
    shortDescription:
      "Job tracker template + review request emails + 2-day / 7-day Zapier timing.",
    setupMinutes: 25,
    downloadPath: "/downloads/kits/google-review-request-workflow.zip",
  },
];

export const KIT_STARTER_BUNDLE = {
  /** Stripe Payment Link key + legacy Gumroad permalink. */
  checkoutSlug: "starter-bundle-kits-1-3",
  gumroadPermalink: "starter-bundle-kits-1-3",
  skuCode: "ATW-KIT-STARTER-BUNDLE",
  name: "Automate This Week — Starter Bundle (Kits #1–#3)",
  priceCents: 3900,
  shortDescription:
    "All three Season 1 workflow kits: inbox triage, quote follow-up, and Google review requests.",
  includedSlugs: WORKFLOW_KITS.map((kit) => kit.playbookSlug),
  downloadPath: "/downloads/kits/starter-bundle-kits-1-3.zip",
} as const;

/** @deprecated Prefer Stripe Payment Links — kept for legacy env migration only. */
const GUMROAD_STORE = process.env.GUMROAD_STORE_SUBDOMAIN ?? "agentops";

/** @deprecated Prefer resolveStripePaymentLink / resolveKitCheckoutUrl. */
export function gumroadCheckoutUrl(permalink: string): string {
  return `https://${GUMROAD_STORE}.gumroad.com/l/${permalink}`;
}

export function kitByPlaybookSlug(slug: string): WorkflowKitSpec | undefined {
  return WORKFLOW_KITS.find((kit) => kit.playbookSlug === slug);
}

export function kitByGumroadPermalink(permalink: string): WorkflowKitSpec | undefined {
  return WORKFLOW_KITS.find((kit) => kit.gumroadPermalink === permalink);
}

/** JSON map of playbook slug → legacy Gumroad checkout URL (migration tooling only). */
export function buildKitUrlMap(): Record<string, string> {
  return Object.fromEntries(
    WORKFLOW_KITS.map((kit) => [kit.playbookSlug, gumroadCheckoutUrl(kit.gumroadPermalink)]),
  );
}
