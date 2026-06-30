---
title: Abgeschlossene Aufträge automatisch in Google-Bewertungen verwandeln
date: '2026-06-19'
status: published
slug: google-review-request-workflow
topic: Google-Bewertungs-Anfrage-Workflow
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Eine neue 5-Sterne-Bewertung zahlt sich oft in lokaler Sichtbarkeit aus
emailSubject: "Playbook #3: Abgeschlossene Aufträge in Google-Bewertungen verwandeln"
publishedAt: '2026-06-19'
workflowDiagram: /workflow-diagrams/google-review-request-workflow.png
workflowDiagramAlt: Auftrag abgeschlossen, 2 Tage warten, automatische Bewertungsanfrage, sanfte Erinnerung nach 7 Tagen
---
Du schliesst den Auftrag ab. Die Kundin ist zufrieden. Dann vergisst du, um eine Bewertung zu bitten — und dein Google-Profil bleibt still, während Mitbewerber Sterne sammeln.

Zwei Tage nach Abschluss erhält deine Kundin automatisch eine freundliche Bewertungsanfrage. Immer noch nichts? Am Tag 7 geht eine sanfte Erinnerung raus — ohne Post-it, CRM-Aufgabe oder dass du dich erinnern musst.

**Einrichtungszeit: 25 Minuten.**

> **Schon auf Klaviyo oder Mailchimp?** Post-Purchase-Bewertungsflows sind ein Kernfeature — wenn deine Aufträge dort liegen, nutze deren Vorlage. **Nutze dieses Playbook**, wenn dein Abschluss-Signal ein Google Sheet (oder Job-App) ist, das dein ESP ohne Zapier nicht sieht.

Passt gut zu [Playbook #2](/issues/quote-follow-up-workflow): Zuerst das Angebot gewinnen, dann liefert dieser Workflow Social Proof aus erbrachter Arbeit.

## Das Problem

Die meisten Dienstleister verlassen sich auf Mundpropaganda, systematisieren Bewertungsanfragen aber nie. Zufriedene Kundinnen wollen bewerten — dann kommt das Leben dazwischen. Manuelle Erinnerungen skalieren nicht über ein paar Aufträge pro Monat, und deine Google-Bewertung wird zum Nachzügler statt zum Wachstumshebel.

## Das Ergebnis

Jeder abgeschlossene Auftrag erhält eine zeitgesteuerte Bewertungsanfrage. Du baust Social Proof auf, ohne unangenehme persönliche Bitten — und hörst auf zu fragen: „Habe ich die schon um eine Bewertung gebeten?"

## Was passiert

![Automatisierter Ablauf für Google-Bewertungsanfragen](/workflow-diagrams/google-review-request-workflow.png)

## Was enthalten ist

- **Auftrags-Tracker** — [Google-Sheet-Vorlage kopieren](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy) *(Board: einmal anlegen, Link wiederverwenden — Spalten: `email`, `name`, `job_completed_at`, `google_review_link`, `status`, `last_nudge`)*
- **2 Bewertungs-E-Mails** — erste Anfrage + sanfte Erinnerung (unten)
- **Setup-Anleitung** — Schritt für Schritt
- **Workflow-Diagramm** — visueller Ablauf oben

## Setup auf einen Blick

| | |
|---|---|
| **Einrichtungszeit** | 25 Minuten |
| **Schwierigkeit** | Anfänger |
| **Tools** | Google Sheets, Gmail, Zapier (Gratis-Tarif reicht) |
| **ROI** | Eine neue 5-Sterne-Bewertung zahlt sich oft in lokaler Sichtbarkeit aus |

## Bevor du startest

1. **Google-Bewertungslink holen** — Google Business Profile → Um Bewertungen bitten → Kurzlink kopieren. In jede Tracker-Zeile einfügen (oder eine Konfig-Zelle, die Zapier liest).
2. **Nur zufriedene Kundinnen fragen** — Aufträge erst nach Lieferung als `complete` markieren, nicht beim Angebot.

## Schritt für Schritt

### 1. Auftrags-Tracker kopieren

Link oben öffnen → **Kopie erstellen**. Wenn du einen Auftrag abschliesst, neue Zeile: `status` = open, `job_completed_at` = heute.

Spalten: `email` · `name` · `job_completed_at` · `google_review_link` · `status` (open | reviewed | skipped) · `last_nudge`

### 2. Tracker verbinden

In Zapier: Wenn eine **neue Zeile** erscheint und `status` **open** ist, Workflow starten.

> **Schon CRM oder Job-App?** Sheet durch den „Auftrag abgeschlossen“- oder „Deal gewonnen“-Trigger deines Tools ersetzen — gleiche Logik.

### 3. 2-Tage-Wartezeit planen

Nach dem Trigger **2 Tage warten**. Vor dem Senden prüfen, ob die Zeile noch **open** ist (erneut aus Sheets lesen).

Warum 2 Tage? Gibt der Kundin Zeit, das Ergebnis zu geniessen — sofortige Anfragen wirken geschäftlich.

### 4. Bewertungsanfrage #1 senden

Diese Vorlage in Gmail (oder verbundenes Postfach) nutzen:

**Betreff:** Kurzer Gefallen — wie war's?

```
Hallo {{name}},

ich hoffe, du bist zufrieden mit der Arbeit vom {{job_completed_at}}.

Wenn du 60 Sekunden hast, hilft eine Google-Bewertung anderen Kundinnen, uns zu finden:
{{google_review_link}}

Kein Druck — und nochmals danke, dass du uns gewählt hast.

Freundliche Grüsse,
{{your_name}}
```

Sheet aktualisieren: `last_nudge` = heute.

### 5. Sanfte Erinnerung (Tag 7)

**5 Tage warten** nach der ersten E-Mail (7 Tage total ab Auftragsabschluss). Stoppen, wenn `status` auf reviewed oder skipped wechselt.

**Betreff:** Noch eine Erinnerung (versprochen, die letzte)

```
Hallo {{name}},

kurze Nachfrage — wenn du mit unserer Arbeit zufrieden warst, hilft eine kurze Google-Bewertung immer noch sehr:
{{google_review_link}}

So oder so: nochmals danke für dein Vertrauen.

Freundliche Grüsse,
{{your_name}}
```

### 6. Als bewertet markieren (optional, manuell)

Wenn eine neue Bewertung reinkommt, `status` = reviewed im Sheet setzen. Zapier sendet keine weiteren Erinnerungen.

> **Tipp:** Manche Teams filtern in Zapier Zeilen mit `status` = reviewed vor jedem Send — doppelte Absicherung.

## Was du messen solltest

**Bewertungsanfrage → veröffentlichte Bewertung** innerhalb von 14 Tagen nach Auftragsabschluss. Ziel: **10 %+ Conversion** bei Anfrage #1, bevor du SMS oder Anreize testest.

Auch **Median Tage bis zur ersten Bewertung** beobachten — sollte unter 10 Tagen fallen, sobald der Workflow läuft.
