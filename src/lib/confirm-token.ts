import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type ConfirmPayload = {
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

function encodePayload(payload: ConfirmPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): ConfirmPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as ConfirmPayload;
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function createConfirmationToken(email: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload = encodePayload({
    email: email.toLowerCase(),
    exp: Date.now() + TOKEN_TTL_MS,
  });

  return `${payload}.${sign(payload, secret)}`;
}

export function verifyConfirmationToken(token: string): { email: string } | null {
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
