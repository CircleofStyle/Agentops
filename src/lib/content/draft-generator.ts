import { slugify } from "./slug";
import { getIssueBySlug, writeIssue } from "./storage";
import type { IssueDocument } from "./types";

function buildDraftBody(topic: string): string {
  return `Most small businesses can automate this workflow in under 30 minutes with tools they already use.

## The problem

Teams lose time on repetitive work around **${topic}**. This playbook gives you a copy-paste starting point.

## What you'll build

1. **Trigger** — identify the event that should start the workflow (email, form, calendar, CRM update).
2. **Classify** — use a short structured prompt to route the item (urgent, support, sales, spam).
3. **Act** — notify the right channel and draft a reply in your tone.

## Step-by-step

### 1. Set up the trigger

Pick your source system (Gmail label, Typeform, HubSpot stage change) and connect it in Zapier or Make.

### 2. Add the classification step

Use a prompt like:

\`\`\`
Given this message about ${topic}, return JSON:
{ "intent": "quote|support|spam", "urgency": "high|low", "summary": "one sentence" }
\`\`\`

### 3. Route and draft

- High urgency → Slack + SMS
- Support → helpdesk queue with draft reply
- Sales → CRM task for follow-up within 24h

## Estimated setup time

20–30 minutes for a first version. Iterate after one week of real traffic.

## Next week

Reply with what broke — we'll ship a follow-up tuning checklist.`;
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
