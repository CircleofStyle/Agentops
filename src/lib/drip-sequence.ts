import { listPublishedIssuesInSequence } from "@/lib/content/storage";

export function isDripSequenceEnabled(): boolean {
  return process.env.DRIP_SEQUENCE_ENABLED !== "false";
}

export function getDripCadenceDays(): number {
  const raw = process.env.DRIP_CADENCE_DAYS;
  if (!raw) return 7;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 7;
}

/** Published playbook slugs in drip order (issue #1 → #N). */
export async function getDripSequenceSlugs(): Promise<string[]> {
  const issues = await listPublishedIssuesInSequence();
  return issues.map((issue) => issue.frontmatter.slug);
}
