# Workflow diagram template — Automate This Week

Reusable vertical flow diagrams for newsletter issues. Created for [NOV-112](/NOV/issues/NOV-112) per [NOV-110](/NOV/issues/NOV-110) assessment.

## Design intent

| Lens | Application |
|------|-------------|
| **Cognitive Load** | One column, max 5 steps; business-outcome labels only |
| **Pragnanz (Gestalt)** | Rectangles + arrows; no Zapier jargon in the diagram |
| **Progressive Disclosure** | Technical steps stay in the article body; diagram shows the *result* |
| **Recognition over Recall** | “Wait” steps use tinted boxes; decisions use dashed borders |
| **WCAG** | 4.5:1 contrast on labels; `role="img"` + `<title>` / `<desc>` in SVG |

## Brand tokens

| Token | Value | Use |
|-------|-------|-----|
| `accent` | `#0ea5e9` | Header kicker, wait-step border |
| `text-primary` | `#0f172a` | Step labels |
| `text-muted` | `#64748b` | Optional footer |
| `surface` | `#f8fafc` | Diagram background |
| `box-fill` | `#ffffff` | Action / decision steps |
| `wait-fill` | `#f0f9ff` | Delay / wait steps |
| `border` | `#e2e8f0` | Action boxes |
| `arrow` | `#94a3b8` | Connectors |

Canvas: **560×420** px (matches email `max-width: 560px`).

## Files

| File | Purpose |
|------|---------|
| `public/workflow-diagrams/workflow-template.svg` | Blank template — edit `step-N-label` text nodes |
| `public/workflow-diagrams/quote-follow-up-workflow.svg` | Example for issue #2 (quote follow-up) |
| `public/workflow-diagrams/quote-follow-up-workflow.png` | Email-safe raster (generate via script below) |
| `scripts/render-workflow-diagram.mjs` | Optional: render PNG from any SVG in `public/workflow-diagrams/` |

## Step kinds

| `data-kind` | Visual | When to use |
|-------------|--------|-------------|
| `action` | White box, solid border | Something happens (email sent, row added, review requested) |
| `wait` | Sky tint, accent border | Delays (“Wait 3 days”, “Wait until Monday”) |
| `decision` | Dashed border | Branch question (“Still no reply?”, “Meeting booked?”) |

Remove unused steps: delete the `<g id="step-N">` group **and** the arrow line above the next step, then tighten `viewBox` height if needed.

## Label rules (CMO copy)

1. **Outcome language** — “Automatic follow-up email”, not “Zapier Delay step”.
2. **Short** — aim for ≤ 28 characters per line; one line per box.
3. **Time in wait steps** — “Wait 3 days”, not “Delay For 72 hours”.
4. **Questions for decisions** — end with `?`.
5. **No tool names** in the diagram (Zapier, Sheets, CRM belong in the article).

## Example: quote follow-up (issue #2)

| Step | Kind | Label |
|------|------|-------|
| 1 | action | Quote sent |
| 2 | wait | Wait 3 days |
| 3 | action | Automatic follow-up email |
| 4 | decision | Still no reply? |
| 5 | action | Second follow-up after 7 days |

## Embed in issue markdown (web)

Place after the opening hook, before “The problem”:

```markdown
## What happens

![Quote follow-up automation flow](/workflow-diagrams/quote-follow-up-workflow.png)
```

Use **PNG** on the web issue page for consistent rendering. SVG is fine for editing only.

## Embed in Resend email

**Recommended:** hosted PNG at production URL.

```html
<img
  src="https://automatethisweek.com/workflow-diagrams/quote-follow-up-workflow.png"
  alt="Quote sent, wait 3 days, automatic follow-up, second follow-up after 7 days if no reply"
  width="560"
  height="420"
  style="display:block;max-width:100%;height:auto;border-radius:16px;margin:24px auto;"
/>
```

**Fallback (text-only clients):** keep a plain list under the image:

```markdown
- Quote sent → Wait 3 days → Automatic follow-up email → Still no reply? → Second follow-up after 7 days
```

Do **not** rely on inline SVG in email — many clients strip it.

## Create a new diagram

1. Copy `workflow-template.svg` → `public/workflow-diagrams/{slug}-workflow.svg`.
2. Edit the five `step-N-label` strings (remove unused steps if fewer than five).
3. Run `node scripts/render-workflow-diagram.mjs public/workflow-diagrams/{slug}-workflow.svg`.
4. Add the markdown image block to the issue content file.
5. Reference the same PNG URL in the broadcast HTML if the diagram must appear above the fold in email.

## Handoff to CMO ([NOV-111](/NOV/issues/NOV-111))

- Drop the diagram into **issue #2+** content using the markdown snippet above.
- Coordinate timing with playbook restructure (outcome-first intro per NOV-110).
- For email broadcast: insert the `<img>` block in the teaser section or immediately after the outcome paragraph — not buried after step-by-step instructions.
- Alt text must describe the full flow for screen readers.

## Acceptance checklist

- [ ] Diagram uses business-outcome labels (no builder jargon)
- [ ] PNG exported and committed next to SVG
- [ ] Issue markdown references PNG path
- [ ] Email `<img>` uses production URL + alt text
- [ ] Text fallback list present for plain-text part
