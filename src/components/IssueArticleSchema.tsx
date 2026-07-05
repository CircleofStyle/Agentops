import type { IssueDocument } from "@/lib/content/types";
import { getWorkflowDiagramUrl } from "@/lib/content/metadata";
import { issueDescription } from "@/lib/content/visibility";
import type { Locale } from "@/i18n/config";
import { issuePageUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/resend";

type IssueArticleSchemaProps = {
  issue: IssueDocument;
  locale: Locale;
};

export function IssueArticleSchema({ issue, locale }: IssueArticleSchemaProps) {
  const siteUrl = getSiteUrl();
  const url = issuePageUrl(issue.frontmatter.slug, locale);
  const description = issueDescription(issue);
  const image = getWorkflowDiagramUrl(issue.frontmatter, siteUrl);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.frontmatter.title,
    description,
    url,
    datePublished: issue.frontmatter.publishedAt ?? issue.frontmatter.date,
    author: {
      "@type": "Organization",
      name: "Automate This Week",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Automate This Week",
      url: siteUrl,
    },
  };

  if (image) {
    schema.image = image;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
