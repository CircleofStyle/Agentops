import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates";

interface AffiliateDisclosureProps {
  className?: string;
}

export function AffiliateDisclosure({ className = "" }: AffiliateDisclosureProps) {
  return (
    <p
      className={`text-xs italic leading-relaxed text-slate-500 ${className}`.trim()}
      data-testid="affiliate-disclosure"
    >
      {AFFILIATE_DISCLOSURE}
    </p>
  );
}
