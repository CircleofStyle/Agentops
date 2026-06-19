import Link from "next/link";

export function SampleIssuePreview() {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
        Free sample · Issue #1
      </p>
      <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
        Auto-triage customer emails with a 15-minute Zapier + GPT workflow
      </h2>
      <p className="mt-4 text-slate-400">
        Most small shops lose leads in a shared inbox. This playbook routes urgent
        requests, drafts replies, and logs everything — without hiring ops.
      </p>
      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        <li className="flex gap-2">
          <span className="text-brand-500">→</span>
          <span>Trigger: new email in Gmail shared label</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-500">→</span>
          <span>Classify intent (quote, support, spam) with a structured prompt</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-500">→</span>
          <span>Route to Slack + draft reply in your tone</span>
        </li>
      </ul>
      <p className="mt-6 text-xs text-slate-500">Estimated setup time: 15 minutes</p>
      <Link
        href="/issues/auto-triage-customer-emails"
        className="mt-6 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
      >
        Read the free sample →
      </Link>
    </article>
  );
}
