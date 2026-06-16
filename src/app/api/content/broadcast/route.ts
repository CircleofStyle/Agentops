import { NextResponse } from "next/server";
import { z } from "zod";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { sendPlaybookBroadcast } from "@/lib/playbook-broadcast";

const bodySchema = z.object({
  slug: z.string().min(1).max(200),
  dryRun: z.boolean().optional(),
  catchUp: z.boolean().optional(),
  testEmail: z.string().email().optional(),
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

  const result = await sendPlaybookBroadcast(parsed.data);

  const httpStatus = result.status === "failed" ? 502 : 200;
  return NextResponse.json(
    {
      ...result,
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus },
  );
}
