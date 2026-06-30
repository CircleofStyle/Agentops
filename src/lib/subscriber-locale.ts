import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import type { SubscriberRecord } from "@/lib/subscribers";

export function normalizePreferredLocale(value: unknown): Locale | undefined {
  if (typeof value !== "string" || !isLocale(value)) return undefined;
  return value;
}

export function resolveSubscriberLocale(
  subscriber?: Pick<SubscriberRecord, "preferredLocale"> | null,
): Locale {
  return subscriber?.preferredLocale ?? defaultLocale;
}
