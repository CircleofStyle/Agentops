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
    subject: "Confirm your AgentOps Brief subscription",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">AgentOps Brief</h1>
        <p>Thanks for subscribing! Confirm your email to start receiving practical AI automation playbooks.</p>
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

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "You're in — welcome to AgentOps Brief",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">You're confirmed!</h1>
        <p>Welcome to AgentOps Brief. Each week you'll get one practical automation playbook you can implement without a dev team.</p>
        <p>— The NovaRho team</p>
      </div>
    `,
  });
}
