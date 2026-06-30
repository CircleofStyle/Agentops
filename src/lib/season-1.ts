export type SeasonIssueStatus = "published" | "planned";

export type SeasonIssueTier = "standard" | "crown";

export type SeasonIssue = {
  number: number;
  slug: string | null;
  title: string;
  pillar: string;
  status: SeasonIssueStatus;
  /** Paid add-on — excluded from free drip and All Access. */
  paidOnly?: boolean;
  tier?: SeasonIssueTier;
  /** Short teaser shown on the Season 1 roadmap for paid-only playbooks. */
  teaser?: string;
};

export const SEASON_1_TITLE = "Season 1";
export const SEASON_1_SUBTITLE = "12 playbooks, one operating system";

export const SEASON_1_PROMISE =
  "12 practical automations that turn a 1–10 person service business into a calm, follow-up-proof operation — inbox, quotes, reviews, scheduling, invoices, and client comms.";

export const FREE_DRIP_ISSUE_COUNT = 11;

export const CROWN_DISCIPLINE_SLUG = "crown-discipline-ai-ceo";

export const SEASON_1_ISSUES: SeasonIssue[] = [
  {
    number: 1,
    slug: "auto-triage-customer-emails",
    title: "Auto-triage customer emails",
    pillar: "Capture",
    status: "published",
  },
  {
    number: 2,
    slug: "quote-follow-up-workflow",
    title: "Never forget to follow up on a quote",
    pillar: "Convert",
    status: "published",
  },
  {
    number: 3,
    slug: "google-review-request-workflow",
    title: "Turn finished jobs into Google reviews",
    pillar: "Reputation",
    status: "published",
  },
  {
    number: 4,
    slug: null,
    title: "Cut no-shows with automated reminders",
    pillar: "Deliver",
    status: "planned",
  },
  {
    number: 5,
    slug: null,
    title: "Friendly payment reminders without awkward calls",
    pillar: "Cash",
    status: "planned",
  },
  {
    number: 6,
    slug: null,
    title: "Instant welcome + intake for new inquiries",
    pillar: "Capture",
    status: "planned",
  },
  {
    number: 7,
    slug: null,
    title: "Auto-send completion summary + upsell prompt",
    pillar: "Deliver",
    status: "planned",
  },
  {
    number: 8,
    slug: null,
    title: "Ask happy clients for referrals on schedule",
    pillar: "Grow",
    status: "planned",
  },
  {
    number: 9,
    slug: null,
    title: "One Google Sheet dashboard for open quotes/jobs",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 10,
    slug: null,
    title: "Route urgent jobs to the right person in Slack",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 11,
    slug: null,
    title: "Draft replies to Google reviews in one click",
    pillar: "Reputation",
    status: "planned",
  },
  {
    number: 12,
    slug: CROWN_DISCIPLINE_SLUG,
    title: "Crown discipline — run automations as a system",
    pillar: "Lead",
    status: "planned",
    paidOnly: true,
    tier: "crown",
    teaser:
      "You've wired inbox, quotes, reviews, and ops. Playbook #12 is the operating-model upgrade: an AI CEO who delegates to specialist agents and keeps automations running as a disciplined system. Paid add-on — separate from All Access.",
  },
];

export function season1Progress(): { published: number; total: number } {
  const published = SEASON_1_ISSUES.filter((issue) => issue.status === "published").length;
  return { published, total: SEASON_1_ISSUES.length };
}

export function getCrownDisciplineIssue(): SeasonIssue {
  const crown = SEASON_1_ISSUES.find((issue) => issue.tier === "crown");
  if (!crown) {
    throw new Error("Crown discipline issue missing from Season 1 data");
  }
  return crown;
}
