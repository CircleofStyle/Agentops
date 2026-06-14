import { NextResponse } from "next/server";
import { z } from "zod";
import { createConfirmationToken } from "@/lib/confirm-token";
import { addToResendAudience, sendVerificationEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { findSubscriber, upsertPendingSubscriber } from "@/lib/subscribers";
import { sanitizeUtmInput } from "@/lib/utm";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
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

  const { email, ...utmFields } = parsed.data;
  const utm = sanitizeUtmInput(utmFields);
  const existing = await findSubscriber(email);

  if (existing?.status === "confirmed") {
    return NextResponse.json({
      message: "You're already subscribed. Check your inbox for the latest issue.",
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

  await upsertPendingSubscriber(email, token, utm);

  if (utm?.utm_source) {
    logger.info("Subscriber attribution captured", {
      email,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });
  }

  const emailSent = await sendVerificationEmail(email, token);

  if (!emailSent) {
    // Local fallback: still accept signup; confirmation works via /api/confirm link in dev
    logger.warn("Verification email not sent", { email, reason: "resend_unconfigured_or_failed" });
  }

  await addToResendAudience(email);

  return NextResponse.json({
    message: emailSent
      ? "Check your inbox and click the confirmation link to complete signup."
      : "Subscription recorded. Configure RESEND_API_KEY to enable confirmation emails.",
  });
}
