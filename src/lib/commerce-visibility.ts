import { getCrownDisciplineIssue, SEASON_1_ISSUES } from "@/lib/season-1";

/** Minimum published free playbooks before marketing surfaces show All Access checkout. */
export const ALL_ACCESS_COMMERCE_MIN_PUBLISHED = 5;

function countPublishedFreePlaybooks(): number {
  return SEASON_1_ISSUES.filter((issue) => !issue.paidOnly && issue.status === "published")
    .length;
}

/** Crown checkout/unlock UI — only when playbook #12 content is published. */
export function isCrownCommerceVisible(): boolean {
  return getCrownDisciplineIssue().status === "published";
}

/** All Access checkout in marketing surfaces — only when enough free playbooks ship value. */
export function isAllAccessCommerceVisible(): boolean {
  return countPublishedFreePlaybooks() >= ALL_ACCESS_COMMERCE_MIN_PUBLISHED;
}
