import Link from "next/link";

const START_HERE_CARDS = [
  {
    label: "Start here · Capture leads",
    title: "Triage customer emails automatically",
    outcome: "Reply to urgent leads in hours, not days",
    setupMinutes: 15,
    cta: "See playbook #1 →",
    href: "/issues/auto-triage-customer-emails",
  },
  {
    label: "Start here · Win more quotes",
    title: "Never forget to follow up on a quote",
    outcome: "Recover silent prospects before they hire someone else",
    setupMinutes: 20,
    cta: "See playbook #2 →",
    href: "/issues/quote-follow-up-workflow",
  },
  {
    label: "Start here · Build social proof",
    title: "Turn finished jobs into Google reviews",
    outcome: "Ask every happy customer — on schedule, not from memory",
    setupMinutes: 25,
    cta: "See playbook #3 →",
    href: "/issues/google-review-request-workflow",
  },
] as const;

export function StartHereCards() {
  return (
    <section className="mt-20 lg:mt-28">
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Start here</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        Pick the bottleneck costing you time this week — each playbook finishes in under 30 minutes.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {START_HERE_CARDS.map((card) => (
          <li key={card.href}>
            <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                {card.label}
              </p>
              <h3 className="mt-3 text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm text-slate-400">{card.outcome}</p>
              <p className="mt-4 text-xs text-slate-500">{card.setupMinutes} min</p>
              <Link
                href={card.href}
                className="mt-4 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
              >
                {card.cta}
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
