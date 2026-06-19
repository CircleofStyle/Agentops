import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateToolLinks } from "@/components/AffiliateToolLinks";
import { GumroadKitCta } from "@/components/GumroadKitCta";
import { IssueEmailGate } from "@/components/IssueEmailGate";
import { issueHasAffiliateTools } from "@/lib/affiliates";
import { markdownToHtml } from "@/lib/content/markdown";
import { getPublishedIssue } from "@/lib/content/storage";
import {
  extractProblemSection,
  extractTeaser,
  isPublicBody,
  isWebVisible,
  issueDescription,
} from "@/lib/content/visibility";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getPublishedIssue(slug);
  if (!issue || !isWebVisible(issue)) return { title: "Issue not found" };

  return {
    title: `${issue.frontmatter.title} — Automate This Week`,
    description: issueDescription(issue),
  };
}

export default async function IssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = await getPublishedIssue(slug);
  if (!issue || !isWebVisible(issue)) notFound();

  const showFullBody = isPublicBody(issue);
  const html = showFullBody ? await markdownToHtml(issue.body) : null;
  const problem = extractProblemSection(issue.body);
  const teaser = problem ?? extractTeaser(issue.body);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />

      <article className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm font-medium text-brand-500 transition hover:text-brand-400"
        >
          ← Automate This Week
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Issue · {issue.frontmatter.date}
            {!showFullBody ? " · Email subscribers" : null}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {issue.frontmatter.title}
          </h1>
          {issue.frontmatter.setupMinutes ? (
            <p className="mt-4 text-sm text-slate-500">
              Estimated setup time: {issue.frontmatter.setupMinutes} minutes
            </p>
          ) : null}
        </header>

        {showFullBody && html ? (
          <div
            className="issue-content mt-10 space-y-4 text-slate-300 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-brand-300 [&_li]:ml-4 [&_li]:list-disc [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <IssueEmailGate teaser={teaser} setupMinutes={issue.frontmatter.setupMinutes} />
        )}

        {showFullBody ? <GumroadKitCta issueSlug={slug} /> : null}

        {showFullBody && issueHasAffiliateTools(slug) ? (
          <>
            <AffiliateToolLinks issueSlug={slug} />
            <AffiliateDisclosure className="mt-6" />
          </>
        ) : null}
      </article>
    </main>
  );
}
