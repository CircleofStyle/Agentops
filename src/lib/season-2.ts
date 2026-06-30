import type { Locale } from "@/i18n/config";

import type { SeasonIssue } from "@/lib/season-1";

export const SEASON_2_TITLE = "Season 2";
export const SEASON_2_SUBTITLE = "Level up with visual orchestration";

export const SEASON_2_PROMISE =
  "12 Make-native playbooks for graduates of Season 1 — multi-step client journeys, branching logic, and connected scenarios that turn calm ops into a scalable operating graph.";

const SEASON_2_TITLE_DE = "Serie 2";
const SEASON_2_SUBTITLE_DE = "Der nächste Schritt mit Make.com";
const SEASON_2_PROMISE_DE =
  "12 Playbooks mit Make.com für alle, die Serie 1 durch haben — mehrstufige Abläufe, klare Verzweigungen und verbundene Workflows für ein wachsendes Unternehmen.";

export function season2Title(locale: Locale): string {
  return locale === "de" ? SEASON_2_TITLE_DE : SEASON_2_TITLE;
}

export function season2Subtitle(locale: Locale): string {
  return locale === "de" ? SEASON_2_SUBTITLE_DE : SEASON_2_SUBTITLE;
}

export function season2Promise(locale: Locale): string {
  return locale === "de" ? SEASON_2_PROMISE_DE : SEASON_2_PROMISE;
}

export const SEASON_2_ISSUES: SeasonIssue[] = [
  {
    number: 1,
    slug: "multi-channel-appointment-reminders",
    title: "Cut no-shows with email + SMS reminders",
    pillar: "Deliver",
    status: "planned",
  },
  {
    number: 2,
    slug: "unified-lead-intake",
    title: "Capture web, email, and SMS leads in one place",
    pillar: "Capture",
    status: "planned",
  },
  {
    number: 3,
    slug: "conditional-quote-routing",
    title: "Route quotes by job type and budget",
    pillar: "Convert",
    status: "planned",
  },
  {
    number: 4,
    slug: "client-crm-sync",
    title: "Keep your client list clean across tools",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 5,
    slug: "payment-status-loops",
    title: "Chase overdue invoices when payment fails",
    pillar: "Cash",
    status: "planned",
  },
  {
    number: 6,
    slug: "team-handoff-routing",
    title: "Escalate urgent jobs with fallback routing",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 7,
    slug: "multi-location-review-monitor",
    title: "Monitor reviews across every location",
    pillar: "Reputation",
    status: "planned",
  },
  {
    number: 8,
    slug: "weekly-owner-digest",
    title: "Monday morning report from live job data",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 9,
    slug: "automation-error-alerts",
    title: "Know instantly when a scenario breaks",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 10,
    slug: "reusable-sub-scenarios",
    title: "Build once, plug into every workflow",
    pillar: "Ops",
    status: "planned",
  },
  {
    number: 11,
    slug: "zapier-to-make-migration",
    title: "When to rebuild in Make vs keep your Zaps",
    pillar: "Lead",
    status: "planned",
  },
  {
    number: 12,
    slug: "full-client-lifecycle-make",
    title: "Connect intake → quote → delivery → review in Make",
    pillar: "Lead",
    status: "planned",
  },
];

export function season2Progress(): { published: number; total: number } {
  const published = SEASON_2_ISSUES.filter((issue) => issue.status === "published").length;
  return { published, total: SEASON_2_ISSUES.length };
}

const SEASON_2_TITLES_DE: Record<string, string> = {
  "multi-channel-appointment-reminders":
    "Terminausfälle mit E-Mail- und SMS-Erinnerungen reduzieren",
  "unified-lead-intake": "Web-, E-Mail- und SMS-Leads an einem Ort erfassen",
  "conditional-quote-routing":
    "Angebote nach Auftragsart und Budget automatisch zuweisen",
  "client-crm-sync": "Kundenliste über alle Tools hinweg sauber halten",
  "payment-status-loops":
    "Überfällige Rechnungen bei fehlgeschlagener Zahlung nachfassen",
  "team-handoff-routing": "Dringende Aufträge mit Fallback-Routing eskalieren",
  "multi-location-review-monitor":
    "Bewertungen an jedem Standort überwachen",
  "weekly-owner-digest": "Montagsbericht aus Live-Auftragsdaten",
  "automation-error-alerts": "Sofort wissen, wenn ein Szenario abbricht",
  "reusable-sub-scenarios": "Einmal bauen, in jeden Workflow einbinden",
  "zapier-to-make-migration": "Wann in Make neu bauen vs. Zaps behalten",
  "full-client-lifecycle-make":
    "Erfassung → Angebot → Lieferung → Bewertung in Make verbinden",
};

const SEASON_2_PILLARS_DE: Record<string, string> = {
  Capture: "Leads erfassen",
  Convert: "Mehr Aufträge",
  Reputation: "Bewertungen",
  Deliver: "Sauber liefern",
  Cash: "Geld rein",
  Ops: "Betrieb",
  Lead: "Überblick",
};

export function season2IssueTitle(issue: SeasonIssue, locale: Locale): string {
  if (locale === "de" && issue.slug && SEASON_2_TITLES_DE[issue.slug]) {
    return SEASON_2_TITLES_DE[issue.slug];
  }
  return issue.title;
}

export function season2IssuePillar(pillar: string, locale: Locale): string {
  if (locale === "de") {
    return SEASON_2_PILLARS_DE[pillar] ?? pillar;
  }
  return pillar;
}
