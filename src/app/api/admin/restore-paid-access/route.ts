import { NextResponse } from "next/server";
import { z } from "zod";
import { isMetricsAuthorized } from "@/lib/metrics-auth";
import { ensurePaidAccessContactProperties } from "@/lib/resend-paid-access";
import { getSubscriberMetrics } from "@/lib/subscriber-metrics";
import {
  grantAllAccessWithSync,
  grantCrownAccessWithSync,
} from "@/lib/subscribers";

const grantSchema = z.object({
  email: z.string().email(),
  allAccess: z.boolean().optional(),
  crownAccess: z.boolean().optional(),
  source: z.enum(["gumroad", "code", "manual"]).default("manual"),
});

const bodySchema = z.object({
  grants: z.array(grantSchema).min(1).max(200),
});

/**
 * Restore paid unlocks onto durable Resend contact properties.
 * Auth: Bearer METRICS_SECRET or CONTENT_PIPELINE_SECRET.
 */
export async function POST(request: Request) {
  if (!isMetricsAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid body" },
      { status: 400 },
    );
  }

  const propertiesReady = await ensurePaidAccessContactProperties();
  if (!propertiesReady) {
    return NextResponse.json(
      {
        ok: false,
        error: "Resend paid-access contact properties are not ready",
        restored: 0,
        results: [],
      },
      { status: 502 },
    );
  }

  const results: Array<{
    email: string;
    allAccess?: boolean;
    crownAccess?: boolean;
    ok: boolean;
    resendSynced: boolean;
    syncDetail?: unknown;
  }> = [];

  for (const grant of parsed.data.grants) {
    const email = grant.email.toLowerCase();
    let ok = true;
    let resendSynced = true;
    let syncDetail: unknown;

    try {
      if (grant.allAccess) {
        const result = await grantAllAccessWithSync(email, grant.source);
        resendSynced = result.resendSynced;
        ok = result.resendSynced;
        syncDetail = result.syncDetail;
      }
      if (grant.crownAccess) {
        const result = await grantCrownAccessWithSync(email, grant.source);
        resendSynced = resendSynced && result.resendSynced;
        ok = ok && result.resendSynced;
        syncDetail = result.syncDetail;
      }
      if (!grant.allAccess && !grant.crownAccess) {
        ok = false;
        resendSynced = false;
      }
    } catch (error) {
      ok = false;
      resendSynced = false;
      syncDetail = {
        reason: "exception",
        body: error instanceof Error ? error.message : "unknown",
      };
    }

    results.push({
      email,
      allAccess: grant.allAccess,
      crownAccess: grant.crownAccess,
      ok,
      resendSynced,
      syncDetail,
    });
  }

  const metrics = await getSubscriberMetrics();
  return NextResponse.json({
    ok: results.every((result) => result.ok),
    restored: results.filter((result) => result.ok).length,
    results,
    propertiesReady,
    subscribers: metrics.subscribers,
    timestamp: metrics.timestamp,
  });
}
