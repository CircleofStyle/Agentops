import { NextResponse } from "next/server";
import { isMetricsAuthorized } from "@/lib/metrics-auth";
import { getSubscriberMetrics } from "@/lib/subscriber-metrics";

export async function GET(request: Request) {
  if (!isMetricsAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metrics = await getSubscriberMetrics();
  return NextResponse.json(metrics);
}
