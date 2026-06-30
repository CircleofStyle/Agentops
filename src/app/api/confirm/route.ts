import { NextRequest, NextResponse } from "next/server";
import { localizedPath } from "@/i18n/navigation";
import { verifyConfirmationToken } from "@/lib/confirm-token";
import { sendInitialDripIssue } from "@/lib/drip";
import { addToResendAudience, sendWelcomeEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { confirmSubscriber, confirmSubscriberByEmail, type SubscriberRecord } from "@/lib/subscribers";
import { resolveSubscriberLocale } from "@/lib/subscriber-locale";
import { getSiteUrl } from "@/lib/resend";

function confirmedPathForSubscriber(subscriber: SubscriberRecord, request: NextRequest): string {
  const locale = resolveSubscriberLocale(subscriber);
  if (locale !== "en") {
    return localizedPath("/confirmed", locale);
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  return cookieLocale === "de" ? "/de/confirmed" : "/confirmed";
}

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

  const locale = resolveSubscriberLocale(subscriber);

  await addToResendAudience(subscriber.email, locale);
  await sendWelcomeEmail(subscriber.email, locale);

  const dripResult = await sendInitialDripIssue(subscriber.email);
  if (dripResult.status === "failed") {
    logger.error("Initial drip issue failed on confirm", {
      email: subscriber.email,
      locale,
      error: dripResult.error,
    });
  }

  return NextResponse.redirect(
    new URL(confirmedPathForSubscriber(subscriber, request), getSiteUrl()),
  );
}
