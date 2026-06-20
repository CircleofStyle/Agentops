import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
          Automate This Week
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">You&apos;re in — check your inbox</h1>
        <p className="mt-4 text-slate-400">
          Issue #1 — auto-triage customer emails — is on its way. Expect 2–5 hours saved per week
          once it&apos;s live. The next playbook follows in 7 days.{" "}
          <Link href="/season-1" className="text-brand-400 hover:text-brand-300">
            See your Season 1 roadmap
          </Link>{" "}
          or read the{" "}
          <Link
            href="/issues/auto-triage-customer-emails"
            className="text-brand-400 hover:text-brand-300"
          >
            free sample
          </Link>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
