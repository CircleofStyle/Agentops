import type { Metadata } from "next";
import Link from "next/link";
import { listIssues } from "@/lib/content/storage";
import { isPublicBody, isWebVisible, issueDescription } from "@/lib/content/visibility";

export const metadata: Metadata = {
  title: "Playbook archive — Automate This Week",
  description:
    "Browse playbook titles and teasers. One free sample on the web; full step-by-step playbooks every Tuesday by email.",
};

export default async function IssuesArchivePage() {
  const issues = (await listIssues("published")).filter(isWebVisible);

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
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Playbook archive
          </h1>
          <p className="mt-4 text-slate-400">
            One free sample includes the full workflow on the web. Every other playbook is
            email-only — this page shows titles and teasers. Subscribe for the complete steps every
            Tuesday.
          </p>
        </header>

        <ul className="mt-12 space-y-6">
          {issues.map((issue) => {
            const publicBody = isPublicBody(issue);
            const description = issueDescription(issue);

            return (
              <li
                key={issue.frontmatter.slug}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                  {issue.frontmatter.date}
                  {!publicBody ? " · Email only" : " · Free sample"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  <Link
                    href={`/issues/${issue.frontmatter.slug}`}
                    className="transition hover:text-brand-400"
                  >
                    {issue.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-3 text-slate-400">{description}</p>
                {issue.frontmatter.setupMinutes ? (
                  <p className="mt-3 text-sm text-slate-500">
                    Setup: ~{issue.frontmatter.setupMinutes} min
                  </p>
                ) : null}
                <Link
                  href={`/issues/${issue.frontmatter.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-brand-500 transition hover:text-brand-400"
                >
                  {publicBody ? "Read the free sample →" : "View teaser · subscribe for full playbook →"}
                </Link>
              </li>
            );
          })}
        </ul>

        {issues.length === 0 ? (
          <p className="mt-12 text-slate-500">No published playbooks yet.</p>
        ) : null}
      </div>
    </main>
  );
}
