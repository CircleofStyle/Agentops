---
title: Freundliche Zahlungserinnerungen ohne unangenehme Anrufe
date: '2026-07-11'
status: published
slug: invoice-chase-workflow
season: 1
seasonNumber: 5
topic: Rechnungserinnerungs-Workflow
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Offene Rechnungen ohne Telefon-Pingpong eintreiben — Geld kommt, während du auf der Baustelle bist
emailSubject: "Playbook #5: Freundliche Zahlungserinnerungen ohne unangenehme Anrufe"
workflowDiagramAlt: >-
  Rechnung als gesendet markiert, Tag-7 höfliche Nachfrage, Tag-14 klarere
  Erinnerung, Überfällig für manuelles Nachfassen markiert
publishedAt: '2026-07-11'
---
Du hast den Auftrag erledigt. Die Rechnung ist raus. Dann Stille — und du bist die Person, die sich unwohl fühlt, wenn sie anrufen muss, um Geld einzufordern, das du schon verdient hast.

Sieben Tage nach dem Versand erhält die Kundin eine höfliche Zahlungserinnerung. Am Tag 14 noch offen? Eine klarere Nachfrage. Überfällige Zeilen bleiben im Tracker sichtbar — du weisst, wer einen Anruf braucht, ohne im Posteingang zu leben.

**Einrichtungszeit: 25 Minuten.**

> **Schon auf QuickBooks, Xero oder Stripe Invoicing?** Nutze deren eingebaute Erinnerungen, wenn jede Rechnung dort lebt. **Nutze dieses Playbook**, wenn Rechnungen in einem Google Sheet (oder PDF + E-Mail) liegen und du zeitgesteuerte Nudges aus *deinem* Gmail willst — ohne weiteres Buchhaltungs-Abo.

