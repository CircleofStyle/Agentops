# Automate This Week

NovaRho Phase 1 venture — an AI-operated B2B newsletter teaching small businesses practical automation workflows.

## Stack

- **App:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Email:** Resend (audience capture + double opt-in verification)
- **Fallback:** Local JSON subscriber store (`data/subscribers.json`) when Resend is unconfigured
- **Hosting:** Vercel (preview + production)
- **CI/CD:** GitHub Actions (lint, typecheck, build, deploy + health gate)
- **Observability:** Structured JSON logs to Vercel runtime logs; optional Sentry later

## Local dev

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Email capture

1. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_AUDIENCE_ID` in `.env.local`
2. Set `NEXT_PUBLIC_SITE_URL` to your public URL (required for confirmation links)
3. Signup flow: POST `/api/subscribe` → verification email → GET `/api/confirm?token=…` → `/confirmed`

Without Resend configured, signups are stored locally in `data/subscribers.json`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm smoke` | Run smoke test against local server |
| `pnpm content:draft` | Generate content draft from topic |
| `pnpm content:publish` | Publish approved draft |
| `pnpm content:broadcast` | Email published playbook to Resend audience (deprecated when drip active) |
| `pnpm content:drip` | Run drip advance job (due subscribers + migration) |
| `pnpm content:list` | List content issues |

## API

- `GET /api/health` — returns `{ "status": "ok", ... }` (used by deploy gate)
- `POST /api/subscribe` — `{ "email": "..." }` waitlist signup; optional `utm_source`, `utm_medium`, `utm_campaign` (also captured from landing URL query params via sessionStorage)
- `GET /api/metrics` — subscriber counts, UTM attribution breakdown, and monetization KPIs (auth: `Authorization: Bearer $CONTENT_PIPELINE_SECRET` or `$METRICS_SECRET`)
- `GET /api/confirm?token=...` — double opt-in confirmation
- `POST /api/content/draft` — agent content draft (auth: `CONTENT_PIPELINE_SECRET`)
- `POST /api/content/publish` — publish draft (auth: `CONTENT_PIPELINE_SECRET`); optional `{ "broadcast": true }` to email audience after publish
- `POST /api/content/broadcast` — send playbook email for an already-published issue (auth: `CONTENT_PIPELINE_SECRET`; skipped when drip sequence is active unless `catchUp: true`)
- `GET|POST /api/pipeline/drip` — advance due drip emails + migrate legacy subscribers (auth: `CONTENT_PIPELINE_SECRET` or Vercel `CRON_SECRET`; Vercel cron daily 14:00 UTC). Body flags: `audit: true`, `catchUpEmail`, `dryRun`.

### Weekly playbook broadcast

> **Deprecation:** When `DRIP_SEQUENCE_ENABLED` is true (default), full-audience broadcast is skipped. New subscribers receive playbooks via the per-subscriber drip sequence anchored to confirm date. Use `catchUp: true` to force a legacy broadcast.

When a playbook publishes, email verified subscribers via Resend **broadcast** to `RESEND_AUDIENCE_ID`. Idempotency is tracked in `data/playbook-broadcasts.json` (one send per issue slug).

### Signup drip sequence

On confirm: welcome email + issue #1 (transactional). Issue #2+ sends on `DRIP_CADENCE_DAYS` (default 7) via daily cron `GET /api/pipeline/drip`. Subscriber state: `dripSequenceIndex`, `lastDripSentAt`, `issuesSent[]` in `data/subscribers.json` locally; on Vercel, drip fields also sync to Resend contact properties so cron can advance the sequence. Set `CRON_SECRET` in Vercel equal to `CONTENT_PIPELINE_SECRET` so cron auth succeeds.

**Dry-run drip advance:**

```bash
pnpm content:drip --dry-run
# or:
curl -fsS -X POST http://localhost:3000/api/pipeline/drip \
  -H "Authorization: Bearer dev-secret-change-me" \
  -H "Content-Type: application/json" \
  -d '{"dryRun":true}'
```

**Dry-run (no Resend call):**

```bash
pnpm content:broadcast auto-triage-customer-emails --dry-run
# or via API:
curl -fsS -X POST http://localhost:3000/api/content/broadcast \
  -H "Authorization: Bearer dev-secret-change-me" \
  -H "Content-Type: application/json" \
  -d '{"slug":"auto-triage-customer-emails","dryRun":true}'
```

