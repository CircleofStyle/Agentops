---
title: Zufriedene Kunden planmässig um Empfehlungen bitten
date: '2026-07-12'
status: published
slug: referral-ask-workflow
season: 1
seasonNumber: 8
sequenceOrder: 8
topic: Empfehlungsanfrage-Workflow
setupMinutes: 20
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Zufriedene Kundinnen in einen planbaren Empfehlungskanal verwandeln
emailSubject: "Playbook #8: Zufriedene Kunden planmässig um Empfehlungen bitten"
workflowDiagramAlt: Auftrag abgeschlossen, 14 Tage warten, Empfehlungsanfrage, sanfte Erinnerung ohne Antwort
publishedAt: '2026-07-12'
---
Du hast gute Arbeit geliefert. Die Kundin würde dich gerne weiterempfehlen — aber niemand fragt, und der Moment verstreicht.

Vierzehn Tage nach Auftragsabschluss erhalten zufriedene Kundinnen eine freundliche Empfehlungsanfrage. Immer noch nichts? Am Tag 21 eine sanfte Erinnerung — ohne unangenehme persönliche Bitten.

**Einrichtungszeit: 20 Minuten.**

> **Schon Klaviyo oder Mailchimp?** Loyalty- und Empfehlungsflows gibt es in den meisten ESPs. **Dieses Playbook lohnt sich**, wenn dein Trigger «Auftrag abgeschlossen» in einem Google Sheet ist — zeitgesteuert nach echter Lieferung, nicht nach einer Listensegmentierung, die dein ESP ohne Zapier nicht sieht.

Passt zu [Playbook #3](/de/issues/google-review-request-workflow): zuerst um die Bewertung bitten (Tag 2–7), dann die Empfehlungsanfrage wenn die Kundin nachweislich zufrieden ist (Tag 14+).

## Das Problem

Empfehlungen sind der vertrauenswürdigste Wachstumskanal — aber Inhaber vergessen zu fragen oder fragen zum falschen Zeitpunkt. ESP-Empfehlungskampagnen setzen E-Commerce-Käufe voraus, nicht «Auftrag im Sheet abgeschlossen».

## Das Ergebnis

Zufriedene Kundinnen erhalten planmässig eine Empfehlungsanfrage. Mundpropaganda wird zum System, nicht zum Zufall.

## Was enthalten ist

- **Auftrags-Tracker** — Spalten von Playbook #3 wiederverwenden oder eigenes Empfehlungs-Sheet
- **2 Empfehlungs-E-Mails** — Erstanfrage + sanfte Erinnerung
- **Setup-Anleitung** — Zapier-Timing ab `job_completed_at`

## Setup-Überblick

| | |
|---|---|
| **Einrichtungszeit** | 20 Minuten |
| **Schwierigkeit** | Anfänger |
| **Tools** | Google Sheets, Gmail, Zapier |
| **ROI** | Eine Empfehlung deckt oft die Akquisitionskosten für einen lokalen Auftrag |

## Schritt für Schritt — Zapier

### 1. Abgeschlossene Aufträge tracken

Playbook #3-Tracker wiederverwenden oder Spalten ergänzen: `referral_asked_at`, `referral_status` (pending | sent | referred | declined).

### 2. Trigger — Auftrag abgeschlossen

**Google Sheets → Neue Zeile** oder **Aktualisierte Zeile** wo `status` = **complete** (oder **reviewed**).

### 3. 14 Tage warten

**Verzögerung** 14 Tage nach `job_completed_at`. Zeile erneut lesen — überspringen wenn `referral_status` bereits gesetzt.

### 4. Empfehlungsanfrage #1 senden

**Gmail → E-Mail senden**

**Betreff:** Kennst du jemanden, der {{service_type}} braucht?

```
Hallo {{name}},

wir hoffen, du bist noch zufrieden mit der Arbeit vom {{job_completed_at}}.

Falls du eine Freundin, Nachbarin oder Kollegin kennst, die {{your_service}} brauchen könnte — eine Empfehlung von zufriedenen Kundinnen bedeutet uns als kleinem Betrieb sehr viel.

Am einfachsten: diese E-Mail weiterleiten oder {{referral_link}} schicken.

Kein Druck — und nochmals danke für dein Vertrauen.

Grüsse,
{{your_name}}
```

Tabelle: `referral_asked_at` = heute, `referral_status` = **sent**.

### 5. Sanfte Erinnerung (Tag 21)

**Verzögerung** 7 weitere Tage. Überspringen wenn `referral_status` = **referred** oder **declined**.

## Was du messen solltest

| Metrik | Ziel |
|--------|------|
| Empfehlungsanfrage → Intro erhalten | Manuell tracken — Ziel 5%+ |
| Zeit von Anfrage bis gebuchter Empfehlungsauftrag | Median unter 30 Tagen |
