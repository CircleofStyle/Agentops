#!/usr/bin/env bash
# Smoke test for Automate This Week — run against local or deployed URL.
# Usage: ./scripts/smoke-test.sh [BASE_URL]
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
BASE_URL="${BASE_URL%/}"

echo "==> Health check"
health=$(curl -fsS "${BASE_URL}/api/health")
echo "$health"
echo "$health" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"' || {
  echo "FAIL: /api/health did not return status ok"
  exit 1
}

echo "==> Landing page"
landing=$(curl -fsS "${BASE_URL}/")
echo "$landing" | grep -qi "Automate This Week" || {
  echo "FAIL: landing page missing expected content"
  exit 1
}

echo "==> Subscribe API"
subscribe_response=$(curl -fsS -X POST "${BASE_URL}/api/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke-test@example.com"}')
echo "$subscribe_response"

echo "==> Playbook archive"
archive=$(curl -fsS "${BASE_URL}/issues")
echo "$archive" | grep -qi "Playbook archive" || {
  echo "FAIL: archive page missing expected heading"
  exit 1
}

echo "==> Published issue #1 (sample — full body on web)"
issue1_page=$(curl -fsS "${BASE_URL}/issues/auto-triage-customer-emails")
echo "$issue1_page" | grep -qi "Auto-triage" || {
  echo "FAIL: issue #1 page not reachable"
  exit 1
}
echo "$issue1_page" | grep -qi "Step-by-step" || {
  echo "FAIL: issue #1 should show full playbook body (sample visibility)"
  exit 1
}
echo "$issue1_page" | grep -qi "Get the full playbook by email" && {
  echo "FAIL: issue #1 should not show email gate (sample visibility)"
  exit 1
}

echo "==> Published issue #2 (email-only gating, if published)"
issue2_status=$(curl -s -o /tmp/issue2-smoke.html -w "%{http_code}" "${BASE_URL}/issues/quote-follow-up-workflow")
if [[ "$issue2_status" == "200" ]]; then
  issue2_page=$(cat /tmp/issue2-smoke.html)
  echo "$issue2_page" | grep -qi "Get the full playbook by email" || {
    echo "FAIL: issue #2 should show email gate when published"
    exit 1
  }
  echo "$issue2_page" | grep -qi "### 1. Create the quote tracker" && {
    echo "FAIL: issue #2 should not expose full step-by-step on web"
    exit 1
  }
  echo "Issue #2 gating OK"
elif [[ "$issue2_status" == "404" ]]; then
  echo "SKIP: issue #2 not published yet (expected before NOV-85)"
else
  echo "FAIL: issue #2 returned unexpected status ${issue2_status}"
  exit 1
fi

echo "==> Resend inbound webhook (unconfigured → 503, or 400 without signature)"
webhook_status=$(curl -sS -o /tmp/atw-webhook-body.txt -w "%{http_code}" -X POST \
  "${BASE_URL}/api/webhooks/resend/inbound" \
  -H "Content-Type: application/json" \
  -d '{"type":"email.received"}')
webhook_body=$(cat /tmp/atw-webhook-body.txt)
echo "status=${webhook_status} body=${webhook_body}"
if [[ "${webhook_status}" == "503" ]]; then
  echo "OK: webhook route present, returns 503 when RESEND_WEBHOOK_SECRET unset"
elif [[ "${webhook_status}" == "400" ]]; then
  echo "OK: webhook route present, rejects unsigned payload"
else
  echo "FAIL: expected 503 (unconfigured) or 400 (unsigned), got ${webhook_status}"
  exit 1
fi

echo "PASS: smoke test completed for ${BASE_URL}"
echo "Manual: confirm email flow requires RESEND_API_KEY + inbox access."
