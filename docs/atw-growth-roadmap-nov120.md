# ATW growth roadmap — content frame, all-access tier, affiliates, TikTok

**Owner:** CMO · **Issue:** [NOV-120](/NOV/issues/NOV-120) · **Board feedback:** 2026-06-20  
**Related:** [drip-sequence-spec](/NOV/issues/NOV-120#document-drip-sequence-spec) · [NOV-119](/NOV/issues/NOV-119) drip implementation

---

## Executive summary

The 7-day drip is the **default free path** — it builds habit and trust. Board is right: impatient readers need an **all-access escape hatch**, and subscribers need a **visible content frame** so they know what they're signing up for. Cursor/Paperclip referral links fit as **scoped affiliate tools** (not on every issue). TikTok is a strong top-of-funnel channel if the board films short demos — CMO can script; board owns the account.

---

## 1. Two-tier product model (recommended)

| Tier | Price (CMO proposal) | What they get | Who it's for |
|------|------------------------|---------------|--------------|
| **Free sequence** | €0 | Drip: 1 playbook every 7 days from confirm; 1 web sample | Patient builders who want one thing at a time |
| **All Access Pass** | **€29 one-time** (launch) | Immediate access to full published archive + every new playbook on publish | Impatient implementers, agency owners, "just give me the library" |

### Why one-time €29 (not subscription) at launch

- Matches "copy-paste playbook" product — feels like buying a toolkit, not another SaaS bill
- Easier to ship on **Gumroad** (infrastructure already planned for kit sales)
- Can add **€9/mo "Pro"** later (early access + templates) once archive has 8+ issues

### Copy (subscriber-facing)

**Landing helper line (under signup):**

> Free: one playbook every 7 days after you confirm. **Can't wait?** [Get all access →](/all-access) — every published playbook, immediately.

**All-access page headline:**

> Skip the wait — get every playbook now

**Subhead:**

> Same step-by-step workflows. No drip timer. One flat price, yours forever (includes future Season 1 playbooks as we publish them).

### CTO handoff (not CMO scope)

- Gumroad product + webhook or manual code list for `allAccess: true` on subscriber
- Gated archive routes: email-only issues unlock for pass holders
- Do **not** break free drip for non-payers

---

## 2. Season 1 content frame — "12 playbooks, one operating system"

Give subscribers a **visible arc** so the drip feels intentional, not random.

### Narrative promise

> **Season 1:** 12 practical automations that turn a 1–10 person service business into a calm, follow-up-proof operation — inbox, quotes, reviews, scheduling, invoices, and client comms.

### Issue map

| # | Slug (planned) | Title (working) | Funnel pillar | Status |
|---|----------------|-----------------|---------------|--------|
| 1 | `auto-triage-customer-emails` | Auto-triage customer emails | **Capture** | ✅ Published |
| 2 | `quote-follow-up-workflow` | Never forget to follow up on a quote | **Convert** | ✅ Published |
| 3 | `google-review-request-workflow` | Turn finished jobs into Google reviews | **Reputation** | ✅ Draft approved |
| 4 | `appointment-reminder-workflow` | Cut no-shows with automated reminders | **Deliver** | 📋 Planned |
| 5 | `invoice-chase-workflow` | Friendly payment reminders without awkward calls | **Cash** | 📋 Planned |
| 6 | `new-lead-welcome-sequence` | Instant welcome + intake for new inquiries | **Capture** | 📋 Planned |
| 7 | `job-completion-checklist` | Auto-send completion summary + upsell prompt | **Deliver** | 📋 Planned |
| 8 | `referral-ask-workflow` | Ask happy clients for referrals on schedule | **Grow** | 📋 Planned |
| 9 | `weekly-ops-dashboard` | One Google Sheet dashboard for open quotes/jobs | **Ops** | 📋 Planned |
| 10 | `slack-team-alerts` | Route urgent jobs to the right person in Slack | **Ops** | 📋 Planned |
| 11 | `review-response-templates` | Draft replies to Google reviews in one click | **Reputation** | 📋 Planned |
| 12 | `crown-discipline-ai-ceo` | Crown discipline — run automations as a system | **Lead** | 💎 Paid add-on (not in drip) |

**Publishing cadence:** 1 issue / 7 days in drip for playbooks **#1–11** only. Free drip does **not** include #12. Crown Discipline is a separate paid purchase.

**After playbook #11:** Subscribers see "Season 1 complete" email with Crown Discipline upsell; all-access holders get playbooks #1–11 immediately but **not** crown content.

### Where to show the frame

| Surface | Copy |
|---------|------|
| Landing (new section) | "Season 1: 12 playbooks from inbox triage to reviews — one every 7 days" |
| Signup footer | "You'll receive playbooks 1→12 in order. See the full Season 1 list." |
| Welcome email | Link to `/season-1` roadmap page |
| Legal / privacy | No change beyond existing newsletter disclosure |

---

## 3. Crown discipline — paid Season 1 finale (board decision 2026-06-21)

**Supersedes** prior `/tools` builder-transparency plan ([NOV-144](/NOV/issues/NOV-144)). Board direction on [NOV-142](/NOV/issues/NOV-142): sell **crown discipline** as a paid AI CEO operating model — no public tool disclosure.

### Three-tier model (updated)

| Tier | Price (CMO proposal) | What they get |
|------|------------------------|---------------|
| **Free sequence** | €0 | Drip: playbooks **#1–11** every 7 days |
| **All Access Pass** | €29 one-time | Immediate access to published playbooks **#1–11** + future Season 1 issues as shipped |
| **Crown Discipline** | **€59 one-time** (board confirms SKU) | Playbook **#12** only — AI CEO orchestration playbook |

**Distinction:** All Access = skip drip timer for the no-code library. Crown = operating-model upgrade (AI CEO + specialist agents). Crown does **not** unlock #1–11; All Access does **not** include #12.

### Season 1 #12 listing

| Field | Value |
|-------|-------|
| Slug | `crown-discipline-ai-ceo` |
| Title | Crown discipline — run automations as a system |
| Pillar | **Lead** |
| Badge | Paid add-on · not in free drip |
| Promise | Install an AI CEO that orchestrates specialist agents so your playbooks run as one operating system — not scattered Zaps. |

Full copy blocks: [crown-discipline-copy](/NOV/issues/NOV-146#document-crown-discipline-copy) · CMO issue [NOV-146](/NOV/issues/NOV-146)

### Retire `/tools` (CMO + CEO agree)

| Action | Rationale |
|--------|-----------|
| Hide/remove `/tools` route | Board does not want public disclosure of internal builder stack |
| Strip footer/nav links | No subscriber path to Cursor/Paperclip affiliates |
| Keep affiliate env keys dormant | Board may use privately; never surface on public pages |

Implementation: [NOV-147](/NOV/issues/NOV-147) (CTO)

### Voice guardrails

- Sell **AI CEO orchestrating specialist agents** — no Cursor, Paperclip, or NovaRho stack names
- Frame as **operating model upgrade**, not "when Zapier fails"
- Crown is **paid**, **not in drip**, **not included in All Access**

### Side project angle (unchanged)

A separate **"Automate with Agents"** mini-newsletter remains viable later — different ICP (technical founders). For ATW Season 1 public brand, stay **"no dev team required"** for #1–11; crown is the optional orchestration layer for ready operators.

---

## 4. TikTok — CMO view

### Verdict: **Strong channel, right product — launch after issue #3 publishes**

| Pros | Cons / mitigations |
|------|-------------------|
| Visual product — automations demo well in 30–60s | Board time to film; batch 4 videos in one session |
| Top-of-funnel for 1–10 person service businesses | Don't promise tools we haven't playbook'd yet |
| Repurpose drip content (scripts already written) | Link in bio → landing, not direct Gumroad (trust first) |

### Content format (repeatable)

**Template:** Hook (pain) → 3-step screen capture → CTA "Full playbook free in bio"

| Episode | Hook | Source playbook |
|---------|------|-----------------|
| 1 | "Your shared inbox is losing you quotes" | Issue #1 triage |
| 2 | "Sent a quote and they ghosted?" | Issue #2 follow-up |
| 3 | "Finished the job but no Google review?" | Issue #3 reviews |
| 4 | "Can't wait 3 weeks for all 12?" | All-access tease |

**Bio link:** `automatethisweek.com?utm_source=tiktok&utm_medium=bio`

**Posting cadence:** 2× / week once backlog of 4 videos exists; CMO drafts scripts from playbook steps.

### Board-owned account

Correct model: board films (authentic SMB-adjacent face), CMO writes scripts + on-screen text. No agent posts to TikTok.

---

## 5. Decisions needed from board

| # | Decision | CMO recommendation |
|---|----------|-------------------|
| A | All-access price | €29 one-time launch; revisit at 8 issues |
| B | Season 1 frame | Approve 12-issue map above (titles can shift) |
| C | Crown Discipline tier | €59 one-time launch SKU; board creates Gumroad product |
| D | Retire `/tools` | Hide public builder-stack page per board direction |
| E | TikTok | Green-light after issue #3 publish; board films, CMO scripts |

---

## Handoff

| Owner | Next action |
|-------|-------------|
| **Board** | Confirm decisions A–E; create Crown Discipline Gumroad SKU (name + price) |
| **CEO** | Approve crown copy + three-tier model |
| **CMO** | Crown copy delivered — [NOV-146](/NOV/issues/NOV-146) |
| **CTO** | Implement crown gate, `/crown`, season-1 #12, hide `/tools` — [NOV-147](/NOV/issues/NOV-147) |
