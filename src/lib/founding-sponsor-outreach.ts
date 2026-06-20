import { getFromEmail, getResendClient } from "./resend";

export type SponsorOutreachTarget = {
  id: string;
  company: string;
  to: string;
  template: "A" | "B" | "C" | "D";
  subject: string;
  text: string;
};

const SAMPLE_ISSUE_URL = "https://automatethisweek.com/issues/auto-triage-customer-emails";

function templateA(firstName: string, toolHook: string): { subject: string; text: string } {
  return {
    subject: "Founding sponsor slot — Automate This Week (€99)",
    text: `Hi ${firstName},

Automate This Week is a weekly playbook newsletter for 1–10 person service businesses — practical automations, not AI hype. Issue #1 walks readers through Zapier inbox triage: ${SAMPLE_ISSUE_URL}

We're opening 3 founding sponsor slots (€99/issue, issues #3–5) before the rate moves to €150. Placement: logo + 80-word blurb + link, clearly labeled sponsored.

${toolHook} fits readers who collect client info before automating follow-up — happy to draft the blurb if useful.

Interested? Reply and I'll hold a slot.

— Automate This Week
hello@automatethisweek.com`,
  };
}

function templateB(firstName: string): { subject: string; text: string } {
  return {
    subject: "Sponsor Automate This Week before we hit 50 subs?",
    text: `Hi ${firstName},

We publish one automation playbook per week for small service businesses. First issue (live): inbox triage with Zapier — ${SAMPLE_ISSUE_URL}

Founding sponsors get one mention in issues #3–5 for €99 (then €150). Transparent sponsored label; we only feature tools we'd use in a playbook.

Cal.com is a natural fit for the "book → triage → follow-up" workflows we teach.

Worth a quick yes/no?

— Automate This Week`,
  };
}

function templateC(firstName: string, useCase: string): { subject: string; text: string } {
  return {
    subject: "€99 founding sponsor — practical SMB automation newsletter",
    text: `Hi ${firstName},

Automate This Week helps 1–10 person shops automate one workflow per week. No founder personal brand — just playbooks.

We're pre-selling 3 sponsor slots at €99 for issues #3–5. Sample content: ${SAMPLE_ISSUE_URL}

Pipedrive readers are exactly who we write for — ${useCase}.

Reply if you'd like the one-pager or a draft blurb.

— Automate This Week`,
  };
}

function templateD(firstName: string): { subject: string; text: string } {
  return {
    subject: "Founding sponsor — newsletter for SMB automation",
    text: `Hi ${firstName},

Quick pitch: Automate This Week = one implementable automation per week for tiny service businesses. Issue #1 is live (Zapier email triage).

Founding sponsor: €99 for logo + 80-word blurb + link in issue #3, #4, or #5. Sponsored label, no paywall on the newsletter.

Brevo aligns with our readers who need reliable email before they automate.

Interested in holding a slot?

— Automate This Week`,
  };
}

export const FOUNDING_SPONSOR_TARGETS: SponsorOutreachTarget[] = [
  {
    id: "tally",
    company: "Tally",
    to: "hello@tally.so",
    template: "A",
    ...templateA("there", "Tally forms feed the triage workflow in issue #1"),
  },
  {
    id: "calcom",
    company: "Cal.com",
    to: "partnerships@cal.com",
    template: "B",
    ...templateB("there"),
  },
  {
    id: "fillout",
    company: "Fillout",
    to: "support@fillout.com",
    template: "A",
    ...templateA("there", "Client intake forms before Zapier routing"),
  },
  {
    id: "brevo",
    company: "Brevo",
    to: "partners@brevo.com",
    template: "D",
    ...templateD("there"),
  },
  {
    id: "pipedrive",
    company: "Pipedrive",
    to: "affiliates@pipedrive.com",
    template: "C",
    ...templateC("there", "deal follow-up after inbox triage"),
  },
];

