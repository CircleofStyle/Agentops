import type { Locale } from "@/i18n/config";
import type { IssueFrontmatter } from "./types";

export type IssueDifficulty = "beginner" | "intermediate" | "advanced";

const DIFFICULTY_LABEL: Record<IssueDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_LABEL_DE: Record<IssueDifficulty, string> = {
  beginner: "Anfänger",
  intermediate: "Mittel",
  advanced: "Fortgeschritten",
};

const DIFFICULTY_EMOJI: Record<IssueDifficulty, string> = {
  beginner: "🟢",
  intermediate: "🟡",
  advanced: "🔴",
};

export function getSetupMinutes(frontmatter: IssueFrontmatter): number | undefined {
  return frontmatter.setupMinutes ?? frontmatter.setupTimeMinutes;
}

export function getDifficultyLabel(
  difficulty: IssueDifficulty | undefined,
  locale: Locale = "en",
): string | undefined {
  if (!difficulty) return undefined;
  const labels = locale === "de" ? DIFFICULTY_LABEL_DE : DIFFICULTY_LABEL;
  return labels[difficulty];
}

export function getDifficultyEmoji(difficulty: IssueDifficulty | undefined): string | undefined {
  return difficulty ? DIFFICULTY_EMOJI[difficulty] : undefined;
}

export function formatToolRequirements(tools: string[] | undefined): string | undefined {
  if (!tools?.length) return undefined;
  return tools.join(" · ");
}

/** One-line metadata strip for emails and compact UI. */
export function formatIssueMetadataLine(frontmatter: IssueFrontmatter): string | undefined {
  const parts: string[] = [];
  const emoji = getDifficultyEmoji(frontmatter.difficulty);
  const label = getDifficultyLabel(frontmatter.difficulty);
  if (emoji && label) parts.push(`${emoji} ${label}`);

  const minutes = getSetupMinutes(frontmatter);
  if (minutes) parts.push(`${minutes} min`);

  const tools = formatToolRequirements(frontmatter.toolRequirements);
  if (tools) parts.push(tools);

  if (frontmatter.roiImpact) parts.push(frontmatter.roiImpact);

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function getWorkflowDiagramUrl(
  frontmatter: IssueFrontmatter,
  siteUrl: string,
): string | undefined {
  const path = frontmatter.workflowDiagram;
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
}

export function getWorkflowDiagramAlt(frontmatter: IssueFrontmatter): string {
  return (
    frontmatter.workflowDiagramAlt ??
    `${frontmatter.title} automation workflow diagram`
  );
}
