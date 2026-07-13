import { buildGumroadKitLink, resolveKitCheckoutUrl } from "@/lib/gumroad";
import { kitByPlaybookSlug } from "@/lib/kit-catalog";

type KitCtaCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
};

interface GumroadKitCtaProps {
  issueSlug: string;
  /** Locale-aware copy — reuse `dict.seoShell.paidLadder` (Stripe-first; no Gumroad branding). */
  copy: KitCtaCopy;
}

/** Issue-page kit CTA — Stripe-first; component name kept for import stability. */
export function GumroadKitCta({ issueSlug, copy }: GumroadKitCtaProps) {
  const kit = kitByPlaybookSlug(issueSlug);
  if (!kit) return null;

  const kitUrl = resolveKitCheckoutUrl(issueSlug);
  const priceLabel = `€${(kit.priceCents / 100).toFixed(0)}`;
  const ctaLabel = copy.ctaLabel.replace("{price}", priceLabel);

  return (
    <aside
      className="mt-12 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8"
      aria-label={copy.heading}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">{copy.heading}</h2>
      <p className="mt-3 text-slate-400">{copy.body.replace("{price}", priceLabel)}</p>
      {kitUrl ? (
        <a
          href={buildGumroadKitLink(kitUrl, issueSlug)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {ctaLabel}
        </a>
      ) : (
        <span
          aria-disabled="true"
          className="mt-6 inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-500"
        >
          {ctaLabel}
        </span>
      )}
    </aside>
  );
}