Passt gut zu [Playbook #2](/issues/quote-follow-up-workflow): Angebot gewinnen, Arbeit liefern, dann mit diesem Workflow den Cash-Loop schliessen.

## Das Problem

Dienstleister verlieren Cashflow an unbezahlte Rechnungen — nicht weil Kundinnen ablehnen, sondern weil niemand planmässig nachfasst. Sticky-Notes und „Ich rufe montags an“ rutschen, wenn du auf der Baustelle bist. Telefonieren fühlt sich persönlich und unangenehm an; Stille kostet mehr.

## Das Ergebnis

Jede versendete Rechnung erhält zeitgesteuerte, freundliche E-Mail-Erinnerungen. Geld kommt ohne unangenehmes Telefon-Pingpong — und du siehst, welche Kundinnen eine Anzahlung oder Stop-Work-Regel brauchen.

## Was passiert

1. Du markierst eine Rechnung im Tracker als **sent** (Datum + Betrag + Fälligkeit)
2. **Tag 7 nach Versand** (wenn noch unbezahlt) → Gmail sendet eine höfliche Erinnerung
3. **Tag 14** (wenn noch unbezahlt) → klarere zweite Nachfrage
4. Nach Tag 21 noch offen → Zeile als **overdue** markiert für deinen manuellen Anruf oder Stop-Work-Entscheid

## Was enthalten ist

- **Rechnungs-Tracker** — [Google-Sheet-Vorlage kopieren](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(Board: einmal anlegen, Link wiederverwenden — Spalten: `client_email`, `client_name`, `invoice_number`, `amount`, `sent_at`, `due_at`, `status`, `last_nudge`)*
- **2 Erinnerungs-E-Mail-Vorlagen** — Tag-7 höflich + Tag-14 klarer
- **Setup-Anleitung** — Schritt-für-Schritt-Zapier-Pfad unten

## Setup auf einen Blick

| | |
|---|---|
| **Einrichtungszeit** | 25 Minuten |
| **Schwierigkeit** | Anfänger |
| **Tools** | Google Sheets, Gmail, Zapier (Gratis-Tarif reicht bei geringem Volumen) |
| **ROI** | Eine eingetriebene Rechnung zahlt oft Monate Zapier-Tasks |

## Bevor du startest

1. **Nur einen Tracker** — jede Rechnung, die zählt, liegt im Sheet (oder synchronisiert hinein). PDFs verstreut in E-Mails = verpasste Nudges.
2. **Status klar halten** — `sent` → `reminded` → `paid` | `overdue` | `written_off`. Niemals `paid`-Zeilen anstupsen.
3. **Ruhiger Ton** — Tag 7 ist „nur kurz nachgefragt“; Tag 14 ist klar und professionell, nicht aggressiv. Telefon ab Tag 21+.

## Schritt für Schritt — Zapier

### 1. Rechnungs-Tracker anlegen

Link oben öffnen → **Kopie erstellen**. Bei jedem Versand neue Zeile: `status` = **sent**, `sent_at` = heute, `due_at` = Zahlungsziel (z. B. +14 Tage).

Spalten: `client_email` · `client_name` · `invoice_number` · `amount` · `sent_at` · `due_at` · `status` (sent | reminded | paid | overdue | written_off) · `last_nudge`

> **Schon QuickBooks, Xero, Wave oder CRM?** Sheet durch den „Rechnung gesendet“ / „Rechnung überfällig“-Trigger deines Tools ersetzen — gleiche Erinnerungslogik.

### 2. Trigger — neue oder aktualisierte Rechnungen beobachten

**Google Sheets → New Spreadsheet Row** (oder **Updated Spreadsheet Row**), wenn `status` = **sent**.

`client_email`, `client_name`, `invoice_number`, `amount`, `sent_at`, `due_at` an die nächsten Schritte übergeben.

### 3. Bis Tag 7 warten, dann nachfragen

**Delay For** → **7 Tage** nach `sent_at` (oder **Delay Until** → `sent_at` + 7 Tage).

Vor dem Senden **Google Sheets → Lookup Row**: nur fortfahren, wenn `status` noch **sent** oder **reminded** ist (überspringen wenn schon **paid**).

### 4. Tag-7 höfliche Erinnerung senden

**Gmail → Send Email** an `client_email`.

**Betreff:** Kurze Nachfrage — Rechnung {{invoice_number}}

```
Hallo {{client_name}},

nur eine freundliche Notiz: Rechnung {{invoice_number}} über {{amount}} wurde am {{sent_at}} gesendet und ist fällig am {{due_at}}.

Falls schon bezahlt — danke, dann kannst du diese Mail ignorieren. Wenn etwas an der Rechnung unklar ist, antworte einfach — wir klären das.

Danke,
{{your_name}}
{{your_business}}
```

**Google Sheets → Update Row:** `status` = **reminded**, `last_nudge` = heute.

### 5. Tag-14 klarere Erinnerung

Zweiter Zap (oder Paths-Zweig): **Delay For** → **14 Tage** nach `sent_at`.

Erneut Lookup — nur fortfahren, wenn Status **nicht** `paid` ist.

**Betreff:** Erinnerung — Rechnung {{invoice_number}} ist überfällig

```
Hallo {{client_name}},

Rechnung {{invoice_number}} über {{amount}} (fällig {{due_at}}) ist bei uns noch offen.

Bitte organisiere die Zahlung diese Woche — oder antworte mit einem Datum, wann wir sie erwarten können. Wenn es ein Problem mit der Arbeit oder der Rechnung gibt, sag Bescheid — lieber lösen als nachfassen.

Zahlungsdetails stehen auf der Originalrechnung. Antworte, wenn du sie nochmals brauchst.

{{your_name}}
{{your_business}}
```

**Google Sheets → Update Row:** `last_nudge` = heute.

### 6. Überfällig für manuelles Nachfassen markieren

Nach `sent_at` + **21 Tagen** (oder nach `due_at` + 7), wenn noch unbezahlt:

- `status` = **overdue** im Sheet setzen
- Optional: **Gmail → Send Email** an dein Ops-Postfach — „Überfällig: {{client_name}} {{invoice_number}} {{amount}}“

Danach deine Regel: Anruf, Stop-Work bei neuen Aufträgen, Anzahlung nächstes Mal, oder Ratenzahlung.

## Zap-Ablauf (Überblick)

```
Google Sheets Neue Zeile (status = sent)
  → Delay 7 Tage
  → Lookup (noch unbezahlt)
  → Gmail E-Mail (Tag-7 höflich)
  → Zeile aktualisieren (reminded)
  → Delay bis Tag 14 [zweiter Zap]
  → Lookup (noch unbezahlt)
  → Gmail E-Mail (Tag-14 klarer)
  → Tag 21 → Zeile (overdue) + Ops-Alert
```

## Was du messen solltest

**Tage bis Zahlung** und Recovery vor/nach 30 Tagen tracken:

| Kennzahl | Ziel |
|----------|------|
| Median Tage Versand → bezahlt | ≥20 % weniger als Baseline |
| % bezahlt nach erster Nachfrage (Tag 7) | ≥30 % der angestupsten Rechnungen |
| Telefon-Nachfassen nötig | Weniger als vorher — Sheet zeigt, wer noch einen Anruf braucht |
