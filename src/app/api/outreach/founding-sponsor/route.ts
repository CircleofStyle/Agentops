import { NextResponse } from "next/server";
import {
  FOUNDING_SPONSOR_FOLLOW_UP_TEXT,
  sendFoundingSponsorFollowUp,
  sendFoundingSponsorOutreach,
} from "@/lib/founding-sponsor-outreach";
import { isMetricsAuthorized } from "@/lib/metrics-auth";

type OutreachBody = {
  targetIds?: string[];
  skipIds?: string[];
  dryRun?: boolean;
  mode?: "initial" | "followUp";
};

export async function POST(request: Request) {
  if (!isMetricsAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: OutreachBody = {};
  try {
    body = (await request.json()) as OutreachBody;
  } catch {
    body = {};
  }

  const mode = body.mode ?? "initial";
  const results =
    mode === "followUp"
      ? await sendFoundingSponsorFollowUp({
          targetIds: body.targetIds,
          skipIds: body.skipIds,
          dryRun: body.dryRun,
        })
      : await sendFoundingSponsorOutreach({
          targetIds: body.targetIds,
          dryRun: body.dryRun,
        });

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return NextResponse.json({
    experiment: "B",
    mode,
    sent,
    failed,
    followUpScheduledFor: mode === "initial" ? "2026-06-20" : undefined,
    followUpText: FOUNDING_SPONSOR_FOLLOW_UP_TEXT,
    results,
    timestamp: new Date().toISOString(),
  });
}
