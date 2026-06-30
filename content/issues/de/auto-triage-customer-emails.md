---
title: Kunden-E-Mails automatisch sortieren mit einem 15-Minuten-Zapier-+-GPT-Workflow
date: '2026-06-09'
status: published
slug: auto-triage-customer-emails
topic: Kunden-E-Mails automatisch sortieren
setupMinutes: 15
publishedAt: '2026-06-09'
visibility: sample
difficulty: beginner
toolRequirements:
  - Gmail
  - Zapier
  - Slack (optional)
roiImpact: Erste Antwortzeit von 48h auf gleichen Tag verkürzen
emailSubject: "Playbook #1: E-Mail-Sortierung von Stunden auf Minuten"
workflowDiagram: /workflow-diagrams/auto-triage-customer-emails-workflow.png
workflowDiagramAlt: Neue Kunden-E-Mail, automatische Klassifizierung, dringender Slack-Alert, Antwortentwurf in Gmail
---

Viele kleine Betriebe verlieren Leads in einem gemeinsamen Postfach. Dieses Playbook leitet dringende Anfragen weiter, erstellt Antwortentwürfe und protokolliert alles — ohne Ops-Personal.

## Was passiert

![Automatisierter Ablauf für E-Mail-Sortierung](/workflow-diagrams/auto-triage-customer-emails-workflow.png)

## Das Problem

Wenn drei Personen ein Gmail-Postfach teilen, liegen dringende Angebotsanfragen neben Newslettern und Spam. Niemand ist für die Sortierung zuständig — die Antwortzeit driftet auf 24–48 Stunden.

## Was du baust

1. **Trigger** — neue E-Mail mit Gmail-Label (`inbox/shared`)
2. **Klassifizieren** — strukturierter GPT-Prompt liefert Absicht + Dringlichkeit
3. **Weiterleiten** — Slack-Alert bei dringenden Mails; Antwortentwurf als Gmail-Draft

## Schritt für Schritt

### 1. Gmail-Label anlegen

Filter erstellen, der Nachrichten an `hello@deinbetrieb.ch` mit Label `inbox/shared` versieht.

### 2. Zapier-Trigger

**New Email Matching Search** in Gmail → Suche `label:inbox/shared`.

### 3. Klassifizierungs-Prompt

```
Given this email, return JSON only:
{ "intent": "quote|support|spam", "urgency": "high|low", "summary": "one sentence" }

Email:
{{body}}
```

### 4. Nach Dringlichkeit routen

- `urgency=high` → Post in `#sales-urgent` in Slack mit Zusammenfassung
- `intent=support` → Antwortentwurf mit deinem Support-Makro erstellen
- `intent=spam` → archivieren und Label `auto-archived` setzen

## Geschätzte Einrichtungszeit

15 Minuten für v1. Prompt nach 20 echten E-Mails feintunen.

## Was du messen solltest

Median der ersten Antwortzeit und Anteil korrekt klassifizierter E-Mails. Ziel: 80 %+ Genauigkeit, bevor du mehr Automatisierung hinzufügst.
