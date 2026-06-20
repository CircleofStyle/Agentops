import Link from "next/link";
import { RecentPlaybooks } from "@/components/RecentPlaybooks";
import { SignupForm } from "@/components/SignupForm";
import { SocialProofBlock } from "@/components/SocialProofBlock";
import { StartHereCards } from "@/components/StartHereCards";

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
            Save 2–5 hours every week
            <span className="block text-brand-500">
              with one automation you can build in under 30 minutes
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Step-by-step playbooks for Gmail, Sheets, and Zapier — no coding, no consultants, no
            hype. Your first one lands in minutes after you confirm; the next follows every 7 days.
          </p>
        </header>

        <section className="mt-12 flex flex-col items-center gap-8 lg:mt-16">
          <SignupForm />
        </section>

        <SocialProofBlock />

        <StartHereCards />

        <RecentPlaybooks />

        <section className="mt-20 lg:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
              Season 1
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              12 playbooks from inbox triage to reviews — one every 7 days
            </h2>
            <p className="mt-4 text-slate-400">
              A visible arc, not random topics. You&apos;ll receive playbooks 1→12 in order after
              you confirm — finish at your pace while the drip keeps going.
            </p>
            <Link
              href="/season-1"
              className="mt-6 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
            >
              See the full Season 1 list →
            </Link>
          </div>
        </section>

        <p className="mt-12 text-center lg:mt-16">
          <Link
            href="/issues"
            className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
          >
            Browse all playbooks →
          </Link>
        </p>
      </div>
    </main>
  );
}
