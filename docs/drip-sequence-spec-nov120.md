# Drip sequence content spec — Automate This Week

**Owner:** CMO · **Issue:** [NOV-120](/NOV/issues/NOV-120) · **Parent:** [NOV-118](/NOV/issues/NOV-118) · **Implementation:** [NOV-119](/NOV/issues/NOV-119)

## CEO decision (locked)

Adopt a **fixed per-subscriber drip sequence** — same ordered playbooks for everyone, anchored to each subscriber's confirm date. **Not** a Tuesday broadcast to the full list.

---

## Sequence overview

| Step | Trigger | Email type | Content | CTO send window |
|------|---------|------------|---------|-----------------|
| 0 | Subscribe | Verification | Confirm link only (no playbook) | Immediate |
| 1 | Confirm | **Welcome** | Short confirmation + sequence promise | Within 5 min of confirm |
| 2 | Confirm (same heartbeat) | **Issue #1** | Full playbook: auto-triage customer emails | Within 5 min of confirm |
| 3 | Confirm + 7 days | **Issue #2** | Full playbook: quote follow-up workflow | Due at `confirmedAt + 7d` |
| 4 | Confirm + 14 days | **Issue #3** | Full playbook: Google review request workflow | Due at `confirmedAt + 14d` |
| 5+ | Prior issue + 7 days | **Issue #4…** | Next published playbook in order | Due at `lastIssueSentAt + 7d` |

### Welcome vs issue #1

| | Welcome | Issue #1 |
|---|---------|----------|
| **Purpose** | Acknowledge confirm; set delivery expectation | Deliver first playbook value |
| **Subject line** | `You're in — your playbook sequence starts now` | `Playbook #1: Auto-triage customer emails` |
| **Body** | 2–3 sentences + what happens next | Full issue HTML (same template as broadcast) |
| **CTA** | Optional link to free sample on web | Primary CTA: read on web (sample) or implement steps |
| **Send timing** | Same confirm event | Same confirm event, after welcome (or merged — CTO choice) |

**CMO recommendation:** Keep welcome and issue #1 as **separate sends** on confirm. Welcome is transactional (~50 words); issue #1 is the product. Merging creates a long first email and buries the confirm reassurance.

---

## Cadence: 7 days

**Recommendation: 7 calendar days between playbook emails.**

| Rationale | Detail |
|-----------|--------|
| Implementation time | Each playbook targets ≤30 min setup; a week gives room to implement before the next arrives |
| Habit without fatigue | Faster than biweekly; slower than daily — matches "automate one thing this week" positioning |
| Ops simplicity | Fixed offset from `confirmedAt` / `lastIssueSentAt` — no Tuesday cron alignment needed |
| Broadcast deprecation | Removes calendar coupling; new subscribers no longer wait for "next Tuesday" |

**Edge cases (for CTO):**

- Confirm at 23:00 → issue #2 due 7×24h later, not "next Tuesday"
- Subscriber catches up after pause → send next unsent issue when due job runs
- End of published sequence → stop drip; optional "you've completed the series" email (backlog)

---

## Issue order (sequence position)

Sequence order = **`publishedAt` ascending** (oldest first). Slug is the stable key for CTO scheduler.

| # | Slug | Title | Status | Visibility | publishedAt | Drip-ready |
|---|------|-------|--------|------------|-------------|------------|
| 1 | `auto-triage-customer-emails` | Auto-triage customer emails with a 15-minute Zapier + GPT workflow | published | sample (web + email) | 2026-06-09 | ✅ Full body |
| 2 | `quote-follow-up-workflow` | Never forget to follow up on a quote again | published | email-only | 2026-06-16 | ✅ Full body |
| 3 | `google-review-request-workflow` | Turn finished jobs into Google reviews — automatically | published | email-only | 2026-06-19 | ✅ Full body ([NOV-121](/NOV/issues/NOV-121)) |
| 4+ | — | *Backlog* | — | — | — | ❌ Not drafted |

### Funnel arc (issues #1–3)

| # | Playbook | Stage |
|---|----------|-------|
| 1 | Auto-triage customer emails | Capture leads |
| 2 | Quote follow-up workflow | Convert quotes |
| 3 | Google review request workflow | Social proof from delivered jobs |

### Content readiness verdict

- **Issue #1:** Ready — published, complete step-by-step, sample visible on web.
- **Issue #2:** Ready — published, email-only gate, full playbook in `content/issues/quote-follow-up-workflow.md`. Diagram asset still "coming soon" (text flow sufficient for email).
- **Issue #3:** Published — full playbook at `content/issues/google-review-request-workflow.md` (25 min, email-only). Approved on [NOV-121](/NOV/issues/NOV-121). **Board:** add Google Sheet template URL in playbook before first send.
- **Issue #4+:** Backlog — sequence extends 7 days per new published issue.

**CTO sequence source:** Filter `status: published`, sort by `publishedAt` asc, map to `sequencePosition` 1…n. Issue #3 enters sequence automatically after board publishes.

---

## Copy promise (subscriber-facing)

**Say:**

- "Your personal playbook sequence starts when you confirm."
- "Issue #1 arrives within minutes; the next playbook follows every 7 days."
- "One practical workflow at a time — finish at your pace."

