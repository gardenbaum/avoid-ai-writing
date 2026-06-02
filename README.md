<div align="center">

# avoid-ai-writing

Prüft Texte auf KI-Schreibmuster und schreibt sie um. Ein praxistaugliches Skill für jeden KI-Agenten. Unterstützt einen Nur-Prüfen-Modus, einen In-Place-Bearbeiten-Modus und Voice-Profile. Deutsch in Schweizer Schreibweise.

[![GitHub stars](https://img.shields.io/github/stars/gardenbaum/avoid-ai-writing?style=social)](https://github.com/gardenbaum/avoid-ai-writing/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
</div>

---


Ein portables Schreib-Skill für [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenClaw](https://github.com/openclaw/openclaw), [Hermes](https://github.com/NousResearch/hermes-agent) und jeden anderen [agentskills.io](https://agentskills.io)-kompatiblen Agenten. Prüft Texte auf deutsche KI-Schreibmuster („KI-Floskeln") und schreibt sie um.

**Sprache.** Dies ist die deutsche Portierung in Schweizer Schreibweise (durchgängig `ss`, kein Eszett). KI-Schreib-Tells sind sprachspezifisch: deutsche LLM-Ausgaben haben eigene Floskeln, und mehrere englisch-kalibrierte Regeln gelten im Deutschen gar nicht. Darum sind Vokabular und Muster aus recherchierten deutschen Tells aufgebaut, nicht aus dem Englischen übersetzt. Der Halbgeviertstrich (–, mit Leerzeichen) gilt als korrekte deutsche Zeichensetzung; das Tell ist der englische Geviertstrich (—). Die deutschen Anführungszeichen („ ") und die Guillemets (« ») werden nie geflaggt.

**Drei Modi:**
- **Rewrite** (Standard) — markiert KI-Muster und schreibt den Text korrigierend um. Ein eingebauter zweiter Durchlauf fängt Muster, die den ersten Edit überlebt haben.
- **Detect** — markiert KI-Muster, ohne umzuschreiben. Zeigt, welche Treffer echte Probleme sind und welche Ermessensfälle. Nützlich, wenn Muster beabsichtigt sein könnten, wenn du Inhalte prüfst, die du nicht verändern willst, oder wenn du nur einen schnellen Scan brauchst.
- **Edit** — bearbeitet eine Datei direkt (über das Edit-Tool) mit minimalen, gezielten Änderungen und lässt schon menschliche Passagen unangetastet. Liefert einen Vorgenommene-Änderungen-plus-Verifizierung-Bericht, nicht die ganze Datei.

Ein optionales **Voice-Profil** (casual / professional / technical / warm / blunt) legt fest, wie die Prosa klingen soll – unabhängig vom Publikums-Kontextprofil.

## Quick-Demo

**Input:**
> Gerne! Acme Analytics, ein pulsierendes Start-up, eingebettet im florierenden Tech-Ökosystem von Zürich, hat 40 Mio. CHF in einer Series-B-Finanzierung gesichert — ein wahrer Wendepunkt für die Observability-Landschaft. Die Plattform dient als zentrale Drehscheibe, verfügt über Echtzeit-Dashboards, bietet Abfragen im Sub-Sekunden-Bereich und präsentiert eine nahtlose Integrationsschicht. Darüber hinaus sind sich Experten einig, dass Acme den Markt umkrempeln dürfte. Zusammenfassend lässt sich sagen: Die Zukunft sieht rosig aus!

**Output:**
> Acme Analytics hat eine Series B über 40 Mio. CHF abgeschlossen, angeführt von Lakestar. Das Zürcher Start-up baut eine Observability-Plattform, die Abfragen in unter einer Sekunde beantwortet und sich ohne eigene Integrationsarbeit an bestehende Monitoring-Stacks anschliesst.

**Was es gefangen hat:** Chatbot-Opener („Gerne!"), Werbesprache („pulsierend", „eingebettet", „florierend"), Bedeutungs-Aufblähung („ein wahrer Wendepunkt"), Kopula-Vermeidung („dient als", „verfügt über", „bietet", „präsentiert"), Tier-1-Vokabel („nahtlos"), Ökosystem-Metapher, vage Quellenangabe („Experten sind sich einig"), Übergangsfloskel („Darüber hinaus"), generischer Schluss („Zusammenfassend lässt sich sagen", „Die Zukunft sieht rosig aus"). Über 12 KI-Tells in einem Absatz.

## Warum ein Skill, nicht nur ein Prompt

Ein einmaliger „mach das menschlicher"-Prompt fängt das Offensichtliche. Dieses Skill geht weiter:

- **Strukturiertes Audit** — liefert die gefundenen Probleme mit zitierter Stelle, die Umschreibung, eine Diff-Zusammenfassung und einen zweiten Prüf-Durchlauf in vier getrennten Abschnitten. Du siehst genau, was sich geändert hat und warum.
- **Zwei-Durchlauf-Erkennung** — der zweite Durchlauf liest die Umschreibung erneut und fängt Muster, die den ersten Edit überleben: recycelte Übergänge, anhaltende Aufblähung, durchgerutschte Kopula-Vermeidung.
- **Wort-Ersetzungstabelle über 3 Stufen plus Tier-3-Phrasen** — nicht aus dem Bauch. Jedes geflaggte Wort hat eine konkrete, schlichtere Alternative. „Nahtlos" → „reibungslos". „Eintauchen" → „anschauen". Tier-1-Wörter flaggen immer, Tier-2-Wörter im Cluster, Tier-3-Wörter nur bei hoher Dichte. Tier-3-*Phrasen* (Mehrwort-Boilerplate wie „die Integration von", „dezentrale Rechenleistung") flaggen bei Wiederholung pro Phrase oder wenn drei oder mehr verschiedene Phrasen sich in einem Text stapeln – die Form, die LLMs annehmen, wenn sie ihre eigene Boilerplate variieren.
- **47 Muster-Kategorien** — repräsentative Beispiele unten, jedes mit Vorher/Nachher. Enthält strukturelle Erkennung (Hashtag-Stopfen, Aufzählungen aus blossen Nominalphrasen, gestapelte Absicherungen in Prognosen), KI-Tool-Fingerabdrücke (Platzhalter, Zitations-Markup, UTM-Parameter), Rhythmus-/Gleichförmigkeits-Checks sowie deutsche Zusatzregeln (Nominalstil/Funktionsverbgefüge, Passivlastigkeit). Der vollständige Katalog steht in [`SKILL.md`](./SKILL.md); diese Zahl wird in der CI gegen ihn geprüft.
- **Detect-Modus** — Muster markieren, ohne umzuschreiben. Sehen, welche Treffer echte Probleme sind und welche Ermessensfälle. Nützlich, wenn Muster beabsichtigt sein könnten oder du Inhalte prüfst, die du nicht verändern willst.
- **Plattformübergreifend** — ein einziges `SKILL.md` läuft in Claude Code, Cowork (als Plugin), OpenClaw und Cursor (als portierte Rule). Siehe die Install-Pfade unten.

## Installation & Nutzung

### Claude Code

**Option 1: Ins Skills-Verzeichnis klonen**

```bash
git clone https://github.com/gardenbaum/avoid-ai-writing ~/.claude/skills/avoid-ai-writing
```

**Option 2: Die Datei direkt kopieren**

Lade `SKILL.md` herunter und lege sie in ein beliebiges Verzeichnis, das Claude Code lesen kann. Verweise in deiner `CLAUDE.md` darauf:

```markdown
- Auf KI-Muster redigieren → lies `path/to/avoid-ai-writing/SKILL.md`
```

**Option 3: Als Slash-Command nutzen**

Lege eine Command-Datei an (z. B. `~/.claude/commands/clean-ai-writing.md`):

```markdown
---
description: Texte auf KI-Schreibmuster prüfen und umschreiben
---

$ARGUMENTS

Lies und befolge die Anweisungen in ~/.claude/skills/avoid-ai-writing/SKILL.md
```

Dann nutze `/clean-ai-writing <dein Text>` in Claude Code.

### Claude Cowork — als Plugin installieren

[Cowork](https://www.anthropic.com/cowork) lädt Skills nur aus **installierten Plugins** – es scannt `~/.claude/skills/` nicht, ein blosser Clone (die Claude-Code-Schritte oben) wird dort also nicht gefunden. Dieses Repo ist zugleich ein Einzel-Plugin-[Marketplace](https://code.claude.com/docs/en/plugin-marketplaces), darum installiere es stattdessen als Plugin:

```bash
/plugin marketplace add gardenbaum/avoid-ai-writing
/plugin install avoid-ai-writing@gardenbaum-skills
/reload-plugins   # oder die Session neu starten, um das Skill zu aktivieren
```

In der Cowork-Desktop-App gehst du gleich vor über **Customize → Plugins → Add marketplace from GitHub** (`gardenbaum/avoid-ai-writing`) und installierst dann **avoid-ai-writing**. Das Skill löst automatisch aus bei Formulierungen wie „entferne KI-Floskeln". Neue Releases kommen, wenn die Plugin-Version erhöht wird – führe `/plugin marketplace update` aus, um sie zu holen.

Dieselbe Plugin-Installation funktioniert auch in Claude Code, wenn du lieber ein versioniertes, aktualisierbares Plugin hast als den Datei-Clone oben.

> Lieber kein Plugin installieren? Kopiere `SKILL.md` in einen Ordner, der mit deiner Cowork-Session verbunden ist, und weise den Agenten an, `./SKILL.md` zu befolgen – funktioniert als Einmal-Nutzung, ohne Auto-Trigger.

### OpenClaw

**Option 1: [Aus ClawHub installieren](https://clawhub.ai/gardenbaum/avoid-ai-writing)**

```bash
clawhub install avoid-ai-writing
```

**Option 2: Ins Skills-Verzeichnis klonen**

```bash
git clone https://github.com/gardenbaum/avoid-ai-writing ~/.openclaw/skills/avoid-ai-writing
```

### Cursor

Lege die portierte Rule in das `.cursor/rules/` deines Projekts:

```bash
mkdir -p .cursor/rules
curl -o .cursor/rules/avoid-ai-writing.mdc \
  https://raw.githubusercontent.com/gardenbaum/avoid-ai-writing/main/cursor-rules/avoid-ai-writing.mdc
```

Siehe [`cursor-rules/README.md`](./cursor-rules/README.md) für Aktivierungs-Globs und Trigger-Phrasen. Funktional identisch mit dem Claude-Code-Skill – gleicher Stufen-Wortschatz, gleiche Context-Profile, gleiche Modi.

### Hermes

Lege das Skill in das Skills-Verzeichnis von Hermes – es erscheint dann automatisch als `/avoid-ai-writing`, ohne Registrierung:

```bash
mkdir -p ~/.hermes/skills/writing/avoid-ai-writing
curl -o ~/.hermes/skills/writing/avoid-ai-writing/SKILL.md \
  https://raw.githubusercontent.com/gardenbaum/avoid-ai-writing/main/SKILL.md
```

### OpenAI Codex

Codex liest [Agent Skills](https://developers.openai.com/codex/skills) im selben `SKILL.md`-Format. Lege es in `.agents/skills/` im Repo-Root ab oder in `~/.agents/skills/`, um es über alle Projekte hinweg zu nutzen:

```bash
mkdir -p .agents/skills/avoid-ai-writing
curl -o .agents/skills/avoid-ai-writing/SKILL.md \
  https://raw.githubusercontent.com/gardenbaum/avoid-ai-writing/main/SKILL.md
```

### Andere Agenten

Dasselbe `SKILL.md` (oder der Cursor-`.mdc`-Port) lässt sich in den meisten Tools an deren Rules-/Skills-Ort ablegen:

| Tool | Wohin damit |
|------|-----------------|
| **Windsurf** | `.windsurf/rules/avoid-ai-writing.md` |
| **Cline** | `.clinerules/avoid-ai-writing.md` |
| **GitHub Copilot** (VS Code) | in `.github/copilot-instructions.md` einfügen |
| **Claude.ai Projects** | `SKILL.md` in die Custom Instructions des Projekts einfügen |
| **ChatGPT Custom GPTs** | `SKILL.md` in das Instructions-Feld des GPT einfügen |

### Das Skill auslösen

Einmal installiert, bitte deinen Assistenten, KI-Schreibe aufzuräumen:

- „Entferne die KI-Floskeln aus diesem Post"
- „Prüfe diesen Entwurf auf KI-Tells"
- „Mach das weniger nach KI klingend"
- „Räum die KI-Schreibe in diesem Absatz auf"

Im **Rewrite-Modus** (Standard) liefert das Skill vier Abschnitte:

1. **Gefundene Probleme** — jede gefundene KI-Floskel, mit zitierter Stelle
2. **Umgeschriebene Fassung** — saubere Version ohne KI-Floskeln
3. **Was sich geändert hat** — Zusammenfassung der wesentlichen Änderungen
4. **Zweiter Prüf-Durchlauf** — liest die Umschreibung erneut und fängt verbliebene Tells

Im **Detect-Modus** liefert das Skill zwei Abschnitte:

1. **Gefundene Probleme** — jede gefundene KI-Floskel, nach Schwere gruppiert (P0/P1/P2)
2. **Einschätzung** — welche Treffer klare Probleme sind und welche bewusst oder im Kontext wirksam sein könnten

Löse den Detect-Modus aus mit: „prüfen", „nur markieren", „nur auditieren", „nur flaggen", „scannen" oder Ähnlichem.

## Muster-Referenz

> Repräsentative Beispiele aus dem Katalog – nicht die vollständige Liste (die steht in [`SKILL.md`](./SKILL.md)). Die menschenlesbare Prosa-Liste des Skills und die [Detector-Engine](./detector/) nutzen **bewusst unterschiedliche Zahlen**: die Engine implementiert 43 `type`-Kategorien, weil sie die Vokabel-Stufen aufteilt und stylometrische/Fingerabdruck-Signale ergänzt (Zeichensetzungs-Verteilung, Funktionswort-Entropie, Bypass-Trick-Erkennung), die als Mathematik über ein Dokument funktionieren statt als nachschlagbare Regel. Die beiden werden in [`detector/CATEGORIES.md`](./detector/CATEGORIES.md) aufeinander abgebildet; „korrigiere" nicht die eine Zahl auf die andere.

### Inhalts-Muster

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 1 | **Bedeutungs-Aufblähung** | „markiert einen Wendepunkt in der Entwicklung von…" | „2019 gegründet, um X zu lösen" |
| 2 | **Prominenz-Namedropping** | „zitiert in NZZ, SRF und Tages-Anzeiger" | „In einem NZZ-Interview von 2024 argumentierte sie…" |
| 3 | **Oberflächliche Partizip-Analysen** | „symbolisierend… widerspiegelnd… aufzeigend…" | Durch konkrete Fakten ersetzen oder streichen |
| 4 | **Werbesprache** | „eingebettet in die atemberaubende Region" | „ist ein Dorf in der Region Gonder" |
| 5 | **Vage Quellenangaben** | „Experten glauben, es spiele eine entscheidende Rolle" | „laut einer Erhebung des SECO von 2024" |
| 6 | **Schablonenhafte Herausforderungen** | „Trotz Herausforderungen floriert es weiter" | Die konkrete Herausforderung und Antwort nennen |
| 7 | **Neuheits-Aufblähung** | „Sie führte einen Begriff ein, den ich nicht kannte" | „Sie zeigte, wie X in der Praxis funktioniert" |

### Sprach-Muster

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 8 | **Wort-/Phrasen-Ersetzungen (3 Stufen)** | „nahtlos… robust… mühelos… eintauchen" | „reibungslos… stabil… einfach… anschauen" |
| 9 | **Kopula-Vermeidung** | „dient als… verfügt über… präsentiert" | „ist… hat" |
| 10 | **Synonym-Wechsel** | „Entwickler… Ingenieurinnen… Fachleute… Bauende" | „Entwickler" (das klare Wort wiederholen) |
| 11 | **Template-Phrasen** | „ein [Adj.] Schritt in Richtung [Adj.] Infrastruktur" | Das konkrete Ergebnis beschreiben |
| 12 | **Füllphrasen** | „Im Hinblick auf", „Es ist wichtig zu beachten, dass" | „Bei", direkt die Aussage machen |
| 13 | **Falsche Spannweiten** | „vom Urknall bis zur dunklen Materie" | Die tatsächlichen Themen auflisten |
| 14 | **Parenthetisches Absichern** | „(und zunehmend auch für kleinere Betriebe)" | Direkt nennen oder streichen |

### Struktur-Muster

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 15 | **Formatierung** | Geviertstriche (— und --), Fett-Überladung, Emoji-Header, aufzählungslastig | Kommas/Punkte, Fliesstext-Absätze |
| 16 | **Satzstruktur** | „Es ist nicht X — es ist Y" plus hohle Verstärker plus Absicherungen | Direkte positive Aussagen |
| 17 | **Strukturelle Probleme** | Gleichförmige Absätze, schablonenhafte Einstiege, verdächtig saubere Grammatik | Variierte Länge, mit dem Punkt führen |
| 18 | **Übergangsphrasen** | „Darüber hinaus", „Des Weiteren", „In der heutigen [X]" | „und", „auch" oder umstrukturieren |
| 19 | **Inline-Header-Listen** | „**Leistung:** Die Leistung verbesserte sich um…" | Den Punkt direkt schreiben |
| 20 | **Nominalstil und Funktionsverbgefüge** | „zur Verfügung stellen", „die Durchführung von Tests" | „geben", „Tests durchführen" |
| 21 | **Nummerierte-Listen-Aufblähung** | „Hier sind 7 Gründe, warum…" | Auf die 2–3 kürzen, die zählen |
| 22 | **Falsche Zugeständnis-Struktur** | „Zwar ist X beeindruckend, doch es bleibt bemerkenswert" | Den echten Tradeoff benennen |
| 23 | **Rhetorische Frage-Einstiege** | „Aber was bedeutet das für dich?" | Mit der Aussage führen |

### Kommunikations-Muster

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 24 | **Chatbot-Artefakte** | „Ich hoffe, das hilft dir weiter! Melde dich gern…" | Ganz entfernen |
| 25 | **„Lass uns"-Konstruktionen** | „Lass uns erkunden", „Schauen wir uns das genauer an" | Einfach mit dem Punkt beginnen |
| 26 | **Cutoff-Disclaimer** | „Stand meines letzten Updates…" | Quelle finden oder entfernen |
| 27 | **Generische Schlüsse** | „Die Zukunft sieht rosig aus", „Nur die Zeit wird zeigen" | Konkreter Schlussgedanke oder streichen |
| 28 | **Emotionale Flachheit** | „Was mich am meisten überrascht hat", „Besonders faszinierend war" | Die Emotion einlösen oder die Behauptung streichen |
| 29 | **Reasoning-Ketten-Artefakte** | „Lass mich das Schritt für Schritt durchgehen" | Schlussfolgerung nennen, dann den Beleg |
| 30 | **Schmeichlerischer Ton** | „Grossartige Frage!", „Du hast völlig recht!" | Ganz entfernen |
| 31 | **Bestätigungs-Schleifen** | „Du fragst nach", „Um deine Frage zu beantworten" | Einfach direkt antworten |
| 32 | **Sicherheits-Kalibrierung** | „Es ist wichtig zu beachten", „Interessanterweise" | Den Fakt für sich sprechen lassen |

### Meta-Muster

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 33 | **Übermässige Struktur** | 5 Überschriften in 200 Wörtern, „Überblick:", „Kernpunkte:" | Abschnitte zusammenführen, konkrete Überschriften |
| 34 | **Rhythmus und Gleichförmigkeit** | Alle Sätze 15–25 Wörter, alle Absätze gleich lang | Kurz/lang mischen, Fragmente, Fragen |
| 35 | **Über-Politur** | Jede Unregelmässigkeit weggeschliffen, perfekt gleichförmige Prosa | Natürliche Stockungen, variierten Rhythmus behalten |
| 36 | **Neu-schreiben-vs.-Flicken-Schwelle** | 5+ Vokabel-Treffer plus 3+ Musterkategorien plus gleichförmiger Rhythmus | Vollständiges Neuschreiben raten, nicht flicken |

### Strukturelle Erkennung

Fängt LLM-Output, der die Vokabeltabellen umgeht, indem er Synonyme einsetzt, sich aber weiter auf strukturelle Formen stützt, die der Detector erkennt. Krypto-/Web3-/KI-Infra-Inhalte konzentrieren diese Muster am stärksten, aber die Regeln verallgemeinern auf jeden Social-Post.

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 37 | **Tier-3-Phrasen (Mehrwort-Boilerplate)** | „die Integration von", „dezentrale Rechenleistung", „community-getrieben", „langfristige Nachhaltigkeit" über einen Text gestapelt | Die wiederholte Phrase durch eine konkrete Aussage ersetzen oder echt variieren. Geflaggt pro Phrase ab 2 Treffern oder als Cluster bei 3+ verschiedenen Phrasen |
| 38 | **Future-Narrative-Schlüsse** | „könnte zu einem der wichtigsten Narrative des nächsten Marktzyklus werden" | Die falsifizierbare Variante wählen. „X dürfte Y bis 2027 übertreffen" ist eine Prognose; die Schablone nicht |
| 39 | **Gestapelte Absicherungen in Prognosen** | „könnte möglicherweise schaffen", „dürfte letztlich freisetzen" | Eines wählen. Jede Absicherung hebt die nächste auf |
| 40 | **„Echt/tatsächlich"-Adjektiv-Aufblähung** | „echte On-Chain-Tokenomics", „tatsächlicher Nutzen" | Den leeren Verstärker streichen und die konkrete Aussage ergänzen. Carve-out: „echte On-Chain-Abwicklung, keine gebrückten Schuldscheine" ist ehrliches Kontrast-Schreiben – das Tell ist der ungesagte Kontrast |
| 41 | **Hashtag-Stopfen** | 15-Tag-Block am Ende: `#KI #Krypto #Web3 #Innovation #ZukunftTech…` | Höchstens 2–3 konkrete Tags, oder keine. Empirische Schwelle: 6+ Tags sind in LLM-Social-Output nahezu universell, in durchdachten menschlichen Posts selten |
| 42 | **Aufzählungslisten aus blossen Nominalphrasen** | `* Stabile Mining-Effizienz / Zuverlässige Pool-Verbindung / Optimierte RandomX-Leistung / Geringe Quote fehlgeschlagener Shares / Effiziente Hardware-Nutzung / Konstante Temperatur-Stabilität` | In Fliesstext umwandeln oder jeden Punkt als vollständige Aussage mit Verb und Zahl umschreiben. Carve-out: echter Listen-Inhalt (Changelogs, Parameter-Dokus, Zutatenlisten), wo blosse Nominalphrasen korrekt sind |

### KI-Tool-Fingerabdrücke und deutsche Zusatzregeln

| # | Muster | Vorher | Nachher |
|---|---------|--------|-------|
| 43 | **Nicht ausgefüllte Platzhalter** | `[Ihr Name]`, `[QUELLE EINFÜGEN]`, `TT.MM.JJJJ` | Mit echtem Inhalt füllen oder löschen – ausgelieferte Platzhalter sind ein nahezu definitives Tell |
| 44 | **Chatbot-Zitations-Markup** | `citeturn0search0`, `oai_citation`, `contentReference[oaicite:0]` | Das Markup-Token ganz entfernen |
| 45 | **KI-Tool-URL-Parameter** | `utm_source=chatgpt.com`, `utm_source=copilot.com` | Den Tracking-Parameter entfernen; die URL behalten, wenn der Link zählt |
| 46 | **Spekulatives Lückenfüllen** | „hält ein relativ geringes öffentliches Profil", „begann vermutlich seine Karriere" | Die Vermutung streichen oder durch einen belegten Fakt ersetzen |
| 47 | **Passivlastigkeit** | „es wird empfohlen, dass", „es sollte beachtet werden" | Ins Aktiv setzen und den Urheber nennen: „wir empfehlen", „beachte" |

Zur Severity-Kalibrierung ergänzen mehrere weitere Regeln den Katalog – Infomercial-Engagement-Köder („Der Haken?", „Der Clou?"), Wortschatz-Vielfalt (niedriges TTR), Selbst-Etikettierung von Bedeutung („Das ist der interessante Teil") – sowie zwei schreiber-seitige **Tests** (Ermessens-Checks, nicht auto-erkannt): **Absatz-Umstell-Immunität** (kannst du zwei Fliesstext-Absätze tauschen, ohne dass der Text bricht?) und der **Tretmühlen-Effekt** („was ist in diesem Absatz eigentlich neu?").

## Vollständiges Beispiel

**Vorher (KI-generiert):**

> Gerne! Hier ist ein umfassender Überblick über Acmes Series B.
>
> Acme Analytics, ein pulsierendes Start-up, eingebettet im Herzen des florierenden Tech-Ökosystems von Zürich, hat 40 Mio. CHF in einer Series-B-Finanzierung gesichert — ein wahrer Wendepunkt für das Unternehmen und die Observability-Landschaft insgesamt. Die Runde wurde von Lakestar angeführt, mit Beteiligung von Index Ventures, Redalpine und Creandum, was das robuste Investorenvertrauen in Acmes Vision unterstreicht.
>
> Die Plattform dient als zentrale Drehscheibe für Engineering-Teams, verfügt über Echtzeit-Dashboards, bietet Abfrageleistung im Sub-Sekunden-Bereich und präsentiert eine nahtlose Integrationsschicht. Es ist nicht einfach ein weiteres Monitoring-Tool — es ist ein Paradigmenwechsel darin, wie Organisationen komplexe verteilte Systeme navigieren. Experten sind sich einig, dass Acme den 15-Mrd.-Observability-Markt umkrempeln dürfte. Studien zeigen, dass Unternehmen, die umfassende Monitoring-Lösungen nutzen, Probleme 40 % schneller erkennen.
>
> - 🚀 **Leistung:** Die Plattform optimiert die Incident-Reaktion und befähigt Engineers, Probleme schneller zu lösen.
> - 💡 **Skalierung:** Acme fördert die Zusammenarbeit über Teams hinweg, von Frontend-Entwicklern über SRE-Fachleute bis zu Plattform-Bauenden und Infrastruktur-Ingenieuren.
> - ✅ **Akzeptanz:** Die Kundenakzeptanz beschleunigt sich weiter und widerspiegelt breitere Branchentrends.
>
> Darüber hinaus zeigt Acmes Ansatz das Potenzial moderner Observability auf — einen Wandel hin zu proaktivem Monitoring symbolisierend, Jahre der Forschungsinvestition widerspiegelnd und das komplexe Zusammenspiel von Datenerfassung und verwertbarer Intelligenz aufzeigend. Trotz Herausforderungen, die im überfüllten Monitoring-Markt üblich sind, floriert Acme weiter. Um diesen Schwung voll auszuschöpfen, plant das Unternehmen, seine Go-to-Market-Bemühungen auszubauen.
>
> Zusammenfassend lässt sich sagen: Die Zukunft sieht rosig aus für Acme Analytics. Nur die Zeit wird zeigen, wie dieser Game-Changer das Observability-Paradigma neugestalten wird. Zögere nicht, dich zu melden, wenn du mehr Details möchtest!

**Nachher (aufgeräumt):**

> Acme Analytics hat eine Series B über 40 Mio. CHF abgeschlossen, angeführt von Lakestar. Das Zürcher Start-up baut eine Observability-Plattform, die Abfragen in unter einer Sekunde beantwortet und sich an bestehende Monitoring-Stacks anschliesst, ohne dass man eigene Integrationen schreiben muss.
>
> Der Pitch ist Tempo. Ihre mediane Zeit bis zur Behebung liegt bei 12 Minuten, gegenüber dem Branchenschnitt von 45 Minuten, den Datadog 2024 berichtete. Diese Lücke ist der Grund, warum 380 Firmen dafür zahlen.
>
> Das Geld geht in neue Vertriebsleute in der EMEA-Region und in Log-Management. Der Monitoring-Markt ist überfüllt, aber Acme wettet darauf, dass die meisten Teams noch drei oder vier Tools zusammenflicken und beim Wechseln dazwischen Zeit verlieren.

**Was das Skill gefangen hat:** Chatbot-Artefakte (Gerne!, Zögere nicht, dich zu melden), 2 Geviertstriche (—), Werbesprache (pulsierend, eingebettet, florierend), Bedeutungs-Aufblähung (ein wahrer Wendepunkt), Kopula-Vermeidung (dient als, verfügt über, bietet, präsentiert), Vokabel-Ersetzungen (nahtlos, robust, umfassend, optimieren, fördern, navigieren, neugestalten, auszuschöpfen), Synonym-Wechsel (Entwickler/Fachleute/Bauende/Ingenieure), negative Parallelität (Es ist nicht einfach X, es ist Y), Prominenz-Namedropping (Lakestar, Index, Redalpine, Creandum gestapelt für Glaubwürdigkeit), vage Quellenangaben (Experten sind sich einig, Studien zeigen), Füllphrasen (Um … auszuschöpfen, Darüber hinaus), Inline-Header-Liste mit Emoji, oberflächliche Partizip-Analyse (symbolisierend… widerspiegelnd… aufzeigend), schablonenhafte Herausforderungen (Trotz Herausforderungen… floriert weiter), generischer Schluss (Die Zukunft sieht rosig aus, Nur die Zeit wird zeigen). Über 30 KI-Tells.

## Detector ausführen

Das Skill liefert eine deterministische, abhängigkeitsfreie Erkennungs-Engine in
[`detector/`](./detector/) – dieselbe 43-Kategorien-Engine, die die Regeln oben
beschreiben, als lauffähiger Code. Sie läuft in Node (`>=18`) und im Browser ohne
Build-Schritt.

Sie ist zugleich die einzige Quelle des numerischen Scores: das Skill selbst (und der
`detect`-Modus) melden, *welche* Muster vorhanden und wie schwer sie sind (P0/P1/P2),
und die Engine ist das, was daraus einen berechneten Score von 0–100 macht. Es gibt
bewusst keinen zweiten, prosa-geschätzten Score in `SKILL.md` – ein Scorer, nicht zwei.

```bash
npm test          # die Fixtures des Detectors ausführen (keine Abhängigkeiten zu installieren)
```

```js
const AIDetector = require("./detector/patterns.js");
const { score, label, issues } = AIDetector.analyzeText("Dein Text hier…");
```

Die Score-Labels sind deutsch: `Sauber`, `Minimale KI-Signale`, `Einige KI-Muster`,
`Moderate KI-Signale`, `Starke KI-Signale`, `Viele KI-Muster` (plus die Sonderfälle
`Leer`, `Zu kurz`, `Text zu lang`).

Siehe [`detector/README.md`](./detector/README.md) für die vollständige `analyzeText`-API
und [`detector/CATEGORIES.md`](./detector/CATEGORIES.md) für die Regel-↔-Kategorie-Map,
die `SKILL.md` und die Engine synchron hält.

## Credits

Diese deutsche Portierung in Schweizer Schreibweise baut auf dem ursprünglichen
`avoid-ai-writing`-Skill von [Conor Bronsdon](https://github.com/conorbronsdon) auf
(MIT-Lizenz). Das deutsche Vokabular und die Muster sind aus recherchierten deutschen
LLM-Tells aufgebaut, nicht aus dem Englischen übersetzt; der Detector wurde an die
deutsche Typografie angepasst (Geviertstrich als Tell, Halbgeviertstrich korrekt,
Title-Case entfernt, Nominalstil/Passivlastigkeit ergänzt). Gepflegt unter
[gardenbaum/avoid-ai-writing](https://github.com/gardenbaum/avoid-ai-writing).

Die Muster-Recherche stützt sich auf:
- [Pangram Labs](https://www.pangram.com/) KI-Erkennungs-Forschung — Erkenntnisse zur strukturellen Regelmässigkeit, Vokabel-Flags aus einem Decoder-only-Klassifikator, trainiert auf 28 Mio. menschlichen Dokumenten
- Wikipedias [Signs of AI-generated text](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) — die kanonische Referenz für KI-Schreib-Tells, gepflegt von Wikipedia-Redaktorinnen und -Redaktoren
- [blader/humanizer](https://github.com/blader/humanizer) Claude-Code-Skill
- [brandonwise/humanizer](https://github.com/brandonwise/humanizer) — gestuftes Vokabularsystem, statistische Analyse-Forschung (Burstiness, Satzlängen-Variation, Trigramm-Wiederholung) und Umschreib-Philosophie
- [OpenClaw](https://github.com/openclaw/openclaw) Humanizer-Skill-Ökosystem — Community-Muster und Vokabel-Forschung

Ursprünglich verfasst von [Conor Bronsdon](https://github.com/conorbronsdon) · [LinkedIn](https://www.linkedin.com/in/conorbronsdon/) · [Chain of Thought Podcast](https://chainofthought.show)

## Community / Mehrsprachig

KI-Schreib-Tells sind sprachspezifisch, und um das ursprüngliche Skill herum sind mehrere Sprach-Adaptionen entstanden:

- **[avoid-ai-writing-multilingual](https://github.com/jurigis/avoid-ai-writing-multilingual)** von [Jürgen Kraus](https://github.com/jurigis) — deutsche (`SKILL-DE.md`) und rumänische (`SKILL-RO.md`) Adaptionen, in muttersprachlicher Recherche verankert statt aus dem Englischen übersetzt.

Etwas auf Basis dieses Skills gebaut? Öffne ein Issue – wir verlinken es hier gern.

---

## Haftungsausschluss

*Dieses Skill markiert statistische Muster, kein Urteil. Die hier geflaggten Formen kommen in LLM-Ausgaben häufiger vor, aber auch Menschen erzeugen sie – besonders unter Zeitdruck, in unvertrauten Textsorten oder in einer Zweitsprache. Behandle die Treffer als Signal, nicht als Beweis. Mach sie nie zur alleinigen Grundlage einer folgenreichen Entscheidung (akademische Integrität, Einstellung, Veröffentlichung, Urheberschaft). Verbinde das Signal stets mit dem Kontext.*

## Lizenz

MIT
