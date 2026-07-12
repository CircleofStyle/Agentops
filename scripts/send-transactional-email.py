#!/usr/bin/env python3
"""Send a one-off transactional email (Reddit drafts, board delivery, etc.).

Prefers direct Resend when RESEND_API_KEY is set in .env.production.local;
otherwise calls the production pipeline API (uses CONTENT_PIPELINE_SECRET).

Safe output — no secrets printed.

Usage:
  python3 scripts/send-transactional-email.py \\
    --to admira_besic@hotmail.com \\
    --subject "Reddit reply drafts — batch 1" \\
    --text-file path/to/body.txt

  python3 scripts/send-transactional-email.py --dry-run --to you@example.com \\
    --subject "Test" --text "Hello"

  python3 scripts/send-transactional-email.py --via-api --to ... --subject ... --text ...
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.production.local"
DEFAULT_API_URL = "https://automatethisweek.com/api/pipeline/send-email"
DEFAULT_REPLY_TO = "hello@automatethisweek.com"
# Resend documented limit for total attachments (~40MB); keep agent sends smaller.
MAX_ATTACH_BYTES = 25 * 1024 * 1024


def load_env() -> dict[str, str]:
    vals: dict[str, str] = {}
    if not ENV_FILE.exists():
        return vals
    for line in ENV_FILE.read_text().splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        vals[key] = value.strip().strip('"').strip("'")
    return vals


def resend_configured(env: dict[str, str]) -> bool:
    key = env.get("RESEND_API_KEY", "")
    from_email = env.get("RESEND_FROM_EMAIL", "")
    if not key or not from_email:
        return False
    if "xxx" in key or "yourdomain" in from_email:
        return False
    return len(key) >= 20


def build_attachments(paths: list[Path]) -> tuple[list[dict], str | None]:
    attachments: list[dict] = []
    total = 0
    for path in paths:
        if not path.is_file():
            return [], f"Attachment not found: {path}"
        raw = path.read_bytes()
        total += len(raw)
        if total > MAX_ATTACH_BYTES:
            return [], f"Attachments exceed {MAX_ATTACH_BYTES} bytes"
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        attachments.append(
            {
                "filename": path.name,
                "content": base64.b64encode(raw).decode("ascii"),
                "content_type": content_type,
            }
        )
    return attachments, None


def send_via_resend(
    *,
    api_key: str,
    from_email: str,
    to: str,
    subject: str,
    text: str,
    reply_to: str,
    dry_run: bool,
    attachments: list[dict] | None = None,
) -> dict:
    attach_names = [a["filename"] for a in (attachments or [])]
    if dry_run:
        return {
            "mode": "resend",
            "status": "skipped",
            "to": to,
            "subject": subject,
            "attachments": attach_names,
            "dryRun": True,
        }

    payload: dict = {
        "from": from_email,
        "to": [to],
        "reply_to": reply_to,
        "subject": subject,
        "text": text,
    }
    if attachments:
        payload["attachments"] = attachments
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
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as err:
        return {
            "mode": "resend",
            "status": "failed",
            "to": to,
            "subject": subject,
            "attachments": attach_names,
            "error": f"HTTP {err.code}: {err.read().decode()[:500]}",
        }

    return {
        "mode": "resend",
        "status": "sent",
        "to": to,
        "subject": subject,
        "attachments": attach_names,
        "resendId": body.get("id"),
    }


def send_via_api(
    *,
    api_url: str,
    pipeline_secret: str,
    to: str,
    subject: str,
    text: str,
    reply_to: str,
    dry_run: bool,
) -> dict:
    payload = {
        "to": to,
        "subject": subject,
        "text": text,
        "replyTo": reply_to,
        "dryRun": dry_run,
    }
    req = urllib.request.Request(
        api_url,
        method="POST",
        headers={
            "Authorization": f"Bearer {pipeline_secret}",
            "Content-Type": "application/json",
        },
        data=json.dumps(payload).encode(),
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as err:
        detail = err.read().decode()[:500]
        return {
            "mode": "api",
            "status": "failed",
            "to": to,
            "subject": subject,
            "error": f"HTTP {err.code}: {detail}",
        }

    ok = body.get("ok", False)
    return {
        "mode": "api",
        "status": "sent" if ok and not dry_run else ("skipped" if dry_run else "failed"),
        "to": to,
        "subject": subject,
        "resendId": body.get("resendId"),
        "dryRun": body.get("dryRun"),
        "error": body.get("error"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Send one-off transactional email")
    parser.add_argument("--to", required=True, help="Recipient email")
    parser.add_argument("--subject", required=True, help="Email subject")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--text", help="Plain-text body")
    group.add_argument("--text-file", type=Path, help="Path to plain-text body file")
    parser.add_argument("--reply-to", default=DEFAULT_REPLY_TO)
    parser.add_argument(
        "--attach",
        action="append",
        type=Path,
        default=[],
        help="File to attach (repeatable). Requires local Resend; not supported via pipeline API.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--via-api",
        action="store_true",
        help="Force production pipeline API (default when local Resend not configured)",
    )
    parser.add_argument("--api-url", default=DEFAULT_API_URL)
    args = parser.parse_args()

    text = args.text
    if args.text_file:
        text = args.text_file.read_text(encoding="utf-8")

    if not text or not text.strip():
        print("Email body is empty", file=sys.stderr)
        return 1

    attachments: list[dict] = []
    if args.attach:
        attachments, attach_err = build_attachments(args.attach)
        if attach_err:
            print(attach_err, file=sys.stderr)
            return 1

    env = load_env()
    use_api = args.via_api or not resend_configured(env)

    if use_api:
        if attachments:
            print(
                "Attachments require local Resend (RESEND_API_KEY). "
                "Pipeline API does not accept files yet.",
                file=sys.stderr,
            )
            return 1
        secret = env.get("CONTENT_PIPELINE_SECRET", "")
        if not args.dry_run and not secret:
            print("CONTENT_PIPELINE_SECRET required in .env.production.local", file=sys.stderr)
            return 1
        result = send_via_api(
            api_url=args.api_url,
            pipeline_secret=secret,
            to=args.to,
            subject=args.subject,
            text=text,
            reply_to=args.reply_to,
            dry_run=args.dry_run,
        )
    else:
        result = send_via_resend(
            api_key=env["RESEND_API_KEY"],
            from_email=env["RESEND_FROM_EMAIL"],
            to=args.to,
            subject=args.subject,
            text=text,
            reply_to=args.reply_to,
            dry_run=args.dry_run,
            attachments=attachments or None,
        )

    print(json.dumps(result, indent=2))
    return 0 if result.get("status") in ("sent", "skipped") else 1


if __name__ == "__main__":
    raise SystemExit(main())
