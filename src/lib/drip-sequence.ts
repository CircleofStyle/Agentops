import { listPublishedIssuesInSequence } from "@/lib/content/storage";
import { CROWN_DISCIPLINE_SLUG, FREE_DRIP_ISSUE_COUNT } from "@/lib/season-1";

export function isDripSequenceEnabled(): boolean {
  return process.env.DRIP_SEQUENCE_ENABLED !== "false";
}

export function getDripCadenceDays(): number {
  const raw = process.env.DRIP_CADENCE_DAYS;
  if (!raw) return 7;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 7;
}

/** Published playbook slugs in drip order (issue #1 → #11). Crown is excluded. */
export async function getDripSequenceSlugs(): Promise<string[]> {
  const issues = await listPublishedIssuesInSequence();
  return issues
    .map((issue) => issue.frontmatter.slug)
    .filter((slug) => slug !== CROWN_DISCIPLINE_SLUG)
    .slice(0, FREE_DRIP_ISSUE_COUNT);
}