**Publish + broadcast in one call:**

```bash
curl -fsS -X POST http://localhost:3000/api/content/publish \
  -H "Authorization: Bearer $CONTENT_PIPELINE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"auto-triage-customer-emails","broadcast":true}'
```

**Test to a single inbox (transactional send, does not write idempotency log):**

```bash
curl -fsS -X POST http://localhost:3000/api/content/broadcast \
  -H "Authorization: Bearer $CONTENT_PIPELINE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"auto-triage-customer-emails","testEmail":"you@example.com"}'
```

**Catch-up for issue #1** (re-broadcast to full audience when `catchUp: true` bypasses idempotency):

```bash
pnpm content:broadcast auto-triage-customer-emails --catch-up
```

Production checklist: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_AUDIENCE_ID`, and `NEXT_PUBLIC_SITE_URL` must all be set. Verify with `testEmail` before the first full-audience broadcast.


Landing links can include standard UTM query params, e.g. `/?utm_source=linkedin&utm_medium=social&utm_campaign=launch-week-1`. The signup form persists these in `sessionStorage` and sends them with the subscribe request. Attribution is stored on each subscriber record in `data/subscribers.json` (first-touch: existing UTM fields are not overwritten on re-signup). Resend contacts do not currently support custom metadata in the SDK, so UTM lives in the local subscriber store and metrics API.

Example metrics call (local dev with default `.env.local` secret):

```bash
curl -fsS -H "Authorization: Bearer dev-secret-change-me" http://localhost:3000/api/metrics
```

Response includes a `monetization` object (backward compatible — existing fields unchanged):

```json
{
  "subscribers": { "pending": 0, "confirmed": 0, "total": 0 },
  "attribution": { "bySource": {} },
  "monetization": {
    "affiliateClicks7d": 0,
    "gumroadSales30d": 0,
    "sponsorRevenueTotal": 0
  },
  "resend": { "configured": false, "audienceTotal": null },
  "timestamp": "2026-06-14T00:00:00.000Z"
}
```

Monetization values resolve in order: **env override** → **`data/monetization.json` seed** → **0**. Copy `data/monetization.json.example` to `data/monetization.json` for manual CMO updates until Gumroad/sponsor APIs are wired.

| Field | Source (Phase 2) |
|-------|------------------|
| `affiliateClicks7d` | `METRICS_AFFILIATE_CLICKS_7D` or seed; 0 until click analytics exist |
| `gumroadSales30d` | `METRICS_GUMROAD_SALES_30D` or seed |
| `sponsorRevenueTotal` | `METRICS_SPONSOR_REVENUE_TOTAL` or seed |

## Deployment (Vercel)

### One-time setup

1. **GitHub repo** — push this project to GitHub (`main` branch).
2. **Vercel project** — import the repo at [vercel.com/new](https://vercel.com/new). Framework preset: Next.js.
3. **Environment variables** — configure in Vercel → Project → Settings → Environment Variables for **Production** and **Preview**:

   | Variable | Required | Notes |
   |----------|----------|-------|
   | `RESEND_API_KEY` | Yes (prod) | Resend API key |
   | `RESEND_FROM_EMAIL` | Yes (prod) | Verified sender |
   | `RESEND_AUDIENCE_ID` | Yes (prod) | Audience for waitlist |
   | `NEXT_PUBLIC_SITE_URL` | Yes | Production URL (e.g. `https://automate-this-week.vercel.app`) |
   | `NEXT_PUBLIC_GUMROAD_KIT_URL` | Optional | Gumroad product URL; issue-page kit CTA hidden until set |
   | `NEXT_PUBLIC_GUMROAD_ALL_ACCESS_URL` | Optional | All Access Pass checkout URL; `/all-access` CTA hidden until set |
   | `GUMROAD_ALL_ACCESS_PRODUCT_PERMALINK` | Optional | Filter Gumroad webhook to All Access product permalink |
   | `NEXT_PUBLIC_GUMROAD_CROWN_URL` | Optional | Crown Discipline checkout URL; `/crown` CTA hidden until set |
   | `GUMROAD_CROWN_PRODUCT_PERMALINK` | Optional | Filter Gumroad webhook to Crown Discipline product permalink |
   | `GUMROAD_WEBHOOK_SECRET` | Optional (prod) | Query param secret on `/api/webhooks/gumroad` |
   | `ALL_ACCESS_CODES` | Optional | Comma-separated manual All Access unlock codes |
   | `CROWN_ACCESS_CODES` | Optional | Comma-separated manual Crown Discipline unlock codes |
   | `AFFILIATE_URL_CURSOR` | Optional | Dormant — board private use only; `/tools` retired |
   | `AFFILIATE_URL_PAPERCLIP` | Optional | Dormant — board private use only; `/tools` retired |
   | `CONTENT_PIPELINE_SECRET` | Yes (prod) | Bearer token for content API and metrics API |
   | `METRICS_SECRET` | Optional | Override bearer token for `/api/metrics` only |
   | `OPENAI_API_KEY` | For content | LLM draft generation |

   Never commit secrets. Use `.env.local` locally; Vercel dashboard for deployed envs.

