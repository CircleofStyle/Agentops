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

echo "==> Published issue page (issue #1)"
issue_page=$(curl -fsS "${BASE_URL}/issues/auto-triage-customer-emails")
echo "$issue_page" | grep -qi "Auto-triage" || {
  echo "FAIL: issue #1 page not reachable"
  exit 1
}

echo "==> Published issue page (issue #2)"
issue2_page=$(curl -fsS "${BASE_URL}/issues/quote-follow-up-workflow")
echo "$issue2_page" | grep -qi "quote" || {
  echo "FAIL: issue #2 page not reachable"
  exit 1
}

echo "PASS: smoke test completed for ${BASE_URL}"
echo "Manual: confirm email flow requires RESEND_API_KEY + inbox access."
