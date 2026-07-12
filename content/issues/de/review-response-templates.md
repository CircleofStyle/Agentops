---
title: Google-Bewertungen mit einem Klick beantworten
date: '2026-07-12'
status: published
slug: review-response-templates
season: 1
seasonNumber: 11
sequenceOrder: 11
topic: Antwortvorlagen für Bewertungen
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Reputation warm halten ohne Abend-Admin — jede neue Bewertung bekommt einen Antwortentwurf zum Absenden
emailSubject: "Playbook #11: Google-Bewertungen mit einem Klick beantworten"
workflowDiagramAlt: Neue Google-Bewertung, Zapier entwirft Antwort aus Vorlagen, Inhaber sendet mit einem Tippen
publishedAt: '2026-07-12'
---
Eine neue Google-Bewertung kommt rein. Du willst später antworten. Später kommt nie — und der Thread kühlt ab, während Wettbewerber reagiert wirken.

Wenn eine neue Bewertung erscheint, legt Zapier einen Antwortentwurf in dein Sheet (oder den Posteingang) aus drei einfachen Vorlagen — positiv, konstruktiv, Danke — damit du mit einem Tippen absenden kannst statt abends vor dem leeren Feld zu sitzen.

**Einrichtungszeit: 20 Minuten.**

> **Schon eine Reputation-Agentur oder GBP-Auto-Antwort?** Behalte sie, wenn jede Bewertung schon menschlich beantwortet wird. **Dieses Playbook lohnt sich**, wenn Bewertungen offen bleiben, weil niemand die Antwort-Warteschlange besitzt.

Passt zu [Playbook #3](/de/issues/google-review-request-workflow): zuerst um die Bewertung bitten, dann antworten.

## Das Problem

Bewertungen wirken nur, wenn du erscheinst. Unbeantwortete Bewertungen wirken verlassen. Inhaber zögern, weil eine sorgfältige Antwort Fokus braucht — und Fokus zwischen Aufträgen fehlt. Fake-Versprechen wie «garantierte 5 Sterne» helfen nicht; eine ruhige, ehrliche Antwort schon.

## Das Ergebnis

Jede neue Bewertung bekommt planmässig einen Antwortentwurf. Du bleibst auf der Baustelle; die Reputation bleibt warm.

## Was enthalten ist

- **Antwort-Tracker** — Sheet-Spalten für Text, Sterneband, Entwurf, Status
- **3 Vorlagen** — positiv / konstruktiv / Danke
- **Setup-Guide** — Zapier von neuer Bewertung → Entwurf → du sendest

## Setup-Überblick

| | |
|---|---|
| **Einrichtungszeit** | 20 Minuten |
| **Schwierigkeit** | Einsteiger |
| **Tools** | Google Sheets, Gmail, Zapier (Free-Tier bei geringem Volumen) |
| **ROI** | Warme Antworten schützen lokales Vertrauen ohne Abend-Admin |

## Bevor du startest

1. **Ehrlich bleiben** — keine erfundenen Sternzahlen, keine «garantierten 5 Sterne», keine Anreize für eine Bewertung.
2. **Selbst senden** — die Automation entwirft; du (oder ein Vertrauter) liest 10 Sekunden und sendet.
3. **Ton treffen** — kurz, konkret, dankbar. Kein Floskeln-Deutsch.

## Schritt für Schritt — Zapier

### 1. Tracker kopieren

Spalten: `review_received_at` · `reviewer_name` · `rating` · `review_text` · `template` (positive | constructive | thank_you) · `draft_reply` · `status` (open | sent | skipped)

### 2. Neue Bewertungen erfassen

**Trigger:** Neue Google-Bewertung (GBP / Monitoring-Tool → Zapier).  
Sheet-Zeile: `status` = **open**, Text + Sterne einfügen.

> **Kein nativer GBP-Trigger?** Review-Benachrichtigungen an Gmail weiterleiten und den Text in dieselbe Sheet-Zeile parsen.

### 3. Vorlage wählen

- Sterne **4–5** → `positive`
- Sterne **1–3** mit brauchbarem Detail → `constructive`
- Kurzlob / fehlende Sterne → `thank_you`

### 4. Antwort entwerfen

**Positiv**

```
Hallo {{reviewer_name}},

vielen Dank für die freundlichen Worte — schön, dass die Arbeit gepasst hat.
Wenn Sie uns wieder brauchen, antworten Sie einfach hier oder rufen Sie an.

Beste Grüsse,
{{your_name}}
```

**Konstruktiv**

```
Hallo {{reviewer_name}},

danke, dass Sie sich die Zeit genommen haben. Es tut uns leid, dass die Erfahrung nicht ganz Ihren Erwartungen entsprochen hat.
Wir haben Ihr Feedback notiert und möchten das klären — bitte antworten Sie hier oder rufen Sie {{phone}} an.

Beste Grüsse,
{{your_name}}
```

**Danke (kurz)**

```
Hallo {{reviewer_name}},

danke für Ihre Bewertung — das freut uns.
Hoffentlich bis bald.

Beste Grüsse,
{{your_name}}
```

`draft_reply` ins Sheet schreiben (oder Gmail-Entwurf an dich selbst zum Kopieren nach GBP).

### 5. Du sendest

GBP öffnen → Entwurf einfügen → senden → Sheet `status` = **sent**.

Optional: Slack/SMS, wenn ein neuer `open`-Entwurf bereitliegt.

## Ton & Compliance

- Nur echte Kundinnen beantworten; keine erfundenen Bewertungen.
- Keine Rabatte oder Geschenke für Sterne-Änderungen.
- Konstruktive Antworten ruhig halten — Streitfälle lieber telefonisch.

## Danach

- Mit [Playbook #3](/de/issues/google-review-request-workflow) zu einem Reputation-Loop verbinden.
- Danach [Playbook #8](/de/issues/referral-ask-workflow) für Empfehlungsanfragen auf eigenem Zeitplan.
