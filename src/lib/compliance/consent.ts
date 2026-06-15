export type ConsentCategory = "analytics" | "marketing";

export type ConsentPreferences = Record<ConsentCategory, boolean>;

export const COOKIE_NAME = "nova_consent_preferences";
export const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 1 year

export const DEFAULT_CONSENT: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

export const OPTIONAL_CONSENT_CATEGORIES: ConsentCategory[] = ["analytics", "marketing"];

export const COOKIE_CATEGORY_DEFINITIONS: Record<
  ConsentCategory,
  { label: string; description: string }
> = {
  analytics: {
    label: "Analytics cookies",
    description: "Count visits, funnels, and playback data so we can keep the playbooks sharp.",
  },
  marketing: {
    label: "Marketing & automation cookies",
    description:
      "Remember your inbox, CTA clicks, and newsletter cadence so automation copies stay relevant.",
  },
};

function encodePreferences(preferences: ConsentPreferences) {
  return encodeURIComponent(JSON.stringify(preferences));
}

function decodePreferences(value: string): ConsentPreferences | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch {
    return null;
  }
}

function getCookieValue() {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
}

export function readConsentCookie(): ConsentPreferences | null {
  const cookieValue = getCookieValue();
  if (!cookieValue) return null;
  return decodePreferences(cookieValue);
}

export function consentCookieExists(): boolean {
  return readConsentCookie() !== null;
}

export function writeConsentCookie(preferences: ConsentPreferences) {
  if (typeof document === "undefined") return;
  const encoded = encodePreferences(preferences);
  document.cookie = `${COOKIE_NAME}=${encoded};max-age=${COOKIE_MAX_AGE_SECONDS};path=/;SameSite=Lax;secure`;
}

export function hasConsentFor(category: ConsentCategory) {
  const preferences = readConsentCookie();
  if (!preferences) {
    return false;
  }
  return preferences[category];
}
