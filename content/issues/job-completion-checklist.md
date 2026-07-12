---
title: Auto-send completion summary + upsell prompt
date: '2026-07-12'
status: published
slug: job-completion-checklist
season: 1
seasonNumber: 7
sequenceOrder: 7
topic: job completion checklist
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Close every finished job with a summary, checklist, and one soft next offer — without living in drafts
emailSubject: 'Playbook #7: Close every job without another awkward ask'
workflowDiagramAlt: >-
  Job marked complete in Sheet, Gmail sends summary and checklist, optional
  upsell line, optional later review ask
publishedAt: '2026-07-12'
---
You finished the job. The client was happy in the moment — then you drove to the next site and never sent the wrap-up. No summary. No care steps. No natural next offer. The relationship cools for no reason.

When a job row flips to complete, the client gets a short summary email from your Gmail, a simple checklist, and one optional upsell line — without another awkward ask.

**Setup time: 25 minutes.**

> **Already on Klaviyo or Jobber?** Use their post-job sequences if every completion lives there. **Wire this playbook** when job status lives in a Sheet (or simple CRM export) and you want emails from *your* Gmail.

Pairs well with [issue #3](/issues/google-review-request-workflow): send the completion summary first, then schedule the review ask. Next: [referral ask](/issues/referral-ask-workflow) once the client is warm.

## The problem

Field work ends; admin does not. Wrap-up emails die between jobs. Clients forget what was done, what to watch for, and what a sensible next step would be — then you chase them weeks later with a cold upsell.

## The outcome

Every finished job closes clean. Clients know what happened and what to do next. You surface one relevant add-on without living in drafts or sounding pushy.

## What happens

1. Mark the job `Complete` in your Google Sheet (or CRM export)
2. Zapier watches the status column
3. **Gmail** sends a short summary + checklist from your address
4. Optional: one sentence upsell tied to the job type
5. Optional later: hand off to your [review request](/issues/google-review-request-workflow) timing

## What's included

- **Job Completion Tracker** — Sheet columns: `client_email`, `client_name`, `job_type`, `completed_at`, `status`, `summary_sent`, `upsell_offer`, `notes`
- **Summary email template** — what was done, what to watch for, how to reach you
- **Checklist fields** — care steps / next visit reminders by job type
- **Upsell rules** — one soft line max; skip when nothing fits
- **Zapier path** — status → filter → Gmail (free tier OK at low volume)

## Setup (high level)

1. Copy the tracker Sheet and fill three recent completed jobs as a test
2. Connect Zapier: Google Sheets → New/Updated Spreadsheet Row
3. Filter: `status` equals `Complete` and `summary_sent` is empty
4. Gmail action: send the summary template; map checklist + optional upsell
5. Update row: set `summary_sent` to `yes` so you do not double-send
6. Run one live test with yourself as the client

## Time and cost

| | |
|---|---|
| Setup | ~25 minutes |
| Time saved | 15–30 min/day once you stop drafting wrap-ups by hand |
| Stack cost | Sheets + Gmail + Zapier free tier at low volume |

## Security notes

- Do not put payment card data or passwords in the Sheet
- Send from a real business Gmail you already use with clients
- Keep upsell copy specific to the job — never paste a full catalog

## FAQs

**Why send a completion summary at all?**  
Clients forget details the same day. A short summary cuts “what did we agree?” replies and creates a calm moment for one relevant next offer.

**Do I need a CRM?**  
No. Google Sheets + Gmail + Zapier is enough. Add a CRM later when volume justifies it.

**Won't an upsell feel pushy?**  
Only if you pitch a catalog. One sentence tied to the job type reads as helpful, not salesy.

