---
title: Auto-triage customer emails with a 15-minute Zapier + GPT workflow
date: '2026-06-09'
status: published
slug: auto-triage-customer-emails
topic: auto-triage customer emails
setupMinutes: 15
publishedAt: '2026-06-09'
---

Most small shops lose leads in a shared inbox. This playbook routes urgent requests, drafts replies, and logs everything — without hiring ops.

## The problem

When three people share one Gmail inbox, urgent quote requests sit next to newsletters and spam. Nobody owns triage, so response time drifts to 24–48 hours.

## What you'll build

1. **Trigger** — new email in a Gmail shared label (`inbox/shared`)
2. **Classify** — structured GPT prompt returns intent + urgency
3. **Route** — Slack alert for urgent items; draft reply saved as Gmail draft

## Step-by-step

### 1. Create the Gmail label

Add a filter that applies label `inbox/shared` to messages sent to `hello@yourbusiness.com`.

### 2. Zapier trigger

New Email Matching Search in Gmail → search `label:inbox/shared`.

### 3. Classification prompt

```
Given this email, return JSON only:
{ "intent": "quote|support|spam", "urgency": "high|low", "summary": "one sentence" }

Email:
{{body}}
```

### 4. Route by urgency

- `urgency=high` → post to `#sales-urgent` in Slack with summary
- `intent=support` → create draft reply with your support macro
- `intent=spam` → archive and label `auto-archived`

## Estimated setup time

15 minutes for v1. Tune the prompt after 20 real emails.

## What to measure

Track median first-response time and % of emails auto-classified correctly. Target 80%+ accuracy before adding more automation.
