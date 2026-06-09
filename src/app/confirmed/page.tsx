import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
          AgentOps Brief
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">You&apos;re subscribed!</h1>
        <p className="mt-4 text-slate-400">
          Your email is confirmed. Watch your inbox for the next playbook.
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
