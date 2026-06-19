import type { IssueVisibility } from "./visibility";

export type IssueStatus = "draft" | "published";

export interface IssueFrontmatter {
  title: string;
  date: string;
  status: IssueStatus;
  slug: string;
  topic?: string;
  setupMinutes?: number;
  publishedAt?: string;
  /** `sample` = full body on web; `email-only` = teaser + signup; `archived` = hidden from web. */
  visibility?: IssueVisibility;
}

export interface IssueDocument {
  frontmatter: IssueFrontmatter;
  body: string;
  filePath: string;
}
