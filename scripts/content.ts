#!/usr/bin/env tsx
import { generateDraft } from "../src/lib/content/draft-generator";
import { listIssues, publishIssue } from "../src/lib/content/storage";

async function main() {
  const [command, arg] = process.argv.slice(2);

  switch (command) {
    case "draft": {
      if (!arg) {
        console.error("Usage: pnpm content:draft \"<topic prompt>\"");
        process.exit(1);
      }
      const doc = await generateDraft(arg);
      console.log(`Created draft: ${doc.frontmatter.slug}`);
      console.log(`  file: ${doc.filePath}`);
      console.log(`  status: ${doc.frontmatter.status}`);
      break;
    }
    case "publish": {
      if (!arg) {
        console.error("Usage: pnpm content:publish <slug>");
        process.exit(1);
      }
      const doc = await publishIssue(arg);
      console.log(`Published: ${doc.frontmatter.slug}`);
      console.log(`  publishedAt: ${doc.frontmatter.publishedAt}`);
      break;
    }
    case "list": {
      const status = arg === "draft" || arg === "published" ? arg : undefined;
      const issues = await listIssues(status);
      if (issues.length === 0) {
        console.log("No issues found.");
        break;
      }
      for (const issue of issues) {
        console.log(
          `${issue.frontmatter.status.padEnd(9)} ${issue.frontmatter.slug} — ${issue.frontmatter.title}`,
        );
      }
      break;
    }
    default:
      console.error("Commands: draft, publish, list");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
