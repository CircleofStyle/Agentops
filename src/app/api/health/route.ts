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
    gumroadWebhook: {
      route: "/api/webhooks/gumroad",
      webhookSecretConfigured: Boolean(process.env.GUMROAD_WEBHOOK_SECRET),
      allAccessProductConfigured: Boolean(process.env.GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK),
      crownProductConfigured: Boolean(process.env.GUMROAD_CROWN_PRODUCT_PERMALINK),
      checkoutUrlConfigured: Boolean(process.env.NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL),
      crownCheckoutUrlConfigured: Boolean(process.env.NEXT_PUBLIC_GUMROAD_CROWN_URL),
      kitCheckoutUrlConfigured:
        Boolean(process.env.NEXT_PUBLIC_GUMROAD_KIT_URL) ||
        Boolean(process.env.NEXT_PUBLIC_GUMROAD_KIT_URLS),
      kitUrlsMapConfigured: Boolean(process.env.NEXT_PUBLIC_GUMROAD_KIT_URLS),
      starterBundleCheckoutUrlConfigured: Boolean(
        process.env.NEXT_PUBLIC_GUMROAD_STARTER_BUNDLE_URL,
      ),
      missingPublic: [
        !process.env.NEXT_PUBLIC_GUMROAD_KIT_URL && "NEXT_PUBLIC_GUMROAD_KIT_URL",
        !process.env.NEXT_PUBLIC_GUMROAD_KIT_URLS && "NEXT_PUBLIC_GUMROAD_KIT_URLS",
        !process.env.NEXT_PUBLIC_GUMROAD_STARTER_BUNDLE_URL &&
          "NEXT_PUBLIC_GUMROAD_STARTER_BUNDLE_URL",
        !process.env.NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL && "NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL",
        !process.env.NEXT_PUBLIC_GUMROAD_CROWN_URL && "NEXT_PUBLIC_GUMROAD_CROWN_URL",
      ].filter(Boolean),
      missingServer: [
        !process.env.GUMROAD_WEBHOOK_SECRET && "GUMROAD_WEBHOOK_SECRET",
        !process.env.GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK && "GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK",
        !process.env.GUMROAD_CROWN_PRODUCT_PERMALINK && "GUMROAD_CROWN_PRODUCT_PERMALINK",
      ].filter(Boolean),
    },
    dripPipeline: {
      route: "/api/pipeline/drip",
      cronSchedule: "0 14 * * *",
      pipelineSecretConfigured: Boolean(process.env.CONTENT_PIPELINE_SECRET),
      cronSecretConfigured: Boolean(process.env.CRON_SECRET),
      cronAuthReady:
        Boolean(process.env.CONTENT_PIPELINE_SECRET) &&
        Boolean(process.env.CRON_SECRET) &&
        process.env.CRON_SECRET === process.env.CONTENT_PIPELINE_SECRET,
      dripSequenceEnabled: process.env.DRIP_SEQUENCE_ENABLED !== "false",
      cadenceDays: Number(process.env.DRIP_CADENCE_DAYS ?? 7),
    },
    transactionalSend: {
      route: "/api/pipeline/send-email",
      pipelineSecretConfigured: Boolean(process.env.CONTENT_PIPELINE_SECRET),
      resendReady: resend.hasApiKey && resend.hasFromEmail,
    },
    seo: {
      sitemapRoute: "/sitemap.xml",
      robotsRoute: "/robots.txt",
      siteUrl: getResendConfigStatus().hasSiteUrl ? process.env.NEXT_PUBLIC_SITE_URL : null,
      siteUrlResolved: resend.hasSiteUrl,
    },
    analytics: {
      ga4MeasurementIdConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    },
  });
}
