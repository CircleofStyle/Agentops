import type { Locale } from "@/i18n/config";

export type TransactionalEmailCopy = {
  verificationSubject: string;
  verificationIntro: string;
  verificationCta: string;
  verificationLinkLabel: string;
  welcomeSubject: string;
  welcomeTitle: string;
  welcomeBody: string;
  welcomeSequence: string;
  welcomeSeasonLink: string;
  welcomeSignoff: string;
  playbookBrand: string;
  playbookDiagramReady: string;
  playbookDiagramSoon: string;
  playbookOpenCta: string;
  playbookCopyLink: string;
  playbookUnsubscribe: string;
  playbookOptOutReply: string;
  playbookToolsPrefix: string;
  playbookRoiPrefix: string;
  pb3ReferralPs: string;
  subscribeAlreadyConfirmed: string;
  subscribeSuccess: string;
  subscribeNoResend: string;
};

const en: TransactionalEmailCopy = {
  verificationSubject: "Confirm your Automate This Week subscription",
  verificationIntro:
    "Thanks for signing up! Confirm your email to get your first automation playbook — step-by-step, no coding required.",
  verificationCta: "Confirm subscription",
  verificationLinkLabel: "Or copy this link:",
  welcomeSubject: "You're in — your playbook sequence starts now",
  welcomeTitle: "You're confirmed!",
  welcomeBody:
    "Welcome to Automate This Week. Your personal playbook sequence starts now — Issue #1 (auto-triage customer emails) arrives in the next few minutes.",
  welcomeSequence:
    "You'll receive playbooks 1→12 in order, one every 7 days. Each saves 2–5 hours per week once live. Every step uses tools you already have — finish in under 30 minutes, no dev team.",
  welcomeSeasonLink: "See the full Season 1 roadmap →",
  welcomeSignoff: "— The NovaRho team",
  playbookBrand: "Automate This Week",
  playbookDiagramReady: "See the workflow diagram below — or follow the step-by-step.",
  playbookDiagramSoon: "Workflow diagram coming soon — text steps below are complete.",
  playbookOpenCta: "Open full playbook →",
  playbookCopyLink: "Or copy this link:",
  playbookUnsubscribe: "Unsubscribe",
  playbookOptOutReply: "Reply to this email to opt out.",
  playbookToolsPrefix: "Tools:",
  playbookRoiPrefix: "ROI:",
  pb3ReferralPs:
    "P.S. Know someone who'd use this? Forward this email — signup link:",
  subscribeAlreadyConfirmed: "You're already subscribed. Check your inbox for the latest issue.",
  subscribeSuccess:
    "Check your inbox to confirm — your first automation playbook arrives right after.",
  subscribeNoResend:
    "Subscription recorded. Configure RESEND_API_KEY to enable confirmation emails.",
};

const de: TransactionalEmailCopy = {
  verificationSubject: "Bestätige dein Automate-This-Week-Abo",
  verificationIntro:
    "Danke für deine Anmeldung! Bestätige deine E-Mail, um dein erstes Automatisierungs-Playbook zu erhalten — Schritt für Schritt, ohne Programmieren.",
  verificationCta: "Abo bestätigen",
  verificationLinkLabel: "Oder kopiere diesen Link:",
  welcomeSubject: "Du bist dabei — deine Playbook-Serie startet jetzt",
  welcomeTitle: "Bestätigt!",
  welcomeBody:
    "Willkommen bei Automate This Week. Deine persönliche Playbook-Serie startet jetzt — Playbook #1 (Kunden-E-Mails automatisch sortieren) kommt in den nächsten Minuten.",
  welcomeSequence:
    "Du erhältst die Playbooks 1→12 der Reihe nach, eines alle 7 Tage. Jedes spart 2–5 Stunden pro Woche, sobald es läuft. Jeder Schritt nutzt Tools, die du schon hast — in unter 30 Minuten fertig, ohne Entwicklerteam.",
  welcomeSeasonLink: "Übersicht Serie 1 ansehen →",
  welcomeSignoff: "— Das NovaRho-Team",
  playbookBrand: "Automate This Week",
  playbookDiagramReady:
    "Sieh das Workflow-Diagramm unten — oder folge den Schritt-für-Schritt-Anleitungen.",
  playbookDiagramSoon:
    "Workflow-Diagramm folgt bald — die Textschritte unten sind vollständig.",
  playbookOpenCta: "Ganzes Playbook öffnen →",
  playbookCopyLink: "Oder kopiere diesen Link:",
  playbookUnsubscribe: "Abmelden",
  playbookOptOutReply: "Antworte auf diese E-Mail, um dich abzumelden.",
  playbookToolsPrefix: "Tools:",
  playbookRoiPrefix: "ROI:",
  pb3ReferralPs:
    "P.S. Kennst du jemanden, dem das hilft? Leite diese E-Mail weiter — Anmeldelink:",
  subscribeAlreadyConfirmed:
    "Du bist bereits angemeldet. Prüfe dein Postfach für die neueste Ausgabe.",
  subscribeSuccess:
    "Prüfe dein Postfach zur Bestätigung — dein erstes Automatisierungs-Playbook folgt direkt danach.",
  subscribeNoResend:
    "Anmeldung gespeichert. Konfiguriere RESEND_API_KEY, um Bestätigungs-E-Mails zu aktivieren.",
};

const copyByLocale: Record<Locale, TransactionalEmailCopy> = { en, de };

export function getTransactionalEmailCopy(locale: Locale = "en"): TransactionalEmailCopy {
  return copyByLocale[locale] ?? en;
}
