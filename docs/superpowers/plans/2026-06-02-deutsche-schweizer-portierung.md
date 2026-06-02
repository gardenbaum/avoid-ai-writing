# Deutsche/Schweizer Portierung — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Unter *ultracode* wird der Plan über die **Workflow**-Orchestrierung umgesetzt (parallele Agents pro Task-Gruppe, adversarische Verifikation der recherchierten Tells).

**Goal:** Das gesamte Repository von Englisch auf Deutsch in Schweizer Schreibweise (kein ß) umstellen — Skill, Detector-Engine, Tests, Doku, CI — gegründet auf recherchierten deutschen LLM-Tells, nicht auf Übersetzung.

**Architecture:** Struktur-erhaltender Neuaufbau. Dateilayout, Scoring-Modell, Kategorie-Framework und CI bleiben. Kanonische deutsche Vokabel-/Tell-Listen werden einmal festgelegt (Task 1) und von SKILL.md (Tabellen) wie Detector (Objekte) geteilt. SKILL.md ist Source of Truth; der Detector spiegelt sie; Doku referenziert beide; `categories.test.js` erzwingt den SKILL↔Engine-Vertrag maschinell.

**Tech Stack:** Markdown (Skill/Doku), Node.js ≥18 (zero-dependency Detector + Tests), Bash/awk/python3 (Guards), JSON (Plugin/Marketplace), Cursor `.mdc`.

**Referenz-Spec:** `docs/superpowers/specs/2026-06-02-deutsche-schweizer-portierung-design.md`

---

## Konventionen (für ALLE Tasks)

