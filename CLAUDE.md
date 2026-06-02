# CLAUDE.md

Diese Datei gibt Claude Code (claude.ai/code) Anleitung für die Arbeit mit dem Code in
diesem Repository.

## Was das ist

Ein Schreib-Skill, das Texte auf deutsche KI-Schreibmuster prüft und sie umschreibt.
Das Repo ist ein mehrteiliges Produkt: `SKILL.md` ist die Source of Truth, eine
deterministische Detector-Engine spiegelt die regex-erkennbare Teilmenge, Tests und CI
halten beide synchron, und Integrationen (Cursor-Rule, Claude-Plugin) werden aus
`SKILL.md` erzeugt. Es ist auf **Deutsch in Schweizer Schreibweise** zugeschnitten
(siehe Konventionen unten), basierend auf recherchierten deutschen LLM-Tells statt auf
einer Übersetzung der englischen Listen.

## Verbindliche Konventionen (Schweizer Portierung)

Diese Regeln gelten für jede Änderung in diesem Repo:

- **Kein Eszett.** Durchgängig `ss` – in Prosa, Tabellen, Beispielen, **Code-Kommentaren
  und Test-Fixtures**. Umlaute bleiben erhalten (Schweizer Schreibweise heisst nur: kein
  Eszett). Beispiele: muss, dass, Strasse, grösser, heisst, weiss, ausserdem,
  abschliessend.
- **Anführungszeichen-Carve-out.** Die deutschen Anführungszeichen `„ "` (U+201E/U+201C)
  und `‚ '` (U+201A/U+2018) sowie die Guillemets `« »` / `‹ ›` gelten als lokal korrekt
  und werden im Detector wie im Skill **nie** geflaggt.
- **Gedankenstrich.** Der Halbgeviertstrich `–` (U+2013, mit Leerzeichen) ist korrektes
  Deutsch und wird nachsichtig behandelt. Der Geviertstrich `—` (U+2014) ist das KI-Tell.
- **Stabil lassen:** der `name: avoid-ai-writing`, alle Verzeichnispfade und sämtliche
  Maschinen-Tokens – `--mode rewrite|detect|edit`, `contextMode general|technical`, die
  Voice-Keys (`casual|professional|technical|warm|blunt`) und die Context-Keys
  (`linkedin|blog|technical-blog|investor-email|docs|casual`). Die Detector-`type`-
  Schlüssel bleiben ebenfalls stabil – Ausnahme: `title-case-header` ist entfernt,
  `nominalstil` neu (netto weiter 43 `type`s).
- **Version überall `4.0.0`.** Repo- und Install-URLs zeigen auf
  `github.com/gardenbaum/avoid-ai-writing`. Die Upstream-MIT-Attribution (Conor Bronsdon)
  bleibt erhalten, dazu ein Hinweis auf die deutsche/schweizer Portierung.
- **Deutsche Score-Labels** (fix, überall identisch): `0` → „Sauber"; bis 15 →
  „Minimale KI-Signale"; bis 35 → „Einige KI-Muster"; bis 60 → „Moderate KI-Signale";
  bis 80 → „Starke KI-Signale"; darüber → „Viele KI-Muster". Sonderfälle: leer →
  „Leer", zu kurz → „Zu kurz", zu lang → „Text zu lang".

## Repository-Struktur

- `SKILL.md` – das Skill selbst (v4.0.0). **Source of Truth.** Alle Regeln, Tiers,
  Profile und das Output-Format leben hier.
- `detector/patterns.js` – die deterministische, abhängigkeitsfreie JS-Engine. Die
  ausführbare Teilmenge der `SKILL.md`-Regeln: Regex-Muster, Vokabel-Tiers, Stylometrie
  und KI-Tool-Fingerabdrücke. Liefert über `analyzeText()` Score, Label und Befunde.
- `detector/patterns.test.js` – Fixtures (je True-Positive und Must-not-fire).
- `detector/categories.test.js` – der Anti-Drift-Vertrag: prüft, dass `TYPE_LABELS`
  und `detector/CATEGORIES.md` exakt zueinander passen.
- `detector/CATEGORIES.md` – die Zuordnung zwischen SKILL.md-Regeln und Detector-`type`s.
- `detector/README.md` – Engine-Doku.
- `README.md` – öffentliche Doku: Pitch, Installation, Muster-Referenztabelle,
  Vorher/Nachher-Beispiel.
- `CHANGELOG.md` – Versionshistorie mit dem Was und Warum.
- `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md` – Beitrags-Guide und PR-Checkliste.
- `cursor-rules/avoid-ai-writing.mdc` (+ `README.md`) – der Cursor-Port, aus `SKILL.md`
  gespiegelt.
- `plugins/avoid-ai-writing/…` – das Claude-Plugin. `skills/avoid-ai-writing/SKILL.md`
  ist eine **automatisch synchronisierte Kopie** der Top-Level-`SKILL.md`;
  `.claude-plugin/plugin.json` ist das Manifest.
- `.claude-plugin/marketplace.json` – der Marketplace-Eintrag.
- `package.json` – NPM-Manifest des Detectors (`name: avoid-ai-writing-detector`).
- `scripts/check-pattern-count.sh` – Guard, der den Musteranzahl-Drift zwischen README
  und `SKILL.md` verhindert.
- `scripts/sync-plugin-skill.sh` – kopiert `SKILL.md` in die Plugin-Kopie und gleicht die
  Version ab.
