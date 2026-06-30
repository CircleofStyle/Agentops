#!/usr/bin/env python3
"""Fetch subscriber metrics and print a markdown snapshot for Paperclip comments."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone


def main() -> int:
    base = os.environ.get("PRODUCTION_URL", os.environ.get("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")).rstrip("/")
    secret = os.environ.get("METRICS_SECRET") or os.environ.get("CONTENT_PIPELINE_SECRET")
    if not secret:
        print("FAIL: METRICS_SECRET or CONTENT_PIPELINE_SECRET is not set", file=sys.stderr)
        return 1

    req = urllib.request.Request(
        f"{base}/api/metrics",
        headers={"Authorization": f"Bearer {secret}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            metrics = json.load(resp)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"FAIL: GET /api/metrics returned {exc.code}: {body}", file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        print(f"FAIL: GET /api/metrics: {exc}", file=sys.stderr)
        return 1

    subs = metrics.get("subscribers", {})
    monetization = metrics.get("monetization", {})
    attribution = metrics.get("attribution", {}).get("bySource", {})
    resend = metrics.get("resend", {})
    ts = metrics.get("timestamp") or datetime.now(timezone.utc).isoformat()

    print("## Subscriber metrics snapshot")
    print()
    print(f"_Generated {ts}_")
    print()
    print("| Metric | Value |")
    print("|--------|------:|")
    print(f"| Confirmed | {subs.get('confirmed', 0)} |")
    print(f"| Pending | {subs.get('pending', 0)} |")
    print(f"| Total | {subs.get('total', 0)} |")
    print(f"| All Access | {subs.get('allAccess', 0)} |")
    print(f"| Crown | {subs.get('crownAccess', 0)} |")
    print(f"| Resend audience | {resend.get('audienceTotal', 'n/a')} |")
    print()
    if monetization:
        print("**Monetization (seed/config):**")
        for key, value in monetization.items():
            print(f"- {key}: {value}")
        print()
    if attribution:
        print("**UTM sources:**")
        for source, count in sorted(attribution.items(), key=lambda item: (-item[1], item[0])):
            print(f"- {source}: {count}")
        print()

    print("```json")
    print(json.dumps(metrics, indent=2))
    print("```")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
