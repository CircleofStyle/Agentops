---
title: Turn finished jobs into Google reviews — automatically
date: '2026-06-19'
status: published
slug: google-review-request-workflow
topic: google review request workflow
setupMinutes: 25
visibility: email-only
difficulty: beginner
publishedAt: '2026-06-19'
---
You finish the job. The customer is happy. Then you forget to ask for a review — and your Google profile stays quiet while competitors stack five stars.

Two days after you mark a job complete, your customer automatically gets a friendly review request. Still nothing? A gentle reminder goes out on day 7 — without a sticky note, a CRM task, or you remembering to follow up.

**Setup time: 25 minutes.**

Pairs well with [issue #2](/issues/quote-follow-up-workflow): win the quote first, then let this workflow turn delivered work into social proof.

## The problem

Most service businesses rely on word of mouth but never systematize review asks. Happy customers intend to leave a review — then life happens. Manual reminders don't scale past a handful of jobs per month, and your Google rating becomes a lagging indicator instead of a growth lever.

## The outcome

Every completed job gets a timed review request on schedule. You build social proof without awkward in-person asks — and you stop wondering "did I ask that one for a review?"

## What happens

```
Job marked complete
    ↓
Wait 2 days
    ↓
Automatic review request email
    ↓
Still no review?
    ↓
Gentle reminder after 7 days
```

> **Diagram:** Workflow image coming soon. Text flow above is sufficient for email until then.

## What's included

- **Job Completion Tracker** — [Copy the Google Sheet template](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(board: create once, reuse link — columns: `email`, `name`, `job_completed_at`, `google_review_link`, `status`, `last_nudge`)*
- **2 review request emails** — initial ask + gentle reminder (below)
- **Setup guide** — step-by-step
- **Workflow diagram** — visual flow (coming soon)

## Setup snapshot

| | |
|---|---|
| **Setup time** | 25 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Sheets, Gmail, Zapier (free tier OK) |
| **ROI** | One new 5-star review often pays for the setup in local search visibility |

## Before you start

1. **Get your Google review link** — Google Business Profile → Ask for reviews → copy the short link. Paste it into every tracker row (or a single config cell Zapier reads).
2. **Only ask happy customers** — mark jobs `complete` only after delivery, not at quote stage.

## Step-by-step

### 1. Copy the job tracker

Open the template link above → **Make a copy**. When you finish a job, add a row: `status` = open, `job_completed_at` = today.

Columns: `email` · `name` · `job_completed_at` · `google_review_link` · `status` (open | reviewed | skipped) · `last_nudge`

### 2. Connect your tracker

In Zapier: when a **new row** appears and `status` is **open**, start the workflow.

> **Already use a CRM or job app?** Swap the sheet for your tool's "job marked complete" or "deal won" trigger — same logic.

### 3. Schedule the 2-day wait

Add a **2-day wait** after the trigger. Before sending, confirm the row is still **open** (re-read from Sheets).

Why 2 days? Gives the customer time to enjoy the result — immediate asks feel transactional.

### 4. Send review request #1

Use this template in Gmail (or your connected inbox):

**Subject:** Quick favor — how did we do?

```
Hi {{name}},

Hope you're happy with the work we completed on {{job_completed_at}}.

If you have 60 seconds, a Google review helps other local customers find us:
{{google_review_link}}

No pressure — and thank you again for choosing us.

Best,
{{your_name}}
```

Update the sheet: `last_nudge` = today.

### 5. Gentle reminder (day 7)

Add a **5-day wait** after the first email (7 days total from job completion). Stop if `status` changes to reviewed or skipped.

**Subject:** One more nudge (promise it's the last)

```
Hi {{name}},

Just a quick follow-up — if you were happy with our work, a short Google review still helps a lot:
{{google_review_link}}

Either way, thanks again for your business.

Best,
{{your_name}}
```

### 6. Mark reviewed (optional manual step)

When you see a new review come in, set `status` = reviewed in the sheet. Zapier won't send further nudges.

> **Tip:** Some teams add a Zapier filter to skip rows where `status` = reviewed before each send — belt and suspenders.

## What to measure

Track **review request → published review rate** within 14 days of job completion. Target **10%+ conversion** on request #1 before adding SMS or incentive experiments.

Also watch **median days to first review** — should drop below 10 days once the workflow runs consistently.
