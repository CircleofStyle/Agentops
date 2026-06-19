import { NextResponse } from "next/server";
import { isPaperclipConfigured } from "@/lib/paperclip-client";
import { getResendConfigStatus } from "@/lib/resend";

export async function GET() {
  const resend = getResendConfigStatus();

  return NextResponse.json({
    status: "ok",
    service: "automate-this-week",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    environment: process.env.VERCEL_ENV ?? "development",
    timestamp: new Date().toISOString(),
    email: {
      resendConfigured: resend.configured,
      missing: [
        !resend.hasApiKey && "RESEND_API_KEY",
        !resend.hasFromEmail && "RESEND_FROM_EMAIL",
        !resend.hasAudienceId && "RESEND_AUDIENCE_ID",
        !resend.hasSiteUrl && "NEXT_PUBLIC_SITE_URL",
      ].filter(Boolean),
    },
    inboundWebhook: {
      route: "/api/webhooks/resend/inbound",
      webhookSecretConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
      paperclipConfigured: isPaperclipConfigured(),
    },
  });
}
