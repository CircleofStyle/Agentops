import { buildGumroadKitLink, getGumroadKitUrlForSlug } from "@/lib/gumroad";
import { kitByPlaybookSlug } from "@/lib/kit-catalog";

interface GumroadKitCtaProps {
  issueSlug: string;
}

export function GumroadKitCta({ issueSlug }: GumroadKitCtaProps) {
  const kitUrl = getGumroadKitUrlForSlug(issueSlug);
  if (!kitUrl) return null;

  const kit = kitByPlaybookSlug(issueSlug);
  const href = buildGumroadKitLink(kitUrl, issueSlug);

  return (
    <aside
      className="mt-12 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8"
      aria-label="Optional done-for-you kit"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
        Optional accelerator
      </p>
      <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
        Want the done-for-you kit?
      </h2>
      <p className="mt-3 text-slate-400">
        Zapier export + prompt doc + checklist — €{kit ? (kit.priceCents / 100).toFixed(0) : "19"}.
        The newsletter stays free; this is for teams who want a head start.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        Get the kit on Gumroad
      </a>
    </aside>
  );
}
