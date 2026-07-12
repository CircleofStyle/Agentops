import { NextResponse } from "next/server";
import { z } from "zod";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { sendTransactionalEmail } from "@/lib/transactional-send";

const bodySchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(500),
  text: z.string().min(1).max(100_000),
  replyTo: z.string().email().optional(),
  dryRun: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!isPipelineAuthorized(request.headers.get("authorization"))) {
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
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await sendTransactionalEmail(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      { ...result, timestamp: new Date().toISOString() },
      { status: result.dryRun ? 200 : 503 },
    );
  }

  return NextResponse.json({
    ...result,
    timestamp: new Date().toISOString(),
  });
}
