/**
 * Offline verification for Gumroad webhook helpers (no HTTP server).
 * Usage: pnpm verify:gumroad
 */
import {
  classifyGumroadSale,
  isAllAccessGumroadSale,
  isCrownDisciplineGumroadSale,
  isGumroadRefund,
  normalizeGumroadSale,
  type GumroadSalePayload,
} from "../src/lib/gumroad-webhook";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

function assertSale(data: Record<string, string>): GumroadSalePayload {
  const sale = normalizeGumroadSale(data);
  assert(sale !== null, "sale parsed");
  return sale;
}

process.env.GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK = "all-access-pass";
process.env.GUMROAD_CROWN_PRODUCT_PERMALINK = "crown-discipline";

const sale = assertSale({
  email: "buyer@example.com",
  sale_id: "sale_123",
  product_permalink: "all-access-pass",
  refunded: "false",
});

assert(sale.email === "buyer@example.com", "normalize sale email");
assert(isAllAccessGumroadSale(sale), "all-access product match");
assert(classifyGumroadSale(sale) === "all_access", "classify all-access");
assert(!isCrownDisciplineGumroadSale(sale), "not crown sale");
assert(!isGumroadRefund(sale), "non-refund sale");

const otherProduct = assertSale({
  email: "buyer@example.com",
  sale_id: "sale_456",
  product_permalink: "inbox-triage-kit",
});
assert(classifyGumroadSale(otherProduct) === "unknown", "ignore kit product");
assert(!isAllAccessGumroadSale(otherProduct), "ignore kit product");

const crownSale = assertSale({
  email: "buyer@example.com",
  sale_id: "sale_crown",
  product_permalink: "crown-discipline",
});
assert(isCrownDisciplineGumroadSale(crownSale), "crown product match");
assert(classifyGumroadSale(crownSale) === "crown", "classify crown");
assert(!isAllAccessGumroadSale(crownSale), "crown is not all-access");

const refund = assertSale({
  email: "buyer@example.com",
  sale_id: "sale_789",
  product_permalink: "all-access-pass",
  refunded: "true",
});
assert(isGumroadRefund(refund), "refund detection");

console.log("PASS: gumroad webhook verification");
