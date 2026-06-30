import type { IssueFrontmatter } from "@/lib/content/types";
import type { Locale } from "@/i18n/config";
import {
  formatIssueMetadataLine,
  formatToolRequirements,
  getDifficultyEmoji,
  getDifficultyLabel,
  getSetupMinutes,
} from "@/lib/content/metadata";

interface IssueMetadataBadgesProps {
  frontmatter: IssueFrontmatter;
  className?: string;
  locale?: Locale;
}

export function IssueMetadataBadges({
  frontmatter,
  className = "",
  locale = "en",
}: IssueMetadataBadgesProps) {
  const minutes = getSetupMinutes(frontmatter);
  const difficultyLabel = getDifficultyLabel(frontmatter.difficulty, locale);
  const difficultyEmoji = getDifficultyEmoji(frontmatter.difficulty);
  const tools = formatToolRequirements(frontmatter.toolRequirements);
  const minLabel = locale === "de" ? "Min." : "min";

  if (!minutes && !difficultyLabel && !tools && !frontmatter.roiImpact) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {difficultyLabel ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-200">
          <span aria-hidden>{difficultyEmoji}</span>
          {difficultyLabel}
        </span>
      ) : null}
      {minutes ? (
        <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-200">
          ~{minutes} {minLabel}
        </span>
      ) : null}
      {tools ? (
        <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300">
          {tools}
        </span>
      ) : null}
      {frontmatter.roiImpact ? (
        <span className="inline-flex items-center rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-300">
          {frontmatter.roiImpact}
        </span>
      ) : null}
    </div>
  );
}

/** Screen-reader friendly one-line summary matching email metadata strip. */
export function IssueMetadataSummary({ frontmatter }: IssueMetadataBadgesProps) {
  const line = formatIssueMetadataLine(frontmatter);
  if (!line) return null;
  return <p className="sr-only">{line}</p>;
}
