import Link from "next/link";
import { SampleIssuePreview } from "@/components/SampleIssuePreview";
import { SignupForm } from "@/components/SignupForm";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Automate This Week
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Automate one workflow this week
            <span className="block text-brand-500">for service businesses without a dev team</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Read one free sample on the site. Subscribers get the full copy-paste playbook every
            Tuesday by email — Gmail, Sheets, Slack, or Zapier, usually under 30 minutes.
          </p>
        </header>

        <section className="mt-12 flex flex-col items-center gap-8 lg:mt-16">
          <SignupForm />
        </section>

        <section className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              What you get every week
            </h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm text-brand-500">
                  1
                </span>
                <span>
                  <strong className="text-white">One workflow</strong> — copy-paste steps with
                  tools you already use (Gmail, Sheets, Slack, Zapier).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm text-brand-500">
                  2
                </span>
                <span>
                  <strong className="text-white">Time estimate</strong> — every issue ships with
                  a realistic setup time, usually under 30 minutes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm text-brand-500">
                  3
                </span>
                <span>
                  <strong className="text-white">In your inbox</strong> — full playbooks arrive
                  every Tuesday by email. The site shows one free sample and short teasers.
                </span>
              </li>
            </ul>
          </div>

          <SampleIssuePreview />
        </section>

        <p className="mt-12 text-center lg:mt-16">
          <Link
            href="/issues"
            className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
          >
            Browse playbook archive →
          </Link>
        </p>

      </div>
    </main>
  );
}
