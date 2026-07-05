import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultLocale, isLocale } from "@/i18n/config";
import { createConfirmationToken } from "@/lib/confirm-token";
import { addToResendAudience, sendVerificationEmail } from "@/lib/email";
import { getTransactionalEmailCopy } from "@/lib/email-i18n";
import { logger } from "@/lib/logger";
import { findSubscriber, upsertPendingSubscriber } from "@/lib/subscribers";
import { isReferralSource } from "@/lib/referral-source";
import { sanitizeUtmInput } from "@/lib/utm";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  preferredLocale: z.enum(["en", "de"]).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referralSource: z.string().max(50).optional(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid email." },
      { status: 400 },
    );
  }

  const { email, preferredLocale: rawLocale, referralSource: rawReferral, ...utmFields } =
    parsed.data;
  const preferredLocale =
    rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;
  const utm = sanitizeUtmInput(utmFields);
  const referralSource =
    rawReferral && isReferralSource(rawReferral) ? rawReferral : undefined;
  const copy = getTransactionalEmailCopy(preferredLocale);
  const existing = await findSubscriber(email);

  if (existing?.status === "confirmed") {
    return NextResponse.json({
      message: copy.subscribeAlreadyConfirmed,
    });
  }

  const token = createConfirmationToken(email);
  if (!token) {
    logger.error("Confirmation token unavailable", { reason: "missing_subscribe_token_secret" });
    return NextResponse.json(
      { error: "Signup is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  await upsertPendingSubscriber(email, token, utm, preferredLocale, referralSource);

  if (utm?.utm_source) {
    logger.info("Subscriber attribution captured", {
      email,
      preferredLocale,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });
  }

  if (referralSource) {
    logger.info("Subscriber referral source captured", { email, referralSource });
  }

  const emailSent = await sendVerificationEmail(email, token, preferredLocale);

  if (!emailSent) {
    // Local fallback: still accept signup; confirmation works via /api/confirm link in dev
    logger.warn("Verification email not sent", { email, reason: "resend_unconfigured_or_failed" });
  }

  await addToResendAudience(email, preferredLocale);

  return NextResponse.json({
    message: emailSent ? copy.subscribeSuccess : copy.subscribeNoResend,
  });
}
