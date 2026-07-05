import {
  gumroadCheckoutUrl,
  KIT_STARTER_BUNDLE,
  kitByPlaybookSlug,
  type WorkflowKitSpec,
} from "@/lib/kit-catalog";

const GUMROAD_KIT_URL_ENV = "NEXT_PUBLIC_GUMROAD_KIT_URL";
const GUMROAD_KIT_URLS_ENV = "NEXT_PUBLIC_GUMROAD_KIT_URLS";
const GUMROAD_STARTER_BUNDLE_URL_ENV = "NEXT_PUBLIC_GUMROAD_STARTER_BUNDLE_URL";
const GUMROAD_ALL_ACCESS_URL_ENV = "NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL";
const GUMROAD_ALL_ACCESS_PRODUCT_ENV = "GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK";
const GUMROAD_CROWN_URL_ENV = "NEXT_PUBLIC_GUMROAD_CROWN_URL";
const GUMROAD_CROWN_PRODUCT_ENV = "GUMROAD_CROWN_PRODUCT_PERMALINK";

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

/** Per-playbook kit checkout URLs from `NEXT_PUBLIC_GUMROAD_KIT_URLS` JSON map. */
export function getGumroadKitUrlMap(): Record<string, string> | null {
  const raw = process.env[GUMROAD_KIT_URLS_ENV]?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const map: Record<string, string> = {};
    for (const [slug, url] of Object.entries(parsed)) {
      if (typeof url === "string" && isValidHttpUrl(url)) {
        map[slug] = url;
      }
    }
    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

/** Resolve kit checkout URL for a published playbook slug. */
export function getGumroadKitUrlForSlug(playbookSlug: string): string | null {
  const map = getGumroadKitUrlMap();
  if (map?.[playbookSlug]) return map[playbookSlug];
  if (playbookSlug === "auto-triage-customer-emails") {
    return getGumroadKitUrl();
  }
  return null;
}

export function getGumroadStarterBundleUrl(): string | null {
  const raw = process.env[GUMROAD_STARTER_BUNDLE_URL_ENV]?.trim();
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

/** Catalog-page checkout link with UTM tags. */
export function buildGumroadKitCatalogLink(
  baseUrl: string,
  playbookSlug: string,
  surface: "kits_index" | "kit_detail" | "starter_bundle" | "drip_email",
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "atw");
  url.searchParams.set("utm_medium", surface);
  url.searchParams.set("utm_campaign", playbookSlug);
  return url.toString();
}

/** True when env provides a live checkout URL for this playbook slug. */
export function isKitCheckoutEnvConfigured(playbookSlug: string): boolean {
  return getGumroadKitUrlForSlug(playbookSlug) !== null;
}

/** Env checkout URL when set; otherwise catalog placeholder from kit metadata. */
export function resolveKitCheckoutUrl(playbookSlug: string): string | null {
  const kit = kitByPlaybookSlug(playbookSlug);
  if (!kit) return null;
  const envUrl = getGumroadKitUrlForSlug(playbookSlug);
  return envUrl ?? gumroadCheckoutUrl(kit.gumroadPermalink);
}

/** Env starter-bundle URL when set; otherwise catalog placeholder. */
export function resolveStarterBundleCheckoutUrl(): string {
  const envUrl = getGumroadStarterBundleUrl();
  return envUrl ?? gumroadCheckoutUrl(KIT_STARTER_BUNDLE.gumroadPermalink);
}

export function isStarterBundleCheckoutEnvConfigured(): boolean {
  return getGumroadStarterBundleUrl() !== null;
}

export function formatKitPriceCents(cents: number): string {
  return `€${(cents / 100).toFixed(0)}`;
}

export function kitCheckoutHref(kit: WorkflowKitSpec, surface: "kits_index" | "kit_detail"): string {
  const base = resolveKitCheckoutUrl(kit.playbookSlug);
  if (!base) return "#";
  return buildGumroadKitCatalogLink(base, kit.playbookSlug, surface);
}

/** Gumroad All Access Pass product URL; unset or invalid values hide checkout CTAs. */
export function getGumroadAllAccessUrl(): string | null {
  const raw = process.env[GUMROAD_ALL_ACCESS_URL_ENV]?.trim();
  if (!raw || !isValidHttpUrl(raw)) return null;
  return raw;
}

export function buildGumroadAllAccessLink(baseUrl: string, surface: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "atw");
  url.searchParams.set("utm_medium", surface);
  url.searchParams.set("utm_campaign", "all_access_pass");
  return url.toString();
}

/** Expected Gumroad product permalink for All Access sales (webhook filter). */
export function getGumroadAllAccessProductPermalink(): string | null {
  const raw = process.env[GUMROAD_ALL_ACCESS_PRODUCT_ENV]?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/** Gumroad Crown Discipline product URL; unset or invalid values hide checkout CTAs. */
export function getGumroadCrownUrl(): string | null {
  const raw = process.env[GUMROAD_CROWN_URL_ENV]?.trim();
  if (!raw || !isValidHttpUrl(raw)) return null;
  return raw;
}

export function buildGumroadCrownLink(baseUrl: string, surface: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "atw");
  url.searchParams.set("utm_medium", surface);
  url.searchParams.set("utm_campaign", "crown_discipline");
  return url.toString();
}

/** Expected Gumroad product permalink for Crown Discipline sales (webhook filter). */
export function getGumroadCrownProductPermalink(): string | null {
  const raw = process.env[GUMROAD_CROWN_PRODUCT_ENV]?.trim();
  return raw && raw.length > 0 ? raw : null;
}
