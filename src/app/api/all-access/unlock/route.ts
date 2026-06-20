import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isValidAllAccessCode,
  setAllAccessSessionCookie,
  subscriberHasAllAccess,
} from "@/lib/all-access";
import { grantAllAccess } from "@/lib/subscribers";

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
    if (!isValidAllAccessCode(code)) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 403 });
    }
    await grantAllAccess(email, "code");
  } else if (!(await subscriberHasAllAccess(email))) {
    return NextResponse.json(
      {
        error:
          "No All Access Pass found for this email. Use the same address as your Gumroad checkout, or enter an access code if you have one.",
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true, redirect: "/issues" });
  const cookieSet = setAllAccessSessionCookie(response, email);

  if (!cookieSet) {
    return NextResponse.json(
      { error: "Unlock is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  return response;
}
