import { getGumroadAllAccessProductPermalink } from "@/lib/gumroad";

export type GumroadSalePayload = {
  email: string;
  sale_id: string;
  product_id?: string;
  product_permalink?: string;
  product_name?: string;
  refunded?: string;
  seller_id?: string;
};

function readField(data: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const value = data[key]?.trim();
    if (value) return value;
  }
  return "";
}

export async function parseGumroadWebhookPayload(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(json).map(([key, value]) => [key, value == null ? "" : String(value)]),
    );
  }

  const form = await request.formData();
  return Object.fromEntries(
    [...form.entries()].map(([key, value]) => [key, typeof value === "string" ? value : ""]),
  );
}

export function normalizeGumroadSale(data: Record<string, string>): GumroadSalePayload | null {
  const email = readField(data, "email", "purchaser_email");
  const sale_id = readField(data, "sale_id", "order_number");

  if (!email || !sale_id) return null;

  return {
    email,
    sale_id,
    product_id: readField(data, "product_id") || undefined,
    product_permalink: readField(data, "product_permalink", "permalink") || undefined,
    product_name: readField(data, "product_name") || undefined,
    refunded: readField(data, "refunded") || undefined,
    seller_id: readField(data, "seller_id") || undefined,
  };
}

export function isAllAccessGumroadSale(sale: GumroadSalePayload): boolean {
  const expectedPermalink = getGumroadAllAccessProductPermalink();
  if (!expectedPermalink) return true;

  const permalink = sale.product_permalink?.toLowerCase() ?? "";
  const expected = expectedPermalink.toLowerCase();
  return permalink === expected || permalink.endsWith(`/${expected}`);
}

export function isGumroadRefund(sale: GumroadSalePayload): boolean {
  return sale.refunded === "true";
}

export function verifyGumroadWebhookSecret(request: Request): boolean {
  const configured = process.env.GUMROAD_WEBHOOK_SECRET?.trim();
  if (!configured) return true;

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret")?.trim();
  return querySecret === configured;
}
