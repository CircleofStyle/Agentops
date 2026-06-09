import { NextResponse } from "next/server";
import { z } from "zod";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { generateDraft } from "@/lib/content/draft-generator";

const bodySchema = z.object({
  topic: z.string().min(3).max(500),
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

  try {
    const doc = await generateDraft(parsed.data.topic);
    return NextResponse.json({
      slug: doc.frontmatter.slug,
      status: doc.frontmatter.status,
      title: doc.frontmatter.title,
      filePath: doc.filePath,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Draft generation failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
