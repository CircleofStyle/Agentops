---
title: Abgeschlossene Aufträge automatisch in Google-Bewertungen verwandeln
date: '2026-06-19'
status: published
slug: google-review-request-workflow
topic: Google-Bewertungsanfrage-Workflow
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Eine neue 5-Sterne-Bewertung zahlt sich oft sofort in lokaler Sichtbarkeit aus
emailSubject: "Playbook #3: Abgeschlossene Aufträge in Google-Bewertungen verwandeln"
publishedAt: '2026-06-19'
workflowDiagram: /workflow-diagrams/google-review-request-workflow.png
workflowDiagramAlt: Auftrag als abgeschlossen markiert, 2 Tage warten, automatische Bewertungsanfrage, sanfte Erinnerung nach 7 Tagen ohne Bewertung
---

Du erledigst den Auftrag. Die Kundin ist zufrieden. Dann vergisst du, um eine Bewertung zu bitten — und dein Google-Profil bleibt still, während Mitbewerberinnen Sterne sammeln.

Zwei Tage nach Abschluss erhält deine Kundin automatisch eine freundliche Bewertungsanfrage. Immer noch nichts? Am Tag 7 geht eine sanfte Erinnerung raus — ohne Post-it, CRM-Aufgabe oder dass du dich erinnern musst.

**Einrichtungszeit: 25 Minuten.**

Passt zu [Playbook #2](/de/issues/quote-follow-up-workflow): erst das Angebot gewinnen, dann gelieferte Arbeit in Social Proof verwandeln.

## Das Problem

Die meisten Dienstleister leben von Mundpropaganda, systematisieren Bewertungsanfragen aber nie. Zufriedene Kundinnen wollen eine Bewertung hinterlassen — dann kommt der Alltag dazwischen. Manuelle Erinnerungen skalieren nicht über ein paar Aufträge pro Monat hinaus.

## Das Ergebnis

Jeder abgeschlossene Auftrag erhält planmässig eine Bewertungsanfrage. Du baust Social Proof auf — ohne unangenehme persönliche Bitten.

## Was passiert

![Ablauf Google-Bewertungsanfrage-Automatisierung](/workflow-diagrams/google-review-request-workflow.png)

## Was enthalten ist

- **Auftrags-Tracker** — Google-Sheet-Vorlage (Spalten: `email`, `name`, `job_completed_at`, `google_review_link`, `status`, `last_nudge`)
- **2 Bewertungs-E-Mails** — Erstanfrage + sanfte Erinnerung (unten)
- **Setup-Anleitung** — Schritt für Schritt
- **Workflow-Diagramm** — visueller Ablauf oben

## Setup-Überblick

| | |
|---|---|
| **Einrichtungszeit** | 25 Minuten |
| **Schwierigkeit** | Anfänger |
| **Tools** | Google Sheets, Gmail, Zapier (Free-Tier OK) |
| **ROI** | Eine neue 5-Sterne-Bewertung zahlt sich oft sofort in lokaler Sichtbarkeit aus |

## Bevor du startest

1. **Google-Bewertungslink holen** — Google Business Profile → Bewertungen anfragen → Kurzlink kopieren.
2. **Nur zufriedene Kundinnen fragen** — Aufträge erst nach Lieferung als `complete` markieren, nicht beim Angebot.

## Schritt für Schritt

### 1. Auftrags-Tracker kopieren

Vorlage öffnen → **Kopie erstellen**. Nach Abschluss eines Auftrags: Zeile mit `status` = open, `job_completed_at` = heute.

Spalten: `email` · `name` · `job_completed_at` · `google_review_link` · `status` (open | reviewed | skipped) · `last_nudge`

### 2. Tracker verbinden

In Zapier: wenn eine **neue Zeile** erscheint und `status` **open** ist, Workflow starten.

> **Schon CRM oder Auftrags-App?** Sheet durch «Auftrag abgeschlossen»-Trigger deines Tools ersetzen — gleiche Logik.

### 3. 2-Tage-Wartezeit planen

**2 Tage warten** nach dem Trigger. Vor dem Senden prüfen, ob die Zeile noch **open** ist.

Warum 2 Tage? Gibt der Kundin Zeit, das Ergebnis zu geniessen — sofortige Anfragen wirken transaktional.

### 4. Bewertungsanfrage #1 senden

Vorlage in Gmail:

**Betreff:** Kurzer Gefallen — wie war unser Service?

```
Hallo {{name}},

wir hoffen, du bist zufrieden mit der Arbeit vom {{job_completed_at}}.

Falls du 60 Sekunden hast, hilft uns eine Google-Bewertung, damit andere lokale Kundinnen uns finden:
{{google_review_link}}

Kein Druck — und nochmals danke, dass du uns gewählt hast.

Grüsse,
{{your_name}}
```

Tabelle: `last_nudge` = heute.

### 5. Sanfte Erinnerung (Tag 7)

**5 Tage warten** nach der ersten E-Mail (7 Tage total ab Auftragsabschluss). Stoppen, wenn `status` reviewed oder skipped ist.

**Betreff:** Noch ein sanfter Stupser (versprochen, der letzte)

```
Hallo {{name}},

kurze Nachfrage — wenn du mit unserer Arbeit zufrieden warst, hilft eine kurze Google-Bewertung sehr:
{{google_review_link}}

Wie auch immer — nochmals danke für dein Vertrauen.

Grüsse,
{{your_name}}
```

### 6. Als bewertet markieren (optional manuell)

Bei neuer Bewertung: `status` = reviewed in der Tabelle setzen.

## Was du messen solltest

**Bewertungsanfrage → veröffentlichte Bewertung** innerhalb 14 Tage nach Auftragsabschluss. Ziel: **10%+ Conversion** bei Anfrage #1.

Auch **Median Tage bis zur ersten Bewertung** beobachten — sollte unter 10 Tagen liegen, sobald der Workflow läuft.
