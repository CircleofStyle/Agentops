import { readFile } from "fs/promises";
import path from "path";

export type MonetizationMetrics = {
  affiliateClicks7d: number;
  gumroadSales30d: number;
  sponsorRevenueTotal: number;
};

type MonetizationSeed = Partial<MonetizationMetrics>;

const SEED_FILE = path.join(process.cwd(), "data", "monetization.json");

function parseNonNegativeInt(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

async function readMonetizationSeed(): Promise<MonetizationSeed> {
  try {
    const raw = await readFile(SEED_FILE, "utf-8");
    return JSON.parse(raw) as MonetizationSeed;
  } catch {
    return {};
  }
}

function resolveMetric(
  envValue: string | undefined,
  seedValue: number | undefined,
): number {
  const fromEnv = parseNonNegativeInt(envValue);
  if (fromEnv !== undefined) return fromEnv;
  if (typeof seedValue === "number" && Number.isFinite(seedValue) && seedValue >= 0) {
    return Math.floor(seedValue);
  }
  return 0;
}

/** Monetization KPIs for CMO weekly revenue log. Env overrides seed file; defaults to 0. */
export async function getMonetizationMetrics(): Promise<MonetizationMetrics> {
  const seed = await readMonetizationSeed();

  return {
    affiliateClicks7d: resolveMetric(
      process.env.METRICS_AFFILIATE_CLICKS_7D,
      seed.affiliateClicks7d,
    ),
    gumroadSales30d: resolveMetric(
      process.env.METRICS_GUMROAD_SALES_30D,
      seed.gumroadSales30d,
    ),
    sponsorRevenueTotal: resolveMetric(
      process.env.METRICS_SPONSOR_REVENUE_TOTAL,
      seed.sponsorRevenueTotal,
    ),
  };
}
