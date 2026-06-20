import { logger } from "@/lib/logger";
import { getAudienceId, getFromEmail, getResendClient, getSiteUrl } from "./resend";

export async function addToResendAudience(email: string): Promise<boolean> {
  const resend = getResendClient();
  const audienceId = getAudienceId();

  if (!resend || !audienceId) return false;

  const { error } = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  });

  if (error && !error.message?.toLowerCase().includes("already")) {
    logger.error("Resend audience error", { error: error.message });
    return false;
  }

  return true;
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const confirmUrl = `${getSiteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Confirm your Automate This Week subscription",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Automate This Week</h1>
        <p>Thanks for signing up! Confirm your email to get your first automation playbook — step-by-step, no coding required.</p>
        <p><a href="${confirmUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Confirm subscription</a></p>
        <p style="color: #64748b; font-size: 14px;">Or copy this link: ${confirmUrl}</p>
      </div>
    `,
  });

  if (error) {
    logger.error("Resend email error", { error: error.message });
    return false;
  }

  return true;
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const seasonUrl = `${getSiteUrl()}/season-1`;

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "You're in — your playbook sequence starts now",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">You're confirmed!</h1>
        <p>Welcome to Automate This Week. Your personal playbook sequence starts now — Issue #1 (auto-triage customer emails) arrives in the next few minutes.</p>
        <p>You'll receive playbooks 1→12 in order, one every 7 days. Each saves 2–5 hours per week once live. Every step uses tools you already have — finish in under 30 minutes, no dev team.</p>
        <p><a href="${seasonUrl}" style="color: #0ea5e9;">See the full Season 1 roadmap →</a></p>
        <p>— The NovaRho team</p>
      </div>
    `,
  });
}
