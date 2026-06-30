---
title: Cut no-shows with automated appointment reminders
date: '2026-06-30'
status: draft
slug: appointment-reminder-workflow
season: 1
seasonNumber: 4
topic: appointment reminder workflow
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Calendar
  - Gmail
  - Zapier
roiImpact: Recover 15–30% of would-be no-shows with timed email reminders
emailSubject: "Playbook #4: Cut no-shows with automated reminders"
workflowDiagramAlt: Appointment booked, 24-hour email reminder, optional 2-hour email nudge, no-show flagged in tracker
---
You booked the job. The client confirmed. Then they ghost on the day — and you lose a slot you could have filled.

Twenty-four hours before each appointment, they get a friendly email reminder. Two hours before, a short follow-up email (optional). No-shows get flagged in your tracker so you can follow up or release the slot.

**Setup time: 20 minutes.**

> **Already on Calendly or Acuity?** Those tools send their own reminders — use them if every booking flows through one app. **Wire this playbook instead** when appointments live in Google Calendar (or a sheet) and you want reminders from *your* Gmail without another subscription.

Pairs well with [issue #3](/issues/google-review-request-workflow): show up first, then ask for the review after delivery. Need SMS branches and Make sleep modules? Graduate to [Season 2 Playbook #1](/issues/multi-channel-appointment-reminders).

## The problem

Service businesses lose margin on empty slots. Manual reminder texts don't scale past a handful of bookings per week — and they're easy to forget when you're on a job site. Calendar alerts only help *you*, not the client who needs the nudge.

## The outcome

Every confirmed appointment gets timed email reminders on schedule. You cut no-shows without awkward phone tag — and you see which clients need a reschedule policy.

## What happens

1. New appointment lands in Google Calendar (or your booking sheet)
2. **24 hours before** → Gmail sends a confirmation + directions email
3. **2 hours before** → optional second email nudge
4. After start time with no check-in → row flagged `no_show` for your follow-up

## What's included

- **Appointment Tracker** — [Copy the Google Sheet template](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(board: create once, reuse link — columns: `client_email`, `client_name`, `appointment_start`, `service_address`, `status`, `last_reminder`)*
- **2 reminder email templates** — 24h + 2h
- **Setup guide** — step-by-step Zapier path below

## Setup snapshot

| | |
|---|---|
| **Setup time** | 20 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Calendar, Gmail, Zapier (free tier OK for low volume) |
| **ROI** | One recovered appointment often pays for a month of Zapier tasks |

## Before you start

1. **Use one calendar** — dedicated Google Calendar for client appointments (not your personal calendar mixed with lunch).
2. **Define "no-show"** — e.g. 15 minutes past start with no reply → flag in sheet manually or with a second Zap.
3. **SMS later** — Zapier SMS adds cost and compliance overhead; when you need Twilio branching, move to [Season 2 Playbook #1](/issues/multi-channel-appointment-reminders).

## Step-by-step — Zapier

### 1. Create the appointment tracker (optional but recommended)

Open the template link above → **Make a copy**. When you book a client, add a row: `status` = **confirmed**, `appointment_start` = ISO datetime.

Columns: `client_email` · `client_name` · `appointment_start` · `service_address` · `status` (confirmed | reminded | completed | no_show | cancelled) · `last_reminder`

> **Already use Calendly, Acuity, or a CRM?** Swap Calendar for that tool's "new booking" trigger — same reminder logic.

### 2. Trigger — watch new appointments

**Option A — Google Calendar (simplest)**

In Zapier: **Google Calendar → Event Start** (or **New Event**) on calendar `Client Appointments`.

Filter: event title does not contain `BLOCK`.

**Option B — Google Sheets**

**Google Sheets → New Spreadsheet Row** where `status` = **confirmed**.

Pass `client_email`, `client_name`, `appointment_start`, `service_address` to the next steps.

### 3. Delay until 24 hours before

Add **Delay Until** → set to `appointment_start` minus **24 hours**.

Before sending, add a **Google Sheets → Lookup Row** filter: continue only if `status` is **confirmed** or **reminded** (skip cancellations).

### 4. Send 24-hour email reminder

**Gmail → Send Email** to `client_email`.

**Subject:** Reminder — we're on for tomorrow

```
Hi {{client_name}},

Quick reminder: we have you scheduled for {{appointment_start}}.

Address: {{service_address}}

Reply to this email if you need to reschedule — we'll do our best to find another slot.

See you then,
{{your_name}}
{{your_business}}
```

**Google Sheets → Update Row:** `status` = **reminded**, `last_reminder` = today.

### 5. Optional — 2-hour email nudge

Add a second Zap (or Paths branch) with **Delay Until** → `appointment_start` minus **2 hours**.

**Subject:** See you in 2 hours

```
Hi {{client_name}},

Quick heads-up — we're on our way for your {{appointment_start}} appointment at {{service_address}}.

Reply if anything changed.

{{your_name}}
```

### 6. Flag no-shows (manual or second Zap)

After `appointment_start` + 15 minutes, if the client didn't confirm:

- Set `status` = **no_show** in the sheet
- Optional: **Gmail → Send Email** to your ops inbox — "No-show: {{client_name}} {{appointment_start}}"

Follow your policy: reschedule fee, deposit forfeiture, or release the slot.

## Zap flow (overview)

```
Google Calendar Event Start
  → Delay Until (−24h)
  → Google Sheets Lookup (status = confirmed)
  → Gmail Send Email (24h reminder)
  → Google Sheets Update Row (reminded)
  → Delay Until (−2h) [optional second Zap]
  → Gmail Send Email (2h nudge)
```

## What to measure

Track **no-show rate** before and after 30 days:

| Metric | Target |
|--------|--------|
| No-show rate | Drop 15–30% vs baseline (email-only) |
| Reminder → reply rate | ≥10% reply "still coming" or reschedule |
| Slots recovered | Count reschedules within 48h of no-show flag |
