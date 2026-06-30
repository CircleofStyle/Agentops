import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  classifyGumroadSale,
  isGumroadRefund,
  normalizeGumroadSale,
  parseGumroadWebhookPayload,
  verifyGumroadWebhookSecret,
} from "@/lib/gumroad-webhook";
import {
  grantAllAccess,
  grantCrownAccess,
  revokeAllAccess,
  revokeCrownAccess,
} from "@/lib/subscribers";

export async function POST(request: Request) {
  if (!verifyGumroadWebhookSecret(request)) {
    logger.warn("Gumroad webhook rejected", { reason: "invalid_secret" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: Record<string, string>;
  try {
    data = await parseGumroadWebhookPayload(request);
  } catch (error) {
    logger.warn("Gumroad webhook parse failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sale = normalizeGumroadSale(data);
  if (!sale) {
    return NextResponse.json({ error: "Missing required sale fields" }, { status: 400 });
  }

  const productKind = classifyGumroadSale(sale);
  if (productKind === "unknown") {
    logger.info("Gumroad webhook ignored", {
      reason: "unknown_product",
      sale_id: sale.sale_id,
      product_permalink: sale.product_permalink,
    });
    return NextResponse.json({ ok: true, ignored: "unknown_product" });
  }

  if (isGumroadRefund(sale)) {
    if (productKind === "crown") {
      await revokeCrownAccess(sale.email);
      logger.info("Crown access revoked from Gumroad refund", {
        email: sale.email,
        sale_id: sale.sale_id,
      });
      return NextResponse.json({ ok: true, action: "crown_revoked" });
    }

    await revokeAllAccess(sale.email);
    logger.info("All access revoked from Gumroad refund", {
      email: sale.email,
      sale_id: sale.sale_id,
    });
    return NextResponse.json({ ok: true, action: "all_access_revoked" });
  }

  if (productKind === "crown") {
    await grantCrownAccess(sale.email, "gumroad");
    logger.info("Crown access granted from Gumroad sale", {
      email: sale.email,
      sale_id: sale.sale_id,
      product_permalink: sale.product_permalink,
    });
    return NextResponse.json({ ok: true, action: "crown_granted" });
  }

  await grantAllAccess(sale.email, "gumroad");
  logger.info("All access granted from Gumroad sale", {
    email: sale.email,
    sale_id: sale.sale_id,
    product_permalink: sale.product_permalink,
  });

  return NextResponse.json({ ok: true, action: "all_access_granted" });
}
