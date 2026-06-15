import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-center text-sm text-slate-500">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        <LegalFooterLinks />
        <AffiliateDisclosure className="mx-auto max-w-2xl" />
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NovaRho · Automate This Week
        </p>
      </div>
    </footer>
  );
}
