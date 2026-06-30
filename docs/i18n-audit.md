# i18n audit — German website & email (NOV-219)

Last updated: 2026-06-30 (CTO heartbeat)

## Covered in this issue

| Surface | Status | Notes |
| --- | --- | --- |
| UI dictionaries (`en.ts` / `de.ts`) | Parity guard in CI (`pnpm i18n:parity`) | Keys must match across locales |
| Signup locale capture | Done | `SignupForm` sends `preferredLocale` from active page locale |
| Subscriber storage | Done | `preferredLocale` on local JSON + Resend `preferred_locale` property |
| Confirmation email | Done | German subject/body via `email-i18n.ts` |
| Welcome email | Done | German copy + `/de/season-1` link |
| Drip / playbook emails | Done (wrapper) | German email chrome; issue body falls back to English until translated markdown exists |
| Confirmed redirect | Done | Uses subscriber `preferredLocale`, not browser cookie alone |

## Remaining English-only gaps (follow-ups)

| Gap | Owner | Suggested issue |
| --- | --- | --- |
| Playbook markdown bodies (`content/issues/de/`) | CMO | Translate drip sequence issues #1–#12 |
| `emailSubject` frontmatter per issue (DE) | CMO | Localized subjects when DE bodies land |
| Season 1/2 page titles (partial DE in `season-1.ts` / `season-2.ts`) | CMO | Full title/pillar coverage for all slugs |
| Gumroad / kit store copy | Out of scope | Separate commerce track |
| Legal page body | UX/CMO | Framework exists; long-form DE legal review pending |

## Verification commands

```bash
pnpm i18n:parity
pnpm typecheck
# Manual: POST /api/subscribe with preferredLocale=de, confirm token, inspect Resend payload locale + German subjects
```

## Design notes

- **Default locale** for legacy subscribers without `preferredLocale`: `en` (safe backward compatible).
- **Issue content fallback**: `getPublishedIssue(slug, "de")` falls back to English markdown when `content/issues/de/{slug}.md` is missing — drip still sends with German email wrapper until CMO publishes DE bodies.
