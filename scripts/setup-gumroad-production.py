#!/usr/bin/env python3
"""Provision Gumroad SKUs + Vercel production env for ATW paid tiers.

Idempotent. Requires GUMROAD_ACCESS_TOKEN for product + ping wiring.
Vercel env + redeploy can run without Gumroad when --vercel-only.

Usage:
  python3 scripts/setup-gumroad-production.py
  python3 scripts/setup-gumroad-production.py --vercel-only
  python3 scripts/setup-gumroad-production.py --skip-deploy
  GUMROAD_ACCESS_TOKEN=... python3 scripts/setup-gumroad-production.py

Never prints secret values — only key names and lengths.
"""
from __future__ import annotations

import argparse
import json
import os
import secrets
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_URL = os.environ.get("ATW_PRODUCTION_URL", "https://automatethisweek.com")
GUMROAD_STORE = os.environ.get("GUMROAD_STORE_SUBDOMAIN", "agentops")
WEBHOOK_SECRET_FILE = ROOT / "data" / ".gumroad-webhook-secret"

PRODUCTS = [
    {
        "slug": "all-access-pass",
        "name": "Automate This Week — All Access Pass",
        "price_cents": 4900,
        "description": "<p>Unlock the full Season 1 playbook archive on the web.</p>",
        "env_url": "NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL",
        "env_permalink": "GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK",
        "zip_file": None,
    },
    {
        "slug": "crown-discipline",
        "name": "Automate This Week — Crown Discipline",
        "price_cents": 7900,
        "description": "<p>Paid add-on: Season 1 playbook #12 — Crown discipline AI CEO epilogue.</p>",
        "env_url": "NEXT_PUBLIC_GUMROAD_CROWN_URL",
        "env_permalink": "GUMROAD_CROWN_PRODUCT_PERMALINK",
        "zip_file": None,
    },
]

# Workflow Kit Store — playbooks #1–#3 (+ starter bundle). ZIPs from pnpm kits:export.
KIT_PRODUCTS = [
    {
        "slug": "inbox-triage-kit",
        "playbook_slug": "auto-triage-customer-emails",
        "name": "Automate This Week — Inbox Triage Kit",
        "price_cents": 1900,
        "description": "<p>Copy-paste Zapier kit: GPT inbox classification, Slack routing, Gmail drafts. Playbook #1 accelerator.</p>",
        "zip_file": "inbox-triage-kit.zip",
    },
    {
        "slug": "quote-follow-up-kit",
        "playbook_slug": "quote-follow-up-workflow",
        "name": "Automate This Week — Quote Follow-Up Kit",
        "price_cents": 1900,
        "description": "<p>Google Sheets quote tracker + day-3/day-7 Gmail nudges. Playbook #2 accelerator.</p>",
        "zip_file": "quote-follow-up-kit.zip",
    },
    {
        "slug": "google-review-request-kit",
        "playbook_slug": "google-review-request-workflow",
        "name": "Automate This Week — Google Review Request Kit",
        "price_cents": 1900,
        "description": "<p>Job tracker + review request emails on a 2-day / 7-day schedule. Playbook #3 accelerator.</p>",
        "zip_file": "google-review-request-kit.zip",
    },
    {
        "slug": "starter-bundle-kits-1-3",
        "playbook_slug": None,
        "name": "Automate This Week — Starter Bundle (Kits #1–#3)",
        "price_cents": 3900,
        "description": "<p>All three Season 1 workflow kits in one purchase.</p>",
        "zip_file": "starter-bundle-kits-1-3.zip",
    },
]

KITS_OUTPUT_DIR = ROOT / "dist" / "kits"


def gumroad_url(slug: str) -> str:
    return f"https://{GUMROAD_STORE}.gumroad.com/l/{slug}"


def load_or_create_webhook_secret() -> str:
    if secret := os.environ.get("GUMROAD_WEBHOOK_SECRET", "").strip():
        return secret
    if WEBHOOK_SECRET_FILE.exists():
        return WEBHOOK_SECRET_FILE.read_text().strip()
    secret = secrets.token_hex(24)
    WEBHOOK_SECRET_FILE.parent.mkdir(parents=True, exist_ok=True)
    WEBHOOK_SECRET_FILE.write_text(secret)
    WEBHOOK_SECRET_FILE.chmod(0o600)
    return secret


