---
title: Friendly payment reminders without awkward calls
date: '2026-07-11'
status: published
slug: invoice-chase-workflow
season: 1
seasonNumber: 5
topic: invoice chase workflow
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: >-
  Recover overdue invoices without phone tag — cash lands while you stay on the
  tools
emailSubject: 'Playbook #5: Friendly payment reminders without awkward calls'
workflowDiagramAlt: >-
  Invoice marked sent, day-7 polite nudge, day-14 firmer reminder, overdue
  flagged for manual follow-up
publishedAt: '2026-07-11'
---
You finished the job. You sent the invoice. Then silence — and you're the one who feels awkward dialing to ask for money you already earned.

Seven days after an invoice is marked sent, the client gets a polite payment reminder. Still unpaid at day 14? A firmer nudge goes out. Overdue rows stay visible in your tracker so you know who needs a call — without living in your inbox.

**Setup time: 25 minutes.**

> **Already on QuickBooks, Xero, or Stripe Invoicing?** Use their built-in reminders if every invoice lives there. **Wire this playbook instead** when invoices are tracked in a Google Sheet (or PDF + email) and you want timed nudges from *your* Gmail without another billing subscription.

Pairs well with [issue #2](/issues/quote-follow-up-workflow): win the quote, deliver the work, then let this workflow close the cash loop.

## The problem

Service businesses lose cash flow on unpaid invoices — not because clients refuse, but because nobody follows up on a schedule. Sticky-note reminders and "I'll call Monday" intentions slip when you're on a job site. Phone chases feel personal and uncomfortable; silence costs more.

## The outcome

Every sent invoice gets timed, friendly email reminders on schedule. Cash arrives without awkward phone tag — and you see which clients need a deposit or stop-work policy.

## What happens

1. You mark an invoice **sent** in your tracker (date + amount + due date)
2. **Day 7 after send** (if still unpaid) → Gmail sends a polite reminder
3. **Day 14** (if still unpaid) → firmer second nudge
4. Still open after day 21 → row flagged **overdue** for your manual call or stop-work decision

## What's included

- **Invoice Tracker** — [Copy the Google Sheet template](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(board: create once, reuse link — columns: `client_email`, `client_name`, `invoice_number`, `amount`, `sent_at`, `due_at`, `status`, `last_nudge`)*
- **2 reminder email templates** — day-7 polite + day-14 firmer
- **Setup guide** — step-by-step Zapier path below

## Setup snapshot

| | |
|---|---|
| **Setup time** | 25 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Sheets, Gmail, Zapier (free tier OK for low volume) |
| **ROI** | One recovered invoice often pays for months of Zapier tasks |

## Before you start

1. **One tracker only** — every invoice you care about lives in the sheet (or syncs into it). Scattered PDFs in email = missed nudges.
2. **Define statuses** — use `sent` → `reminded` → `paid` | `overdue` | `written_off`. Never nudge `paid` rows.
3. **Keep tone calm** — day-7 is "just checking"; day-14 is clear and professional, not aggressive. Save the phone for day 21+.

## Step-by-step — Zapier

### 1. Create the invoice tracker

Open the template link above → **Make a copy**. When you send an invoice, add a row: `status` = **sent**, `sent_at` = today, `due_at` = payment terms (e.g. +14 days).

Columns: `client_email` · `client_name` · `invoice_number` · `amount` · `sent_at` · `due_at` · `status` (sent | reminded | paid | overdue | written_off) · `last_nudge`

> **Already use QuickBooks, Xero, Wave, or a CRM?** Swap the sheet for that tool's "invoice sent" / "invoice overdue" trigger — same reminder logic.

### 2. Trigger — watch new or updated invoices

**Google Sheets → New Spreadsheet Row** (or **Updated Spreadsheet Row**) where `status` = **sent**.

Pass `client_email`, `client_name`, `invoice_number`, `amount`, `sent_at`, `due_at` to the next steps.

### 3. Delay until day 7, then nudge

Add **Delay For** → **7 days** after `sent_at` (or **Delay Until** → `sent_at` + 7 days).

Before sending, add a **Google Sheets → Lookup Row** filter: continue only if `status` is still **sent** or **reminded** (skip if already **paid**).

### 4. Send day-7 polite reminder

**Gmail → Send Email** to `client_email`.

**Subject:** Quick check — invoice {{invoice_number}}

```
Hi {{client_name}},

Just a friendly note that invoice {{invoice_number}} for {{amount}} was sent on {{sent_at}} and is due {{due_at}}.

If you've already paid, thank you — you can ignore this. If something's unclear on the invoice, reply to this email and we'll sort it out.

Thanks,
{{your_name}}
{{your_business}}
```

**Google Sheets → Update Row:** `status` = **reminded**, `last_nudge` = today.

### 5. Day-14 firmer reminder

Second Zap (or Paths branch): **Delay For** → **14 days** after `sent_at`.

Lookup again — continue only if status is **not** `paid`.

**Subject:** Reminder — invoice {{invoice_number}} is past due

```
Hi {{client_name}},

Invoice {{invoice_number}} for {{amount}} (due {{due_at}}) is still open on our side.

Please arrange payment this week, or reply with a date we can expect it. If there's a problem with the work or the invoice, tell us — we'd rather fix it than chase.

Payment details are on the original invoice. Reply if you need it resent.

{{your_name}}
{{your_business}}
```

**Google Sheets → Update Row:** `last_nudge` = today.

### 6. Flag overdue for manual follow-up

After `sent_at` + **21 days** (or after `due_at` + 7), if still unpaid:

- Set `status` = **overdue** in the sheet
- Optional: **Gmail → Send Email** to your ops inbox — "Overdue: {{client_name}} {{invoice_number}} {{amount}}"

Follow your policy: phone call, stop-work on new jobs, deposit requirement next time, or payment plan.

## Zap flow (overview)

```
Google Sheets New Row (status = sent)
  → Delay 7 days
  → Lookup (still unpaid)
  → Gmail Send Email (day-7 polite)
  → Update Row (reminded)
  → Delay to day 14 [second Zap]
  → Lookup (still unpaid)
  → Gmail Send Email (day-14 firmer)
  → Day 21 → Update Row (overdue) + ops alert
```

## What to measure

Track **days-to-paid** and recovery before vs after 30 days:

| Metric | Target |
|--------|--------|
| Median days from send → paid | Drop 20%+ vs baseline |
| % paid after first nudge (day 7) | ≥30% of nudged invoices |
| Phone chases needed | Fewer than before — sheet shows who still needs a call |
