---
title: Sofortige Begrüßung und Aufnahme bei neuen Anfragen
date: '2026-07-11'
status: published
slug: new-lead-welcome-sequence
season: 1
seasonNumber: 6
sequenceOrder: 6
topic: Begrüßungssequenz für neue Leads
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Gmail
  - Google Forms
  - Zapier
roiImpact: Auf neue Anfragen in unter 5 Minuten reagieren — bevor sie woanders anfragen
emailSubject: "Playbook #6: Sofortige Begrüßung und Aufnahme bei neuen Anfragen"
workflowDiagramAlt: Neue Anfrage, sofortige Willkommens-E-Mail, Link zum Aufnahmeformular, Nachfass wenn Formular nicht ausgefüllt
publishedAt: '2026-07-11'
---
Eine Interessentin meldet sich. Du bist mitten im Tagesgeschäft. Bis du antwortest, hat sie schon zwei andere Offerten angefragt.

Sobald eine neue Anfrage eingeht — Formular, E-Mail oder Kontaktseite — erhält sie sofort eine Begrüßung und ein kurzes Aufnahmeformular. Du wirkst reaktionsschnell, ohne im Posteingang zu hängen.

**Einrichtungszeit: 20 Minuten.**

> **Schon Klaviyo oder Mailchimp?** Willkommens-Serien sind ESP-Kernfeature — wenn du bereits zahlst und jeder Lead auf deiner Liste ist, starte dort. **Dieses Playbook lohnt sich**, wenn Leads in Gmail oder einem einfachen Formular landen, *bevor* du ein Marketing-Tool für $20–300/Monat brauchst — sofortiger Zap, kein ESP nötig.

Passt zu [Playbook #1](/de/issues/auto-triage-customer-emails): Posteingang zuerst sortieren, dann neue passende Anfragen automatisch begrüssen.

## Das Problem

Geschwindigkeit gewinnt bei lokalen Dienstleistern. Manuelle «Danke, wir melden uns»-Antworten verzögern sich — und generische Autoresponder wirken kalt ohne klaren nächsten Schritt.

## Das Ergebnis

Jede neue Anfrage erhält innerhalb von Minuten eine warme Begrüßung und einen strukturierten Aufnahme-Link. Du sammelst die Details für ein Angebot ohne E-Mail-Ping-Pong.

## Was enthalten ist

- **Willkommens-E-Mail-Vorlage** — sofortiger Versand beim Trigger
- **Aufnahmeformular** — Google Form im Willkommens-Mail verlinkt
- **Optionale Erinnerung** — Nachfass wenn Formular nach 48h nicht ausgefüllt
- **Setup-Anleitung** — Zapier-Trigger (Formular, Gmail-Label, Typeform)

## Setup-Überblick

| | |
|---|---|
| **Einrichtungszeit** | 20 Minuten |
| **Schwierigkeit** | Anfänger |
| **Tools** | Gmail, Google Forms, Zapier |
| **ROI** | Schnellere Antwort erhöht oft die Angebots-Gewinnrate um 10%+ |

## Schritt für Schritt — Zapier

### 1. Aufnahmeformular erstellen

Google Forms → neues Formular → Link kopieren. Felder: Name, E-Mail, Telefon, Auftragsbeschreibung, Adresse, Wunschtermin.

### 2. Trigger — neue Anfrage

Eine Option wählen:

- **Google Forms → Neue Antwort**
- **Gmail → Neue E-Mail** mit Label `New Lead`
- **Typeform / Jotform → Neuer Eintrag**

### 3. Willkommens-E-Mail sofort senden

**Gmail → E-Mail senden**

**Betreff:** Danke für deine Anfrage — kurzer nächster Schritt

```
Hallo {{name}},

danke für deine Anfrage bei {{your_business}}. Wir antworten in der Regel innerhalb von {{SLA}}.

Für eine genaue Offerte bitte dieses 2-Minuten-Formular ausfüllen:
{{form_link}}

Bei Dringlichkeit einfach auf diese E-Mail antworten.

Bis bald,
{{your_name}}
```

### 4. Optional — 48h-Erinnerung

Zweiter Zap: **Verzögerung** 48 Stunden → wenn Formular nicht ausgefüllt → sanfte Erinnerung mit gleichem Link.

## Was du messen solltest

| Metrik | Ziel |
|--------|------|
| Median Zeit bis erste Antwort | Unter 5 Minuten (automatisiert) |
| Formular-Abschlussrate | ≥50% innerhalb 48h |
| Angebot innerhalb 24h nach Aufnahme | Manuell tracken — sollte steigen |
