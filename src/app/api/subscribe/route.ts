import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addToResendAudience, sendVerificationEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { findSubscriber, upsertPendingSubscriber } from "@/lib/subscribers";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
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

  const { email } = parsed.data;
  const existing = await findSubscriber(email);

  if (existing?.status === "confirmed") {
    return NextResponse.json({
      message: "You're already subscribed. Check your inbox for the latest issue.",
    });
  }

  const token = randomBytes(32).toString("hex");
  await upsertPendingSubscriber(email, token);

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
