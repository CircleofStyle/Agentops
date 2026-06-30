# Bilingual publishing runbook — Automate This Week

**Owner:** CMO (copy) + CTO (wiring) · **Issue:** [NOV-220](/NOV/issues/NOV-220) · **Parent:** [NOV-217](/NOV/issues/NOV-217)

## Rule

**No publish ships English-only.** Every web surface, playbook, and email must have German (`de`) alongside English (`en`) in the same release.

---

## Pre-publish checklist

| # | Surface | Owner | EN location | DE location | Verify |
|---|---------|-------|-------------|-------------|--------|
| 1 | UI strings | CMO → CTO | `src/i18n/dictionaries/en.ts` | `src/i18n/dictionaries/de.ts` | `pnpm i18n:parity` passes |
| 2 | New playbook (web) | CMO | `content/issues/{slug}.md` | `content/issues/de/{slug}.md` | DE file exists; same `slug` + `status` |
| 3 | Drip email subject | CMO | `emailSubject` in EN frontmatter | `emailSubject` in DE frontmatter | Subject line reviewed |
| 4 | Transactional emails | CMO → CTO | `src/lib/email.ts` (EN today) | `src/i18n/dictionaries/email.ts` (proposed) | DE subscriber receives DE copy |
| 5 | Playbook email shell | CMO → CTO | `src/lib/playbook-email.ts` | locale-aware strings | CTA, diagram callout, footer in DE |
| 6 | Season roadmap titles | CMO | `src/lib/season-1.ts` `SEASON_1_ISSUES` | `SEASON_1_TITLES_DE` map | New slug added to both |
| 7 | Legal pages | Board + CMO | `src/app/[locale]/legal/` | Same route, `de` notice if EN-only body | `legal.deNotice` accurate |

---

## Publish workflow (new playbook)

1. **CMO drafts** EN playbook in `content/issues/{slug}.md`.
2. **CMO drafts** DE playbook in `content/issues/de/{slug}.md` (same frontmatter keys, translated body).
3. **CMO adds** German title to `SEASON_1_TITLES_DE` in `season-1.ts` if Season 1 issue.
4. **CTO publishes** both files in same commit/deploy.
5. **Verify:**
   - `/de/issues/{slug}` renders German title + body
   - `/en/issues/{slug}` unchanged
   - Test subscriber with `preferredLocale: de` receives DE drip email on next send
6. **CMO signs off** in issue comment before CEO closes publish task.

---

## Publish workflow (UI copy change)

1. Edit `en.ts` and `de.ts` in the **same PR**.
2. Run `pnpm i18n:parity` (CTO guardrail from [NOV-219](/NOV/issues/NOV-219)).
3. Spot-check `/de` and `/en` on changed surfaces.

---

## Publish workflow (email-only change)

1. Update strings in issue document [email-copy-de](/NOV/issues/NOV-220#document-email-copy-de) or playbook DE files.
2. CTO wires into `email.ts` / `playbook-email.ts` with `preferredLocale`.
3. Send test to `+de-test@` subscriber; confirm subject + body language.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **CMO** | DE copy for all new content; dictionary parity; email subject lines |
| **CTO** | `preferredLocale` routing; i18n parity CI; locale param on `getPublishedIssue` |
| **CEO** | Approve publish when checklist complete |
| **Board** | Legal body translation (backlog); Gumroad product copy if localized later |

---

## Verification commands

```bash
pnpm i18n:parity                    # en.ts / de.ts key parity
ls content/issues/de/*.md             # German playbooks on disk
curl …/api/pipeline/drip -d '{"audit":true}'   # drip sequence slugs
```

---

## Backlog

- Full DE translation of legal page bodies (currently EN with `deNotice` banner)
- Season 2 playbook DE files when Season 2 publishes
- Gumroad checkout copy localization (separate epic)
