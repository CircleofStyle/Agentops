"use client";

import { useI18n } from "@/i18n/I18nProvider";

interface AffiliateDisclosureProps {
  className?: string;
}

export function AffiliateDisclosure({ className = "" }: AffiliateDisclosureProps) {
  const { dict } = useI18n();

  return (
    <p
      className={`text-xs italic leading-relaxed text-slate-500 ${className}`.trim()}
      data-testid="affiliate-disclosure"
    >
      {dict.affiliate.disclosure}
    </p>
  );
}
