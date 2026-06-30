---
title: Cut no-shows with email + SMS reminders
date: '2026-06-30'
status: draft
slug: multi-channel-appointment-reminders
season: 2
seasonNumber: 1
topic: multi-channel appointment reminders
setupMinutes: 30
visibility: email-only
difficulty: intermediate
toolRequirements:
  - Google Calendar
  - Gmail
  - Make.com
  - Twilio
roiImpact: Recover 20–40% of would-be no-shows with email + SMS branching
emailSubject: "Season 2 Playbook #1: Cut no-shows with email + SMS reminders"
workflowDiagramAlt: Appointment booked, 24-hour email reminder, 2-hour SMS nudge, no-show flagged in tracker
---
You booked the job. The client confirmed. Then they ghost on the day — and you lose a slot you could have filled.

Twenty-four hours before each appointment, they get a friendly email reminder. Two hours before, a short SMS nudge. No-shows get flagged in your tracker so you can follow up or release the slot. This is your **Season 2 graduation playbook** — branching logic and multi-channel nudges that are awkward in linear Zaps but natural in Make.

**Setup time: 30 minutes.**

Pairs well with [Season 1 Playbook #4](/issues/appointment-reminder-workflow): start with Zapier email reminders, then upgrade here when you need SMS branches and scenario sleep modules.

## The problem

Service businesses lose margin on empty slots. Manual reminder texts don't scale past a handful of bookings per week — and they're easy to forget when you're on a job site. Calendar alerts only help *you*, not the client who needs the nudge. Linear Zapier paths struggle with "sleep until 24h before, then branch on phone number" without eating tasks or breaking on reschedule.

## The outcome

Every confirmed appointment gets timed email + optional SMS reminders on schedule. You cut no-shows without awkward phone tag — and you see which clients need a reschedule policy.

## What happens

1. New appointment lands in Google Calendar (or your booking sheet)
2. **24 hours before** → Gmail sends a confirmation + directions email
3. **2 hours before** → SMS nudge via Twilio (branch skips if no phone on file)
4. After start time with no check-in → row flagged `no_show` for your follow-up

## What's included

- **Appointment Tracker** — [Copy the Google Sheet template](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(board: create once, reuse link — columns: `client_email`, `client_phone`, `client_name`, `appointment_start`, `service_address`, `status`, `last_reminder`)*
- **2 reminder templates** — 24h email + 2h SMS
- **Make scenario** — step-by-step module list below
- **Make affiliate disclosure** — see footer

## Setup snapshot

| | |
|---|---|
| **Setup time** | 30 minutes |
| **Difficulty** | Intermediate |
| **Tools** | Google Calendar, Gmail, Make.com, Twilio (SMS branch) |
| **ROI** | One recovered appointment often covers a month of Make operations |

## Before you start

1. **Use one calendar** — dedicated Google Calendar for client appointments (not your personal calendar mixed with lunch).
2. **Collect phone numbers** — SMS branch needs `client_phone` in E.164 format (`+41…`). Skip SMS if you only have email.
3. **Define "no-show"** — e.g. 15 minutes past start with no reply → flag in sheet.
4. **Graduated from Season 1?** You already have email-only reminders in Zapier — reuse the same tracker columns and templates; this scenario adds sleep + SMS routing.

> **Build in Make:** Sign up free at [make.com/en/register?pc=automatethisweek](https://www.make.com/en/register?pc=automatethisweek) *(affiliate link — supports this newsletter at no extra cost to you)*.

## Step-by-step — Make scenario

### 1. Create the appointment tracker (optional but recommended)

Open the template link above → **Make a copy**. When you book a client, add a row: `status` = **confirmed**, `appointment_start` = ISO datetime.

Columns: `client_email` · `client_phone` · `client_name` · `appointment_start` · `service_address` · `status` (confirmed | reminded | completed | no_show | cancelled) · `last_reminder`

> **Already use Calendly, Acuity, or a CRM?** Use that tool's "new booking" webhook as your trigger instead of Calendar — same reminder logic.

### 2. Trigger — watch new appointments

**Option A — Google Calendar (simplest)**

| Module | Setting |
|--------|---------|
| **Google Calendar → Watch Events** | Calendar: `Client Appointments` |
| Filter | Event title does not contain `BLOCK` |

**Option B — Google Sheets**

| Module | Setting |
|--------|---------|
| **Google Sheets → Watch Rows** | Spreadsheet: Appointment Tracker |
| Filter | `status` = **confirmed** |

On each new event/row, pass `client_email`, `client_phone`, `client_name`, `appointment_start`, `service_address` to the next modules.

### 3. Sleep until 24 hours before

| Module | Setting |
|--------|---------|
| **Tools → Sleep** | Until `appointment_start` minus **24 hours** |

Make schedules the scenario to resume at that timestamp. Test with an appointment 25+ hours in the future.

### 4. Re-check status (belt and suspenders)

| Module | Setting |
|--------|---------|
| **Google Sheets → Get a Row** | Match on `appointment_start` + `client_email` |
| **Router** | Continue only if `status` = **confirmed** or **reminded** |

Skip if the client already cancelled.

### 5. Send 24-hour email reminder

| Module | Setting |
|--------|---------|
| **Gmail → Send an Email** | To: `client_email` |

**Subject:** Reminder — we're on for tomorrow

```
Hi {{client_name}},

Quick reminder: we have you scheduled for {{appointment_start | date}}.

Address: {{service_address}}

Reply to this email if you need to reschedule — we'll do our best to find another slot.

See you then,
{{your_name}}
{{your_business}}
```

Update sheet: `status` = **reminded**, `last_reminder` = today.

### 6. Sleep until 2 hours before

| Module | Setting |
|--------|---------|
| **Tools → Sleep** | Until `appointment_start` minus **2 hours** |

### 7. Optional — 2-hour SMS nudge

Add only if you have Twilio (or similar) connected in Make:

| Module | Setting |
|--------|---------|
| **Router** | Branch: `client_phone` is not empty |
| **Twilio → Create a Message** | To: `client_phone` |

**SMS (≤160 chars):**

```
Hi {{client_name}} — {{your_business}} appointment in 2h at {{service_address}}. Reply RESCHEDULE if needed.
```

> **No SMS?** Delete this branch. Email-only still cuts most no-shows — or stay on [Season 1 Playbook #4](/issues/appointment-reminder-workflow) until you're ready.

### 8. Flag no-shows (end of day)

Add a separate scenario or a final branch after `appointment_start` + 15 minutes:

| Module | Setting |
|--------|---------|
| **Google Sheets → Update a Row** | `status` = **no_show** |
| **Gmail → Send an Email** (internal) | To: your ops inbox — "No-show: {{client_name}} {{appointment_start}}" |

Follow your policy: reschedule fee, deposit forfeiture, or release the slot.

## Make module map (canvas overview)

```
Google Calendar Watch Events
  → Sleep (until −24h)
  → Google Sheets Get a Row
  → Router (status = confirmed)
  → Gmail Send Email (24h reminder)
  → Google Sheets Update Row (reminded)
  → Sleep (until −2h)
  → Router (phone present?)
      → Twilio Create Message (SMS)
  → Sleep (until +15min after start)
  → Google Sheets Update Row (no_show) + internal alert
```

## What to measure

Track **no-show rate** before and after 30 days:

| Metric | Target |
|--------|--------|
| No-show rate | Drop 20–40% vs baseline |
| Reminder → confirm reply rate | ≥10% reply "still coming" or reschedule |
| Slots recovered | Count reschedules within 48h of no-show flag |

## Affiliate disclosure

This playbook is built in **Make.com**. Links to Make in this issue are affiliate links — if you sign up through them, Automate This Week may earn a commission at no extra cost to you. We only recommend tools we use in our own playbooks.
