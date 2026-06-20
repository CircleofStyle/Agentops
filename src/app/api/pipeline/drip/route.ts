import { NextResponse } from "next/server";
import { z } from "zod";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { getDripCadenceDays, getDripSequenceSlugs } from "@/lib/drip-sequence";
import { processDueDripEmails } from "@/lib/drip";

const bodySchema = z
  .object({
    dryRun: z.boolean().optional(),
    limit: z.number().int().min(1).max(500).optional(),
  })
  .optional();

export async function POST(request: Request) {
  if (!isPipelineAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown = {};
  try {
    const text = await request.text();
    if (text.trim()) json = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const sequence = await getDripSequenceSlugs();
  const result = await processDueDripEmails(parsed.data);

  return NextResponse.json({
    ...result,
    sequence,
    cadenceDays: getDripCadenceDays(),
    timestamp: new Date().toISOString(),
  });
}

/** Vercel Cron invokes GET; require the same pipeline secret via Authorization header. */
export async function GET(request: Request) {
  return POST(request);
}
