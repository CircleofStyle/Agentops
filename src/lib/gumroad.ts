const GUMROAD_KIT_URL_ENV = "NEXT_PUBLIC_GUMROAD_KIT_URL";

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Gumroad kit product URL; unset or invalid values hide the issue-page CTA. */
export function getGumroadKitUrl(): string | null {
  const raw = process.env[GUMROAD_KIT_URL_ENV]?.trim();
  if (!raw || !isValidHttpUrl(raw)) return null;
  return raw;
}

export function buildGumroadKitLink(baseUrl: string, issueSlug: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "atw");
  url.searchParams.set("utm_medium", "issue_page");
  url.searchParams.set("utm_campaign", issueSlug);
  return url.toString();
}
