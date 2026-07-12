---
title: Abschlusszusammenfassung und Upsell automatisch senden
date: '2026-07-12'
status: published
slug: job-completion-checklist
season: 1
seasonNumber: 7
sequenceOrder: 7
topic: Job-Abschluss-Checkliste
setupMinutes: 25
visibility: email-only
difficulty: beginner
toolRequirements:
  - Google Sheets
  - Gmail
  - Zapier
roiImpact: Jeden fertigen Auftrag mit Zusammenfassung, Checkliste und einem sanften Folgeangebot schliessen — ohne in Entwürfen zu leben
emailSubject: 'Playbook #7: Jeden Auftrag schliessen ohne erneutes unangenehmes Nachfragen'
workflowDiagramAlt: >-
  Auftrag in Sheet als erledigt markiert, Gmail sendet Zusammenfassung und
  Checkliste, optionale Upsell-Zeile, optional später Bewertung anfragen
publishedAt: '2026-07-12'
---
Du hast den Auftrag fertig. Die Kundin war vor Ort zufrieden — dann bist du zum nächsten Termin gefahren und hast den Wrap-up nie geschickt. Keine Zusammenfassung. Keine Pflegeschritte. Kein natürliches Folgeangebot. Die Beziehung kühlt ohne Grund ab.

Wenn eine Auftragszeile auf erledigt wechselt, erhält die Kundin eine kurze Zusammenfassung aus deinem Gmail, eine einfache Checkliste und optional eine Upsell-Zeile — ohne erneutes unangenehmes Nachfragen.

**Einrichtungszeit: 25 Minuten.**

> **Schon auf Klaviyo oder Jobber?** Nutze deren Post-Job-Sequenzen, wenn jeder Abschluss dort lebt. **Dieses Playbook lohnt sich**, wenn der Auftragsstatus in einem Sheet (oder einfachen CRM-Export) liegt und du E-Mails aus *deinem* Gmail willst.

Passt gut zu [Playbook #3](/de/issues/google-review-request-workflow): zuerst die Abschlusszusammenfassung, dann die Bewertungsanfrage zeitlich planen. Danach: [Empfehlungsanfrage](/de/issues/referral-ask-workflow), sobald die Kundin warm ist.

## Das Problem

Feldarbeit endet; Admin nicht. Wrap-up-Mails sterben zwischen den Aufträgen. Kundinnen vergessen, was erledigt wurde, worauf sie achten sollen und welcher nächste Schritt sinnvoll wäre — und du fragst Wochen später mit kaltem Upsell nach.

## Das Ergebnis

Jeder fertige Auftrag schliesst sauber. Kundinnen wissen, was passiert ist und was als Nächstes zu tun ist. Du platzierst ein relevantes Zusatzangebot, ohne in Entwürfen zu leben oder aufdringlich zu wirken.

## Was passiert

1. Markiere den Auftrag in deinem Google Sheet als `Complete` (oder CRM-Export)
2. Zapier überwacht die Status-Spalte
3. **Gmail** sendet eine kurze Zusammenfassung + Checkliste von deiner Adresse
4. Optional: ein Satz Upsell, passend zum Auftragstyp
5. Optional später: Übergabe an dein Timing für die [Bewertungsanfrage](/de/issues/google-review-request-workflow)

## Was enthalten ist

- **Job Completion Tracker** — Sheet-Spalten: `client_email`, `client_name`, `job_type`, `completed_at`, `status`, `summary_sent`, `upsell_offer`, `notes`
- **Zusammenfassungs-Vorlage** — was erledigt wurde, worauf achten, wie dich erreichen
- **Checklisten-Felder** — Pflegeschritte / nächste Besuchshinweise nach Auftragstyp
- **Upsell-Regeln** — maximal ein sanfter Satz; weglassen wenn nichts passt
- **Zapier-Pfad** — Status → Filter → Gmail (Free-Tier bei geringem Volumen ok)

## Setup (Überblick)

1. Tracker-Sheet kopieren und drei kürzlich erledigte Aufträge als Test eintragen
2. Zapier verbinden: Google Sheets → Neue/aktualisierte Zeile
3. Filter: `status` gleich `Complete` und `summary_sent` leer
4. Gmail-Aktion: Zusammenfassungs-Vorlage senden; Checkliste + optionalen Upsell mappen
5. Zeile aktualisieren: `summary_sent` auf `yes`, damit nichts doppelt geht
6. Einen Live-Test mit dir selbst als Kundin ausführen

## Zeit und Kosten

| | |
|---|---|
| Setup | ca. 25 Minuten |
| Zeitersparnis | 15–30 Min./Tag, sobald Wrap-ups nicht mehr von Hand entstehen |
| Stack-Kosten | Sheets + Gmail + Zapier Free-Tier bei geringem Volumen |

## Sicherheitshinweise

- Keine Kartendaten oder Passwörter ins Sheet
- Von einer echten Geschäfts-Gmail senden, die du bereits mit Kundinnen nutzt
- Upsell-Text auf den Auftrag beziehen — nie den ganzen Katalog einfügen

## FAQs

**Warum überhaupt eine Abschlusszusammenfassung?**  
Kundinnen vergessen Details am gleichen Tag. Eine kurze Zusammenfassung reduziert «Was hatten wir vereinbart?»-Antworten und schafft einen ruhigen Moment für ein relevantes Folgeangebot.

**Brauche ich ein CRM?**  
Nein. Google Sheets + Gmail + Zapier reichen. Ein CRM kommt später, wenn das Volumen es rechtfertigt.

**Wirkt ein Upsell nicht aufdringlich?**  
Nur wenn du einen Katalog verkaufst. Ein Satz, der zum Auftragstyp passt, wirkt hilfreich — nicht verkäuferisch.

