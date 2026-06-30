/**
 * Acceptance check: DE signup → confirm → drip #1 content path.
 * Does not send email (no Resend required).
 */
import { getPublishedIssue } from "@/lib/content/storage";
import { getDripSequenceSlugs } from "@/lib/drip-sequence";
import { getTransactionalEmailCopy } from "@/lib/email-i18n";
import { buildPlaybookSubject } from "@/lib/playbook-email";
import { resolveSubscriberLocale } from "@/lib/subscriber-locale";
import {
  confirmSubscriber,
  findSubscriber,
  upsertPendingSubscriber,
} from "@/lib/subscribers";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const email = `de-acceptance+${Date.now()}@example.com`;
  const token = `verify-de-${Date.now()}`;

  await upsertPendingSubscriber(email, token, undefined, "de");
  const pending = await findSubscriber(email);
  assert(pending?.preferredLocale === "de", "signup should persist preferredLocale=de");
  assert(
    resolveSubscriberLocale(pending) === "de",
    "resolveSubscriberLocale should return de after signup",
  );

  const verificationCopy = getTransactionalEmailCopy("de");
  assert(
    verificationCopy.verificationSubject.includes("Bestätige"),
    "German verification email subject",
  );
  assert(
    verificationCopy.subscribeSuccess.length > 0,
    "German subscribe API success message",
  );

  const confirmed = await confirmSubscriber(token);
  assert(confirmed?.status === "confirmed", "confirm should mark subscriber confirmed");
  assert(
    resolveSubscriberLocale(confirmed) === "de",
    "locale should survive confirmation",
  );

  const welcomeCopy = getTransactionalEmailCopy("de");
  assert(welcomeCopy.welcomeSubject.includes("dabei"), "German welcome email subject");

  const sequence = await getDripSequenceSlugs();
  assert(sequence.length > 0, "drip sequence should have at least one slug");
  const slug = sequence[0]!;

  const issueDe = await getPublishedIssue(slug, "de");
  const issueEn = await getPublishedIssue(slug, "en");
  assert(issueDe, `German published issue missing: ${slug}`);
  assert(issueEn, `English published issue missing: ${slug}`);
  assert(
    issueDe.frontmatter.title !== issueEn.frontmatter.title,
    "DE drip #1 title should differ from EN",
  );

  const dripSubject = buildPlaybookSubject(issueDe);
  assert(
    dripSubject.includes("E-Mail") || dripSubject.includes("Playbook"),
    `German drip #1 subject looks wrong: ${dripSubject}`,
  );

  console.log("DE locale acceptance OK");
  console.log(`  subscriber: ${email}`);
  console.log(`  drip slug: ${slug}`);
  console.log(`  drip #1 subject (de): ${dripSubject}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
