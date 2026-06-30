import { NextResponse } from "next/server";
import { z } from "zod";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { auditDripDelivery, catchUpAllBehindDrip, catchUpSubscriberDrip, processDueDripEmails } from "@/lib/drip";
import { getDripCadenceDays, getDripSequenceSlugs } from "@/lib/drip-sequence";

const bodySchema = z
  .object({
    dryRun: z.boolean().optional(),
    limit: z.number().int().min(1).max(500).optional(),
    audit: z.boolean().optional(),
    catchUpEmail: z.string().email().optional(),
    catchUpBehind: z.boolean().optional(),
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

  if (parsed.data?.audit) {
    const audit = await auditDripDelivery();
    return NextResponse.json(audit);
  }

  if (parsed.data?.catchUpEmail) {
    const results = await catchUpSubscriberDrip(parsed.data.catchUpEmail);
    return NextResponse.json({
      email: parsed.data.catchUpEmail,
      results,
      sequence: await getDripSequenceSlugs(),
      cadenceDays: getDripCadenceDays(),
      timestamp: new Date().toISOString(),
    });
  }

  if (parsed.data?.catchUpBehind) {
    const catchUp = await catchUpAllBehindDrip();
    return NextResponse.json({
      ...catchUp,
      sequence: await getDripSequenceSlugs(),
      cadenceDays: getDripCadenceDays(),
      timestamp: new Date().toISOString(),
    });
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

/** Vercel Cron invokes GET; require pipeline or CRON_SECRET via Authorization header. */
export async function GET(request: Request) {
  return POST(request);
}
