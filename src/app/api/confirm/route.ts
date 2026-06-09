import { NextRequest, NextResponse } from "next/server";
import { addToResendAudience, sendWelcomeEmail } from "@/lib/email";
import { confirmSubscriber } from "@/lib/subscribers";
import { getSiteUrl } from "@/lib/resend";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing-token", getSiteUrl()));
  }

  const subscriber = await confirmSubscriber(token);

  if (!subscriber) {
    return NextResponse.redirect(new URL("/?error=invalid-token", getSiteUrl()));
  }

  await addToResendAudience(subscriber.email);
  await sendWelcomeEmail(subscriber.email);

  return NextResponse.redirect(new URL("/confirmed", getSiteUrl()));
}