**Do not say:**

- "Every Tuesday"
- "Same email to everyone on the list"
- "Weekly newsletter blast"

---

## Copy audit — files updated (NOV-120)

| File | Surface | Before (broadcast) | After (drip) |
|------|---------|-------------------|--------------|
| `src/app/page.tsx` | Hero subhead | Each Tuesday: one copy-paste playbook… | Your personal playbook sequence starts when you confirm — one copy-paste workflow every 7 days. |
| `src/app/page.tsx` | Value section H2 | What you get every week | What you get in your sequence |
| `src/components/SignupForm.tsx` | CTA | Send me the weekly playbook | Start my playbook sequence |
| `src/components/SignupForm.tsx` | Footer | one playbook per week | one playbook every 7 days after you confirm |
| `src/components/IssueEmailGate.tsx` | Gate body | ship every Tuesday to verified subscribers | delivered in your personal sequence after you confirm |
| `src/app/issues/page.tsx` | Archive intro | every Tuesday | every 7 days in your sequence |
| `src/app/confirmed/page.tsx` | Post-confirm | arrive every Tuesday | Issue #1 is on its way; the next playbook follows in 7 days |
| `src/app/layout.tsx` | Meta description | every Tuesday by email | in your personal sequence by email |
| `src/app/legal/page.tsx` | Newsletter delivery | Full weekly playbooks | Full playbooks on a fixed sequence (one every 7 days after confirm) |
| `src/lib/email.ts` | `sendWelcomeEmail` | Each week you'll get one… | Sequence starts now; issue #1 on its way; next in 7 days |

---

## Handoff

| Owner | Action |
|-------|--------|
| **CTO** ([NOV-119](/NOV/issues/NOV-119)) | Implement confirm → welcome + issue #1; 7-day scheduler; sequence state on subscriber |
| **CEO** | Approve updated sequence spec + copy (confirmation on this issue) |
| **Board** | Add Google Sheet template link in issue #3 playbook before first drip send |

---

## CTO timing implementation ([NOV-196](/NOV/issues/NOV-196))

Per-subscriber drip is live. Each subscriber's sequence is anchored to their own `confirmedAt` — not a shared calendar send.

### Environment inputs (marketing-adjustable)

| Variable | Default | Effect |
|----------|---------|--------|
| `DRIP_CADENCE_DAYS` | `7` | Calendar days between playbook emails after issue #1 |
| `DRIP_SEQUENCE_ENABLED` | `true` | When `false`, reverts to legacy Tuesday broadcast on publish |

Change cadence by setting `DRIP_CADENCE_DAYS` in Vercel env (or `.env.local`). No code change required unless marketing wants a non-day-based interval.

### Subscriber fields that drive send timing

| Field | Set when | Drives |
|-------|----------|--------|
| `confirmedAt` | Email confirm | Catch-up schedule anchor; issue #1 send window |
| `dripEnrolledAt` | Confirm or first drip send | Sequence enrollment timestamp |
| `dripSequenceIndex` | After each drip send | Count of playbooks sent (`0` = enrolled, issue #1 pending/sent) |
| `lastDripSentAt` | After each drip send | Next issue due at `lastDripSentAt + DRIP_CADENCE_DAYS` |
| `issuesSent[]` | After each drip send | Audit trail of slugs delivered |

On Vercel (read-only filesystem), drip fields sync to Resend contact properties (`drip_enrolled_at`, `drip_sequence_index`, `last_drip_sent_at`) so the daily cron can advance sequences without local file writes.

### Send pipeline

| Step | Trigger | Code path |
|------|---------|-----------|
| Welcome | Confirm click | `sendWelcomeEmail` in `src/lib/email.ts` |
| Issue #1 | Same confirm heartbeat | `sendInitialDripIssue` → `sendPlaybookDripToSubscriber` |
| Issue #2+ | Daily cron 14:00 UTC | `GET /api/pipeline/drip` → `processDueDripEmails` |
| Catch-up | Manual / audit | `catchUpSubscriberDrip` or `catchUpAllBehindDrip` (uses `confirmedAt` anchor) |

### Due-date logic

- **Issue #1:** Sent immediately on confirm (within the confirm API request).
- **Issue #2+:** Cron checks `lastDripSentAt + DRIP_CADENCE_DAYS`. With issue #1 sent on confirm day, issue #2 lands ~7 days after confirm.
- **Catch-up:** `expectedDripIndex` computes how many issues should have been sent based on `confirmedAt` and cadence; `catchUpSubscriberDrip` sends any missed issues in order.

### Ops commands

```bash
pnpm content:drip --dry-run          # preview due sends without Resend calls
curl …/api/pipeline/drip -d '{"audit":true}'   # subscriber audit report
curl …/api/pipeline/drip -d '{"catchUpEmail":"user@example.com"}'  # single-subscriber catch-up
```

### Legal / subscriber-facing pages

Legal copy updated in `src/app/[locale]/legal/page.tsx` — delivery described as "fixed sequence, one every 7 days after confirm." No further legal changes required for drip framing unless marketing adds new claims (e.g. completion email at end of series — backlog).
