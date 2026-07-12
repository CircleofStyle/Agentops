---
title: Ask happy clients for referrals on schedule
date: '2026-07-12'
status: published
slug: referral-ask-workflow
season: 1
seasonNumber: 8
sequenceOrder: 8
topic: referral ask workflow
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Turn satisfied clients into a predictable referral channel
emailSubject: "Playbook #8: Ask happy clients for referrals on schedule"
workflowDiagramAlt: Job marked complete, wait 14 days, referral ask email, gentle reminder if no response
publishedAt: '2026-07-12'
---
You delivered great work. The client would happily refer you — but nobody asks, and the moment passes.

Fourteen days after a job is marked complete, satisfied clients get a friendly referral ask. Still nothing? A gentle reminder on day 21 — without awkward in-person requests or hoping they remember you.

**Setup time: 20 minutes.**

> **Already on Klaviyo or Mailchimp?** Loyalty and post-purchase referral flows exist in most ESPs. **Wire this playbook instead** when your trigger is "job marked complete" in a Google Sheet — timed off real delivery, not a list segment your ESP can't see without Zapier.

Pairs well with [issue #3](/issues/google-review-request-workflow): ask for the review first (day 2–7), then the referral ask once they're a proven happy client (day 14+).

## The problem

Referrals are the highest-trust growth channel for local services — but owners forget to ask, or ask at the wrong moment (too soon, too pushy). ESP referral campaigns assume ecommerce purchase events, not "job complete in spreadsheet."

## The outcome

Happy clients get a timed referral ask on schedule. Word-of-mouth becomes a system, not a hope.

## What's included

- **Job Completion Tracker** — reuse columns from Playbook #3 or dedicated referral sheet
- **2 referral ask emails** — initial ask + gentle reminder
- **Setup guide** — Zapier timing off `job_completed_at`

## Setup snapshot

| | |
|---|---|
| **Setup time** | 20 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Sheets, Gmail, Zapier |
| **ROI** | One referral often covers acquisition cost for a local service job |

## Before you start

1. **Only ask proven happy clients** — filter `status` = complete and optionally `reviewed` = yes from Playbook #3.
2. **Make referring easy** — include a short link to your contact form or a "text this number" CTA.

## Step-by-step — Zapier

### 1. Track completed jobs

Reuse Playbook #3 tracker or add columns: `referral_asked_at`, `referral_status` (pending | sent | referred | declined).

### 2. Trigger — job marked complete

**Google Sheets → New Row** or **Updated Row** where `status` = **complete** (or **reviewed**).

### 3. Wait 14 days

**Delay** 14 days after `job_completed_at`. Re-read row — skip if `referral_status` already set or job was disputed.

### 4. Send referral ask #1

**Gmail → Send Email**

**Subject:** Know someone who needs {{service_type}}?

```
Hi {{name}},

Hope you're still happy with the work we did on {{job_completed_at}}.

If you know a friend, neighbor, or colleague who could use {{your_service}}, we'd really appreciate an intro — referrals from happy clients mean the world to a small business like ours.

Easiest way: forward this email or send them to {{referral_link}}.

No pressure at all — and thanks again for trusting us.

Best,
{{your_name}}
```

Update sheet: `referral_asked_at` = today, `referral_status` = **sent**.

### 5. Gentle reminder (day 21)

**Delay** 7 more days. Skip if `referral_status` = **referred** or **declined**.

**Subject:** One more thought (promise it's quick)

```
Hi {{name}},

Quick follow-up — if anyone comes to mind who needs {{your_service}}, we'd be grateful for the intro:
{{referral_link}}

Either way, thanks again.

Best,
{{your_name}}
```

## What to measure

| Metric | Target |
|--------|--------|
| Referral ask → intro received | Track manually — target 5%+ |
| Time from ask to referred job booked | Median under 30 days |
| % jobs with referral ask sent | 100% of completed happy jobs |
