---
title: Automatisches Nachfassen bei Angeboten mit einem 20-Minuten-Zapier-Workflow
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
roiImpact: 15 %+ stille Angebote mit zeitgesteuerten Erinnerungen zurückgewinnen
emailSubject: "Playbook #2: Stille Angebote automatisch zurückgewinnen"
workflowDiagram: /workflow-diagrams/quote-follow-up-workflow.png
workflowDiagramAlt: Angebot gesendet, 3 Tage warten, automatisches Nachfassen, zweite Erinnerung nach 7 Tagen ohne Antwort
---
Du sendest ein Angebot, die Interessentin wird still, und das Nachfassen rutscht weg. Dieses Playbook erinnert stille Interessentinnen am Tag 3 und Tag 7 — ohne Tabellen-Erinnerung oder Post-it am Monitor.

Passt gut zu [Playbook #1](/issues/auto-triage-customer-emails): Eingehende Angebotsanfragen zuerst sortieren, dann verfolgt dieser Workflow die, die hängen bleiben.

## Was passiert

![Automatisierter Ablauf für Angebots-Nachfassen](/workflow-diagrams/quote-follow-up-workflow.png)

## Das Problem

Die meisten Dienstleister senden Angebote in gutem Glauben und warten. Am fünften Tag bist du beim nächsten Auftrag — und die Interessentin bucht jemanden, der schneller nachgefasst hat. Manuelle Erinnerungen in einer Tabelle skalieren nicht über zehn offene Angebote, und CRM-Nudges funktionieren nur, wenn jemand jedes Angebot am selben Tag einträgt.

## Was du baust

1. **Trigger** — neue Zeile in einem Google-Sheet-Angebots-Tracker (oder CRM-Status = `Quoted`)
2. **Warten** — 3 Tage ohne Statusänderung
3. **Nachfassen** — kurze E-Mail aus deiner Vorlage senden und Kontakt im Sheet protokollieren

## Schritt für Schritt

### 1. Angebots-Tracker anlegen

Google Sheet mit Spalten: `email`, `name`, `quote_sent_at`, `status` (`open` | `won` | `lost`), `last_follow_up`.

Wenn du ein Angebot sendest, neue Zeile mit `status=open` und heutigem Datum in `quote_sent_at`.

### 2. Zapier-Trigger

**New Spreadsheet Row** in Google Sheets → Tracker wählen → Filter, wo `status` gleich `open` ist.

### 3. Verzögerung

**Delay For**-Schritt: 3 Tage. Vor dem Senden einen **Filter**, der nur fortfährt, wenn `status` noch `open` ist (Zeile aus Sheets erneut lesen).

> **Tipp:** Wenn dein CRM den Angebotsstatus trackt, ersetze den Sheets-Trigger durch den „Deal updated“-Trigger deines CRM und mappe dieselben Felder.

### 4. Nachfass-E-Mail

Über Gmail (oder verbundenes Postfach) senden:

```
Hallo {{name}},

Kurze Nachfrage zum Angebot vom {{quote_sent_at}}. Gerne passen wir Umfang oder Timing an, falls sich bei dir etwas geändert hat.

Antworte hier — wir klären den Rest.

— {{your_name}}
```

Sheet aktualisieren: `last_follow_up` auf heute setzen.

### 5. Zweite Erinnerung (optional)

Pfad duplizieren mit **Delay For** 7 Tage (4 weitere Tage nach der ersten Erinnerung). Stoppen, wenn `status` auf `won` oder `lost` wechselt.

## Geschätzte Einrichtungszeit

20 Minuten für v1. Starte nur mit der 3-Tage-Erinnerung; füge den 7-Tage-Pfad hinzu, nachdem deine ersten fünf Angebote durchgelaufen sind.

## Was du messen solltest

Antwortrate innerhalb von 48h nach dem Nachfassen und Anteil der `open`-Angebote, die zu `won` werden. Ziel: 15 %+ Antwortrate bei der ersten Erinnerung, bevor du mehr Automatisierung hinzufügst.
