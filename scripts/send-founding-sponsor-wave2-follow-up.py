#!/usr/bin/env python3
"""Send Experiment B wave-2 day-5 founding sponsor follow-up bumps.

Uses Resend API directly from .env.production.local (no deploy dependency).
Safe output — no secrets printed.

Usage:
  python3 scripts/send-founding-sponsor-wave2-follow-up.py [--dry-run] [--skip make,podium]
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
        "id": "make",
        "company": "Make.com",
        "to": "partners@make.com",
        "subject": "Founding sponsor slot — Automate This Week",
        "resend_id": "d0ea0dd6-f4d7-4c62-afc1-2ceb9bd36b0c",
    },
    {
        "id": "podium",
        "company": "Podium",
        "to": "partnerships@podium.com",
        "subject": "Founding sponsor — SMB review automation newsletter",
        "resend_id": "ee7d1313-78de-40ff-b6c6-d3acc118b92e",
    },
    {
        "id": "invoice-ninja",
        "company": "Invoice Ninja",
        "to": "hello@invoiceninja.com",
        "subject": "€99 founding sponsor — invoice follow-up playbook",
        "resend_id": "88af14db-e0ea-48b4-a72b-230adca23bd2",
    },
    {
        "id": "simplybook",
        "company": "SimplyBook.me",
        "to": "info@simplybook.me",
        "subject": "Sponsor Automate This Week — scheduling + reminders playbook",
        "resend_id": "53d7e429-9d75-4af1-86e5-b0665db00d6f",
    },
    {
        "id": "nicejob",
        "company": "NiceJob",
        "to": "hello@getnicejob.com",
        "subject": "Founding sponsor — SMB review automation newsletter",
        "resend_id": "d35861ca-3c51-414f-adaa-c121c22fb252",
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
        "wave": 2,
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
