import type { SeoShellSlug } from "@/lib/content/seo-shell";

export type SeoShellLink = {
  href: string;
  label: string;
};

const COMMON_LINKS: SeoShellLink[] = [
  { href: "/", label: "Automate This Week home" },
  { href: "/season-1", label: "Season 1 playbook roadmap" },
];

/** Sibling workflow links only — kits belong in WorkflowPaidLadder (NOV-315). */
const PAGE_LINKS: Record<SeoShellSlug, SeoShellLink[]> = {
  "auto-triage-customer-emails": [
    { href: "/issues/quote-follow-up-workflow", label: "Quote follow-up automation" },
  ],
  "quote-follow-up-workflow": [
    { href: "/issues/auto-triage-customer-emails", label: "Email triage automation" },
    { href: "/issues/google-review-request-workflow", label: "Google review requests" },
  ],
  "google-review-request-workflow": [
    { href: "/issues/quote-follow-up-workflow", label: "Quote follow-up automation" },
  ],
  "appointment-reminder-workflow": [
    { href: "/issues/google-review-request-workflow", label: "Google review requests" },
    {
      href: "/issues/multi-channel-appointment-reminders",
      label: "Multi-channel appointment reminders (Season 2)",
    },
  ],
  "new-lead-welcome-sequence": [
    { href: "/issues/auto-triage-customer-emails", label: "Email triage automation" },
    { href: "/issues/quote-follow-up-workflow", label: "Quote follow-up automation" },
  ],
  "job-completion-checklist": [
    {
      href: "/issues/google-review-request-workflow",
      label: "Google review requests",
    },
    { href: "/issues/referral-ask-workflow", label: "Referral ask workflow" },
  ],
  "referral-ask-workflow": [
    {
      href: "/issues/google-review-request-workflow",
      label: "Google review requests",
    },
    {
      href: "/issues/job-completion-checklist",
      label: "Job completion checklist",
    },
  ],
  "review-response-templates": [
    {
      href: "/issues/google-review-request-workflow",
      label: "Google review requests",
    },
    { href: "/issues/referral-ask-workflow", label: "Referral ask workflow" },
  ],
};

const MAX_RELATED_WORKFLOWS = 3;

export function getSeoShellCommonLinks(): SeoShellLink[] {
  return [...COMMON_LINKS];
}

/** Related `/issues/...` links only (≤3). No kit purchase hrefs. */
export function getSeoShellRelatedWorkflowLinks(slug: SeoShellSlug): SeoShellLink[] {
  return PAGE_LINKS[slug].filter((l) => l.href.startsWith("/issues/")).slice(0, MAX_RELATED_WORKFLOWS);
}

/** @deprecated Prefer getSeoShellRelatedWorkflowLinks + getSeoShellCommonLinks. */
export function getSeoShellLinks(slug: SeoShellSlug): SeoShellLink[] {
  return [...getSeoShellCommonLinks(), ...getSeoShellRelatedWorkflowLinks(slug)];
}
