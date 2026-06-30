---
title: Angebotsanfragen automatisch nachfassen mit einem 20-Minuten-Zapier-Workflow
date: '2026-06-16'
status: published
slug: quote-follow-up-workflow
topic: Angebots-Nachfass-Workflow
setupMinutes: 20
publishedAt: '2026-06-16'
visibility: email-only
difficulty: intermediate
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: 15%+ stille Angebote mit zeitgesteuerten Erinnerungen zurückgewinnen
emailSubject: "Playbook #2: Stille Angebote automatisch zurückgewinnen"
workflowDiagram: /workflow-diagrams/quote-follow-up-workflow.png
workflowDiagramAlt: Angebot gesendet, 3 Tage warten, automatisches Nachfassen, zweite Erinnerung nach 7 Tagen ohne Antwort
---

Du sendest ein Angebot, die Interessentin wird still — und das Nachfassen bleibt liegen. Dieses Playbook erinnert stille Interessentinnen am Tag 3 und Tag 7 — ohne Tabellen-Reminder oder Post-it am Monitor.

Passt zu [Playbook #1](/de/issues/auto-triage-customer-emails): erst eingehende Anfragen sortieren, dann die hängenden Angebote automatisch nachverfolgen.

## Was passiert

![Ablauf Angebots-Nachfass-Automatisierung](/workflow-diagrams/quote-follow-up-workflow.png)

## Das Problem

Die meisten Dienstleister senden Angebote in gutem Glauben und warten. Am fünften Tag bist du beim nächsten Auftrag — und die Interessentin bucht jemanden, der schneller nachgefasst hat. Manuelle Erinnerungen in einer Tabelle skalieren nicht über zehn offene Angebote hinaus.

## Was du baust

1. **Trigger** — neue Zeile im Google-Sheets-Angebots-Tracker (oder CRM-Status = `Quoted`)
2. **Warten** — 3 Tage ohne Statusänderung
3. **Nachfassen** — kurze E-Mail aus Vorlage senden und Kontakt in der Tabelle protokollieren

## Schritt für Schritt

### 1. Angebots-Tracker erstellen

Google Sheet mit Spalten: `email`, `name`, `quote_sent_at`, `status` (`open` | `won` | `lost`), `last_follow_up`.

Beim Senden eines Angebots: Zeile mit `status=open` und heutigem Datum in `quote_sent_at`.

### 2. Zapier-Trigger

**New Spreadsheet Row** in Google Sheets → Tracker wählen → Filter `status` equals `open`.

### 3. Verzögerung

**Delay For**: 3 Tage. Vor dem Senden: **Filter**, der nur fortfährt, wenn `status` noch `open` ist (Zeile aus Sheets neu lesen).

> **Tipp:** Wenn dein CRM bereits Angebotsstufen trackt, ersetze den Sheets-Trigger durch den CRM-Trigger «Deal aktualisiert».

### 4. Nachfass-E-Mail

Via Gmail (oder verbundenes Postfach):

```
Hallo {{name}},

Kurze Rückfrage zum Angebot vom {{quote_sent_at}}. Gerne passen wir Umfang oder Timing an, falls sich bei dir etwas geändert hat.

Antworte einfach hier — wir klären das.

— {{your_name}}
```

Tabelle aktualisieren: `last_follow_up` = heute.

### 5. Zweite Erinnerung (optional)

Pfad duplizieren mit **Delay For** 7 Tage (4 weitere Tage nach dem ersten Nachfassen). Stoppen, wenn `status` auf `won` oder `lost` wechselt.

## Geschätzte Einrichtungszeit

20 Minuten für v1. Starte nur mit der 3-Tage-Erinnerung; füge den 7-Tage-Pfad hinzu, wenn die ersten fünf Angebote durchgelaufen sind.

## Was du messen solltest

Antwortrate innerhalb 48h nach Nachfassen und % der `open`-Angebote, die zu `won` werden. Ziel: 15%+ Antwortrate beim ersten Nachfassen.
