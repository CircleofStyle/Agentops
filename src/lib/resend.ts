import { Resend } from "resend";

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Automate This Week <onboarding@resend.dev>";
}

export function getAudienceId(): string | undefined {
  return process.env.RESEND_AUDIENCE_ID;
}

function resolveSiteUrl(): string | null {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return null;
}

export function getSiteUrl(): string {
  return resolveSiteUrl() ?? "http://localhost:3000";
}

export function getResendConfigStatus(): {
  configured: boolean;
  hasApiKey: boolean;
  hasFromEmail: boolean;
  hasAudienceId: boolean;
  hasSiteUrl: boolean;
} {
  const hasApiKey = Boolean(process.env.RESEND_API_KEY);
  const hasFromEmail = Boolean(process.env.RESEND_FROM_EMAIL);
  const hasAudienceId = Boolean(process.env.RESEND_AUDIENCE_ID);
  const hasSiteUrl = Boolean(resolveSiteUrl());

  return {
    configured: hasApiKey && hasFromEmail && hasAudienceId && hasSiteUrl,
    hasApiKey,
    hasFromEmail,
    hasAudienceId,
    hasSiteUrl,
  };
}
