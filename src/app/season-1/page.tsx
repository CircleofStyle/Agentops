import type { Metadata } from "next";
import Link from "next/link";
import { AllAccessCta } from "@/components/AllAccessCta";
import { SignupForm } from "@/components/SignupForm";
import {
  SEASON_1_ISSUES,
  SEASON_1_PROMISE,
  SEASON_1_SUBTITLE,
  SEASON_1_TITLE,
  season1Progress,
} from "@/lib/season-1";

export const metadata: Metadata = {
  title: "Season 1 roadmap — Automate This Week",
  description:
    "12 playbooks from inbox triage to reviews — one practical automation every 7 days after you confirm. See the full Season 1 arc.",
};

export default function Season1Page() {
  const { published, total } = season1Progress();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          ← Automate This Week
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            {SEASON_1_TITLE}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {SEASON_1_SUBTITLE}
          </h1>
          <p className="mt-4 text-lg text-slate-400">{SEASON_1_PROMISE}</p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">Progress</p>
          <p className="mt-3 text-2xl font-bold text-white">
            {published} of {total} playbooks published
          </p>
          <p className="mt-2 text-slate-400">
            Free subscribers receive playbooks 1→{total} in order — one every 7 days after you
            confirm. Finish at your pace; the drip keeps going until Season 1 is complete (~12
            weeks).
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">The Season 1 arc</h2>
          <p className="mt-3 text-slate-400">
            Each playbook targets a real operator bottleneck — capture, convert, deliver, and grow —
            using Gmail, Sheets, and Zapier you already have.
          </p>

          <ol className="mt-8 space-y-4">
            {SEASON_1_ISSUES.map((issue) => (
              <li
                key={issue.number}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:flex sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Playbook #{issue.number} · {issue.pillar}
                    {issue.status === "published" ? " · Live" : " · Coming soon"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {issue.slug ? (
                      <Link
                        href={`/issues/${issue.slug}`}
                        className="transition hover:text-brand-400"
                      >
                        {issue.title}
                      </Link>
                    ) : (
                      issue.title
                    )}
                  </h3>
                </div>
                <span
                  className={`mt-3 inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${
                    issue.status === "published"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {issue.status === "published" ? "Published" : "Planned"}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Start your sequence — free</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            Confirm your email and playbook #1 arrives in minutes. The rest follow every 7 days in
            order — no Tuesday blast, no random topics.
          </p>
          <div className="mt-8 flex flex-col items-center">
            <SignupForm />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Can&apos;t wait for the drip?{" "}
            <Link href="/all-access" className="font-medium text-brand-400 hover:text-brand-300">
              Get all access →
            </Link>{" "}
            — every published playbook, immediately.
          </p>
        </section>

        <section className="mt-12 text-center">
          <p className="text-slate-400">Want the full library now?</p>
          <div className="mt-4">
            <AllAccessCta surface="season_1_page" />
          </div>
        </section>
      </div>
    </main>
  );
}
