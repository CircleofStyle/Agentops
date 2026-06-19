import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { processInboundSponsorReply } from "@/lib/process-inbound-sponsor-reply";
import {
  isHelloInboxRecipient,
  verifyResendWebhook,
  type ResendEmailReceivedEvent,
} from "@/lib/resend-inbound";

export async function POST(request: Request) {
  if (!process.env.RESEND_WEBHOOK_SECRET) {
    logger.error("Resend inbound webhook unavailable", { reason: "missing_webhook_secret" });
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const payload = await request.text();

  let event: ResendEmailReceivedEvent;
  try {
    event = verifyResendWebhook(payload, request.headers);
  } catch (error) {
    logger.warn("Resend webhook verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  if (!isHelloInboxRecipient(event.data.to)) {
    return NextResponse.json({ ok: true, ignored: "not_hello_inbox" });
  }

  try {
    const result = await processInboundSponsorReply(event);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    logger.error("Inbound sponsor reply processing failed", {
      emailId: event.data.email_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
