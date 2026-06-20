import { NextResponse } from "next/server";
import { isPipelineAuthorized } from "@/lib/content/auth";
import { provisionResendInbound, sendHelloInboxTestEmail } from "@/lib/resend-inbound-setup";

export async function POST(request: Request) {
  if (!isPipelineAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let sendTest = false;
  try {
    const body = (await request.json()) as { sendTest?: boolean };
    sendTest = body.sendTest === true;
  } catch {
    sendTest = false;
  }

  try {
    const result = await provisionResendInbound();
    const response: Record<string, unknown> = {
      ok: true,
      ...result,
      notes: result.webhook.signingSecret
        ? "Store signingSecret as RESEND_WEBHOOK_SECRET in Vercel production env."
        : "Webhook already existed; signing secret not returned — copy from Resend dashboard or recreate webhook.",
    };

    if (sendTest) {
      response.testEmail = await sendHelloInboxTestEmail();
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbound setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