def gumroad_request(
    token: str,
    method: str,
    path: str,
    data: dict[str, str] | None = None,
) -> dict:
    body = urllib.parse.urlencode({"access_token": token, **(data or {})}).encode()
    req = urllib.request.Request(
        f"https://api.gumroad.com/v2{path}",
        data=body if method != "GET" else None,
        method=method,
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def list_products(token: str) -> list[dict]:
    payload = gumroad_request(token, "GET", "/products")
    if not payload.get("success"):
        raise RuntimeError(f"Gumroad list products failed: {payload}")
    return payload.get("products") or []


def run_kit_export() -> None:
    proc = subprocess.run(
        ["pnpm", "kits:export"],
        cwd=ROOT,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError("pnpm kits:export failed — run manually before Gumroad upload")


def upload_gumroad_file(token: str, zip_path: Path) -> str:
    proc = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "gumroad-upload-file.py"), str(zip_path)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env={**os.environ, "GUMROAD_ACCESS_TOKEN": token},
    )
    if proc.returncode != 0:
        raise RuntimeError(f"gumroad upload failed for {zip_path.name}: {proc.stderr.strip()}")
    payload = json.loads(proc.stdout.strip())
    return payload["file_url"]


def attach_product_file(token: str, product_id: str, file_url: str, display_name: str) -> None:
    payload = gumroad_request(
        token,
        "PUT",
        f"/products/{product_id}",
        {
            "files[0][url]": file_url,
            "files[0][display_name]": display_name,
        },
    )
    if not payload.get("success"):
        raise RuntimeError(f"Gumroad attach file failed for {product_id}: {payload}")
    print(f"gumroad_file_attached product_id={product_id} file={display_name}")


def ensure_kit_product(token: str, spec: dict) -> dict:
    product = ensure_product(token, spec)
    zip_name = spec.get("zip_file")
    if not zip_name:
        return product
    zip_path = KITS_OUTPUT_DIR / zip_name
    if not zip_path.is_file():
        raise RuntimeError(f"kit ZIP missing: {zip_path} — run pnpm kits:export")
    file_url = upload_gumroad_file(token, zip_path)
    attach_product_file(token, product["id"], file_url, zip_name)
    return product


def kit_url_map() -> dict[str, str]:
    return {
        spec["playbook_slug"]: gumroad_url(spec["slug"])
        for spec in KIT_PRODUCTS
        if spec.get("playbook_slug")
    }


def ensure_product(token: str, spec: dict) -> dict:
    existing = {
        (p.get("custom_permalink") or p.get("short_url", "").rsplit("/", 1)[-1]): p
        for p in list_products(token)
    }
    if spec["slug"] in existing:
        product = existing[spec["slug"]]
        print(f"gumroad_product_exists slug={spec['slug']} id={product.get('id')}")
        return product

    payload = gumroad_request(
        token,
        "POST",
        "/products",
        {
            "native_type": "digital",
            "name": spec["name"],
            "description": spec["description"],
            "custom_permalink": spec["slug"],
            "price": str(spec["price_cents"]),
            "price_currency_type": "eur",
        },
    )
    if not payload.get("success"):
        raise RuntimeError(f"Gumroad create {spec['slug']} failed: {payload}")
    product = payload["product"]
    print(f"gumroad_product_created slug={spec['slug']} id={product.get('id')}")
    enable = gumroad_request(token, "PUT", f"/products/{product['id']}/enable")
    if not enable.get("success"):
        print(f"warn: enable {spec['slug']} returned {enable}", file=sys.stderr)
    return product


def ensure_sale_webhook(token: str, ping_url: str) -> None:
    payload = gumroad_request(token, "GET", "/resource_subscriptions")
    subs = payload.get("resource_subscriptions") or []
    for sub in subs:
        if sub.get("post_url") == ping_url and sub.get("resource_name") == "sale":
            print("gumroad_webhook_exists resource=sale")
            return
    created = gumroad_request(
        token,
        "PUT",
        "/resource_subscriptions",
        {"resource_name": "sale", "post_url": ping_url},
    )
    if not created.get("success"):
        raise RuntimeError(f"Gumroad webhook create failed: {created}")
    print("gumroad_webhook_created resource=sale")


