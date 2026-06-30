import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { IssueDocument, IssueFrontmatter, IssueStatus } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "issues");

function localeContentDir(locale: Locale): string {
  if (locale === defaultLocale) return CONTENT_DIR;
  return path.join(CONTENT_DIR, locale);
}

function issuePath(slug: string, locale: Locale = defaultLocale): string {
  return path.join(localeContentDir(locale), `${slug}.md`);
}

function parseFile(filePath: string, raw: string): IssueDocument {
  const { data, content } = matter(raw);
  const frontmatter = data as IssueFrontmatter;

  if (!frontmatter.title || !frontmatter.slug || !frontmatter.status) {
    throw new Error(`Invalid frontmatter in ${filePath}`);
  }

  return { frontmatter, body: content.trim(), filePath };
}

export async function ensureContentDir(): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
}

async function listIssuesFromDir(
  dir: string,
  status?: IssueStatus,
): Promise<IssueDocument[]> {
  await fs.mkdir(dir, { recursive: true });

  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const docs: IssueDocument[] = [];
  for (const entry of entries.filter((f) => f.endsWith(".md"))) {
    const filePath = path.join(dir, entry);
    const raw = await fs.readFile(filePath, "utf8");
    const doc = parseFile(filePath, raw);
    if (!status || doc.frontmatter.status === status) {
      docs.push(doc);
    }
  }

  return docs.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export async function listIssues(
  status?: IssueStatus,
  locale: Locale = defaultLocale,
): Promise<IssueDocument[]> {
  await ensureContentDir();
  const canonical = await listIssuesFromDir(CONTENT_DIR, status);
  if (locale === defaultLocale) return canonical;

  const localized = await Promise.all(
    canonical.map(async (issue) => {
      const doc = await getIssueBySlug(issue.frontmatter.slug, locale);
      return doc ?? issue;
    }),
  );
  return localized;
}

/** Published playbooks in drip order (issue #1 → #N), oldest first. */
export async function listPublishedIssuesInSequence(): Promise<IssueDocument[]> {
  const published = await listIssues("published");
  return published.sort((a, b) => {
    const aKey = a.frontmatter.publishedAt ?? a.frontmatter.date;
    const bKey = b.frontmatter.publishedAt ?? b.frontmatter.date;
    return aKey.localeCompare(bKey);
  });
}

export async function getIssueBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<IssueDocument | null> {
  if (locale !== defaultLocale) {
    const localizedPath = issuePath(slug, locale);
    try {
      const raw = await fs.readFile(localizedPath, "utf8");
      return parseFile(localizedPath, raw);
    } catch {
      // fall through to default locale
    }
  }

  const filePath = issuePath(slug, defaultLocale);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parseFile(filePath, raw);
  } catch {
    return null;
  }
}

export async function getPublishedIssue(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<IssueDocument | null> {
  const doc = await getIssueBySlug(slug, locale);
  if (!doc || doc.frontmatter.status !== "published") return null;
  return doc;
}

function serializeIssue(frontmatter: IssueFrontmatter, body: string): string {
  return matter.stringify(body, frontmatter);
}

export async function writeIssue(
  frontmatter: IssueFrontmatter,
  body: string,
): Promise<IssueDocument> {
  await ensureContentDir();
  const filePath = issuePath(frontmatter.slug);
  await fs.writeFile(filePath, serializeIssue(frontmatter, body), "utf8");
  return { frontmatter, body, filePath };
}

export async function publishIssue(slug: string): Promise<IssueDocument> {
  const doc = await getIssueBySlug(slug);
  if (!doc) {
    throw new Error(`Issue not found: ${slug}`);
  }
  if (doc.frontmatter.status === "published") {
    return doc;
  }

  const frontmatter: IssueFrontmatter = {
    ...doc.frontmatter,
    status: "published",
    publishedAt: new Date().toISOString().slice(0, 10),
  };

  return writeIssue(frontmatter, doc.body);
}
