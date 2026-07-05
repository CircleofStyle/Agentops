# SEO FAQ schema component (CMO shells)

Reusable JSON-LD for public SEO summary pages. Implemented in [NOV-251](/NOV/issues/NOV-251); consumed by CMO shells in [NOV-253](/NOV/issues/NOV-253).

## Component

`src/components/FaqSchema.tsx` renders a `FAQPage` schema.org block from a question/answer list.

```tsx
import { FaqSchema } from "@/components/FaqSchema";

const faqs = [
  {
    question: "How long does this workflow take to set up?",
    answer: "Most teams finish in under 30 minutes with Gmail and Zapier.",
  },
  {
    question: "Do I need to code?",
    answer: "No — every step uses no-code tools with copy-paste templates.",
  },
];

export default function PublicSeoShell() {
  return (
    <>
      <FaqSchema items={faqs} />
      {/* page content */}
    </>
  );
}
```

## Rules

- Use plain-text answers (no HTML). Strip markdown if copying from playbook body.
- Keep 3–6 FAQs per shell page; match visible on-page FAQ copy when shells include an accordion.
- Place `<FaqSchema />` once per page, near the top of the server component tree.
- Pair with `generateMetadata()` canonical + OG tags from `src/lib/seo-issue-metadata.ts` pattern.

## Related technical SEO

| Route | File |
| --- | --- |
| `/sitemap.xml` | `src/app/sitemap.ts` |
| `/robots.txt` | `src/app/robots.ts` |
| Issue Article JSON-LD | `src/components/IssueArticleSchema.tsx` |
| Issue metadata helper | `src/lib/seo-issue-metadata.ts` |

## Signup referral attribution

Optional signup field **"How did you hear about us?"** stores `referralSource` on subscriber records. Counts appear in `/api/metrics` under `attribution.byReferralSource`.

Allowed values: `search`, `reddit`, `social`, `friend`, `other` (`src/lib/referral-source.ts`).
