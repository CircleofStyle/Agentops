#!/usr/bin/env bash
# Smoke test for AgentOps Brief — run against local or deployed URL.
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
echo "$landing" | grep -qi "AgentOps Brief" || {
  echo "FAIL: landing page missing expected content"
  exit 1
}

echo "==> Subscribe API"
subscribe_response=$(curl -fsS -X POST "${BASE_URL}/api/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke-test@example.com"}')
echo "$subscribe_response"

echo "==> Published issue page"
# Uses seeded content from content/issues/
issue_page=$(curl -fsS "${BASE_URL}/issues/auto-triage-customer-emails")
echo "$issue_page" | grep -qi "Auto-triage" || {
  echo "FAIL: published issue page not reachable"
  exit 1
}

echo "PASS: smoke test completed for ${BASE_URL}"
echo "Manual: confirm email flow requires RESEND_API_KEY + inbox access."
