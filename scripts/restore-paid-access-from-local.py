#!/usr/bin/env python3
"""Restore All Access / Crown grants from local data/subscribers.json onto production.

Requires CONTENT_PIPELINE_SECRET (or METRICS_SECRET) and a deployed
POST /api/admin/restore-paid-access handler that syncs flags to Resend.

Usage:
  PRODUCTION_URL=https://automatethisweek.com \\
  CONTENT_PIPELINE_SECRET=... \\
  python3 scripts/restore-paid-access-from-local.py
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


def main() -> int:
    base = os.environ.get("PRODUCTION_URL", os.environ.get("NEXT_PUBLIC_SITE_URL", "")).rstrip("/")
    secret = os.environ.get("METRICS_SECRET") or os.environ.get("CONTENT_PIPELINE_SECRET")
    if not base or not secret:
        print(
            "FAIL: set PRODUCTION_URL and METRICS_SECRET/CONTENT_PIPELINE_SECRET",
            file=sys.stderr,
        )
        return 1

    path = Path(os.environ.get("SUBSCRIBERS_FILE", "data/subscribers.json"))
    if not path.is_file():
        print(f"FAIL: missing {path}", file=sys.stderr)
        return 1

    subscribers = json.loads(path.read_text())
    grants = []
    for record in subscribers:
        email = (record.get("email") or "").lower()
        if not email:
            continue
        all_access = bool(record.get("allAccess"))
        crown = bool(record.get("crownAccess"))
        if not all_access and not crown:
            continue
        source = record.get("allAccessSource") or record.get("crownAccessSource") or "manual"
        if source not in ("gumroad", "code", "manual"):
            source = "manual"
        grants.append(
            {
                "email": email,
                "allAccess": all_access,
                "crownAccess": crown,
                "source": source,
            }
        )

    if not grants:
        print("FAIL: no paid-access grants found in local subscribers file", file=sys.stderr)
        return 1

    payload = json.dumps({"grants": grants}).encode("utf-8")
    req = urllib.request.Request(
        f"{base}/api/admin/restore-paid-access",
        data=payload,
        headers={
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as exc:
        print(f"FAIL: HTTP {exc.code}: {exc.read().decode('utf-8', 'replace')}", file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(body, indent=2))
    subs = body.get("subscribers") or {}
    print(
        f"Restored {body.get('restored', 0)}/{len(grants)} · "
        f"allAccess={subs.get('allAccess')} · confirmed={subs.get('confirmed')}",
        file=sys.stderr,
    )
    return 0 if body.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
