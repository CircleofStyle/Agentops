"use client";

import Link from "next/link";

import { useI18n } from "@/i18n/I18nProvider";
import { localizedPath } from "@/i18n/navigation";

export function LegalFooterLinks() {
  const { locale, dict } = useI18n();
  const t = dict.legal;

  const footerLinks = [
    { href: localizedPath("/season-1", locale), label: t.footerSeason1 },
    { href: localizedPath("/season-2", locale), label: t.footerSeason2 },
    { href: localizedPath("/all-access", locale), label: t.footerAllAccess },
    { href: localizedPath("/issues", locale), label: t.footerPlaybooks },
    { href: localizedPath("/legal#privacy-policy", locale), label: t.footerPrivacy },
    { href: localizedPath("/legal#cookies", locale), label: t.footerCookies },
    { href: localizedPath("/legal#data-protection", locale), label: t.footerDataProtection },
    { href: localizedPath("/legal#terms-of-use", locale), label: t.footerTerms },
  ];

  return (
    <nav
      aria-label="Legal"
      className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
    >
      {footerLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition hover:text-white focus-visible:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
