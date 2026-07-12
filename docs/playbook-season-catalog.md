---
title: Playbook Season Catalog
description: Season 1 (Zapier-first) and Season 2 (Make-first) topic catalog — canonical workspace copy.
source: NOV-198#document-season-catalog
---

# Season 1 & 2 topic catalog

**Issue:** [NOV-197](/NOV/issues/NOV-197) · **Author:** CMO · **Date:** 2026-06-30  
**Strategic framing:** [plan document](/NOV/issues/NOV-197#document-plan) · **Baseline:** `src/lib/season-1.ts`, [growth roadmap](/NOV/issues/NOV-120)

---

## Bridge decision — Playbook #4 (`appointment-reminder`)

**Recommendation: (b) Rewrite #4 for Zapier; move the Make draft to Season 2 #1.**

| Option | Verdict | Rationale |
|--------|---------|-----------|
| (a) Keep Make #4 in S1 as bridge | ❌ Reject | Breaks S1 Zapier-first promise after three Zapier playbooks; confuses subscribers who chose ATW for "no dev team required" simple Zaps. |
| **(b) Zapier #4 in S1; Make version → S2 #1** | ✅ **Adopt** | S1 stays tool-consistent through #11. The existing Make draft (`content/issues/appointment-reminder-workflow.md`) becomes S2 opener — natural graduation moment (email + SMS branching showcases Make without polluting S1). |

**CTO handoff:** Retarget existing Make draft to S2 #1 slug `multi-channel-appointment-reminders`. Author new Zapier-first #4 with Calendar trigger + Gmail (+ optional simple SMS if Zapier supports); keep same business outcome and slug `appointment-reminder-workflow`.

---

## Audience fit — ESP overlap (Klaviyo, Mailchimp, etc.)

**Board note (2026-06-30):** Several Season 1 automations — especially **Google review requests (#3)** — are standard flows in email marketing platforms (Klaviyo, Mailchimp, Brevo, ActiveCampaign, Omnisend). We should position explicitly, not pretend these are novel.

### ICP we serve

| Profile | Stack | Why ATW playbooks |
|---------|-------|-------------------|
| **Primary ICP** | Gmail + Google Sheets + Calendar; no ESP subscription | Needs copy-paste automations without a $20–300/mo marketing platform |
| **Secondary** | Has ESP but job data lives outside it (field service, trades, agencies) | ESP can't trigger on "job marked complete in Sheet" without Zapier/Make anyway |
| **Not our fight** | Klaviyo/Mailchimp shop with native post-purchase flows | Point them to ESP docs; don't sell duplicate automation |

**Season promise stays valid:** we're teaching *operating-system wiring* for tiny service businesses, not competing with ESP feature checklists.

### Overlap matrix (Season 1)

| # | Slug | ESP overlap | Keep in catalog? | Positioning |
|---|------|-------------|------------------|-------------|
| 3 | `google-review-request-workflow` | **High** — post-purchase review flows are ESP defaults | ✅ Yes — core drip + reputation pillar | Lead with **job-completion trigger from Sheets**, not "send an email." Add playbook callout: *"Already on Klaviyo? Use their review flow — or wire this if your jobs live in a spreadsheet."* |
| 6 | `new-lead-welcome-sequence` | **High** — welcome series is ESP bread-and-butter | ✅ Yes | Same callout; ATW value = instant Zap from form/inbox before they buy an ESP |
| 8 | `referral-ask-workflow` | Medium — post-purchase / loyalty flows | ✅ Yes | Timed ask off job-complete event, not list segment |
| 4 | `appointment-reminder-workflow` | Medium — some ESPs + Calendly native | ✅ Yes | Calendar-triggered; overlaps Calendly/Acuity more than Klaviyo |
| 5 | `invoice-chase-workflow` | Low | ✅ Yes | Cash pillar; invoice/overdue trigger is outside ESP scope |
| 7 | `job-completion-checklist` | Medium | ✅ Yes | Deliverable + upsell; ESP lacks job context |
| 1–2, 9–11 | inbox / quote / ops | Low–medium | ✅ Yes | Cross-tool ops; ESP doesn't replace |

**Catalog decision:** No topic removals. Add **"ESP overlap"** column to playbook intros (CMO) and a shared **"Already on Klaviyo/Mailchimp?"** sidebar component for #3, #6, #8.

### Season 2 distinction

S2 reputation playbooks (**#7 multi-location review monitor**, **#12 full lifecycle**) are **monitoring + orchestration**, not ESP campaign clones — low overlap with Klaviyo review-request templates.

---

## Season 1 — framing

| Field | EN | DE |
|-------|----|----|
| **Title** | Season 1 | Season 1 |
| **Subtitle** | 12 playbooks, one operating system | 12 Playbooks, ein Betriebssystem |
| **Promise** | 12 practical automations that turn a 1–10 person service business into a calm, follow-up-proof operation — inbox, quotes, reviews, scheduling, invoices, and client comms. | 12 praktische Automationen, die ein Dienstleistungsunternehmen mit 1–10 Personen in einen ruhigen, nachfass-sicheren Betrieb verwandeln — Posteingang, Angebote, Bewertungen, Termine, Rechnungen und Kundenkommunikation. |

**Tool default:** Zapier-first · **Affiliate:** Zapier pending review — use generic signup links until approved; disclose when live.

---

## Season 1 — playbook catalog

| # | Slug | EN title | DE title | Pillar | Primary tool | Status | Drip | 1-line outcome | Affiliate tools |
|---|------|----------|----------|--------|--------------|--------|------|----------------|-----------------|
| 1 | `auto-triage-customer-emails` | Auto-triage customer emails | Kunden-E-Mails automatisch sortieren | Capture | Zapier | published | ✅ #1–11 | Every inquiry gets sorted and answered — nothing sits in the inbox. | Zapier *(pending)* |
| 2 | `quote-follow-up-workflow` | Never forget to follow up on a quote | Nie wieder ein Angebot vergessen nachzufassen | Convert | Zapier | published | ✅ | Sent quotes get timed follow-ups so ghosted leads come back. | Zapier *(pending)* |
| 3 | `google-review-request-workflow` | Turn finished jobs into Google reviews | Abgeschlossene Aufträge in Google-Bewertungen verwandeln | Reputation | Zapier | published | ✅ | Completed jobs trigger a polite review ask on schedule. | Zapier *(pending)* |
| 4 | `appointment-reminder-workflow` | Cut no-shows with automated reminders | Terminausfälle mit automatischen Erinnerungen reduzieren | Deliver | Zapier | published | ✅ | Confirmed appointments get timed email reminders — fewer empty slots. | Zapier *(pending)* |
| 5 | `invoice-chase-workflow` | Friendly payment reminders without awkward calls | Freundliche Zahlungserinnerungen ohne unangenehme Anrufe | Cash | Zapier | published | ✅ | Overdue invoices get escalating nudges — cash arrives without phone tag. | Zapier *(pending)* |
| 6 | `new-lead-welcome-sequence` | Instant welcome + intake for new inquiries | Sofortige Begrüßung und Aufnahme bei neuen Anfragen | Capture | Zapier | published | ✅ | New leads get an immediate welcome and a short intake form — before they shop elsewhere. | Zapier *(pending)* |
| 7 | `job-completion-checklist` | Auto-send completion summary + upsell prompt | Abschlusszusammenfassung und Upsell automatisch senden | Deliver | Zapier | published | ✅ | Job done → client gets a summary, checklist, and a natural upsell ask. | Zapier *(pending)* |
| 8 | `referral-ask-workflow` | Ask happy clients for referrals on schedule | Zufriedene Kunden planmässig um Empfehlungen bitten | Grow | Zapier | published | ✅ | Satisfied clients get a timed referral ask — word-of-mouth on autopilot. | Zapier *(pending)* |
| 9 | `weekly-ops-dashboard` | One Google Sheet dashboard for open quotes/jobs | Ein Google-Sheet-Dashboard für offene Angebote und Aufträge | Ops | Zapier | planned | ✅ | One live sheet shows every open quote and job — no digging through inboxes. | Zapier *(pending)* |
| 10 | `slack-team-alerts` | Route urgent jobs to the right person in Slack | Dringende Aufträge an die richtige Person in Slack leiten | Ops | Zapier | planned | ✅ | Urgent jobs ping the right teammate in Slack — nothing falls through. | Zapier *(pending)* |
| 11 | `review-response-templates` | Draft replies to Google reviews in one click | Google-Bewertungen mit einem Klick beantworten | Reputation | Zapier | published | ✅ | New reviews get a draft reply you can send in one click — reputation stays warm. | Zapier *(pending)* |
| 12 | `crown-discipline-ai-ceo` | Crown discipline — run automations as a system | Crown Discipline — Automatisierungen als System betreiben | Lead | Agent stack *(no affiliate)* | planned | ❌ paid add-on | Install an AI CEO that orchestrates specialist agents so playbooks run as one system. | — |

**Drip rule:** Free sequence delivers #1–11 only (7-day cadence). #12 is Crown Discipline paid add-on (€59); not included in All Access.

### Reconciliation notes (vs `season-1.ts` / growth roadmap)

| Change | Detail |
|--------|--------|
| Slugs added for #4–11 | Growth roadmap had planned slugs; `season-1.ts` had `slug: null` for #4–11 — catalog adopts roadmap slugs. |
| #4 primary tool | Was Make in draft; **changes to Zapier** per bridge decision. |
| #3 status | `season-1.ts` = published; growth roadmap noted "draft approved" — catalog uses **published**. |
| Titles #4–11 | Unchanged from `season-1.ts` / roadmap — no title renames. |
| DE titles #4–11 | New in this catalog (not yet in `season-1.ts` `SEASON_1_TITLES_DE`). |
| ESP overlap | Board feedback 2026-06-30 — see **Audience fit** section; #3/#6/#8 get playbook callouts, no catalog cuts. |

---

## Season 2 — framing

| Field | EN | DE |
|-------|----|----|
| **Title** | Season 2 | Season 2 |
| **Subtitle** | Level up with visual orchestration | Mit visueller Orchestrierung auf das nächste Level |
| **Promise** | 12 Make-native playbooks for graduates of Season 1 — multi-step client journeys, branching logic, and connected scenarios that turn calm ops into a scalable operating graph. | 12 Make-native Playbooks für Season-1-Absolventinnen — mehrstufige Kundenreisen, Verzweigungslogik und verbundene Szenarien, die ruhige Abläufe in ein skalierbares Betriebsnetz verwandeln. |

**Tool default:** Make.com-first · **Affiliate:** Live — use `pc=automatethisweek` in all S2 build steps.  
**Audience:** S1 completers, All Access holders ready to graduate. S2 is **not** in the free drip (separate launch / upsell path — CEO to confirm monetization).

---

## Season 2 — playbook catalog

| # | Slug | EN title | DE title | Pillar | Primary tool | Status | Drip | 1-line outcome | Affiliate tools |
|---|------|----------|----------|--------|--------------|--------|------|----------------|-----------------|
| 1 | `multi-channel-appointment-reminders` | Cut no-shows with email + SMS reminders | Terminausfälle mit E-Mail- und SMS-Erinnerungen reduzieren | Deliver | Make | planned | ❌ S2 launch | Timed email and SMS nudges with no-show flags in one visual scenario. | Make `pc=automatethisweek` |
| 2 | `unified-lead-intake` | Capture web, email, and SMS leads in one place | Web-, E-Mail- und SMS-Leads an einem Ort erfassen | Capture | Make | planned | ❌ | Every inquiry channel feeds one Make scenario — no lead left behind. | Make |
| 3 | `conditional-quote-routing` | Route quotes by job type and budget | Angebote nach Auftragsart und Budget automatisch zuweisen | Convert | Make | planned | ❌ | Incoming quotes branch to the right template and owner based on job rules. | Make |
| 4 | `client-crm-sync` | Keep your client list clean across tools | Kundenliste über alle Tools hinweg sauber halten | Ops | Make | planned | ❌ | Sheets, email, and form data dedupe and sync — one source of truth. | Make |
| 5 | `payment-status-loops` | Chase overdue invoices when payment fails | Überfällige Rechnungen bei fehlgeschlagener Zahlung nachfassen | Cash | Make | planned | ❌ | Stripe/PayPal webhooks trigger escalating reminders until paid or escalated. | Make + Stripe/PayPal |
| 6 | `team-handoff-routing` | Escalate urgent jobs with fallback routing | Dringende Aufträge mit Fallback-Routing eskalieren | Ops | Make | planned | ❌ | Urgent jobs route through Slack/Teams with timeouts and backup assignees. | Make |
| 7 | `multi-location-review-monitor` | Monitor reviews across every location | Bewertungen an jedem Standort überwachen | Reputation | Make | planned | ❌ | New reviews from all locations land in one alert + response queue. | Make |
| 8 | `weekly-owner-digest` | Monday morning report from live job data | Montagsbericht aus Live-Auftragsdaten | Ops | Make | planned | ❌ | One scheduled email summarizes open quotes, jobs, and cash — every Monday. | Make |
| 9 | `automation-error-alerts` | Know instantly when a scenario breaks | Sofort wissen, wenn ein Szenario abbricht | Ops | Make | planned | ❌ | Failed modules trigger Slack/email alerts with retry guidance. | Make |
| 10 | `reusable-sub-scenarios` | Build once, plug into every workflow | Einmal bauen, in jeden Workflow einbinden | Ops | Make | planned | ❌ | Reusable Make sub-scenarios speed up every future playbook. | Make |
| 11 | `zapier-to-make-migration` | When to rebuild in Make vs keep your Zaps | Wann in Make neu bauen vs. Zaps behalten | Lead | Make + Zapier | planned | ❌ | Decision framework + migration checklist for graduating S1 automations. | Make + Zapier *(generic until Zapier affiliate live)* |
| 12 | `full-client-lifecycle-make` | Connect intake → quote → delivery → review in Make | Erfassung → Angebot → Lieferung → Bewertung in Make verbinden | Lead | Make | planned | ❌ | Capstone: one connected scenario graph runs the full client lifecycle. | Make |

**S2 pillar arc:** Deliver → Capture → Convert → Ops → Cash → Ops → Reputation → Ops → Ops → Ops → Lead → Lead

---

## Affiliate & disclosure summary

| Season | Primary affiliate | Link policy | Disclosure |
|--------|-------------------|-------------|------------|
| S1 #1–11 | Zapier | Generic `zapier.com` signup until affiliate approved | Standard footer: *"Some links support this newsletter at no extra cost to you."* |
| S1 #12 | None | No public tool affiliates | Sell operating model, not stack |
| S2 #1–12 | Make | `make.com/en/register?pc=automatethisweek` in every build step | Same footer + Make affiliate line in playbook body |

---

## Handoff

| Owner | Next action |
|-------|-------------|
| **CEO / board** | Confirm catalog + #4 bridge decision; request board confirmation card |
| **CTO** | Implement in `season-1.ts`, new `season-2.ts`, season pages, i18n — [NOV-199](/NOV/issues/NOV-199) (blocked until approval) |
| **CMO** | After approval: rewrite S1 #4 Zapier playbook; retarget Make draft to S2 #1; add ESP-overlap callouts to #3, #6, #8 |
