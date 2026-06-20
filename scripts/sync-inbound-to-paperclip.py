#!/usr/bin/env python3
"""Sync hello@ inbound replies from production Resend into Paperclip sponsor log.

Paperclip runs locally (127.0.0.1) so production webhooks cannot write directly.
This script polls the production pipeline endpoint (Resend receiving API) and appends
new rows to [NOV-77 sponsor-outreach-log](/NOV/issues/NOV-77#document-sponsor-outreach-log).

Usage:
  python3 scripts/sync-inbound-to-paperclip.py [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.production.local"
SITE_URL = "https://automatethisweek.com"
SPONSOR_ISSUE_ID = "c896b654-b38b-4a33-a053-49403583330d"
SPONSOR_LOG_KEY = "sponsor-outreach-log"
CMO_AGENT_ID = "fc7f00b6-7292-4b36-9c0e-cc07e0674cdd"


def load_pipeline_secret() -> str:
    for line in ENV_FILE.read_text().splitlines():
        if line.startswith("CONTENT_PIPELINE_SECRET="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("CONTENT_PIPELINE_SECRET missing")


def paperclip_request(api: str, key: str, run_id: str, path: str, method: str = "GET", body: dict | None = None):
    headers = {"Authorization": f"Bearer {key}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if run_id:
        headers["X-Paperclip-Run-Id"] = run_id
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{api}{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def append_inbound_row(body: str, entry: dict) -> str:
    email_id = entry["emailId"]
    if email_id in body:
        return body

    row = (
        f"| {entry['receivedAt']} | {entry['from']} | {entry['subject']} | "
        f"{entry['snippet']} | `{email_id}` | "
        f"{'**positive**' if entry['positive'] else 'neutral'} |"
    )
    section = "## Inbound replies"
    header = (
        "| Received | From | Subject | Snippet | Email ID | Sentiment |\n"
        "|----------|------|---------|---------|----------|-----------|"
    )

    if section in body:
        before, after = body.split(section, 2)
        lines = after.strip().split("\n")
        table_lines = []
        for line in lines:
            if line.startswith("## "):
                break
            table_lines.append(line)
        updated = "\n".join([*table_lines, row])
        return f"{before}{section}\n\n{updated}\n"

    return f"{body.rstrip()}\n\n{section}\n\n{header}\n{row}\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    api = os.environ.get("PAPERCLIP_API_URL", "http://127.0.0.1:3100")
    key = os.environ.get("PAPERCLIP_API_KEY")
    run_id = os.environ.get("PAPERCLIP_RUN_ID", "")
    if not key:
        print("PAPERCLIP_API_KEY missing", file=sys.stderr)
        return 1

    pipeline_secret = load_pipeline_secret()
    list_req = urllib.request.Request(
        f"{SITE_URL}/api/pipeline/inbound-replies",
        headers={"Authorization": f"Bearer {pipeline_secret}"},
    )
    with urllib.request.urlopen(list_req, timeout=60) as resp:
        payload = json.load(resp)

    replies = payload.get("replies", [])
    print(f"production_replies={len(replies)}")

    doc = paperclip_request(
        api,
        key,
        run_id,
        f"/api/issues/{SPONSOR_ISSUE_ID}/documents/{SPONSOR_LOG_KEY}",
    )
    body = doc["body"]
    appended = 0
    positive_new = 0

    for entry in replies:
        next_body = append_inbound_row(body, entry)
        if next_body != body:
            body = next_body
            appended += 1
            if entry.get("positive"):
                positive_new += 1

    if appended == 0:
        print("no_new_rows")
        return 0

    print(f"appended={appended} positive_new={positive_new}")
    if args.dry_run:
        return 0

    paperclip_request(
        api,
        key,
        run_id,
        f"/api/issues/{SPONSOR_ISSUE_ID}/documents/{SPONSOR_LOG_KEY}",
        method="PUT",
        body={
            "title": doc["title"],
            "format": "markdown",
            "body": body,
            "baseRevisionId": doc["latestRevisionId"],
        },
    )

    if positive_new:
        comment = "\n".join(
            [
                "## Positive sponsor reply (synced from Resend)",
                "",
                f"- **Count:** {positive_new} new positive reply(s) synced",
                "",
                f"[@CMO](agent://{CMO_AGENT_ID}) — review [sponsor-outreach-log](/NOV/issues/NOV-77#document-sponsor-outreach-log).",
            ]
        )
        paperclip_request(
            api,
            key,
            run_id,
            f"/api/issues/{SPONSOR_ISSUE_ID}/comments",
            method="POST",
            body={"body": comment},
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