- **Kein ß.** Durchgängig `ss` — Prosa, Tabellen, Beispiele, Code-Kommentare, Test-Fixtures.
- **Anführungszeichen-Carve-out** (Detector + SKILL): `„ "` `‚ '` (U+201E/201C/201A/2018) **und** `« »` `‹ ›` (Guillemets) gelten als lokal-korrekt → nie flaggen.
- **Gedankenstrich:** `–` (U+2013, gespacet) korrekt/nachsichtig; `—` (U+2014) ist das Tell.
- **Stabil lassen:** `name: avoid-ai-writing`, alle Verzeichnispfade, Maschinen-Tokens (`--mode rewrite|detect|edit`, `contextMode general|technical`, Voice-/Context-Keys), die 43 Detector-`type`-Schlüssel (ausser dem Tausch `title-case-header` → `nominalstil`).
- **Version überall `4.0.0`.** Repo-/Install-URLs → `gardenbaum/avoid-ai-writing`. Upstream-MIT-Attribution (Conor Bronsdon) erhalten + Port-Hinweis.
- **Commits:** häufig, einer pro Task. Branch: `de-ch-portierung` (existiert bereits).
- **Git-Commit-Trailer:** `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## Dateistruktur (was wird angefasst)

| Datei | Verantwortung | Aktion |
|---|---|---|
| `docs/superpowers/research/de-tells.md` | Kanonische deutsche Tell-/Vokabel-Listen (Single Source) | Create |
| `SKILL.md` | Regelkatalog, Source of Truth | Rewrite |
| `detector/patterns.js` | Deterministische Engine | Rewrite (Inhalt), Struktur/Math bleibt |
| `detector/patterns.test.js` | Fixtures (TP + Must-not-fire) | Rewrite |
| `detector/categories.test.js` | SKILL↔Engine-Vertrag | Minimal anpassen |
| `detector/CATEGORIES.md` | Kategorien-Map | Rewrite |
| `detector/README.md` | Engine-Doku | Rewrite |
| `README.md` | Pitch, Install, Muster-Tabellen | Rewrite |
| `CHANGELOG.md` | Historie + `4.0.0`-Eintrag | Rewrite |
| `CONTRIBUTING.md` | Beitrags-Guide | Rewrite |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR-Checkliste | Rewrite |
| `CLAUDE.md` | Projekt-Guidance (+ faktisch korrigieren) | Rewrite |
| `cursor-rules/avoid-ai-writing.mdc` | Cursor-Port | Rewrite (aus SKILL.md) |
| `cursor-rules/README.md` | Cursor-Install | Rewrite |
| `plugins/.../skills/.../SKILL.md` | Generierte Kopie | Via Sync-Skript |
| `plugins/.../.claude-plugin/plugin.json` | Plugin-Manifest | Edit (Desc/Version) |
| `.claude-plugin/marketplace.json` | Marketplace | Edit (Desc/Keywords) |
| `package.json` | NPM-Manifest | Edit (Desc/Version) |
| `scripts/check-pattern-count.sh` | Count-Guard | Edit (deutsche Anker) |
| `scripts/sync-plugin-skill.sh` | Sync-Guard | Edit (Echo-Texte) |
| `.github/workflows/*.yml` | CI | Unverändert (pfadbasiert) |

---

## Task 1: Kanonische deutsche Tell-Listen (Research-Artefakt)

Single Source für Vokabular und Phrasen-Tells. Seed unten ist die Basis; die Recherche
**bestätigt jeden Eintrag als echtes deutsches LLM-Tell und prüft ihn gegen
False-Positives auf normalem (Schweizer) Menschentext**. FN-Bias halten: ein Eintrag,
der gewöhnliche Prosa fälschlich flaggt, fliegt raus.

**Files:**
- Create: `docs/superpowers/research/de-tells.md`

- [ ] **Step 1: Seed-Listen anlegen** (kein ß; jede Vokabel mit konkretem, schlichterem Ersatz)

```markdown
## Tier 1 — immer flaggen (Token, kleingeschrieben)
nahtlos → reibungslos, einfach
mühelos → einfach, leicht
ganzheitlich → vollständig, gesamt
bahnbrechend → neu (oder benennen, was neu ist)
revolutionär → verändernd (oder benennen)
vielfältig → verschieden, breit
facettenreich → vielseitig (oder die Facetten nennen)
eintauchen → ansehen, untersuchen
beleuchten → erklären, zeigen
robust → stabil, zuverlässig
zukunftsweisend → (benennen, was es leistet)
wegweisend → wichtig (oder benennen)
meilenstein → Schritt, Ereignis benennen
wendepunkt → Veränderung benennen
zeugnis → zeigt, belegt
synergie → das Zusammenspiel beschreiben
synergien → das Zusammenspiel beschreiben
nutzen (Verb, inflationär) → verwenden
herausragend → (benennen, was es auszeichnet)
spielend → einfach

## Tier 1 — Mehrwort-Phrasen
tauchen wir ein → sehen wir uns an
es lohnt sich → (sagen, warum es zählt)
auf ein neues level (heben|bringen) → verbessern
in der welt der → im Bereich (oder konkret benennen)
im bereich der → (konkret benennen)
ein wahres zeugnis → zeigt, belegt
die zukunft sieht rosig aus → (konkret oder streichen)
nur die zeit wird zeigen → (konkret oder streichen)

## Tier 2 — im Cluster (≥2 pro Absatz)
optimieren → vereinfachen, beschleunigen
navigieren → bewältigen, umgehen
fördern → unterstützen, aufbauen
stärken → verbessern
ermöglichen → erlauben, lassen
transformativ → (beschreiben, was sich änderte)
transformation → (beschreiben, was sich änderte)
ökosystem → System, Netzwerk, Markt
vielzahl → viele (oder Zahl nennen)
fülle → viele, viel
eckpfeiler → Grundlage, Kernstück
massgeblich → wichtig, zentral
aufkeimend → wachsend, jung
entscheidend → wichtig, nötig
umfassend → vollständig, gründlich
revolutionieren → verändern
katalysieren → auslösen, beschleunigen
neugestalten → überdenken, umbauen
beleben → (konkret beschreiben)

## Tier 3 — nur bei Dichte
bedeutend, innovativ, effektiv, dynamisch, skalierbar, überzeugend,
beispiellos, aussergewöhnlich, bemerkenswert, ausgeklügelt, hochmodern

## Tier-3-Phrasen — Boilerplate (≥2× oder ≥3 verschiedene)
die integration von
die schnittstelle von
community-getrieben
langfristige nachhaltigkeit
nutzer-engagement
dezentrale rechenleistung
nachhaltige token-ausschüttungen
tokenisierte anreizstrukturen

## Phrasen-Tells je Kategorie (Regex-Quelle für Task 5)
transition: darüber hinaus | des weiteren | zudem | ferner | überdies | abschliessend | zusammenfassend | letztendlich | in der heutigen | in einer zeit, in der
chatbot: gerne! | natürlich! | aber gerne | ich hoffe, das hilft | zögere nicht | melde dich gern | lass es mich wissen | in diesem artikel werden wir
sycophantic: grossartige frage | das ist eine ausgezeichnete frage | du hast völlig recht | eine sehr aufschlussreiche
filler: es ist wichtig zu beachten, dass | es ist wichtig zu erwähnen, dass | im hinblick auf | in bezug auf | tatsache ist, dass
generic-conclusion: die zukunft (sieht|ist) (rosig|vielversprechend) | nur die zeit wird (es )?zeigen | eines ist sicher | wenn wir nach vorne blicken
lets-construction: lassen sie uns | lasst uns | schauen wir uns .* an | werfen wir einen blick | betrachten wir | gehen wir .* durch
reasoning-artifact: schritt für schritt | lass(t)? uns das aufschlüsseln | gehen wir systematisch vor | hier ist mein gedankengang | überlegen wir zunächst
acknowledgment-loop: du fragst (dich )?nach | um deine frage zu beantworten | die frage, ob
significance-inflation: markiert einen wendepunkt | ein meilenstein (für|in) | in der entwicklung von | ein (entscheidender|prägender) moment
vague-attribution: experten (glauben|sagen|gehen davon aus|sind sich einig) | studien zeigen | forschung (zeigt|legt nahe|deutet darauf hin) | branchenführer sind sich einig
hollow-intensifier: wirklich | ehrlich gesagt | um ehrlich zu sein | in der tat | seien wir ehrlich | zweifellos (als Intensivierer)
emotional-flatline: was mich am meisten überrascht (hat|hatte) | faszinierend (war|fand ich) | was mich beeindruckt hat | besonders spannend war | das interessanteste (teil|daran)
novelty-inflation: ein begriff, den niemand nennt | ein problem, über das niemand spricht | was dir niemand sagt | die erkenntnis, die alle übersehen
cutoff-disclaimer: als ki-sprachmodell | als künstliche intelligenz | stand meines letzten updates | mein wissensstand reicht bis | ich habe keinen zugriff auf echtzeitdaten | basierend auf den verfügbaren informationen
template-phrase: ein .* schritt in richtung | ob sie nun .* oder .* sind | ich hatte kürzlich das vergnügen
false-concession: zwar ist .* beeindruckend, (doch|aber) | obwohl .* fortschritte gemacht hat
rhetorical-question: aber was bedeutet das für | warum sollte (dich|sie) das interessieren | was kommt als nächstes\?
hedge-stack: (könnte|dürfte|mag|kann) .{0,15}(möglicherweise|eventuell|letztlich|womöglich|unter umständen) | (möglicherweise|eventuell|letztlich) (könnte|dürfte)
future-narrative: (könnte|dürfte|wird|mag) .{0,20}zu (einem|einer) der (wichtigsten|bedeutendsten) .* (narrative|geschichten|trends|themen|entwicklungen) werden
real-actual-inflation: (echte|echter|echtes|tatsächliche|wahre|wahrer) (tokenomics|nutzen|akzeptanz|nachhaltigkeit|wirkung|nachfrage|wertschöpfung|innovation)
formulaic-opener: in der heutigen schnelllebigen welt | in einer (zeit|welt), in der | hat sich als (führend|wegweisend|zentral) etabliert | wird (immer|zunehmend) (wichtiger|relevanter)
confidence-calibration: interessanterweise | überraschenderweise | bemerkenswerterweise | wichtig ist | zweifellos | ohne zweifel | es sei darauf hingewiesen
parenthetical-hedge: (und zunehmend.{0,40}) | (genauer gesagt,.{0,40}) | (zumindest in der theorie.{0,30})
nominalstil (NEU): zur verfügung (stellen|gestellt) | in anspruch (nehmen|genommen) | zum einsatz (kommen|kommt|gebracht) | zur anwendung (kommen|bringen) | unter beweis (stellen|gestellt) | durchführung (von|der|des)
ai-placeholder: [Ihr Name] | [Dein Name] | [QUELLE EINFÜGEN] | [Firmenname] | [Empfänger] | [Betreff] | TT.MM.JJJJ
```

- [ ] **Step 2: Jeden Eintrag adversarisch verifizieren**

Für jeden Tell: (a) Beleg, dass er in deutschen LLM-Ausgaben überdurchschnittlich auftritt; (b) ein Must-not-fire-Gegenbeispiel aus normaler Schweizer Prosa. Einträge ohne (a) oder mit (b)-Treffer streichen. Ergebnis je Eintrag in der Datei dokumentieren.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/research/de-tells.md
git commit -m "docs: kanonische deutsche Tell-Listen (verifiziert)"
```

---

## Task 2: SKILL.md neu aufbauen (Source of Truth)

Struktur/Abschnitte von SKILL.md beibehalten, Inhalt Schweizer Deutsch, Vokabeltabellen aus Task 1. **Exakte Abschnittstitel** für den Count-Guard (Task 12) festlegen.

**Files:**
- Modify: `SKILL.md` (vollständig)

- [ ] **Step 1: Frontmatter**

```yaml
name: avoid-ai-writing
description: Prüft Texte auf KI-Schreibmuster („KI-Floskeln") und schreibt sie um. Nutze dieses Skill bei „entferne KI-Floskeln", „KI-Stil bereinigen", „auf KI-Muster prüfen", „klingt das nach KI?" oder „mach das menschlicher". Unterstützt einen Nur-Prüfen-Modus, einen In-Place-Bearbeiten-Modus für Dateien, ein optionales Voice-Profil (casual / professional / technical / warm / blunt) und einen Iterieren-bis-stabil-Durchlauf.
version: 4.0.0
license: MIT
```
(Restliche Frontmatter-Felder erhalten: `compatibility` deutsch, `metadata.author`, `tags`, `agentskills_spec`, `openclaw`.)

- [ ] **Step 2: Prosa-Abschnitte übersetzen (Schweizer Deutsch)**

Alle Abschnitte übernehmen: „Was dieses Skill ist und was nicht" (inkl. der Forschungs-Belege zu Detektor-Fehlerraten — Quellen unverändert zitieren), Modi (rewrite/detect/edit), „Was zu entfernen oder zu korrigieren ist" (Hauptkatalog), Severity-Tiers, Self-Reference-Escape-Hatch, Context-Profile + Toleranzmatrix, Auto-Detection-Cues, Voice-Profile, Output-Format, Ton-Kalibrierung.

**Verbindliche Abschnittstitel (für Guard):**
- Hauptkatalog: `## Was zu entfernen oder zu korrigieren ist`
- Writer-Tests (vom Count ausgeschlossen): Titel enthalten ` (Struktur-Test)` bzw. ` (Inhalts-Test)`
- Rewrite-vs-Patch: `### Wann komplett neu schreiben statt flicken`

- [ ] **Step 3: Vokabeltabellen + Kategorien aus Task 1 einsetzen**

Tier-1/2/3-Tabellen und Tier-3-Phrasen aus `de-tells.md`. `###`-Kategorien anpassen: `### Title-Case-Überschriften` **entfernen**; **neu** `### Nominalstil und Funktionsverbgefüge` und `### Passivlastigkeit` ergänzen. Em-Dash-Regel auf deutsche Typografie umschreiben (`—` = Tell, `–` korrekt). Anführungszeichen-Regel auf `„ "`/`« »`-Carve-out.

- [ ] **Step 4: Verifizieren — kein ß, Titel vorhanden**

Run: `! grep -n 'ß' SKILL.md && grep -c '^### ' SKILL.md && grep -n '## Was zu entfernen oder zu korrigieren ist' SKILL.md`
Expected: kein ß-Treffer; Hauptkatalog-Titel vorhanden.

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "feat: SKILL.md auf Deutsch (Schweizer Schreibweise) portiert"
```

---

## Task 3: Detector — Vokabel-Objekte (TIER1/2/3 + Phrasen)

TDD. Mechanik (Lookup, Cluster-Logik, Dichte-Schwelle) bleibt; nur die Daten werden deutsch (aus Task 1).

**Files:**
- Modify: `detector/patterns.js` (Blöcke `TIER1`, `TIER1_PHRASES`, `TIER2`, `TIER3`, `TIER3_PHRASES`)
- Test: `detector/patterns.test.js`

- [ ] **Step 1: Failing Test schreiben**

```js
test('flaggt deutsche Tier-1-Vokabel', () => {
  const r = AIDetector.analyzeText('Diese Lösung ist nahtlos und ganzheitlich. '.repeat(4) + 'Wir tauchen jetzt tief in die Materie ein und beleuchten die Details ausführlich für alle Beteiligten.');
  assert.ok(r.issues.some((i) => i.type === 'tier1'), 'tier1 deutsch erkannt');
});
test('flaggt normalen Schweizer Satz NICHT als Tier-1', () => {
  const r = AIDetector.analyzeText('Wir haben die Offerte gestern verschickt und warten nun auf die Rückmeldung des Kunden aus Zürich, die bis Freitag eintreffen soll.');
  assert.ok(!r.issues.some((i) => i.type === 'tier1'), 'kein Fehlalarm');
});
```

- [ ] **Step 2: Test fails ausführen**

Run: `node detector/patterns.test.js`
Expected: FAIL (englische Vokabel matcht „nahtlos" nicht).

- [ ] **Step 3: TIER1/TIER2/TIER3/Phrasen ersetzen**

```js
const TIER1 = {
  'nahtlos': 'reibungslos, einfach',
  'mühelos': 'einfach, leicht',
  'ganzheitlich': 'vollständig, gesamt',
  'bahnbrechend': 'neu (oder benennen, was neu ist)',
  'revolutionär': 'verändernd',
  'vielfältig': 'verschieden, breit',
  'facettenreich': 'vielseitig',
  'eintauchen': 'ansehen, untersuchen',
  'beleuchten': 'erklären, zeigen',
  'robust': 'stabil, zuverlässig',
  'zukunftsweisend': 'benennen, was es leistet',
  'wegweisend': 'wichtig',
  'meilenstein': 'Schritt, Ereignis benennen',
  'wendepunkt': 'Veränderung benennen',
  'synergie': 'das Zusammenspiel beschreiben',
  'synergien': 'das Zusammenspiel beschreiben',
  'herausragend': 'benennen, was es auszeichnet',
};
const TIER1_PHRASES = [
  { pattern: /\btauchen\s+wir\s+(?:tief\s+)?ein\b/gi, replace: 'sehen wir uns an' },
  { pattern: /\bes\s+lohnt\s+sich\b/gi, replace: 'sagen, warum es zählt' },
  { pattern: /\bauf\s+ein\s+neues\s+(?:level|niveau)\s+(?:heben|bringen)\b/gi, replace: 'verbessern' },
  { pattern: /\bin\s+der\s+welt\s+der\b/gi, replace: 'im Bereich (oder konkret benennen)' },
  { pattern: /\bdie\s+zukunft\s+sieht\s+rosig\s+aus\b/gi, replace: 'konkret oder streichen' },
  { pattern: /\bnur\s+die\s+zeit\s+wird\s+(?:es\s+)?zeigen\b/gi, replace: 'konkret oder streichen' },
];
const TIER2 = {
  'optimieren': 'vereinfachen, beschleunigen',
  'navigieren': 'bewältigen, umgehen',
  'fördern': 'unterstützen, aufbauen',
  'stärken': 'verbessern',
  'ermöglichen': 'erlauben, lassen',
  'transformativ': 'beschreiben, was sich änderte',
  'transformation': 'beschreiben, was sich änderte',
  'ökosystem': 'System, Netzwerk, Markt',
  'vielzahl': 'viele (oder Zahl nennen)',
  'fülle': 'viele, viel',
  'eckpfeiler': 'Grundlage, Kernstück',
  'massgeblich': 'wichtig, zentral',
  'aufkeimend': 'wachsend, jung',
  'entscheidend': 'wichtig, nötig',
  'umfassend': 'vollständig, gründlich',
  'revolutionieren': 'verändern',
  'katalysieren': 'auslösen, beschleunigen',
  'neugestalten': 'überdenken, umbauen',
};
const TIER3 = [
  'bedeutend', 'innovativ', 'effektiv', 'dynamisch', 'skalierbar',
  'überzeugend', 'beispiellos', 'aussergewöhnlich', 'bemerkenswert',
  'ausgeklügelt', 'hochmodern',
];
const TIER3_PHRASES = [
  /\bdie\s+integration\s+von\b/gi,
  /\bdie\s+schnittstelle\s+von\b/gi,
  /\bcommunity-?getrieben\b/gi,
  /\blangfristige\s+nachhaltigkeit\b/gi,
  /\bnutzer-?engagement\b/gi,
  /\bdezentrale\s+rechenleistung\b/gi,
  /\bnachhaltige\s+token-?ausschüttungen?\b/gi,
  /\btokenisierte\s+anreizstrukturen?\b/gi,
];
```
(Hinweis: `TIER1`/`TIER2` Keys kleingeschrieben — der Tokenizer lowercased. Substantive wie „Synergie" → Token „synergie".)

- [ ] **Step 4: Test passes ausführen**

Run: `node detector/patterns.test.js`
Expected: PASS (beide neuen Tests grün).

- [ ] **Step 5: Commit**

```bash
git add detector/patterns.js detector/patterns.test.js
git commit -m "feat(detector): deutsche Vokabel-Tiers"
```

---

## Task 4: Detector — Phrasen-Regex-Arrays (Mechanik unverändert)

Alle einfachen Regex-Arrays auf Deutsch aus Task 1: `TRANSITIONS`, `CHATBOT_ARTIFACTS`, `SYCOPHANTIC`, `FILLERS`, `GENERIC_CONCLUSIONS`, `LETS_PATTERNS`, `REASONING_ARTIFACTS`, `ACKNOWLEDGMENT_LOOPS`, `SIGNIFICANCE_INFLATION`, `VAGUE_ATTRIBUTIONS`, `HOLLOW_INTENSIFIERS`, `EMOTIONAL_FLATLINE`, `NOVELTY_INFLATION`, `CUTOFF_DISCLAIMERS`, `TEMPLATE_PHRASES`, `FALSE_CONCESSION`, `RHETORICAL_QUESTIONS`, `HEDGE_STACK`, `FUTURE_NARRATIVE`, `REAL_ACTUAL_INFLATION`, `FORMULAIC_OPENERS`, `PARENTHETICAL_HEDGE`, `CONFIDENCE_CALIBRATION`, `AI_PLACEHOLDERS`. `AI_CITATION_MARKUP` und `AI_UTM_SOURCE` bleiben (sprach-neutral).

**Files:**
- Modify: `detector/patterns.js`
- Test: `detector/patterns.test.js`

- [ ] **Step 1: Failing Tests (ein TP + ein Must-not-fire je kritischer Kategorie)**

```js
test('flaggt deutschen Chatbot-Artefakt', () => {
  const r = AIDetector.analyzeText('Gerne! Ich hoffe, das hilft dir weiter. Zögere nicht, dich bei Fragen jederzeit wieder bei mir zu melden.');
  assert.ok(r.issues.some((i) => i.type === 'chatbot'));
});
test('flaggt deutschen Cutoff-Disclaimer', () => {
  const r = AIDetector.analyzeText('Als KI-Sprachmodell habe ich keinen Zugriff auf Echtzeitdaten und kann dir den aktuellen Kurs daher leider nicht nennen.');
  assert.ok(r.issues.some((i) => i.type === 'cutoff-disclaimer'));
});
test('flaggt deutsche Vage-Attribution', () => {
  const r = AIDetector.analyzeText('Experten glauben, dass der Markt wächst. Studien zeigen einen klaren Trend nach oben in den nächsten Jahren.');
  assert.ok(r.issues.some((i) => i.type === 'vague-attribution'));
});
test('normaler Bericht löst Chatbot/Cutoff NICHT aus', () => {
  const r = AIDetector.analyzeText('Der Verwaltungsrat hat das Budget für 2027 gestern genehmigt. Die Investitionen fliessen vor allem in die Produktion in Winterthur.');
  assert.ok(!r.issues.some((i) => ['chatbot','cutoff-disclaimer','vague-attribution'].includes(i.type)));
});
```

- [ ] **Step 2: Tests fails ausführen** — Run: `node detector/patterns.test.js` → FAIL.

- [ ] **Step 3: Arrays ersetzen** (Beispiele; vollständige Listen aus `de-tells.md`)

```js
const TRANSITIONS = [
  /\bdarüber\s+hinaus\b/gi, /\bdes\s+weiteren\b/gi, /\bzudem\b/gi, /\bferner\b/gi,
  /\büberdies\b/gi, /\babschliessend\b/gi, /\bzusammenfassend\b/gi, /\bletztendlich\b/gi,
  /\bin\s+der\s+heutigen\b/gi, /\bin\s+einer\s+zeit,?\s+in\s+der\b/gi,
];
const CHATBOT_ARTIFACTS = [
  /\bgerne!\b/gi, /\bnatürlich!\b/gi, /\bich\s+hoffe,?\s+das\s+hilft\b/gi,
  /\bzögere\s+nicht\b/gi, /\bmelde\s+dich\s+gern\b/gi, /\blass\s+es\s+mich\s+wissen\b/gi,
  /\bin\s+diesem\s+artikel\s+werden\s+wir\b/gi,
];
const CUTOFF_DISCLAIMERS = [
  /\bals\s+ki-?sprachmodell\b/gi, /\bals\s+künstliche\s+intelligenz\b/gi,
  /\bstand\s+meines\s+letzten\s+updates\b/gi, /\bmein\s+wissensstand\s+reicht\s+bis\b/gi,
  /\bich\s+habe\s+keinen\s+zugriff\s+auf\s+echtzeitdaten\b/gi,
  /\bbasierend\s+auf\s+den\s+verfügbaren\s+informationen\b/gi,
];
const AI_PLACEHOLDERS = [
  /\[(?:Ihr|Dein|Euer)\s+[^\]\n]{1,40}\]/gi,
  /\[(?:Name|Quelle|Firmenname|Empfänger|Absender|Betreff|Thema|Datum|Abteilung|Position)(?:\s+[^\]\n]{0,40})?\]/gi,
  /\[(?:EINFÜGEN|EINTRAGEN|AUSFÜLLEN|HINZUFÜGEN|TODO|PLATZHALTER)[^\]\n]{0,80}\]/g,
  /\bTT\.MM\.(?:JJJJ|JJ)\b/g,
];
// ... übrige Arrays analog aus de-tells.md; AI_CITATION_MARKUP & AI_UTM_SOURCE unverändert.
```

- [ ] **Step 4: Tests passes ausführen** — Run: `node detector/patterns.test.js` → PASS.

- [ ] **Step 5: Commit** — `git commit -am "feat(detector): deutsche Phrasen-Muster"`

---

## Task 5: Detector — Redesigns (em-dash, smart-punct, bullet-np, Funktionswörter)

**Files:**
- Modify: `detector/patterns.js`
- Test: `detector/patterns.test.js`

- [ ] **Step 1: Failing Tests**

```js
test('flaggt englischen Geviertstrich — als Tell', () => {
  const r = AIDetector.analyzeText('Das Produkt ist gut — wirklich gut — und schnell. Es liefert — ohne Frage — beste Resultate für das ganze Team und alle Kunden.');
  assert.ok(r.issues.some((i) => i.type === 'em-dash'));
});
test('korrekter deutscher Gedankenstrich – wird NICHT geflaggt', () => {
  const lang = 'Der Bericht – er liegt seit gestern vor – fasst alles zusammen. '.repeat(3) + 'Die Zahlen stammen aus dem internen System und wurden vom Controlling geprüft und freigegeben.';
  const r = AIDetector.analyzeText(lang);
  assert.ok(!r.issues.some((i) => i.type === 'em-dash'));
});
test('Bullet-NP-Liste deutsch erkannt', () => {
  const r = AIDetector.analyzeText('Vorteile:\n- Stabile Leistung\n- Zuverlässige Verbindung\n- Optimierte Geschwindigkeit\n- Geringe Fehlerquote\n- Effiziente Nutzung\n- Konstante Qualität');
  assert.ok(r.issues.some((i) => i.type === 'bullet-np-list'));
});
test('deutsche Stichwortliste mit Verben wird NICHT als Bullet-NP geflaggt', () => {
  const r = AIDetector.analyzeText('Changelog:\n- behebt den Absturz beim Start\n- entfernt die alte API\n- ergänzt die Doku um Beispiele\n- aktualisiert die Abhängigkeiten\n- korrigiert einen Tippfehler');
  assert.ok(!r.issues.some((i) => i.type === 'bullet-np-list'));
});
```

- [ ] **Step 2: Tests fails ausführen** — Run: `node detector/patterns.test.js` → FAIL.

- [ ] **Step 3: em-dash umdrehen**

```js
// Deutsch: — (U+2014, Geviertstrich) ist untypisch → das eigentliche Tell.
// – (U+2013, Halbgeviertstrich, gespacet) ist der korrekte Gedankenstrich → nachsichtig.
const emDashCount = (text.match(/—|(?<=\s)--(?=\s|$)/gm) || []).length;
const emDashRate = emDashCount / (wordCount / 1000);
if (emDashRate > 1) {
  issues.push({ type: 'em-dash', text: `${emDashCount} Geviertstriche (—) in ${wordCount} Wörtern`,
    severity: 'medium', suggestion: 'Im Deutschen den Halbgeviertstrich – mit Leerzeichen, ein Komma oder einen Punkt verwenden.' });
}
```

- [ ] **Step 4: smart-punct-signature für Deutsch (Oxford-Komma raus)**

```js
{
  const hasCurly = /[„“”«»]/.test(text);
  const hasEmDash = /—/.test(text);            // englischer Geviertstrich
  const doubleSpaces = (text.match(/[^.!?]  +/g) || []).length;
  // Deutsche Elisionen ohne Apostroph als „Mensch-Tippfehler"-Signal:
  const missingApos = /\b(?:gibts|gehts|wars|machts|kommts|habs|aufs| ins )\b/i.test(text);
  const clean = doubleSpaces === 0 && !missingApos;
  const signals = [hasCurly, hasEmDash, clean].filter(Boolean).length;
  if (hasEmDash && signals >= 3 && wordCount >= 80) {
    issues.push({ type: 'smart-punct-signature',
      text: 'Geviertstrich + Schreib-Anführungszeichen + fehlerfreies Tippen',
      severity: 'high',
      suggestion: 'Signatur passt zu aus einem LLM kopiertem Text; der englische Geviertstrich — ist im Deutschen untypisch.' });
  }
}
```
(Der Carve-out im Highlight/Score bleibt; `« »`/`„ "` lösen für sich allein nichts aus.)

- [ ] **Step 5: bullet-np Verb-Regex deutsch**

```js
const verbRe = /\b(?:ist|sind|war|waren|wird|werden|wurde|wurden|hat|haben|hatte|hatten|kann|können|muss|müssen|soll|sollen|darf|wäre|sei|gibt|behebt|entfernt|ergänzt|korrigiert|aktualisiert|fügt|löst)\b/i;
```

- [ ] **Step 6: Funktionswort-Liste deutsch (`fnword-trigram-entropy`)**

```js
const FUNC_WORDS = new Set([
  'der','die','das','den','dem','des','ein','eine','einen','einem','einer','eines',
  'und','oder','aber','doch','sondern','denn','sowie','sowohl',
  'in','im','an','am','auf','aus','bei','mit','nach','seit','von','vom','vor','zu','zur','zum','über','unter','durch','für','gegen','ohne','um','bis',
  'ist','sind','war','waren','sein','bin','bist','wird','werden','wurde','worden','hat','haben','hatte','kann','könnte','muss','soll','will','wäre',
  'ich','du','er','sie','es','wir','ihr','man','sich','mich','dich','ihm','ihn',
  'nicht','kein','keine','auch','noch','schon','nur','so','wenn','dann','als','wie','dass','weil','damit','ob','wo','was','wer','welche','welcher',
  'dieser','diese','dieses','hier','dort','da','sehr','mehr','am',
]);
```

- [ ] **Step 7: Tests passes ausführen** — Run: `node detector/patterns.test.js` → PASS (alle 4 grün).

- [ ] **Step 8: Commit** — `git commit -am "feat(detector): em-dash/smart-punct/bullet-np/Funktionswörter auf Deutsch"`

---

## Task 6: Detector — `title-case-header` entfernen, `nominalstil` ergänzen

Netto bleiben es 43 `type`s. `TITLE_CASE_HEADER`-Block, das `if (contextMode !== 'technical')`-Filter, der `title-case-header`-Eintrag in `ISSUE_WEIGHTS`, `TYPE_LABELS` und der Highlight-Filter werden entfernt. `nominalstil` kommt neu hinzu.

**Files:**
- Modify: `detector/patterns.js`
- Test: `detector/patterns.test.js`

- [ ] **Step 1: Failing Tests**

```js
test('Title-Case-Header existiert nicht mehr', () => {
  assert.ok(!('title-case-header' in AIDetector.TYPE_LABELS), 'type entfernt');
});
test('flaggt Funktionsverbgefüge (Nominalstil)', () => {
  const r = AIDetector.analyzeText('Wir stellen Ihnen die Daten zur Verfügung und nehmen Ihr Feedback in Anspruch, damit die Durchführung der Migration reibungslos zum Einsatz kommt.');
  assert.ok(r.issues.some((i) => i.type === 'nominalstil'));
});
test('normaler Verbalstil löst Nominalstil NICHT aus', () => {
  const r = AIDetector.analyzeText('Wir geben Ihnen die Daten und hören auf Ihr Feedback, damit die Migration reibungslos läuft.');
  assert.ok(!r.issues.some((i) => i.type === 'nominalstil'));
});
```

- [ ] **Step 2: Tests fails ausführen** — Run: `node detector/patterns.test.js` → FAIL.

- [ ] **Step 3: Title-Case entfernen** — `TITLE_CASE_HEADER`-Konstante, den Block unter `if (contextMode !== 'technical')` (Title-Case-Teil), `'title-case-header': 4` aus `ISSUE_WEIGHTS`, den Key aus `TYPE_LABELS` löschen.

- [ ] **Step 4: Nominalstil ergänzen**

```js
const NOMINALSTIL = [
  /\bzur\s+verfügung\s+(?:stellen|gestellt|stehen|steht)\b/gi,
  /\bin\s+anspruch\s+(?:nehmen|genommen)\b/gi,
  /\bzum\s+einsatz\s+(?:kommen|kommt|gebracht)\b/gi,
  /\bzur\s+anwendung\s+(?:kommen|kommt|bringen)\b/gi,
  /\bunter\s+beweis\s+(?:stellen|gestellt)\b/gi,
  /\bdurchführung\s+(?:von|der|des)\b/gi,
];
// im ISSUE_WEIGHTS: 'nominalstil': 3,
// in der Pattern-Sektion: issues.push(...matchPatterns(text, NOMINALSTIL, 'nominalstil', 'medium'));
// in TYPE_LABELS: 'nominalstil': 'Nominalstil',
```

- [ ] **Step 5: Tests passes ausführen** — Run: `node detector/patterns.test.js` → PASS.

- [ ] **Step 6: Commit** — `git commit -am "feat(detector): title-case raus, nominalstil rein"`

---

## Task 7: Detector — Restmeldungen, Stylometrie-Kommentare, Roleplay-Verben

**Files:**
- Modify: `detector/patterns.js`

- [ ] **Step 1:** Alle deutschsprachigen `suggestion`/`text`-Strings der verbliebenen Meldungen übersetzen (uniformity, formatting, low-ttr, punct-distribution, cross-para-burstiness, normalization-flag, hashtag-stuff, tier3, tier3-phrase(-cluster), em-dash). Datei-Kopfkommentar deutsch.
- [ ] **Step 2:** Roleplay-Verben um deutsche Formen ergänzen: `nickt|seufzt|lacht|lächelt|zuckt|grinst|flüstert|denkt|überlegt`.
- [ ] **Step 3:** Stylometrie-Schwellen (TTR 0.4, CV 0.25/0.08, Entropie 0.82) als **dokumentierte Heuristik mit Kalibrierungs-Vorbehalt** kommentieren (englisch kalibriert; deutsche Flexion/Komposita verschieben die Verteilung; konservativ halten).
- [ ] **Step 4: Verifizieren** — Run: `! grep -n 'ß' detector/patterns.js && node detector/patterns.test.js` → kein ß, Tests grün.
- [ ] **Step 5: Commit** — `git commit -am "feat(detector): Meldungen deutsch + Stylometrie-Vorbehalt dokumentiert"`

---

## Task 8: `categories.test.js` + `detector/CATEGORIES.md`

Der Vertrag prüft `TYPE_LABELS` ↔ `CATEGORIES.md` (jeder Typ dokumentiert, jeder dokumentierte Typ real).

**Files:**
- Modify: `detector/CATEGORIES.md` (vollständig, deutsch)
- Modify: `detector/categories.test.js` (nur falls Typliste/Texte referenziert)

- [ ] **Step 1:** `CATEGORIES.md` deutsch neu: §A Direktes Mapping (Zeile `title-case-header` raus, `nominalstil` rein, SKILL-Abschnittsnamen deutsch), §B Detector-only (Stylometrie), §C Skill-only (inkl. **Passivlastigkeit**, Synonym-Wechsel, Kopula-Vermeidung usw.). Title-Case explizit als „im Deutschen entfallen" vermerken.
- [ ] **Step 2: Vertrag ausführen** — Run: `node detector/categories.test.js`
  Expected: PASS (alle Typen inkl. `nominalstil` dokumentiert; `title-case-header` nicht mehr referenziert).
- [ ] **Step 3:** Falls FAIL: in `categories.test.js` die hartkodierte Typliste/Texte anpassen, erneut ausführen → PASS.
- [ ] **Step 4: Commit** — `git commit -am "docs(detector): CATEGORIES.md deutsch + Vertrag grün"`

---

## Task 9: Detector-Doku + package.json

**Files:**
- Modify: `detector/README.md`, `package.json`

- [ ] **Step 1:** `detector/README.md` deutsch (Felder-Tabelle, `analyzeText`-API, Design-Notizen FN-Bias). Label-Werte (`Clean`/`Minimal AI signals`/…) entweder deutsch übersetzen **und** in `getLabel()` (Task 7) synchron halten — Entscheidung: Labels deutsch (`Sauber`, `Minimale KI-Signale`, `Einige KI-Muster`, `Moderate KI-Signale`, `Starke KI-Signale`, `Viele KI-Muster`); falls hier geändert, in Task 7 `getLabel()` + zugehörige Fixtures nachziehen.
- [ ] **Step 2:** `package.json`: `description` deutsch, `version` → `4.0.0`. `name` bleibt `avoid-ai-writing-detector`.
- [ ] **Step 3: Verifizieren** — Run: `node -e "require('./detector/patterns.js')" && python3 -m json.tool package.json > /dev/null` → kein Fehler.
- [ ] **Step 4: Commit** — `git commit -am "docs(detector): README deutsch + package.json 4.0.0"`

> **Hinweis Labels:** Wenn deutsche Labels gewählt werden, muss `getLabel()` in `patterns.js` (Task 7) dieselben Strings liefern und die Fixtures in `patterns.test.js`, die auf `r.label` prüfen, angepasst werden. Diese Querabhängigkeit beim Review bewusst prüfen.

---

## Task 10: README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Vollständig deutsch: Pitch, drei Modi, Quick-Demo (deutsches Vorher/Nachher in Schweizer Schreibweise), „Warum ein Skill", Install (Pfade gleich; alle `conorbronsdon/avoid-ai-writing`-URLs → `gardenbaum/avoid-ai-writing`), Muster-Referenztabellen (deutsche Beispiele), „Detector ausführen", Credits (Upstream erhalten + Port-Hinweis), Multilingual/Community, Disclaimer, License.
- [ ] **Step 2: Pattern-Count herleiten** (nicht raten)

Run: `awk '/^## Was zu entfernen oder zu korrigieren ist/{i=1;next} /^## /{i=0} i&&/^### /{if($0~/\(Struktur-Test\)/)next; if($0~/\(Inhalts-Test\)/)next; if($0~/^### Wann komplett neu schreiben/)next; n++} END{print n+0}' SKILL.md`
Diese Zahl in das README-Bullet **`**NN Muster-Kategorien**`** schreiben (exakt diese Schreibweise, Guard in Task 12 hängt daran). Engine-`type`-Zahl bleibt 43; in der Notiz erwähnen.

- [ ] **Step 3: Verifizieren** — `! grep -n 'ß' README.md && grep -n 'Muster-Kategorien' README.md`.
- [ ] **Step 4: Commit** — `git commit -am "docs: README.md deutsch portiert"`

---

## Task 11: CHANGELOG, CONTRIBUTING, PR-Template, CLAUDE.md, Cursor-Rule

**Files:**
- Modify: `CHANGELOG.md`, `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `CLAUDE.md`, `cursor-rules/avoid-ai-writing.mdc`, `cursor-rules/README.md`

- [ ] **Step 1: CHANGELOG.md** — bestehende Einträge auf Deutsch + neuer Top-Eintrag:

```markdown
## [4.0.0] — 2026-06-02 — Deutsche/Schweizer Portierung

### Geändert
- Gesamtes Repository auf Deutsch in Schweizer Schreibweise (kein ß) umgestellt.
  Vokabular und Muster aus recherchierten deutschen LLM-Tells statt Übersetzung.
- Detector: `em-dash` umgekehrt (— ist das Tell, – ist korrekt), `smart-punct-signature`
  ohne Oxford-Komma neu, `bullet-np`/Funktionswörter/`nominalstil` deutsch,
  `title-case-header` entfernt (Substantiv-Grossschreibung im Deutschen).
- Stylometrie-Schwellen als Heuristik mit Kalibrierungs-Vorbehalt dokumentiert.
- Upstream-Skill von Conor Bronsdon (MIT) — Portierung für `gardenbaum/avoid-ai-writing`.
```

- [ ] **Step 2: CONTRIBUTING.md + PR-Template** deutsch (Checklisten-Items übersetzen).
- [ ] **Step 3: CLAUDE.md** deutsch **und faktisch korrigiert**: nicht „single file/no tests", sondern Detector-Engine + Tests + CI + Plugin + Cursor-Rule beschreiben; die ss-Regel und die deutschen Konventionen als verbindliche Projekt-Guidance aufnehmen.
- [ ] **Step 4: cursor-rules/`.mdc`** — Body aus der **neuen** `SKILL.md` spiegeln; `.mdc`-Frontmatter (`description` deutsch inkl. Version v4.0.0, `globs` unverändert). `cursor-rules/README.md` deutsch.
- [ ] **Step 5: Verifizieren** — `! grep -rn 'ß' CHANGELOG.md CONTRIBUTING.md CLAUDE.md cursor-rules/ .github/PULL_REQUEST_TEMPLATE.md`.
- [ ] **Step 6: Commit** — `git commit -am "docs: CHANGELOG/CONTRIBUTING/CLAUDE/Cursor deutsch"`

---

## Task 12: Plugin/Marketplace + Skripte (Guards)

**Files:**
- Modify: `.claude-plugin/marketplace.json`, `plugins/avoid-ai-writing/.claude-plugin/plugin.json`, `scripts/check-pattern-count.sh`, `scripts/sync-plugin-skill.sh`

- [ ] **Step 1: JSON-Manifeste** — `description` deutsch, `keywords` deutsch/passend, `plugin.json` `version` → `4.0.0`. JSON gültig halten.
- [ ] **Step 2: `check-pattern-count.sh`** — awk-Anker auf deutsche Titel: Start `^## Was zu entfernen oder zu korrigieren ist`; Ausschlüsse `\(Struktur-Test\)`, `\(Inhalts-Test\)`, `^### Wann komplett neu schreiben`. README-Regex auf `**\([0-9][0-9]*\) Muster-Kategorien**`. Fehlermeldungen deutsch.
- [ ] **Step 3: `sync-plugin-skill.sh`** — Logik bleibt (liest `version:`, kopiert SKILL.md); nur `echo`-Texte deutsch. Dann ausführen, um die Plugin-Kopie zu regenerieren.

Run: `bash scripts/sync-plugin-skill.sh`
Expected: `synced: plugin skill + version (4.0.0)`

- [ ] **Step 4: Count-Guard ausführen**

Run: `bash scripts/check-pattern-count.sh`
Expected: `pattern count in sync: NN` (NN = Zahl aus Task 10 Step 2).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "build: Plugin/Marketplace deutsch + Guards angepasst + Kopie synchron"`

---

## Task 13: Gesamt-Verifikation & Abschluss

**Files:** keine (nur Prüfungen)

- [ ] **Step 1: Tests + Guards grün**

Run: `npm test && bash scripts/check-pattern-count.sh && bash scripts/sync-plugin-skill.sh`
Expected: alle PASS; keine Git-Diffs durch den Sync.

- [ ] **Step 2: Kein ß im ganzen Repo**

Run: `git grep -n 'ß' -- ':!docs/superpowers/specs' ':!docs/superpowers/plans'`
Expected: leer (Spec/Plan dürfen historisch ß enthalten — sie sind in Schweizer Schreibweise verfasst, daher ebenfalls leer; falls Treffer, korrigieren).

- [ ] **Step 3: Kein englischer Fliesstext (Stichprobe)**

Run: `git grep -nwiE '(the|and|with|your|using|leverage|robust)' -- 'README.md' 'SKILL.md' 'CHANGELOG.md' 'CONTRIBUTING.md' | grep -viE 'utm_source|cite|http|json|README|CHANGELOG|MIT|agentskills|openclaw|claude' | head`
Expected: nur erklärte Eigennamen/Tokens, kein deutscher Prosatext mit Resten.

- [ ] **Step 4: End-to-End-Selbstaudit** — Das portierte Skill (mental/als Detector) auf die neue `README.md` anwenden: `node -e "const D=require('./detector/patterns.js');const fs=require('fs');const r=D.analyzeText(fs.readFileSync('README.md','utf8').slice(0,8000));console.log(r.score,r.label,r.issues.length)"` → plausibel niedrige Score-Werte; auffällige Treffer prüfen und ggf. Prosa glätten.

- [ ] **Step 5: Plugin-Kopie identisch** — Run: `diff SKILL.md plugins/avoid-ai-writing/skills/avoid-ai-writing/SKILL.md` → keine Ausgabe.

- [ ] **Step 6: Finishing** — Mit `superpowers:finishing-a-development-branch` Merge/PR-Optionen anbieten. PR-Body deutsch, verweist auf Spec + diesen Plan.

---

## Self-Review (Plan ↔ Spec)

- **Spec-Abdeckung:** §3 Konventionen → Konventionsblock + Tasks 2–12. §4 SKILL.md → Task 2 (+ Task 1 Vokabular). §5 Detector inkl. 3 Redesigns + Streichung + Neu-Regel → Tasks 3–8. §5.1 Stylometrie-Vorbehalt → Task 7 Step 3. §5.2 Tests → in jeder Detector-Task + Task 13. §6 Doku → Tasks 9–11. §7 Skripte/Guards → Task 12. §8 Build-Reihenfolge → Task-Nummerierung. §9 DoD → Task 13. §10 Risiken → Task 1 (Verifikation), Task 7 (Schwellen), Task 9-Hinweis (Label-Querabhängigkeit).
- **Platzhalter:** keine „TBD/TODO"; Pattern-Count wird hergeleitet (Task 10/12), nicht geraten.
- **Typ-Konsistenz:** `nominalstil` durchgängig (Tasks 1/6/8); `title-case-header` durchgängig entfernt (Tasks 6/8); Maschinen-Tokens unverändert; Label-Querabhängigkeit explizit markiert (Task 9).
