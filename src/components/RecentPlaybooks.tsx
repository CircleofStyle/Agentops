import { PlaybookPreviewCard } from "@/components/PlaybookPreviewCard";
import { listIssues } from "@/lib/content/storage";
import { extractTeaser, isPublicBody, isWebVisible } from "@/lib/content/visibility";

function sortBySequence(issues: Awaited<ReturnType<typeof listIssues>>) {
  return [...issues].sort((a, b) => {
    const aOrder = a.frontmatter.sequenceOrder;
    const bOrder = b.frontmatter.sequenceOrder;
    if (aOrder != null && bOrder != null && aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    if (aOrder != null && bOrder == null) return -1;
    if (aOrder == null && bOrder != null) return 1;
    const aKey = a.frontmatter.publishedAt ?? a.frontmatter.date;
    const bKey = b.frontmatter.publishedAt ?? b.frontmatter.date;
    return aKey.localeCompare(bKey);
  });
}

export async function RecentPlaybooks() {
  const issues = sortBySequence((await listIssues("published")).filter(isWebVisible)).slice(0, 4);

  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 lg:mt-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
          Recent playbooks
        </p>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          See what you&apos;ll build in your first month
        </h2>
        <p className="mt-4 text-slate-400">
          One new workflow every 7 days after you confirm.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {issues.map((issue, index) => (
          <li key={issue.frontmatter.slug}>
            <PlaybookPreviewCard
              issueNumber={issue.frontmatter.sequenceOrder ?? index + 1}
              title={issue.frontmatter.title}
              teaser={extractTeaser(issue.body)}
              slug={issue.frontmatter.slug}
              isSample={isPublicBody(issue)}
              frontmatter={issue.frontmatter}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
