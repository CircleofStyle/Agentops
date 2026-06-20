import { NextRequest, NextResponse } from "next/server";
import { verifyConfirmationToken } from "@/lib/confirm-token";
import { sendInitialDripIssue } from "@/lib/drip";
import { addToResendAudience, sendWelcomeEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { confirmSubscriber, confirmSubscriberByEmail } from "@/lib/subscribers";
import { getSiteUrl } from "@/lib/resend";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing-token", getSiteUrl()));
  }

  const verified = verifyConfirmationToken(token);
  const subscriber = verified
    ? await confirmSubscriberByEmail(verified.email)
    : await confirmSubscriber(token);

  if (!subscriber) {
    return NextResponse.redirect(new URL("/?error=invalid-token", getSiteUrl()));
  }

  await addToResendAudience(subscriber.email);
  await sendWelcomeEmail(subscriber.email);

  const dripResult = await sendInitialDripIssue(subscriber.email);
  if (dripResult.status === "failed") {
    logger.error("Initial drip issue failed on confirm", {
      email: subscriber.email,
      error: dripResult.error,
    });
  }

  return NextResponse.redirect(new URL("/confirmed", getSiteUrl()));
}
