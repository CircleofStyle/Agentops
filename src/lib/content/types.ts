export type IssueStatus = "draft" | "published";

export interface IssueFrontmatter {
  title: string;
  date: string;
  status: IssueStatus;
  slug: string;
  topic?: string;
  setupMinutes?: number;
  publishedAt?: string;
}

export interface IssueDocument {
  frontmatter: IssueFrontmatter;
  body: string;
  filePath: string;
}
