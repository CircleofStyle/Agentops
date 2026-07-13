/**
 * Guardrail: DE UI must not ship hardcoded English chrome or stale Gumroad CTA branding.
 * Complements verify-de-locale-flow.ts (subscriber/email path) with static source checks.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import de from "../src/i18n/dictionaries/de";
import en from "../src/i18n/dictionaries/en";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const FORBIDDEN_LITERALS = [
  "Tools for this playbook",
  "Sign up through these links to implement the workflow",
  "Get the kit on Gumroad",
  "Get all access on Gumroad",
  "Enter the email from your Gumroad receipt",
  "Playbook #12 · Gumroad purchase",
  "Use the same address as your Gumroad checkout",
];

const SCAN_ROOTS = ["src/components", "src/app"];

function walkTsxFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTsxFiles(full, out);
      continue;
    }
    if (name.endsWith(".tsx") || name.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

function main(): void {
  assert(
    de.affiliate.toolsHeading !== en.affiliate.toolsHeading,
    "de.affiliate.toolsHeading must differ from English",
  );
  assert(
    de.affiliate.toolsBody.includes("Workflow") || de.affiliate.toolsBody.includes("Links"),
    "de.affiliate.toolsBody should be German",
  );
  assert(
    !/gumroad/i.test(de.seoShell.paidLadder.ctaLabel),
    "de paidLadder CTA must not mention Gumroad",
  );
  assert(
    !/gumroad/i.test(en.seoShell.paidLadder.ctaLabel),
    "en paidLadder CTA must not mention Gumroad",
  );
  assert(
    !/gumroad/i.test(de.kits.checkoutCta) && !/gumroad/i.test(en.kits.checkoutCta),
    "kits.checkoutCta must not mention Gumroad",
  );
  assert(
    !/gumroad/i.test(de.allAccess.unlockBody) && !/gumroad/i.test(en.allAccess.unlockBody),
    "unlock body must be provider-agnostic (no Gumroad)",
  );
  assert(
    !/gumroad/i.test(de.crown.purchaseNote) && !/gumroad/i.test(en.crown.purchaseNote),
    "crown.purchaseNote must not mention Gumroad",
  );
  assert(
    de.allAccess.unlockTitle !== en.allAccess.unlockTitle,
    "de allAccess unlockTitle must be localized",
  );
  assert(de.crown.unlockTitle !== en.crown.unlockTitle, "de crown unlockTitle must be localized");

  const files = SCAN_ROOTS.flatMap((root) => walkTsxFiles(root));
  const hits: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const literal of FORBIDDEN_LITERALS) {
      if (text.includes(literal)) {
        hits.push(`${file}: "${literal}"`);
      }
    }
  }

  assert(hits.length === 0, `forbidden hardcoded UI strings:\n  - ${hits.join("\n  - ")}`);

  console.log("DE UI hardcode / Gumroad branding guard OK");
  console.log(`  scanned ${files.length} files`);
  console.log(`  affiliate DE heading: ${de.affiliate.toolsHeading}`);
  console.log(`  paidLadder EN CTA: ${en.seoShell.paidLadder.ctaLabel}`);
}

main();
