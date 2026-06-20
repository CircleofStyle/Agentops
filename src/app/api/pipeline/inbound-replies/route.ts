import { NextResponse } from "next/server";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { listHelloInboundReplies } from "@/lib/resend-inbound-setup";

export async function GET(request: Request) {
  if (!isPipelineAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const replies = await listHelloInboundReplies();
    return NextResponse.json({ ok: true, count: replies.length, replies });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbound list failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
