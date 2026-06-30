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
    },
    {
        "slug": "crown-discipline",
        "name": "Automate This Week — Crown Discipline",
        "price_cents": 7900,
        "description": "<p>Paid add-on: Season 1 playbook #12 — Crown discipline AI CEO epilogue.</p>",
        "env_url": "NEXT_PUBLIC_GUMROAD_CROWN_URL",
        "env_permalink": "GUMROAD_CROWN_PRODUCT_PERMALINK",
    },
    {
        "slug": "inbox-triage-kit",
        "name": "Automate This Week — Inbox Triage Kit",
        "price_cents": 900,
        "description": "<p>Issue-page kit CTA product (optional).</p>",
        "env_url": "NEXT_PUBLIC_GUMROAD_KIT_URL",
        "env_permalink": None,
    },
]


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

    env_map = {
        "GUMROAD_WEBHOOK_SECRET": secret,
        "GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK": "all-access-pass",
        "GUMROAD_CROWN_PRODUCT_PERMALINK": "crown-discipline",
        "NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL": gumroad_url("all-access-pass"),
        "NEXT_PUBLIC_GUMROAD_CROWN_URL": gumroad_url("crown-discipline"),
        "NEXT_PUBLIC_GUMROAD_KIT_URL": gumroad_url("inbox-triage-kit"),
    }

    token = os.environ.get("GUMROAD_ACCESS_TOKEN", "").strip()
    if not args.vercel_only:
        if not token:
            print("GUMROAD_ACCESS_TOKEN missing — skipping Gumroad API (use --vercel-only)", file=sys.stderr)
        else:
            for spec in PRODUCTS:
                ensure_product(token, spec)
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
