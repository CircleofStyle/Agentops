import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import type { SubscriberRecord } from "@/lib/subscribers";

export type SealedPaidAccessGrant = {
  email: string;
  allAccess?: boolean;
  crownAccess?: boolean;
  source?: NonNullable<SubscriberRecord["allAccessSource"]>;
  grantedAt?: string;
};

type SealedPayload = {
  v: 1;
  iv: string;
  tag: string;
  ciphertext: string;
};

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(`atw-paid-access-grants:v1:${secret}`).digest();
}

function getSealSecret(): string | null {
  return (
    process.env.PAID_ACCESS_SEAL_SECRET?.trim() ||
    process.env.CONTENT_PIPELINE_SECRET?.trim() ||
    process.env.METRICS_SECRET?.trim() ||
    null
  );
}

export function sealPaidAccessGrants(
  grants: SealedPaidAccessGrant[],
  secret: string,
): SealedPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(secret), iv);
  const plaintext = Buffer.from(JSON.stringify(grants), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: 1,
    iv: iv.toString("base64url"),
    tag: tag.toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
  };
}

export function unsealPaidAccessGrants(
  payload: SealedPayload,
  secret: string,
): SealedPaidAccessGrant[] {
  if (payload.v !== 1) throw new Error("unsupported sealed grants version");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    deriveKey(secret),
    Buffer.from(payload.iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64url")),
    decipher.final(),
  ]);
  const parsed = JSON.parse(plaintext.toString("utf8")) as SealedPaidAccessGrant[];
  if (!Array.isArray(parsed)) throw new Error("sealed grants payload is not an array");
  return parsed;
}

export async function loadSealedPaidAccessGrants(): Promise<SealedPaidAccessGrant[]> {
  const secret = getSealSecret();
  if (!secret) return [];

  const filePath =
    process.env.PAID_ACCESS_GRANTS_SEALED_PATH?.trim() ||
    path.join(process.cwd(), "content", "paid-access-grants.sealed.json");

  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as SealedPayload;
    return unsealPaidAccessGrants(payload, secret);
  } catch {
    return [];
  }
}

export function applySealedPaidAccessGrants(
  subscribers: SubscriberRecord[],
  grants: SealedPaidAccessGrant[],
): SubscriberRecord[] {
  if (grants.length === 0) return subscribers;

  const byEmail = new Map(subscribers.map((record) => [record.email.toLowerCase(), { ...record }]));

  for (const grant of grants) {
    const email = grant.email.toLowerCase();
    const existing = byEmail.get(email);
    const now = grant.grantedAt ?? new Date().toISOString();
    const source = grant.source ?? "manual";

    if (!existing) {
      byEmail.set(email, {
        email,
        status: "confirmed",
        createdAt: now,
        confirmedAt: now,
        token: createHash("sha256").update(`sealed-token:${email}`).digest("hex").slice(0, 48),
        allAccess: grant.allAccess || undefined,
        allAccessGrantedAt: grant.allAccess ? now : undefined,
        allAccessSource: grant.allAccess ? source : undefined,
        crownAccess: grant.crownAccess || undefined,
        crownAccessGrantedAt: grant.crownAccess ? now : undefined,
        crownAccessSource: grant.crownAccess ? source : undefined,
      });
      continue;
    }

    if (grant.allAccess) {
      existing.allAccess = true;
      existing.allAccessGrantedAt = existing.allAccessGrantedAt ?? now;
      existing.allAccessSource = existing.allAccessSource ?? source;
      existing.status = "confirmed";
      existing.confirmedAt = existing.confirmedAt ?? now;
    }
    if (grant.crownAccess) {
      existing.crownAccess = true;
      existing.crownAccessGrantedAt = existing.crownAccessGrantedAt ?? now;
      existing.crownAccessSource = existing.crownAccessSource ?? source;
      existing.status = "confirmed";
      existing.confirmedAt = existing.confirmedAt ?? now;
    }
    byEmail.set(email, existing);
  }

  return Array.from(byEmail.values());
}
