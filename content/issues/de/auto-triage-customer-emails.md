---
title: Kunden-E-Mails automatisch sortieren mit einem 15-Minuten-Zapier- + GPT-Workflow
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
roiImpact: Erste Antwort von 48h auf gleichen Tag verkürzen
emailSubject: "Playbook #1: E-Mail-Triage von Stunden auf Minuten reduzieren"
workflowDiagram: /workflow-diagrams/auto-triage-customer-emails-workflow.png
workflowDiagramAlt: Neue Kunden-E-Mail, Absicht automatisch klassifizieren, dringende Slack-Meldung, Antwortentwurf in Gmail speichern
---

Die meisten kleinen Betriebe verlieren Leads in einem gemeinsamen Posteingang. Dieses Playbook leitet dringende Anfragen weiter, erstellt Antwortentwürfe und protokolliert alles — ohne Ops-Personal.

## Was passiert

![Ablauf E-Mail-Triage-Automatisierung](/workflow-diagrams/auto-triage-customer-emails-workflow.png)

## Das Problem

Wenn drei Personen einen Gmail-Posteingang teilen, liegen dringende Angebotsanfragen neben Newslettern und Spam. Niemand ist für die Triage verantwortlich — die Antwortzeit driftet auf 24–48 Stunden.

## Was du baust

1. **Trigger** — neue E-Mail mit Gmail-Label (`inbox/shared`)
2. **Klassifizieren** — strukturierter GPT-Prompt liefert Absicht + Dringlichkeit
3. **Weiterleiten** — Slack-Alert bei dringenden Items; Antwortentwurf als Gmail-Entwurf speichern

## Schritt für Schritt

### 1. Gmail-Label erstellen

Filter anlegen, der Nachrichten an `hello@deinbetrieb.ch` mit Label `inbox/shared` versieht.

### 2. Zapier-Trigger

New Email Matching Search in Gmail → Suche `label:inbox/shared`.

### 3. Klassifizierungs-Prompt

```
Analysiere diese E-Mail und gib nur JSON zurück:
{ "intent": "quote|support|spam", "urgency": "high|low", "summary": "ein Satz" }

E-Mail:
{{body}}
```

### 4. Nach Dringlichkeit routen

- `urgency=high` → in `#sales-urgent` in Slack mit Zusammenfassung posten
- `intent=support` → Antwortentwurf mit Support-Makro erstellen
- `intent=spam` → archivieren und Label `auto-archived` setzen

## Geschätzte Einrichtungszeit

15 Minuten für v1. Prompt nach 20 echten E-Mails feintunen.

## Was du messen solltest

Median der Erstantwortzeit und % korrekt klassifizierter E-Mails tracken. Ziel: 80%+ Genauigkeit, bevor du mehr Automatisierung hinzufügst.
