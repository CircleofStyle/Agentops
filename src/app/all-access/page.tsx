import type { Metadata } from "next";
import Link from "next/link";
import { AllAccessUnlockForm } from "@/components/AllAccessUnlockForm";
import { GumroadAllAccessCta } from "@/components/GumroadAllAccessCta";

export const metadata: Metadata = {
  title: "All Access Pass — Automate This Week",
  description:
    "Skip the drip — get every published automation playbook immediately with a one-time All Access Pass.",
};

export default function AllAccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          ← Automate This Week
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            All Access Pass
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Skip the wait — get every playbook now
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Same step-by-step workflows. No drip timer. One flat price, yours forever — includes
            future Season 1 playbooks as we publish them.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          <GumroadAllAccessCta />

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
            <p className="font-medium text-slate-300">Free path still available</p>
            <p className="mt-2">
              Subscribe free and receive one playbook every 7 days after you confirm. All Access is
              for teams who want the full library today.
            </p>
          </div>

          <AllAccessUnlockForm />
        </div>
      </div>
    </main>
  );
}
