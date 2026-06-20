import { slugify } from "./slug";
import { getIssueBySlug, writeIssue } from "./storage";
import type { IssueDocument } from "./types";

function buildDraftBody(topic: string): string {
  return `You spend time on **${topic}** every week — and it still slips when you're busy.

This playbook gives you a copy-paste kit: tracker template, email scripts, and a step-by-step setup you can finish in one sitting.

**Setup time: 20 minutes.**

## The problem

Teams lose time and revenue on repetitive work around **${topic}**. Manual reminders don't scale, and things fall through the cracks when you're focused on delivery.

## The outcome

After setup, **${topic}** runs on schedule without you remembering to check. You get consistency without adding headcount.

## What happens

\`\`\`
Trigger event
    ↓
Wait / check condition
    ↓
Automatic action (email, SMS, or task)
    ↓
Still no response?
    ↓
Follow-up on schedule
\`\`\`

> **Diagram:** Add a workflow image when the UX template ships. Text flow above is sufficient for email until then.

## What's included

- **Tracker template** — Google Sheet (copy link — replace \`TEMPLATE_ID\` when board provides master sheet URL)
- **Email / message templates** — nudge 1, nudge 2, final check-in (copy-paste ready)
- **Setup guide** — step-by-step below
- **Workflow diagram** — visual flow (add when hosted asset is ready)

## Setup snapshot

| | |
|---|---|
| **Setup time** | 20 minutes |
| **Difficulty** | Beginner |
| **Tools** | Google Sheets, Gmail, Zapier (free tier OK) |
| **ROI** | One recovered customer usually pays for the setup instantly |

## Step-by-step

### 1. Copy the tracker

Open the template link above → **Make a copy**. Add a row each time the trigger event happens.

### 2. Connect your tracker

In Zapier: when a **new row** appears (or your CRM stage changes), start the workflow.

> **Already use a CRM?** Swap the sheet for your CRM's equivalent trigger — same logic.

### 3. Schedule the first follow-up

Add a wait step. Before sending, confirm the item is still open (re-read from Sheets or CRM).

### 4. Send follow-up #1

Use a short, friendly template with \`{{name}}\` placeholders. Update the tracker after each touch.

### 5. Second nudge

Duplicate the path with a longer wait. Stop if status changes to won or lost.

### 6. Final check-in (optional)

Polite close-the-loop message. Mark lost in the tracker if no reply.

## What to measure

Track reply rate within 48h of the first nudge and % of open items that convert. Target **15%+ reply rate** on nudge 1 before adding more automation.`;
}

export async function generateDraft(topic: string): Promise<IssueDocument> {
  const slug = slugify(topic);
  if (!slug) {
    throw new Error("Topic must produce a valid slug");
  }

  const existing = await getIssueBySlug(slug);
  if (existing) {
    throw new Error(`Issue already exists: ${slug} (${existing.frontmatter.status})`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const title = topic.trim().replace(/^\w/, (c) => c.toUpperCase());

  return writeIssue(
    {
      title,
      date: today,
      status: "draft",
      slug,
      topic,
      setupMinutes: 20,
      visibility: "email-only",
    },
    buildDraftBody(topic),
  );
}
