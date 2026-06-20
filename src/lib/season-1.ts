export type SeasonIssueStatus = "published" | "planned";

export type SeasonIssue = {
  number: number;
  slug: string | null;
  title: string;
  pillar: string;
  status: SeasonIssueStatus;
};

export const SEASON_1_TITLE = "Season 1";
export const SEASON_1_SUBTITLE = "12 playbooks, one operating system";

export const SEASON_1_PROMISE =
  "12 practical automations that turn a 1–10 person service business into a calm, follow-up-proof operation — inbox, quotes, reviews, scheduling, invoices, and client comms.";

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
    slug: "agent-assisted-automation-stack",
    title: "When to use Zapier vs Cursor + Paperclip for custom flows",
    pillar: "Meta / tools",
    status: "planned",
  },
];

export function season1Progress(): { published: number; total: number } {
  const published = SEASON_1_ISSUES.filter((issue) => issue.status === "published").length;
  return { published, total: SEASON_1_ISSUES.length };
}
