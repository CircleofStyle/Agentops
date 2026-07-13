import { NextResponse } from "next/server";
import { z } from "zod";
import { isMetricsAuthorized } from "@/lib/metrics-auth";
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

  const results: Array<{
    email: string;
    allAccess?: boolean;
    crownAccess?: boolean;
    ok: boolean;
    resendSynced: boolean;
  }> = [];

  for (const grant of parsed.data.grants) {
    const email = grant.email.toLowerCase();
    let ok = true;
    let resendSynced = true;

    try {
      if (grant.allAccess) {
        const result = await grantAllAccessWithSync(email, grant.source);
        resendSynced = result.resendSynced;
        ok = result.resendSynced;
      }
      if (grant.crownAccess) {
        const result = await grantCrownAccessWithSync(email, grant.source);
        resendSynced = resendSynced && result.resendSynced;
        ok = ok && result.resendSynced;
      }
      if (!grant.allAccess && !grant.crownAccess) {
        ok = false;
        resendSynced = false;
      }
    } catch {
      ok = false;
      resendSynced = false;
    }

    results.push({
      email,
      allAccess: grant.allAccess,
      crownAccess: grant.crownAccess,
      ok,
      resendSynced,
    });
  }

  const metrics = await getSubscriberMetrics();
  return NextResponse.json({
    ok: results.every((result) => result.ok),
    restored: results.filter((result) => result.ok).length,
    results,
    subscribers: metrics.subscribers,
    timestamp: metrics.timestamp,
  });
}
