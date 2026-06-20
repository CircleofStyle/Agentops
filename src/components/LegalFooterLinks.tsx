import Link from "next/link";

const footerLinks = [
  { href: "/season-1", label: "Season 1" },
  { href: "/all-access", label: "All access" },
  { href: "/issues", label: "Playbooks" },
  { href: "/legal#privacy-policy", label: "Privacy policy" },
  { href: "/legal#cookies", label: "Cookies" },
  { href: "/legal#data-protection", label: "Data protection" },
  { href: "/legal#terms-of-use", label: "Terms of use" },
];

export function LegalFooterLinks() {
  return (
    <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
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
