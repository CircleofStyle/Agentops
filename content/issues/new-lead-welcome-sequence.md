---
title: Instant welcome + intake for new inquiries
date: '2026-07-11'
status: published
slug: new-lead-welcome-sequence
season: 1
seasonNumber: 6
sequenceOrder: 6
topic: new lead welcome sequence
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Gmail
  - Google Forms
  - Zapier
roiImpact: Respond to new leads in under 5 minutes — before they shop elsewhere
emailSubject: "Playbook #6: Instant welcome + intake for new inquiries"
workflowDiagramAlt: New inquiry arrives, instant welcome email, intake form link, follow-up if form not completed
publishedAt: '2026-07-11'
---
A prospect reaches out. You're mid-day with client work. By the time you reply, they've already requested two other quotes.

The moment a new inquiry lands — form, email, or contact page — they get an instant welcome and a short intake form. You look responsive without living in your inbox.

**Setup time: 20 minutes.**

> **Already on Klaviyo or Mailchimp?** Welcome series are ESP bread-and-butter — if you're already paying for one and every lead is on your list, start there. **Wire this playbook instead** when leads land in Gmail or a simple form *before* you've committed to a $20–300/mo marketing platform — instant Zap, no ESP subscription required.

Pairs well with [issue #1](/issues/auto-triage-customer-emails): triage the inbox first, then auto-welcome net-new inquiries that match your ideal client profile.

## The problem

Speed-to-lead wins in local services. Manual "thanks, we'll get back to you" replies slip when you're busy — and generic autoresponders feel cold without a clear next step.

## The outcome

Every new inquiry gets a warm welcome and a structured intake link within minutes. You collect the details you need for a quote without a back-and-forth email chain.

## What's included

- **Welcome email template** — instant send on trigger
- **Intake form** — Google Form linked in welcome (job type, address, photos, timeline)
- **Optional nudge** — reminder if form not completed in 48h
- **Setup guide** — Zapier trigger options (form submit, labeled Gmail, Typeform)

## Setup snapshot

| | |
|---|---|
| **Setup time** | 20 minutes |
| **Difficulty** | Beginner |
| **Tools** | Gmail, Google Forms, Zapier |
| **ROI** | Faster response often lifts quote win rate 10%+ vs silent hours |

## Before you start

1. **One intake form** — keep it short: contact info, job description, preferred timeline, photo upload optional.
2. **Match your triage rules** — only auto-welcome leads that pass filters (e.g. not spam, correct service area).

## Step-by-step — Zapier

### 1. Create the intake form

Google Forms → new form → copy share link. Fields: name, email, phone, job description, address, preferred date.

### 2. Trigger — new inquiry

Pick one:

- **Google Forms → New Response**
- **Gmail → New Email** with label `New Lead` (pairs with Playbook #1)
- **Typeform / Jotform → New Entry** if you already use one

### 3. Send welcome email immediately

**Gmail → Send Email**

**Subject:** Thanks for reaching out — quick next step

```
Hi {{name}},

Thanks for contacting {{your_business}}. We typically respond to quotes within {{SLA}}.

To give you an accurate estimate, please fill out this 2-minute intake form:
{{form_link}}

If anything is urgent, reply to this email and we'll prioritize.

Talk soon,
{{your_name}}
```

### 4. Optional — 48h form nudge

Second Zap: **Delay** 48 hours → check if form not submitted → send gentle reminder with same link.

## What to measure

| Metric | Target |
|--------|--------|
| Median time to first reply | Under 5 minutes (automated) |
| Intake form completion rate | ≥50% within 48h |
| Quote sent within 24h of intake | Track manually — should rise |
