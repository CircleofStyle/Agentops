#!/usr/bin/env python3
"""Send Experiment B wave-2 founding sponsor outreach (5 targets).

Uses Resend API directly from .env.production.local (no deploy dependency).
Safe output — no secrets printed.

Usage:
  python3 scripts/send-founding-sponsor-wave2.py [--dry-run] [--only make,podium]
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

SAMPLE_ISSUE_URL = "https://automatethisweek.com/issues/auto-triage-customer-emails"


def template_e(first_name: str) -> tuple[str, str]:
    subject = "Founding sponsor slot — Automate This Week"
    text = f"""Hi {first_name},

We teach one practical automation per week to 1–10 person service businesses. Week 1 playbook (live): {SAMPLE_ISSUE_URL}

Opening 3 founding sponsor spots at €99 (issues #3–5). We label sponsored content clearly and only feature SMB-practical tools.

Make.com is our recommended Zapier alternative in the playbook — natural sponsor fit for readers who want more control over multi-step workflows.

Reply yes/no — happy to send the one-pager or draft your 80-word blurb.

— Automate This Week
hello@automatethisweek.com"""
    return subject, text


def template_f(first_name: str, company: str) -> tuple[str, str]:
    subject = "Founding sponsor — SMB review automation newsletter"
    text = f"""Hi {first_name},

Automate This Week publishes one implementable automation per week for tiny service businesses. Issue #1 (inbox triage) is live; issue #3 covers Google review requests after finished jobs.

We're pre-selling 3 founding sponsor slots at €99 for issues #3–5: logo + 80-word blurb + tracked link, clearly labeled sponsored.

{company} fits readers who already deliver great work but need a system to ask for reviews — not awkward manual follow-up.

Interested? Reply and I'll hold a slot.

— Automate This Week
hello@automatethisweek.com"""
    return subject, text


def template_g(first_name: str) -> tuple[str, str]:
    subject = "€99 founding sponsor — invoice follow-up playbook"
    text = f"""Hi {first_name},

Quick pitch: Automate This Week = one automation per week for 1–10 person service shops. No founder personal brand — just playbooks.

Founding sponsor: €99 for logo + 80-word blurb + link in issue #3, #4, or #5. Issue #5 walks through friendly payment reminders without awkward phone calls.

Invoice Ninja is exactly the kind of tool our readers use before they automate invoice chase.

Reply if you'd like the rate card or a draft blurb.

— Automate This Week
hello@automatethisweek.com"""
    return subject, text


def template_b2(first_name: str) -> tuple[str, str]:
    subject = "Sponsor Automate This Week — scheduling + reminders playbook"
    text = f"""Hi {first_name},

We publish one automation playbook per week for small service businesses. First issue (live): inbox triage with Zapier — {SAMPLE_ISSUE_URL}

Issue #4 covers automated appointment reminders to cut no-shows.

Founding sponsors get one mention in issues #3–5 for €99 (then €150). Transparent sponsored label; we only feature tools we'd use in a playbook.

SimplyBook.me is a natural fit for the book → remind → show-up workflow we teach.

Worth a quick yes/no?

— Automate This Week
hello@automatethisweek.com"""
    return subject, text


TARGETS = [
    {
        "id": "make",
        "company": "Make.com",
        "to": "partners@make.com",
        "template": "E",
        "subject": template_e("there")[0],
        "text": template_e("there")[1],
    },
    {
        "id": "podium",
        "company": "Podium",
        "to": "partnerships@podium.com",
        "template": "F",
        "subject": template_f("there", "Podium")[0],
        "text": template_f("there", "Podium")[1],
    },
    {
        "id": "invoice-ninja",
        "company": "Invoice Ninja",
        "to": "hello@invoiceninja.com",
        "template": "G",
        "subject": template_g("there")[0],
        "text": template_g("there")[1],
    },
    {
        "id": "simplybook",
        "company": "SimplyBook.me",
        "to": "info@simplybook.me",
        "template": "B2",
        "subject": template_b2("there")[0],
        "text": template_b2("there")[1],
    },
    {
        "id": "nicejob",
        "company": "NiceJob",
        "to": "hello@getnicejob.com",
        "template": "F",
        "subject": template_f("there", "NiceJob")[0],
        "text": template_f("there", "NiceJob")[1],
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


def send_email(
    *,
    api_key: str,
    from_email: str,
    target: dict,
    dry_run: bool,
) -> dict:
    if dry_run:
        return {
            "id": target["id"],
            "company": target["company"],
            "to": target["to"],
            "template": target["template"],
            "subject": target["subject"],
            "status": "skipped",
        }

    payload = {
        "from": from_email,
        "to": [target["to"]],
        "reply_to": "hello@automatethisweek.com",
        "subject": target["subject"],
        "text": target["text"],
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
            "template": target["template"],
            "subject": target["subject"],
            "status": "failed",
            "error": f"HTTP {err.code}: {detail}",
        }

    return {
        "id": target["id"],
        "company": target["company"],
        "to": target["to"],
        "template": target["template"],
        "subject": target["subject"],
        "status": "sent",
        "resendId": body.get("id"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--only", default="", help="Comma-separated target ids")
    args = parser.parse_args()

    only_ids = {s.strip() for s in args.only.split(",") if s.strip()}
    env = load_env()
    api_key = env.get("RESEND_API_KEY", "")
    from_email = env.get("RESEND_FROM_EMAIL", "")

    if not args.dry_run and (not api_key or not from_email):
        print("RESEND_API_KEY and RESEND_FROM_EMAIL required", file=sys.stderr)
        return 1

    results = []
    for target in TARGETS:
        if only_ids and target["id"] not in only_ids:
            continue
        results.append(
            send_email(
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
        "mode": "initial",
        "dryRun": args.dry_run,
        "sent": sent,
        "failed": failed,
        "results": results,
    }
    print(json.dumps(summary, indent=2))
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
