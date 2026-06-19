---
title: Auto-follow-up on quote requests with a 20-minute Zapier workflow
date: '2026-06-16'
status: published
slug: quote-follow-up-workflow
topic: quote follow-up workflow
setupMinutes: 20
publishedAt: '2026-06-16'
visibility: email-only
---
You send a quote, the prospect goes quiet, and follow-up slips. This playbook nudges silent prospects on day 3 and day 7 — without a spreadsheet reminder or a sticky note on your monitor.

Pairs well with [issue #1](/issues/auto-triage-customer-emails): triage incoming quote requests first, then let this workflow chase the ones that stall.

## The problem

Most service businesses quote in good faith and wait. By day five, you've moved on to the next job — and the prospect hires someone who followed up faster. Manual reminders in a sheet don't scale past ten open quotes, and CRM nudges only work if someone actually logs every quote the same day.

## What you'll build

1. **Trigger** — new row in a Google Sheet quote tracker (or CRM stage = `Quoted`)
2. **Wait** — 3 days with no status change
3. **Follow-up** — send a short email from your template and log the touch in the sheet

## Step-by-step

### 1. Create the quote tracker

Add a Google Sheet with columns: `email`, `name`, `quote_sent_at`, `status` (`open` | `won` | `lost`), `last_follow_up`.

When you send a quote, add a row with `status=open` and today's date in `quote_sent_at`.

### 2. Zapier trigger

**New Spreadsheet Row** in Google Sheets → select your tracker → filter where `status` equals `open`.

### 3. Delay path

Add a **Delay For** step: 3 days. Before sending, add a **Filter** step that only continues if `status` is still `open` (re-read the row from Sheets).

> **Tip:** If your CRM already tracks quote stage, swap the Sheets trigger for your CRM's "deal updated" trigger and map the same fields.

### 4. Follow-up email

Send via Gmail (or your connected inbox):

```
Hi {{name}},

Quick check-in on the quote we sent on {{quote_sent_at}}. Happy to adjust scope or timing if anything changed on your end.

Reply here and we'll sort it out.

— {{your_name}}
```

Update the sheet: set `last_follow_up` to today.

### 5. Second nudge (optional)

Duplicate the path with a **Delay For** 7 days (4 more days after the first nudge). Stop if `status` changes to `won` or `lost`.

## Estimated setup time

20 minutes for v1. Start with the 3-day nudge only; add the 7-day path after your first five quotes flow through.

## What to measure

Track reply rate within 48h of follow-up and % of `open` quotes that move to `won`. Target 15%+ reply rate on the first nudge before adding more automation.
