# Legal compliance infrastructure

NovaRho needs a reusable legal compliance stack across every web property. The Automate This Week site now shares the same structure that future projects can plug into:

## Cookie consent module

- **Component:** `src/components/CookieConsentBanner.tsx` is a client component that renders a banner with granular toggles for analytics and marketing cookies, Accept All / Save buttons, and a “Manage cookies” link to `/legal#cookies`. It automatically checks for the `nova_consent_preferences` cookie and writes new consent decisions with a 1‑year lifetime (`SameSite=Lax`, `secure`, path `/`).
- **Library:** `src/lib/compliance/consent.ts` exports the cookie name, optional category list, label/descriptions, and helper verbs (`readConsentCookie`, `writeConsentCookie`, `hasConsentFor`, etc.). Copy or import this module into a future property and call `writeConsentCookie` before calling any analytics scripts that require consent.
- **Integration:** Mount the banner once per property inside the root layout so it appears on all pages (see `src/app/layout.tsx`). Add `LegalFooterLinks` or a similar footer nav that points to `/legal#cookies` so visitors can revisit the policy.
- **Customization:** Update `COOKIE_CATEGORY_DEFINITIONS` if new categories are required. Keep `DEFAULT_CONSENT` aligned with whichever categories you surface on the banner. Any scripts that read consent should call `hasConsentFor(category)` before firing.

## Legal pages

The `/legal` page (`src/app/legal/page.tsx`) already centralizes Privacy, Cookies, Data Protection, and Terms of Use content with the anchors that the footer links target. When a new property copies this page, ensure the address, controller details, and supporting processors (Vercel, Postmark, Plausible) are accurate for that brand.

## Future reuse checklist

1. Copy `src/lib/compliance/consent.ts` with any category tweaks.
2. Add `CookieConsentBanner` and mount it in the new layout.
3. Update or copy `LegalFooterLinks` so the footer always points to the legal anchors (privacy, cookies, data protection, terms).
4. Ensure the `/legal` page exists and explains data categories, legal bases, processors, and cookie retention timelines.
5. Run `pnpm lint` (and `pnpm build` if needed) to confirm the property bundles without regressions before release.

Keeping this doc alongside the code helps future engineers hook their own sites into NovaRho’s compliance guardrails.
