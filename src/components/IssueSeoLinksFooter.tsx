import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { SeoShellSlug } from "@/lib/content/seo-shell";
import { getSeoShellLinks } from "@/lib/seo-shell-links";

type IssueSeoLinksFooterProps = {
  slug: SeoShellSlug;
  locale: Locale;
  heading: string;
};

export function IssueSeoLinksFooter({ slug, locale, heading }: IssueSeoLinksFooterProps) {
  const links = getSeoShellLinks(slug);

  return (
    <nav
      className="mt-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm"
      aria-label={heading}
    >
      <p className="font-medium text-slate-300">{heading}</p>
      <ul className="mt-4 space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={localizedPath(href, locale)}
              className="text-brand-500 transition hover:text-brand-400"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
