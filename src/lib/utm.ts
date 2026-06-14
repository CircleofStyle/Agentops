export const UTM_PARAM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];
export type UtmParams = Partial<Record<UtmParamKey, string>>;

export const UTM_STORAGE_KEY = "atw_utm";

const MAX_UTM_LENGTH = 100;

function sanitizeUtmValue(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_UTM_LENGTH);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseUtmFromSearchParams(searchParams: URLSearchParams): UtmParams {
  const utm: UtmParams = {};

  for (const key of UTM_PARAM_KEYS) {
    const value = sanitizeUtmValue(searchParams.get(key));
    if (value) utm[key] = value;
  }

  return utm;
}

export function sanitizeUtmInput(input: unknown): UtmParams | undefined {
  if (!input || typeof input !== "object") return undefined;

  const record = input as Record<string, unknown>;
  const utm: UtmParams = {};

  for (const key of UTM_PARAM_KEYS) {
    const raw = record[key];
    if (typeof raw !== "string") continue;
    const value = sanitizeUtmValue(raw);
    if (value) utm[key] = value;
  }

  return Object.keys(utm).length > 0 ? utm : undefined;
}

export function mergeUtmFields(
  existing: UtmParams | undefined,
  incoming: UtmParams | undefined,
): UtmParams | undefined {
  const merged: UtmParams = {
    utm_source: existing?.utm_source ?? incoming?.utm_source,
    utm_medium: existing?.utm_medium ?? incoming?.utm_medium,
    utm_campaign: existing?.utm_campaign ?? incoming?.utm_campaign,
  };

  const hasValue = UTM_PARAM_KEYS.some((key) => merged[key]);
  return hasValue ? merged : undefined;
}
