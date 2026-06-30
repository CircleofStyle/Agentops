import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { getTransactionalEmailCopy } from "@/lib/email-i18n";
import { logger } from "@/lib/logger";
import { PREFERRED_LOCALE_KEY, syncPreferredLocaleToResend } from "@/lib/resend-subscribers";
import { getAudienceId, getFromEmail, getResendClient, getSiteUrl } from "./resend";

export async function addToResendAudience(
  email: string,
  preferredLocale?: Locale,
): Promise<boolean> {
  const resend = getResendClient();
  const audienceId = getAudienceId();

  if (!resend || !audienceId) return false;

  const properties =
    preferredLocale != null ? { [PREFERRED_LOCALE_KEY]: preferredLocale } : undefined;

  const { error } = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
    ...(properties ? { properties } : {}),
  });

  if (error && !error.message?.toLowerCase().includes("already")) {
    logger.error("Resend audience error", { error: error.message });
    return false;
  }

  if (preferredLocale) {
    await syncPreferredLocaleToResend(email, preferredLocale);
  }

  return true;
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale: Locale = "en",
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const copy = getTransactionalEmailCopy(locale);
  const confirmUrl = `${getSiteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: copy.verificationSubject,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">${copy.playbookBrand}</h1>
        <p>${copy.verificationIntro}</p>
        <p><a href="${confirmUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">${copy.verificationCta}</a></p>
        <p style="color: #64748b; font-size: 14px;">${copy.verificationLinkLabel} ${confirmUrl}</p>
      </div>
    `,
  });

  if (error) {
    logger.error("Resend email error", { error: error.message });
    return false;
  }

  return true;
}

export async function sendWelcomeEmail(email: string, locale: Locale = "en"): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const copy = getTransactionalEmailCopy(locale);
  const seasonUrl = `${getSiteUrl()}${localizedPath("/season-1", locale)}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: copy.welcomeSubject,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">${copy.welcomeTitle}</h1>
        <p>${copy.welcomeBody}</p>
        <p>${copy.welcomeSequence}</p>
        <p><a href="${seasonUrl}" style="color: #0ea5e9;">${copy.welcomeSeasonLink}</a></p>
        <p>${copy.welcomeSignoff}</p>
      </div>
    `,
  });
}