- `.github/workflows/{detector-test,plugin-skill-sync}.yml` – CI: führt die Tests aus und
  prüft, dass die Plugin-Kopie synchron ist.

## Wie man Änderungen macht

`SKILL.md` ist die Source of Truth; alles andere spiegelt sie. Bei Änderungen:

- Die Version in der `SKILL.md`-Frontmatter erhöhen (`version: X.Y.Z`) und in
  `plugin.json` sowie `package.json` synchron halten.
- Einen datierten Eintrag in `CHANGELOG.md` ergänzen.
- `README.md` aktualisieren, wenn die Änderung Installation, Nutzung, Feature-Liste oder
  die Musteranzahl betrifft.
- Eine regex-erkennbare Regel braucht zusätzlich einen Detector-`type` in
  `patterns.js`, eine Zeile in `detector/CATEGORIES.md` und eine Fixture in
  `patterns.test.js` (True-Positive **und** Must-not-fire).
- Die Musteranzahl steht an **einer** Stelle – dem README-Bullet „**NN
  Muster-Kategorien**" – und wird aus den `###`-Erkennungs-Einträgen von `SKILL.md`
  hergeleitet. Nicht anderswo wiederholen; CI (`scripts/check-pattern-count.sh`) lässt
  den Build scheitern, wenn die README-Zahl von `SKILL.md` abweicht. Also einfach den
  neuen `###`-Eintrag ergänzen und das README-Bullet anpassen.
- `npm test` ausführen (Engine-Fixtures + `categories.test.js`-Vertrag). Wenn ein
  Detector-`type` dazukommt oder wegfällt, müssen `patterns.js`, `CATEGORIES.md` und der
  Vertrag konsistent bleiben.
- Nach Änderungen an `SKILL.md` `bash scripts/sync-plugin-skill.sh` ausführen, damit die
  Plugin-Kopie identisch bleibt (die CI prüft das).

## Architektur des Skills

Das Skill hat drei Modi (`rewrite` Standard, `detect` nur flaggen, `edit` in-place) und
verarbeitet Text in dieser Pipeline:

1. **Context-Profil-Erkennung** – erkennt automatisch oder akzeptiert einen Profil-Hint
   (linkedin, blog, technical-blog, investor-email, docs, casual), der die Regel-Strenge
   über die Toleranzmatrix anpasst.
2. **Mustererkennung** – Erkennungskategorien über Inhalt, Sprache, Struktur,
   Kommunikation und Meta-Muster (Katalog in `SKILL.md`; die Zahl steht im README-Bullet).
3. **Vokabel-Flagging** – 3-Stufen-System: Tier 1 (immer flaggen), Tier 2 (im Cluster
   flaggen), Tier 3 (bei hoher Dichte flaggen).
4. **Severity-Klassifikation** – P0 (Glaubwürdigkeits-Killer), P1 (offensichtlicher
   KI-Geruch), P2 (stilistischer Feinschliff).
5. **Output** – Rewrite-Modus: 4 Abschnitte inklusive Zweitdurchlauf-Prüfung;
   Detect-Modus: 2 Abschnitte mit der Einschätzung Problem vs. Ermessensfrage.

Der deterministische Detector ist die **einzige Quelle des Scores**: das Skill ruft
mental dieselbe Logik auf, die `patterns.js` ausführt. SKILL.md und Engine müssen über
`CATEGORIES.md` (maschinell erzwungen) konsistent bleiben.

## Besonderheiten der deutschen Portierung

- **`em-dash` ist umgekehrt:** der Geviertstrich `—` ist das Tell, der gespacete
  Halbgeviertstrich `–` ist korrekt. Beim Schreiben von Beispielen und Doku darauf
  achten.
- **`smart-punct-signature` ohne Oxford-Komma** (kein deutsches Konstrukt) – die Signatur
  setzt sich aus Geviertstrich, Schreib-Anführungszeichen und fehlerfreiem Tippmuster
  zusammen.
- **`title-case-header` gibt es nicht mehr:** Deutsch schreibt alle Substantive gross, es
  gibt also keine „Title Case" als Tell. An ihrer Stelle steht `nominalstil`
  (Funktionsverbgefüge / `-ung`-Häufung) plus die Passivlastigkeit als Skill-only-Regel.
- **Stylometrie-Schwellen** (Type-Token-Ratio, Burstiness, Trigramm-Entropie) sind auf
  englischen Korpora kalibriert und im Code als Heuristik mit Kalibrierungs-Vorbehalt
  dokumentiert; deutsche Flexion und Komposita verschieben die Verteilung. Konservativ
  halten (FN-Bias).

## Zentrale Bedingungen

- Wort-Ersetzungstabellen-Einträge brauchen konkrete Alternativen, nicht bloss
  „umformulieren".
- Der Self-Reference-Escape-Hatch (zitierte Beispiele sind vom Flaggen ausgenommen) muss
  erhalten bleiben – ohne ihn flaggt das Skill seine eigene Doku.
- Das technical-blog-Profil hat explizite Ausnahmen in der Wort-Tabelle (z. B. sind
  „robust" und „Ökosystem" in technischen Kontexten legitim).
- „Extra streng" und „überspringen" in der Toleranzmatrix haben in der Datei definierte
  Bedeutungen.

## Kompatibilität

Das Skill funktioniert mit Claude Code, OpenClaw/ClawHub und jedem
agentskills.io-kompatiblen Agent. Die Frontmatter enthält die Felder `agentskills_spec`
und `openclaw`. Änderungen dürfen kein Format brechen.
