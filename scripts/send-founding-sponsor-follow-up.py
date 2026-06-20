#!/usr/bin/env python3
"""Send Experiment B day-5 founding sponsor follow-up bumps.

Uses Resend API directly from .env.production.local (no deploy dependency).
Safe output — no secrets printed.

Usage:
  python3 scripts/send-founding-sponsor-follow-up.py [--dry-run] [--skip tally,calcom]
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.production.local"

FOLLOW_UP_TEXT = (
    "Bumping the €99 founding sponsor slot — still open for issues #3–5. "
    "No worries if timing's off."
)

TARGETS = [
    {
        "id": "tally",
        "company": "Tally",
        "to": "hello@tally.so",
        "subject": "Founding sponsor slot — Automate This Week (€99)",
        "resend_id": "2f590202-bb5b-497a-9b34-1a524977db3e",
    },
    {
        "id": "calcom",
        "company": "Cal.com",
        "to": "partnerships@cal.com",
        "subject": "Sponsor Automate This Week before we hit 50 subs?",
        "resend_id": "7bdc67d2-699d-4aaa-977b-c8309220a2fd",
    },
    {
        "id": "fillout",
        "company": "Fillout",
        "to": "support@fillout.com",
        "subject": "Founding sponsor slot — Automate This Week (€99)",
        "resend_id": "eb62aa18-7804-4784-9762-04454712fd39",
    },
    {
        "id": "brevo",
        "company": "Brevo",
        "to": "partners@brevo.com",
        "subject": "Founding sponsor — newsletter for SMB automation",
        "resend_id": "8fc14010-b9ce-4989-a0ed-a8a46c1cbf10",
    },
    {
        "id": "pipedrive",
        "company": "Pipedrive",
        "to": "affiliates@pipedrive.com",
        "subject": "€99 founding sponsor — practical SMB automation newsletter",
        "resend_id": "edfedfbd-c287-44cf-8bcc-efa1d4a4afff",
    },
]


def load_env() -> dict[str, str]:
    vals: dict[str, str] = {}
    if not ENV_FILE.exists():
        print(f"missing {ENV_FILE}", file=sys.stderr)
        sys.exit(1)
    for line in ENV_FILE.read_text().splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        vals[key] = value.strip().strip('"').strip("'")
    return vals


def send_bump(
    *,
    api_key: str,
    from_email: str,
    target: dict,
    dry_run: bool,
) -> dict:
    subject = f"Re: {target['subject']}"
    if dry_run:
        return {
            "id": target["id"],
            "company": target["company"],
            "to": target["to"],
            "subject": subject,
            "status": "skipped",
        }

    payload = {
        "from": from_email,
        "to": [target["to"]],
        "reply_to": "hello@automatethisweek.com",
        "subject": subject,
        "text": FOLLOW_UP_TEXT,
        "headers": {
            "In-Reply-To": f"<{target['resend_id']}@resend.dev>",
            "References": f"<{target['resend_id']}@resend.dev>",
        },
    }

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        data=json.dumps(payload).encode(),
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as err:
        detail = err.read().decode()
        return {
            "id": target["id"],
            "company": target["company"],
            "to": target["to"],
            "subject": subject,
            "status": "failed",
            "error": f"HTTP {err.code}: {detail}",
        }

    return {
        "id": target["id"],
        "company": target["company"],
        "to": target["to"],
        "subject": subject,
        "status": "sent",
        "resendId": body.get("id"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip", default="", help="Comma-separated target ids to skip")
    args = parser.parse_args()

    skip_ids = {s.strip() for s in args.skip.split(",") if s.strip()}
    env = load_env()
    api_key = env.get("RESEND_API_KEY", "")
    from_email = env.get("RESEND_FROM_EMAIL", "")

    if not args.dry_run and (not api_key or not from_email):
        print("RESEND_API_KEY and RESEND_FROM_EMAIL required", file=sys.stderr)
        return 1

    results = []
    for target in TARGETS:
        if target["id"] in skip_ids:
            results.append(
                {
                    "id": target["id"],
                    "company": target["company"],
                    "to": target["to"],
                    "subject": f"Re: {target['subject']}",
                    "status": "skipped",
                    "reason": "replied",
                }
            )
            continue
        results.append(
            send_bump(
                api_key=api_key,
                from_email=from_email,
                target=target,
                dry_run=args.dry_run,
            )
        )

    sent = sum(1 for r in results if r["status"] == "sent")
    failed = sum(1 for r in results if r["status"] == "failed")
    summary = {
        "experiment": "B",
        "mode": "followUp",
        "dryRun": args.dry_run,
        "sent": sent,
        "failed": failed,
        "followUpText": FOLLOW_UP_TEXT,
        "results": results,
    }
    print(json.dumps(summary, indent=2))
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
