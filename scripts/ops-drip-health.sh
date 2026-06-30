#!/usr/bin/env bash
# Verify production drip pipeline health (run after Vercel cron at 14:00 UTC).
# Usage: PRODUCTION_URL=https://automatethisweek.com CONTENT_PIPELINE_SECRET=... ./scripts/ops-drip-health.sh
set -euo pipefail

BASE_URL="${PRODUCTION_URL:-${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}}"
BASE_URL="${BASE_URL%/}"
SECRET="${CONTENT_PIPELINE_SECRET:-}"

if [[ -z "$SECRET" ]]; then
  echo "FAIL: CONTENT_PIPELINE_SECRET is not set"
  exit 1
fi

echo "==> Health: ${BASE_URL}/api/health"
health=$(curl -fsS "${BASE_URL}/api/health")
echo "$health"
echo "$health" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"' || {
  echo "FAIL: /api/health did not return status ok"
  exit 1
}

echo "==> Drip dry-run: ${BASE_URL}/api/pipeline/drip"
drip=$(curl -fsS -X POST "${BASE_URL}/api/pipeline/drip" \
  -H "Authorization: Bearer ${SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"dryRun":true}')
echo "$drip"
echo "$drip" | grep -q '"sequence"' || {
  echo "FAIL: drip response missing sequence"
  exit 1
}

processed=$(echo "$drip" | python3 -c "import json,sys; print(json.load(sys.stdin).get('processed', 'missing'))")
migrated=$(echo "$drip" | python3 -c "import json,sys; print(json.load(sys.stdin).get('migrated', 'missing'))")
echo "PASS: drip dry-run ok (processed=${processed}, migrated=${migrated})"
