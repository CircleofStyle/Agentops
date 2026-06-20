import type { IssueDifficulty } from "./metadata";
import type { IssueVisibility } from "./visibility";

export type IssueStatus = "draft" | "published";

export interface IssueFrontmatter {
  title: string;
  date: string;
  status: IssueStatus;
  slug: string;
  topic?: string;
  setupMinutes?: number;
  /** Alias for setupMinutes — CMO copy spec field name. */
  setupTimeMinutes?: number;
  publishedAt?: string;
  /** Explicit order in the signup drip sequence (lower = earlier). */
  sequenceOrder?: number;
  /** `sample` = full body on web; `email-only` = teaser + signup; `archived` = hidden from web. */
  visibility?: IssueVisibility;
  difficulty?: IssueDifficulty;
  roiImpact?: string;
  toolRequirements?: string[];
  /** Public path to PNG workflow diagram, e.g. `/workflow-diagrams/quote-follow-up-workflow.png`. */
  workflowDiagram?: string;
  workflowDiagramAlt?: string;
  /** Override for drip email subject line. */
  emailSubject?: string;
}

export type { IssueDifficulty };

export interface IssueDocument {
  frontmatter: IssueFrontmatter;
  body: string;
  filePath: string;
}
