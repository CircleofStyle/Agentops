/**
 * Offline verification for Resend inbound webhook helpers (no Resend API calls).
 * Usage: pnpm verify:inbound
 */
import { randomBytes } from "node:crypto";
import { Webhook } from "svix";
import {
  extractSnippet,
  isHelloInboxRecipient,
  isPositiveReply,
  verifyResendWebhook,
  type ResendEmailReceivedEvent,
} from "../src/lib/resend-inbound";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const sampleEvent: ResendEmailReceivedEvent = {
  type: "email.received",
  created_at: "2026-06-16T12:00:00.000Z",
  data: {
    email_id: "test-email-id",
    from: "prospect@example.com",
    to: ["hello@automatethisweek.com"],
    subject: "Re: Founding sponsor slot",
    created_at: "2026-06-16T12:00:00.000Z",
  },
};

// Heuristic checks
assert(isHelloInboxRecipient(["Hello <hello@automatethisweek.com>"]), "hello inbox match");
assert(!isHelloInboxRecipient(["other@example.com"]), "non-hello ignored");
assert(isPositiveReply("Yes, interested — hold a slot for us."), "positive yes");
assert(isPositiveReply("Sounds good, happy to learn more."), "positive sounds good");
assert(!isPositiveReply("No thanks, not at this time."), "negative no thanks");
assert(!isPositiveReply(""), "empty body not positive");
assert(
  extractSnippet("  line one\n\nline two with more text ").startsWith("line one line two"),
  "snippet compaction",
);

// Signature verification (Svix round-trip)
const secret = `whsec_${randomBytes(24).toString("base64")}`;
process.env.RESEND_WEBHOOK_SECRET = secret;
const payload = JSON.stringify(sampleEvent);
const wh = new Webhook(secret);
const msgId = `msg_${randomBytes(8).toString("hex")}`;
const timestamp = new Date();
const signature = wh.sign(msgId, timestamp, payload);
const headers = new Headers({
  "svix-id": msgId,
  "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
  "svix-signature": signature,
});

const verified = verifyResendWebhook(payload, headers);
assert(verified.data.email_id === "test-email-id", "signature verification");

console.log("PASS: inbound webhook verification");
