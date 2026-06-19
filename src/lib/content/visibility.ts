import type { IssueDocument, IssueFrontmatter } from "./types";

export type IssueVisibility = "sample" | "email-only" | "archived";

export function resolveVisibility(frontmatter: IssueFrontmatter): IssueVisibility {
  return frontmatter.visibility ?? "email-only";
}

export function isArchived(issue: IssueDocument): boolean {
  return resolveVisibility(issue.frontmatter) === "archived";
}

export function isPublicBody(issue: IssueDocument): boolean {
  return resolveVisibility(issue.frontmatter) === "sample";
}

export function isWebVisible(issue: IssueDocument): boolean {
  return !isArchived(issue);
}

export function extractTeaser(body: string, maxSentences = 2): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#"));

  const first = paragraphs[0] ?? "";
  const sentences = first.match(/[^.!?]+[.!?]+/g) ?? [first];
  return sentences
    .slice(0, maxSentences)
    .join(" ")
    .trim();
}

export function extractProblemSection(body: string): string | null {
  const match = body.match(/^## The problem\s*\n+([\s\S]*?)(?=\n## |\s*$)/m);
  if (!match) return null;
  return match[1].trim();
}

export function issueDescription(issue: IssueDocument): string {
  const problem = extractProblemSection(issue.body);
  if (problem) return problem.slice(0, 160);
  return extractTeaser(issue.body).slice(0, 160);
}
