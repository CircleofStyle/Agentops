import type { Locale } from "@/i18n/config";

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

const SEASON_1_TITLE_DE = "Serie 1";
const SEASON_1_SUBTITLE_DE = "12 Playbooks für deinen Alltag — Schritt für Schritt";
const SEASON_1_PROMISE_DE =
  "12 praktische Automatisierungen für kleine Dienstleistungsbetriebe: Posteingang, Angebote, Bewertungen, Termine, Rechnungen und Kundenkontakt — ruhig und zuverlässig im Alltag.";

export function season1Title(locale: Locale): string {
  return locale === "de" ? SEASON_1_TITLE_DE : SEASON_1_TITLE;
}

export function season1Subtitle(locale: Locale): string {
  return locale === "de" ? SEASON_1_SUBTITLE_DE : SEASON_1_SUBTITLE;
}

export function season1Promise(locale: Locale): string {
  return locale === "de" ? SEASON_1_PROMISE_DE : SEASON_1_PROMISE;
}

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
    slug: "appointment-reminder-workflow",
    title: "Cut no-shows with automated reminders",
    pillar: "Deliver",
    status: "published",
  },
  {
    number: 5,
    slug: "invoice-chase-workflow",
    title: "Friendly payment reminders without awkward calls",
    pillar: "Cash",
    status: "published",
  },
  {
    number: 6,
    slug: "new-lead-welcome-sequence",
    title: "Instant welcome + intake for new inquiries",
    pillar: "Capture",
    status: "planned",
  },
  {
    number: 7,
    slug: "job-completion-checklist",
    title: "Auto-send completion summary + upsell prompt",
    pillar: "Deliver",
    status: "planned",
  },
  {
    number: 8,
    slug: "referral-ask-workflow",
    title: "Ask happy clients for referrals on schedule",
    pillar: "Grow",
    status: "planned",
  },
  {
    number: 9,
    slug: "weekly-ops-dashboard",
    title: "One Google Sheet dashboard for open quotes/jobs",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 10,
    slug: "slack-team-alerts",
    title: "Route urgent jobs to the right person in Slack",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 11,
    slug: "review-response-templates",
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

const SEASON_1_TITLES_DE: Record<string, string> = {
  "auto-triage-customer-emails": "Kunden-E-Mails automatisch sortieren",
  "quote-follow-up-workflow": "Nie wieder ein Angebot vergessen nachzufassen",
  "google-review-request-workflow": "Abgeschlossene Aufträge in Google-Bewertungen verwandeln",
  "appointment-reminder-workflow":
    "Terminausfälle mit automatischen Erinnerungen reduzieren",
  "invoice-chase-workflow":
    "Freundliche Zahlungserinnerungen ohne unangenehme Anrufe",
  "new-lead-welcome-sequence":
    "Sofortige Begrüßung und Aufnahme bei neuen Anfragen",
  "job-completion-checklist":
    "Abschlusszusammenfassung und Upsell automatisch senden",
  "referral-ask-workflow": "Zufriedene Kunden planmässig um Empfehlungen bitten",
  "weekly-ops-dashboard":
    "Ein Google-Sheet-Dashboard für offene Angebote und Aufträge",
  "slack-team-alerts":
    "Dringende Aufträge an die richtige Person in Slack leiten",
  "review-response-templates":
    "Google-Bewertungen mit einem Klick beantworten",
  "crown-discipline-ai-ceo": "Crown Discipline — Automatisierungen als System betreiben",
};

const SEASON_1_PILLARS_DE: Record<string, string> = {
  Capture: "Leads erfassen",
  Convert: "Mehr Aufträge",
  Reputation: "Bewertungen",
  Deliver: "Sauber liefern",
  Cash: "Geld rein",
  Grow: "Weiter wachsen",
  Ops: "Betrieb",
  Lead: "Überblick",
};

const SEASON_1_TEASERS_DE: Record<string, string> = {
  "crown-discipline-ai-ceo":
    "Du hast Posteingang, Angebote, Bewertungen und Betrieb verbunden. Playbook #12 ist das Upgrade: ein KI-CEO, der Aufgaben verteilt und deine Automatisierungen als ein System am Laufen hält. Kostenpflichtiges Add-on — separat von All Access.",
};

export function season1IssueTeaser(issue: SeasonIssue, locale: Locale): string | undefined {
  if (!issue.teaser) return undefined;
  if (locale === "de" && issue.slug && SEASON_1_TEASERS_DE[issue.slug]) {
    return SEASON_1_TEASERS_DE[issue.slug];
  }
  return issue.teaser;
}

export function season1IssueTitle(issue: SeasonIssue, locale: Locale): string {
  if (locale === "de" && issue.slug && SEASON_1_TITLES_DE[issue.slug]) {
    return SEASON_1_TITLES_DE[issue.slug];
  }
  return issue.title;
}

export function season1IssuePillar(pillar: string, locale: Locale): string {
  if (locale === "de") {
    return SEASON_1_PILLARS_DE[pillar] ?? pillar;
  }
  return pillar;
}
