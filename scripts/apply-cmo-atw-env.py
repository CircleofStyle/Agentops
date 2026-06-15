#!/usr/bin/env python3
"""Apply ATW production env bindings to the CMO agent adapterConfig.env.

Reads secrets from .env.production.local (gitignored). Safe to run in a CMO
heartbeat — prints key names and lengths only, never secret values.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.production.local"
CMO_AGENT_ID = "fc7f00b6-7292-4b36-9c0e-cc07e0674cdd"


def load_env(path: Path) -> dict[str, str]:
    vals: dict[str, str] = {}
    if not path.exists():
        return vals
    for line in path.read_text().splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        vals[key] = value.strip().strip('"').strip("'")
    return vals


def main() -> int:
    api = os.environ.get("PAPERCLIP_API_URL", "http://127.0.0.1:3100")
    key = os.environ.get("PAPERCLIP_API_KEY")
    run_id = os.environ.get("PAPERCLIP_RUN_ID", "")
    agent_id = os.environ.get("PAPERCLIP_AGENT_ID", "")

    if not key:
        print("PAPERCLIP_API_KEY missing", file=sys.stderr)
        return 1
    if agent_id != CMO_AGENT_ID:
        print(f"Run as CMO agent only (got {agent_id})", file=sys.stderr)
        return 1

    vals = load_env(ENV_FILE)
    env_bindings: dict[str, dict[str, str]] = {
        "ATW_METRICS_URL": {
            "type": "plain",
            "value": "https://automatethisweek.com/api/metrics",
        },
        "NEXT_PUBLIC_SITE_URL": {
            "type": "plain",
            "value": vals.get("NEXT_PUBLIC_SITE_URL") or "https://automatethisweek.com",
        },
    }
    for name in (
        "CONTENT_PIPELINE_SECRET",
        "RESEND_API_KEY",
        "RESEND_AUDIENCE_ID",
        "RESEND_FROM_EMAIL",
    ):
        value = vals.get(name, "")
        if value:
            env_bindings[name] = {"type": "plain", "value": value}

    if not env_bindings.get("CONTENT_PIPELINE_SECRET"):
        print("CONTENT_PIPELINE_SECRET missing in .env.production.local", file=sys.stderr)
        return 1

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if run_id:
        headers["X-Paperclip-Run-Id"] = run_id

    patch = {"adapterConfig": {"env": env_bindings}}
    req = urllib.request.Request(
        f"{api}/api/agents/{CMO_AGENT_ID}",
        method="PATCH",
        headers=headers,
        data=json.dumps(patch).encode(),
    )
    try:
        with urllib.request.urlopen(req) as resp:
            agent = json.load(resp)
    except urllib.error.HTTPError as err:
        print(f"PATCH failed: {err.code} {err.read().decode()}", file=sys.stderr)
        return 1

    bound = sorted(agent.get("adapterConfig", {}).get("env", {}).keys())
    print("bound_keys:", ", ".join(bound))
    for name in (
        "CONTENT_PIPELINE_SECRET",
        "RESEND_API_KEY",
        "RESEND_AUDIENCE_ID",
    ):
        length = len(env_bindings.get(name, {}).get("value", ""))
        print(f"{name}_len={length}")

    secret = env_bindings["CONTENT_PIPELINE_SECRET"]["value"]
    mreq = urllib.request.Request(
        "https://automatethisweek.com/api/metrics",
        headers={"Authorization": f"Bearer {secret}"},
    )
    try:
        with urllib.request.urlopen(mreq, timeout=20) as resp:
            print(f"metrics_probe_status={resp.status}")
    except urllib.error.HTTPError as err:
        print(f"metrics_probe_status={err.code}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
