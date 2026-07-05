import type { SeoShellSlug } from "@/lib/content/seo-shell";

export type SeoShellLink = {
  href: string;
  label: string;
};

const COMMON_LINKS: SeoShellLink[] = [
  { href: "/", label: "Automate This Week home" },
  { href: "/season-1", label: "Season 1 playbook roadmap" },
];

const PAGE_LINKS: Record<SeoShellSlug, SeoShellLink[]> = {
  "auto-triage-customer-emails": [
    { href: "/issues/quote-follow-up-workflow", label: "Quote follow-up automation" },
    { href: "/kits/inbox-triage-kit", label: "Inbox Triage Kit" },
  ],
  "quote-follow-up-workflow": [
    { href: "/issues/auto-triage-customer-emails", label: "Email triage automation" },
    { href: "/issues/google-review-request-workflow", label: "Google review requests" },
    { href: "/kits/quote-follow-up-kit", label: "Quote Follow-Up Kit" },
  ],
  "google-review-request-workflow": [
    { href: "/issues/quote-follow-up-workflow", label: "Quote follow-up automation" },
    { href: "/kits/google-review-request-kit", label: "Google Review Request Kit" },
  ],
  "appointment-reminder-workflow": [
    { href: "/issues/google-review-request-workflow", label: "Google review requests" },
    {
      href: "/issues/multi-channel-appointment-reminders",
      label: "Multi-channel appointment reminders (Season 2)",
    },
  ],
};

export function getSeoShellLinks(slug: SeoShellSlug): SeoShellLink[] {
  return [...COMMON_LINKS, ...PAGE_LINKS[slug]];
}
