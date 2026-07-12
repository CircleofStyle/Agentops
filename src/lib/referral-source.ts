/** Allowed values for optional signup "How did you hear about us?" field. */
export const REFERRAL_SOURCE_OPTIONS = [
  "search",
  "reddit",
  "social",
  "friend",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCE_OPTIONS)[number];

export function isReferralSource(value: string): value is ReferralSource {
  return (REFERRAL_SOURCE_OPTIONS as readonly string[]).includes(value);
}
