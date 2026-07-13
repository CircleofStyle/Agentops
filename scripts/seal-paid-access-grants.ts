/**
 * Seal paid-access grants from data/subscribers.json for durable production restore.
 * Usage: CONTENT_PIPELINE_SECRET=... pnpm tsx scripts/seal-paid-access-grants.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { sealPaidAccessGrants, type SealedPaidAccessGrant } from "../src/lib/paid-access-sealed";

const secret =
  process.env.PAID_ACCESS_SEAL_SECRET?.trim() ||
  process.env.CONTENT_PIPELINE_SECRET?.trim() ||
  process.env.METRICS_SECRET?.trim();

if (!secret) {
  console.error("FAIL: set CONTENT_PIPELINE_SECRET (or PAID_ACCESS_SEAL_SECRET)");
  process.exit(1);
}

const src = process.env.SUBSCRIBERS_FILE || "data/subscribers.json";
const subscribers = JSON.parse(readFileSync(src, "utf8")) as Array<Record<string, unknown>>;

const grants: SealedPaidAccessGrant[] = [];
for (const record of subscribers) {
  const email = String(record.email || "").toLowerCase();
  if (!email) continue;
  const allAccess = Boolean(record.allAccess);
  const crownAccess = Boolean(record.crownAccess);
  if (!allAccess && !crownAccess) continue;
  let source = (record.allAccessSource || record.crownAccessSource || "manual") as string;
  if (source !== "gumroad" && source !== "code" && source !== "manual") source = "manual";
  grants.push({
    email,
    allAccess,
    crownAccess,
    source: source as SealedPaidAccessGrant["source"],
    grantedAt:
      (record.allAccessGrantedAt as string | undefined) ||
      (record.crownAccessGrantedAt as string | undefined),
  });
}

if (grants.length === 0) {
  console.error("FAIL: no paid-access grants found");
  process.exit(1);
}

const out = process.env.SEALED_OUT || "content/paid-access-grants.sealed.json";
mkdirSync(path.dirname(out), { recursive: true });
const payload = sealPaidAccessGrants(grants, secret);
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
console.error(`Wrote ${out} with ${grants.length} grants (sealed)`);