export type SponsorSendResult = {
  id: string;
  company: string;
  to: string;
  template: string;
  subject: string;
  status: "sent" | "failed" | "skipped";
  resendId?: string;
  error?: string;
};

export async function sendFoundingSponsorOutreach(options?: {
  targetIds?: string[];
  dryRun?: boolean;
}): Promise<SponsorSendResult[]> {
  const resend = getResendClient();
  const from = getFromEmail();
  const ids = options?.targetIds?.length
    ? new Set(options.targetIds)
    : null;
  const targets = ids
    ? FOUNDING_SPONSOR_TARGETS.filter((t) => ids.has(t.id))
    : FOUNDING_SPONSOR_TARGETS;

  const results: SponsorSendResult[] = [];

  for (const target of targets) {
    if (options?.dryRun) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject: target.subject,
        status: "skipped",
      });
      continue;
    }

    if (!resend) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject: target.subject,
        status: "failed",
        error: "RESEND not configured",
      });
      continue;
    }

    const { data, error } = await resend.emails.send({
      from,
      to: target.to,
      replyTo: "hello@automatethisweek.com",
      subject: target.subject,
      text: target.text,
    });

    if (error) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject: target.subject,
        status: "failed",
        error: error.message,
      });
      continue;
    }

    results.push({
      id: target.id,
      company: target.company,
      to: target.to,
      template: target.template,
      subject: target.subject,
      status: "sent",
      resendId: data?.id,
    });
  }

  return results;
}

export const FOUNDING_SPONSOR_FOLLOW_UP_TEXT =
  "Bumping the €99 founding sponsor slot — still open for issues #3–5. No worries if timing's off.";

/** Resend IDs from initial Experiment B sends (2026-06-15). Used for reply threading. */
export const INITIAL_SEND_RESEND_IDS: Record<string, string> = {
  tally: "2f590202-bb5b-497a-9b34-1a524977db3e",
  calcom: "7bdc67d2-699d-4aaa-977b-c8309220a2fd",
  fillout: "eb62aa18-7804-4784-9762-04454712fd39",
  brevo: "8fc14010-b9ce-4989-a0ed-a8a46c1cbf10",
  pipedrive: "edfedfbd-c287-44cf-8bcc-efa1d4a4afff",
};

export async function sendFoundingSponsorFollowUp(options?: {
  targetIds?: string[];
  skipIds?: string[];
  dryRun?: boolean;
}): Promise<SponsorSendResult[]> {
  const resend = getResendClient();
  const from = getFromEmail();
  const ids = options?.targetIds?.length ? new Set(options.targetIds) : null;
  const skip = new Set(options?.skipIds ?? []);
  const targets = (ids
    ? FOUNDING_SPONSOR_TARGETS.filter((t) => ids.has(t.id))
    : FOUNDING_SPONSOR_TARGETS
  ).filter((t) => !skip.has(t.id));

  const results: SponsorSendResult[] = [];

  for (const target of targets) {
    const subject = `Re: ${target.subject}`;

    if (options?.dryRun) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject,
        status: "skipped",
      });
      continue;
    }

    if (!resend) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject,
        status: "failed",
        error: "RESEND not configured",
      });
      continue;
    }

    const originalId = INITIAL_SEND_RESEND_IDS[target.id];
    const headers = originalId
      ? { "In-Reply-To": `<${originalId}@resend.dev>`, References: `<${originalId}@resend.dev>` }
      : undefined;

    const { data, error } = await resend.emails.send({
      from,
      to: target.to,
      replyTo: "hello@automatethisweek.com",
      subject,
      text: FOUNDING_SPONSOR_FOLLOW_UP_TEXT,
      headers,
    });

    if (error) {
      results.push({
        id: target.id,
        company: target.company,
        to: target.to,
        template: target.template,
        subject,
        status: "failed",
        error: error.message,
      });
      continue;
    }

    results.push({
      id: target.id,
      company: target.company,
      to: target.to,
      template: target.template,
      subject,
      status: "sent",
      resendId: data?.id,
    });
  }

  return results;
}
