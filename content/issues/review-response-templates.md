---
title: Draft replies to Google reviews in one click
date: '2026-07-12'
status: published
slug: review-response-templates
season: 1
seasonNumber: 11
sequenceOrder: 11
topic: review response templates
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: >-
  Keep reputation warm without evening admin — every new review gets a draft
  reply you can send in one tap
emailSubject: 'Playbook #11: Draft replies to Google reviews in one click'
workflowDiagramAlt: >-
  New Google review lands, Zapier drafts a reply from templates, owner sends in
  one tap
publishedAt: '2026-07-12'
---
A new Google review lands. You mean to reply later. Later never comes — and the thread goes cold while competitors look responsive.

When a new review appears, Zapier drops a draft reply into your Sheet (or inbox) from three simple templates — positive, constructive, and thank-you — so you can send in one tap instead of staring at a blank box at 9pm.

**Setup time: 20 minutes.**

> **Already on a reputation agency or GBP auto-reply tool?** Keep it if every review already gets a human-sounding reply. **Wire this playbook** when reviews sit unanswered because nobody owns the reply queue.

Pairs well with [issue #3](/issues/google-review-request-workflow): ask for the review first, then answer what comes back.

## The problem

Reviews are social proof only if you show up. Unanswered reviews look abandoned. Owners delay because writing a careful reply takes focus — and focus disappears between jobs. Fake “guaranteed 5-star” promises and star-count brags don’t help; a calm, honest reply does.

## The outcome

Every new review gets a draft reply on schedule. You stay on the tools; reputation stays warm.

## What's included

- **Review Reply Tracker** — Sheet columns for review text, rating band, draft reply, status
- **3 reply templates** — positive / constructive / thank-you (edit tone once, reuse)
- **Setup guide** — Zapier off new review → draft → you send

## Setup snapshot

| | |
|---|---|
| **Setup time** | 20 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Sheets, Gmail, Zapier (free tiers at low volume) |
| **ROI** | Warm replies protect local trust without evening admin |

## Before you start

1. **Be honest** — never invent star counts, never promise “guaranteed 5 stars,” never incentivize a rating.
2. **Own the send** — automation drafts; you (or a trusted teammate) hit send after a 10-second read.
3. **Match the tone** — short, specific, grateful. No corporate fluff.

## Step-by-step — Zapier

### 1. Copy the reply tracker

Columns: `review_received_at` · `reviewer_name` · `rating` · `review_text` · `template` (positive | constructive | thank_you) · `draft_reply` · `status` (open | sent | skipped)

### 2. Capture new reviews

**Trigger:** New Google review (Google Business Profile / review monitoring tool → Zapier).  
Write a Sheet row: `status` = **open**, paste review text + rating.

> **No native GBP trigger?** Forward review notification emails into Gmail and parse the body into the same Sheet row.

### 3. Pick a template

**Filter / Formatter:**

- Rating **4–5** → `positive`
- Rating **1–3** with useful detail → `constructive`
- Rating missing or short praise → `thank_you`

### 4. Draft the reply (templates)

**Positive**

```
Hi {{reviewer_name}},

Thank you for the kind words — we’re glad the work met your expectations.
If you ever need us again, just reply here or call.

Best,
{{your_name}}
```

**Constructive**

```
Hi {{reviewer_name}},

Thanks for taking the time to share this. We’re sorry the experience wasn’t fully what you hoped for.
We’ve noted your feedback and would like to make it right — please reply here or call {{phone}} so we can follow up directly.

Best,
{{your_name}}
```

**Thank-you (short)**

```
Hi {{reviewer_name}},

Appreciate you leaving a review — thank you.
Hope to see you again soon.

Best,
{{your_name}}
```

Write `draft_reply` into the Sheet (or create a Gmail draft addressed to yourself with the reply body for copy-paste into GBP).

### 5. You send (one tap)

Open GBP (or your review tool) → paste draft → send → mark Sheet `status` = **sent**.

Optional: Slack/SMS ping when a new `open` draft is ready so it doesn’t wait overnight.

## Compliance & tone

- Reply to real customers only; don’t fabricate reviews or ratings.
- Don’t offer discounts or gifts tied to changing a star rating.
- Keep constructive replies calm and offline-friendly — move disputes to a phone call when needed.

## After you're live

- Pair with [Playbook #3](/issues/google-review-request-workflow) so asks and replies share one reputation loop.
- Once replies are habit, [Playbook #8](/issues/referral-ask-workflow) asks happy clients for intros on a separate schedule.
