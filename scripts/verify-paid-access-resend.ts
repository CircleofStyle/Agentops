/**
 * Offline verification for Resend paid-access property hydration + merge.
 * Usage: pnpm verify:paid-access-resend
 */
import {
  ALL_ACCESS_GRANTED_AT_KEY,
  ALL_ACCESS_KEY,
  ALL_ACCESS_SOURCE_KEY,
  CROWN_ACCESS_KEY,
  paidAccessFieldsFromProperties,
} from "../src/lib/resend-paid-access";
import { mergeSubscriberRecords } from "../src/lib/resend-subscribers";
import type { SubscriberRecord } from "../src/lib/subscribers";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const hydrated = paidAccessFieldsFromProperties({
  [ALL_ACCESS_KEY]: "true",
  [ALL_ACCESS_GRANTED_AT_KEY]: "2026-06-20T12:39:11.821Z",
  [ALL_ACCESS_SOURCE_KEY]: "gumroad",
  [CROWN_ACCESS_KEY]: "false",
});

assert(hydrated.allAccess === true, "all_access true hydrates");
assert(hydrated.allAccessSource === "gumroad", "all_access_source hydrates");
assert(hydrated.allAccessGrantedAt === "2026-06-20T12:39:11.821Z", "granted_at hydrates");
assert(hydrated.crownAccess === undefined, "false crown stays unset");

const denied = paidAccessFieldsFromProperties({
  [ALL_ACCESS_KEY]: "false",
});
assert(denied.allAccess === undefined, "false all_access stays unset");

const remote: SubscriberRecord = {
  email: "buyer@example.com",
  status: "confirmed",
  createdAt: "2026-06-20T12:39:11.821Z",
  confirmedAt: "2026-06-20T12:39:11.821Z",
  token: "remote-token",
  allAccess: true,
  allAccessGrantedAt: "2026-06-20T12:39:11.821Z",
  allAccessSource: "gumroad",
};

const localEmpty: SubscriberRecord[] = [];
const mergedFromRemote = mergeSubscriberRecords(localEmpty, [remote]);
assert(mergedFromRemote.length === 1, "remote-only merge keeps contact");
assert(mergedFromRemote[0].allAccess === true, "remote allAccess survives empty local FS");
assert(mergedFromRemote[0].allAccessSource === "gumroad", "remote source survives empty local FS");

const localPending: SubscriberRecord = {
  email: "buyer@example.com",
  status: "pending",
  createdAt: "2026-06-19T00:00:00.000Z",
  token: "local-token",
};

const merged = mergeSubscriberRecords([localPending], [remote]);
assert(merged[0].status === "confirmed", "confirmed wins on merge");
assert(merged[0].allAccess === true, "allAccess preserved when local lacks flag");
assert(merged[0].token === "local-token", "local token preferred when present");

console.log("PASS: paid-access Resend hydration + merge verification");
