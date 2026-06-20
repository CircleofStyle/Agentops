#!/usr/bin/env python3
"""Provision Resend inbound receiving + Vercel DNS/env for hello@automatethisweek.com.

Runs against production using CONTENT_PIPELINE_SECRET auth. Safe output — no secrets
printed except webhook secret length.

Usage:
  python3 scripts/provision-resend-inbound.py [--skip-deploy] [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.production.local"
SITE_URL = "https://automatethisweek.com"
SETUP_PATH = "/api/pipeline/inbound-setup"


def load_secret() -> str:
    if not ENV_FILE.exists():
        print(f"Missing {ENV_FILE}", file=sys.stderr)
        sys.exit(1)
    for line in ENV_FILE.read_text().splitlines():
        if line.startswith("CONTENT_PIPELINE_SECRET="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    print("CONTENT_PIPELINE_SECRET missing in .env.production.local", file=sys.stderr)
    sys.exit(1)


def run(cmd: list[str], *, dry_run: bool = False) -> int:
    print("+", " ".join(cmd))
    if dry_run:
        return 0
    return subprocess.run(cmd, cwd=ROOT, check=False).returncode


def post_setup(secret: str) -> dict:
    req = urllib.request.Request(
        f"{SITE_URL}{SETUP_PATH}",
        method="POST",
        headers={
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
        },
        data=b"{}",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-deploy", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    secret = load_secret()
    print(f"CONTENT_PIPELINE_SECRET len={len(secret)}")

    if not args.skip_deploy:
        code = run(["npx", "vercel", "deploy", "--prod", "--yes"], dry_run=args.dry_run)
        if code != 0:
            return code

    if args.dry_run:
        print("dry-run: would call inbound-setup and configure DNS/env")
        return 0

    try:
        result = post_setup(secret)
    except urllib.error.HTTPError as err:
        print(f"inbound-setup failed: {err.code} {err.read().decode()}", file=sys.stderr)
        return 1

    print("domain:", result.get("domainName"), "receiving:", result.get("receivingEnabled"))
    webhook = result.get("webhook", {})
    signing_secret = webhook.get("signingSecret")
    print("webhook_id:", webhook.get("id"), "created:", webhook.get("created"))
    print("signing_secret_len:", len(signing_secret or ""))

    mx = result.get("mxRecord")
    if mx:
        mx_name = mx.get("name", "@")
        dns_name = "@" if mx_name in ("@", "", result.get("domainName")) else mx_name
        dns_cmd = [
            "npx",
            "vercel",
            "dns",
            "add",
            result.get("domainName", "automatethisweek.com"),
            dns_name,
            "MX",
            mx.get("value", "").rstrip("."),
            str(mx.get("priority", 10)),
        ]
        code = run(dns_cmd, dry_run=False)
        if code != 0:
            print("DNS add may have failed (record might already exist)", file=sys.stderr)
    else:
        print("No MX record returned from Resend — check domain receiving status", file=sys.stderr)

    if signing_secret:
        for name, value in [
            ("RESEND_WEBHOOK_SECRET", signing_secret),
        ]:
            env_cmd = [
                "npx",
                "vercel",
                "env",
                "add",
                name,
                "production",
                "--value",
                value,
                "--yes",
                "--force",
            ]
            run(env_cmd, dry_run=False)

        redeploy_code = run(["npx", "vercel", "deploy", "--prod", "--yes"], dry_run=False)
        if redeploy_code != 0:
            return redeploy_code

    health_req = urllib.request.Request(f"{SITE_URL}/api/health")
    with urllib.request.urlopen(health_req, timeout=20) as resp:
        health = json.load(resp)
    inbound = health.get("inboundWebhook", {})
    print(
        "health:",
        "webhookSecretConfigured=",
        inbound.get("webhookSecretConfigured"),
        "paperclipConfigured=",
        inbound.get("paperclipConfigured"),
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
