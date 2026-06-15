import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsor Automate This Week — Founding rate €99",
  description:
    "Reach 1–10 person service businesses with a transparent sponsored mention in Automate This Week. Founding sponsor slots from €99/issue.",
  openGraph: {
    title: "Sponsor Automate This Week",
    description:
      "Logo + 80-word blurb + tracked link in one weekly automation playbook. Founding rate €99 before we hit 50 subscribers.",
    type: "website",
  },
};

const SPONSOR_EMAIL = "hello@automatethisweek.com";
const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("Founding Sponsor")}`;

const INCLUDED = [
  "Logo + 80-word blurb + tracked link in one issue",
  "Clearly labeled \"Sponsored\" — transparent, not native-ad disguise",
  "One sponsor maximum per issue",
  "Audience: 1–10 person service businesses learning practical automation",
];

const EXCLUDED = [
  "Crypto and speculative finance",
  "MLM and get-rich-quick offers",
  "Generic AI wrappers with no concrete workflow",
  "Urgency theater and manufactured scarcity",
];

export default function SponsorsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          ← Automate This Week
        </Link>

        <header className="mt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Sponsorship
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Reach service businesses who actually implement automations
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Automate This Week is a weekly playbook newsletter for 1–10 person service
            businesses. Each issue is one practical automation you can finish in under an hour — no
            AI hype, no founder personal brand.
          </p>
        </header>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-brand-500/40 bg-slate-900/60 p-6 shadow-xl shadow-brand-500/10 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
              Founding sponsor
            </p>
            <p className="mt-4 text-4xl font-bold text-white">
              €99
              <span className="text-lg font-normal text-slate-400"> / issue</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Issues #3–#5 · 3 slots available at founding rate
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
              <li>Rate locked before we hit 50 subscribers</li>
              <li>Then increases to €150/issue</li>
              <li>No slot booked until payment received</li>
            </ul>
            <a
              href={SPONSOR_MAILTO}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
            >
              Hold a founding slot
            </a>
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Standard slot
            </p>
            <p className="mt-4 text-4xl font-bold text-white">
              €150–300
              <span className="text-lg font-normal text-slate-400"> / issue</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              After founding slots fill or at 50+ subscribers
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
              <li>Same placement: logo, blurb, tracked link</li>
              <li>One sponsor maximum per issue</li>
              <li>Pricing scales with list size and issue performance</li>
            </ul>
            <a
              href={`mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("Sponsor inquiry")}`}
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-500 hover:text-brand-400"
            >
              Ask about standard slots
            </a>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">What&apos;s included</h2>
          <ul className="mt-6 space-y-3 text-slate-300">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">What we won&apos;t sponsor</h2>
          <ul className="mt-6 space-y-3 text-slate-400">
            {EXCLUDED.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 text-center sm:p-8">
          <h2 className="text-xl font-bold text-white">See a sample issue</h2>
          <p className="mt-3 text-slate-400">
            Issue #1 walks readers through Zapier inbox triage — the kind of practical workflow our
            audience implements.
          </p>
          <Link
            href="/issues/auto-triage-customer-emails"
            className="mt-6 inline-flex text-sm font-semibold text-brand-500 transition hover:text-brand-400"
          >
            Read: Auto-triage customer emails →
          </Link>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Questions or booking</p>
          <a
            href={SPONSOR_MAILTO}
            className="mt-4 inline-block text-lg font-semibold text-brand-400 transition hover:text-brand-300"
          >
            {SPONSOR_EMAIL}
          </a>
          <p className="mt-2 text-sm text-slate-500">
            Subject line: &ldquo;Founding Sponsor&rdquo; · We reply within 2 business days
          </p>
        </section>
      </div>
    </main>
  );
}
