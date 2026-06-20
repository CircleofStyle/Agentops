import { buildGumroadAllAccessLink, getGumroadAllAccessUrl } from "@/lib/gumroad";

type GumroadAllAccessCtaProps = {
  surface?: string;
};

export function GumroadAllAccessCta({ surface = "all_access_page" }: GumroadAllAccessCtaProps) {
  const checkoutUrl = getGumroadAllAccessUrl();

  return (
    <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">All Access Pass</p>
      <p className="mt-3 text-3xl font-bold text-white">€49 one-time</p>
      <p className="mt-3 text-slate-400">
        Every published playbook, immediately — plus future Season 1 issues as we ship them.
      </p>
      {checkoutUrl ? (
        <a
          href={buildGumroadAllAccessLink(checkoutUrl, surface)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          Get all access on Gumroad
        </a>
      ) : (
        <p className="mt-6 text-sm text-slate-400">
          Checkout opens soon —{" "}
          <a href="mailto:hello@novarho.com" className="text-brand-400 hover:text-brand-300">
            email us
          </a>{" "}
          for early access.
        </p>
      )}
    </div>
  );
}
