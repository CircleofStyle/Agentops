import { listIssues } from "@/lib/content/storage";
import { exportSubscribers } from "@/lib/subscribers";

export type PublicSiteStats = {
  confirmedSubscribers: number;
  publishedWorkflows: number;
};

export async function getPublicSiteStats(): Promise<PublicSiteStats> {
  const [subscribers, issues] = await Promise.all([
    exportSubscribers(),
    listIssues("published"),
  ]);

  return {
    confirmedSubscribers: subscribers.filter((s) => s.status === "confirmed").length,
    publishedWorkflows: issues.length,
  };
}
