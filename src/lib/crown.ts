import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";
import { findSubscriber } from "@/lib/subscribers";

export const CROWN_COOKIE = "atw_crown";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSigningSecret(): string | null {
  return (
    process.env.SUBSCRIBE_TOKEN_SECRET ??
    process.env.CONTENT_PIPELINE_SECRET ??
    (process.env.NODE_ENV === "development" ? "dev-subscribe-token-secret" : null)
  );
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as SessionPayload;
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function createCrownSessionToken(email: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload = encodePayload({
    email: email.toLowerCase(),
    exp: Date.now() + SESSION_TTL_MS,
  });

  return `${payload}.${sign(payload, secret)}`;
}

export function verifyCrownSession(token: string | undefined): { email: string } | null {
  if (!token) return null;

  const secret = getSigningSecret();
  if (!secret) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload, secret);
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actual.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actual, expectedBuffer)) return null;

  const payload = decodePayload(encodedPayload);
  if (!payload || payload.exp < Date.now()) return null;

  return { email: payload.email };
}

export function setCrownSessionCookie(response: NextResponse, email: string): boolean {
  const token = createCrownSessionToken(email);
  if (!token) return false;

  response.cookies.set(CROWN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return true;
}

export async function subscriberHasCrownAccess(email: string): Promise<boolean> {
  const subscriber = await findSubscriber(email);
  return subscriber?.crownAccess === true;
}

export async function resolveCrownAccessFromCookie(
  cookieValue: string | undefined,
): Promise<boolean> {
  const session = verifyCrownSession(cookieValue);
  if (!session) return false;
  return subscriberHasCrownAccess(session.email);
}

export function parseCrownAccessCodes(): Set<string> {
  const raw = process.env.CROWN_ACCESS_CODES?.trim();
  if (!raw) return new Set();

  return new Set(
    raw
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean),
  );
}

export function isValidCrownAccessCode(code: string): boolean {
  const codes = parseCrownAccessCodes();
  return codes.size > 0 && codes.has(code.trim());
}