4. **GitHub Actions secrets** — add to repo Settings → Secrets → Actions:

   | Secret | Source |
   |--------|--------|
   | `PRODUCTION_URL` | Public production URL (e.g. `https://agentops.vercel.app`) |
   | `VERCEL_AUTOMATION_BYPASS_SECRET` | Optional — Vercel → Deployment Protection → Protection Bypass for Automation |

5. **GitHub environment** — create `production` environment (optional protection rules).

6. **Vercel Deployment Protection** — for a public landing page, use **Only Preview Deployments** (not All Deployments). If protection is enabled on production URLs, health checks and smoke tests return `401` until disabled or bypass secret is configured.

### Deploy flow

- **Preview:** Vercel auto-deploys every PR when GitHub is connected. CI (`.github/workflows/ci.yml`) runs lint/typecheck/build on PRs.
- **Production:** Vercel Git integration deploys on push to `main`. `.github/workflows/deploy.yml` then:
  1. lint → typecheck → build
  2. Post-deploy health check on `PRODUCTION_URL/api/health` (optional bypass header)

**Current production deployment:** `https://agentops-circleofstyles-projects.vercel.app` (Vercel production alias; `agentops-git-main-*` also tracks `main`). Update `PRODUCTION_URL` GitHub secret to this URL — stale per-deployment URLs (e.g. `agentops-c0cn9dd5b-*`) can serve older builds.

### Smoke test

Automated (no email inbox required):

```bash
# Terminal 1
pnpm dev

# Terminal 2
pnpm smoke
# or against a deployed URL:
./scripts/smoke-test.sh https://your-app.vercel.app
```

Manual end-to-end (requires Resend configured):

1. Open landing page → submit signup form with a real inbox
2. Click confirmation link in email → land on `/confirmed`
3. Open a published issue, e.g. `/issues/auto-triage-customer-emails`

### Rollback

**Fast rollback (recommended):**

1. Vercel Dashboard → Project → Deployments
2. Find the last known-good deployment
3. Click **⋯** → **Promote to Production**

**CLI rollback:**

```bash
vercel rollback
```

**Git revert (if bad commit on main):**

```bash
git revert <bad-commit-sha>
git push origin main
# Triggers new deploy via deploy.yml
```

After rollback, verify: `curl -fsS https://<prod-url>/api/health`

## Observability

- **Structured logs:** `src/lib/logger.ts` emits JSON to stdout (visible in Vercel → Logs).
- **Process errors:** `src/instrumentation.ts` captures unhandled rejections/exceptions.
- **Health endpoint:** `/api/health` includes version (`VERCEL_GIT_COMMIT_SHA`) and environment.
- **Deploy gate:** GitHub Actions deploy workflow fails if post-deploy health check does not return `status: ok`.

Optional future: Sentry via `@sentry/nextjs` (out of scope for MVP).

## Related issues

- Scaffold: [NOV-3](/NOV/issues/NOV-3)
- Landing + email: [NOV-4](/NOV/issues/NOV-4)
- Content pipeline: [NOV-5](/NOV/issues/NOV-5)
- Deploy + observability: [NOV-6](/NOV/issues/NOV-6)