def vercel_env_upsert(name: str, value: str, *, dry_run: bool) -> None:
    check = subprocess.run(
        ["npx", "vercel", "env", "ls", "production"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if name in check.stdout:
        rm = subprocess.run(
            ["npx", "vercel", "env", "rm", name, "production", "--yes"],
            cwd=ROOT,
            check=False,
        )
        if rm.returncode != 0 and not dry_run:
            raise RuntimeError(f"vercel env rm {name} failed")

    if dry_run:
        print(f"vercel_env_dry_run {name} len={len(value)}")
        return

    add = subprocess.run(
        ["npx", "vercel", "env", "add", name, "production"],
        cwd=ROOT,
        input=value,
        text=True,
        capture_output=True,
    )
    if add.returncode != 0:
        raise RuntimeError(f"vercel env add {name} failed: {add.stderr.strip()}")
    print(f"vercel_env_set {name} len={len(value)}")


def deploy_production(*, dry_run: bool) -> None:
    if dry_run:
        print("vercel_deploy_dry_run")
        return
    proc = subprocess.run(
        ["npx", "vercel", "deploy", "--prod", "--yes"],
        cwd=ROOT,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError("vercel deploy --prod failed")


def fetch_health() -> dict:
    with urllib.request.urlopen(f"{SITE_URL}/api/health", timeout=30) as resp:
        return json.load(resp)


def test_webhook_ping(secret: str) -> int:
    body = urllib.parse.urlencode(
        {
            "email": "gumroad-prod-test@example.com",
            "sale_id": f"test-{secrets.token_hex(6)}",
            "product_permalink": "all-access-pass",
            "refunded": "false",
        }
    ).encode()
    url = f"{SITE_URL}/api/webhooks/gumroad?secret={urllib.parse.quote(secret)}"
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"webhook_test_status={resp.status}")
            return resp.status
    except urllib.error.HTTPError as err:
        print(f"webhook_test_status={err.code}")
        return err.code


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--vercel-only", action="store_true")
    parser.add_argument("--skip-deploy", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    secret = load_or_create_webhook_secret()
    ping_url = f"{SITE_URL}/api/webhooks/gumroad?secret={secret}"

    kit_urls = kit_url_map()
    env_map = {
        "GUMROAD_WEBHOOK_SECRET": secret,
        "GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK": "all-access-pass",
        "GUMROAD_CROWN_PRODUCT_PERMALINK": "crown-discipline",
        "NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL": gumroad_url("all-access-pass"),
        "NEXT_PUBLIC_GUMROAD_CROWN_URL": gumroad_url("crown-discipline"),
        "NEXT_PUBLIC_GUMROAD_KIT_URL": gumroad_url("inbox-triage-kit"),
        "NEXT_PUBLIC_GUMROAD_KIT_URLS": json.dumps(kit_urls, separators=(",", ":")),
        "NEXT_PUBLIC_GUMROAD_STARTER_BUNDLE_URL": gumroad_url("starter-bundle-kits-1-3"),
    }

    token = os.environ.get("GUMROAD_ACCESS_TOKEN", "").strip()
    if not args.vercel_only:
        if not token:
            print("GUMROAD_ACCESS_TOKEN missing — skipping Gumroad API (use --vercel-only)", file=sys.stderr)
        else:
            if not args.dry_run:
                run_kit_export()
            for spec in PRODUCTS:
                ensure_product(token, spec)
            for spec in KIT_PRODUCTS:
                ensure_kit_product(token, spec)
            ensure_sale_webhook(token, ping_url)

    for name, value in env_map.items():
        vercel_env_upsert(name, value, dry_run=args.dry_run)

    # Deploy after env vars so NEXT_PUBLIC_* are baked into the build.
    if not args.skip_deploy:
        deploy_production(dry_run=args.dry_run)

    if args.dry_run:
        return 0

    health = fetch_health()
    gumroad = health.get("gumroadWebhook", {})
    print(
        "health_gumroad",
        json.dumps(
            {
                k: gumroad.get(k)
                for k in (
                    "webhookSecretConfigured",
                    "allAccessProductConfigured",
                    "crownProductConfigured",
                    "checkoutUrlConfigured",
                    "crownCheckoutUrlConfigured",
                    "kitCheckoutUrlConfigured",
                    "missingPublic",
                    "missingServer",
                )
            }
        ),
    )

    status = test_webhook_ping(secret)
    if status not in (200, 401):
        print(f"warn: unexpected webhook test status {status}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
