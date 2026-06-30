import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isValidCrownAccessCode,
  setCrownSessionCookie,
  subscriberHasCrownAccess,
} from "@/lib/crown";
import { grantCrownAccess } from "@/lib/subscribers";

const unlockSchema = z.object({
  email: z.string().email("Please enter the email you used at checkout."),
  code: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = unlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const code = parsed.data.code?.trim();

  if (code) {
    if (!isValidCrownAccessCode(code)) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 403 });
    }
    await grantCrownAccess(email, "code");
  } else if (!(await subscriberHasCrownAccess(email))) {
    return NextResponse.json(
      {
        error:
          "No Crown Discipline purchase found for this email. Use the same address as your Gumroad checkout, or enter an access code if you have one.",
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true, redirect: "/crown" });
  const cookieSet = setCrownSessionCookie(response, email);

  if (!cookieSet) {
    return NextResponse.json(
      { error: "Unlock is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  return response;
}
