#!/usr/bin/env tsx
import { generateDraft } from "../src/lib/content/draft-generator";
import { listIssues, publishIssue } from "../src/lib/content/storage";
import { sendPlaybookBroadcast } from "../src/lib/playbook-broadcast";

function parseBroadcastFlags(argv: string[]): {
  slug: string | undefined;
  dryRun: boolean;
  catchUp: boolean;
  testEmail?: string;
} {
  let dryRun = false;
  let catchUp = false;
  let testEmail: string | undefined;
  const positional: string[] = [];

  for (const arg of argv) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--catch-up") catchUp = true;
    else if (arg.startsWith("--test-email=")) testEmail = arg.slice("--test-email=".length);
    else positional.push(arg);
  }

  return { slug: positional[0], dryRun, catchUp, testEmail };
}

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
    case "broadcast": {
      const flags = parseBroadcastFlags(process.argv.slice(3));
      if (!flags.slug) {
        console.error(
          "Usage: pnpm content:broadcast <slug> [--dry-run] [--catch-up] [--test-email=you@example.com]",
        );
        process.exit(1);
      }
      const result = await sendPlaybookBroadcast({
        slug: flags.slug,
        dryRun: flags.dryRun,
        catchUp: flags.catchUp,
        testEmail: flags.testEmail,
      });
      console.log(JSON.stringify(result, null, 2));
      if (result.status === "failed") process.exit(1);
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
      console.error("Commands: draft, publish, broadcast, list");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
