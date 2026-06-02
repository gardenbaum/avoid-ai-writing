# Design-Spec: Deutsche/Schweizer Portierung von `avoid-ai-writing`

**Datum:** 2026-06-02
**Status:** Entwurf zur Review
**Ziel-Repo:** `gardenbaum/avoid-ai-writing`

---

## 1. Kontext & Ziel

`avoid-ai-writing` ist ein mehrteiliges Produkt, das Texte auf KI-Schreibmuster
(„AI-isms") prüft und umschreibt. Es besteht heute aus:

- `SKILL.md` (~639 Zeilen) — der menschenlesbare Regelkatalog (Single Source of Truth):
  Vokabular-Tiers, ~47 Muster-Kategorien, Context- und Voice-Profile, Output-Format.
- `detector/patterns.js` (~1623 Zeilen) — deterministische JS-Engine: Regex-Muster,
  Vokabular-Tiers, Stylometrie (Funktionswort-Listen, Type-Token-Ratio, Oxford-Komma-
  Signatur, Title-Case-Erkennung, Em-Dash-Regeln), AI-Tool-Fingerprints.
- `detector/patterns.test.js` (~714 Zeilen Fixtures), `detector/categories.test.js`,
  `detector/CATEGORIES.md` (Anti-Drift-Vertrag SKILL.md ↔ Engine).
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
- `cursor-rules/avoid-ai-writing.mdc` (+ README) — Cursor-Port, ~Klon von SKILL.md.
- `plugins/avoid-ai-writing/skills/avoid-ai-writing/SKILL.md` — auto-synchronisierte
  Kopie; `plugins/.../.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`.
- `scripts/check-pattern-count.sh`, `scripts/sync-plugin-skill.sh`,
  `.github/workflows/{detector-test,plugin-skill-sync}.yml`, `CLAUDE.md`, `package.json`.

**Ziel:** Das gesamte Repository so portieren, dass es auf **Deutsch in Schweizer
Schreibweise** zugeschnitten ist statt auf Englisch. Es wird ein **reines
Deutsch-/Schweiz-Tool** — Englisch wird ersetzt, nicht parallel geführt.

**Kernerkenntnis:** KI-Schreib-Tells sind **sprachspezifisch**. Deutsche LLM-Ausgaben
haben eigene Tells. Mehrere englisch-kalibrierte Detector-Regeln gelten im Deutschen
gar nicht (Substantiv-Grossschreibung bricht „Title Case"; das Oxford-Komma ist kein
deutsches Konstrukt; der Gedankenstrich `–` ist korrekte, übliche deutsche
Zeichensetzung statt eines Tells). Darum: **recherchierter Neuaufbau der Inhalte,
keine Übersetzung.**

---

## 2. Entscheidungen (verbindlich)

| # | Entscheidung | Wahl |
|---|---|---|
| 1 | Sprachstrategie | **Komplett ersetzen** — reines Deutsch-/Schweiz-Repo |
| 2 | Herleitung der Muster | **Deutsch recherchiert** — echte deutsche LLM-Tells, keine 1:1-Übersetzung |
| 3 | Umfang | **Alles inkl. Detector-Engine** — `patterns.js`, Tests, CI |
| 4 | Schweizer Norm | **Nur Eszett → ss** — sonst deutsche Standard-Orthografie |

**Defaults für offene Punkte** (beim Review kippbar):

- **Anführungszeichen-Carve-out:** `„ "` **und** `« »` (Guillemets, schweizerisch) —
  ein Carve-out *erlaubt* nur, flaggt nie fälschlich, darum risikolos permissiv.
- **Skill-Name:** technischer `name: avoid-ai-writing` und alle Verzeichnispfade
  **bleiben** (stabile Install-Pfade, Marketplace). Maschinen-Tokens bleiben.
- **Deutsche Zusatzregeln:** Nominalstil/Funktionsverbgefüge und Passivlastigkeit
  **werden aufgenommen**.
- **CHANGELOG:** Historie **wird übersetzt** + neuer Top-Eintrag `4.0.0`.

---

## 3. Konventionen & Identität (Fundament)

### 3.1 Orthografie (Schweizer Schreibweise)

- **Kein Eszett. Durchgängig `ss`** — in Prosa, Vokabeltabellen, Beispielen, **Code-
  Kommentaren und Test-Fixtures**. Beispiele: muss, dass, Strasse, grösser, heisst,
  weiss, ausserdem, abschliessend, gemäss, Schluss.
- Sonst deutsche Standard-Orthografie (Duden), kein weiterer Helvetismus-Zwang.

### 3.2 Zeichensetzung

- **Anführungszeichen-Carve-out im Detector:** `„ "` (U+201E/U+201C) und `‚ '`
  (U+201A/U+2018) sowie `« »` / `‹ ›` (Guillemets) gelten als lokal-korrekt und
  werden **nicht** geflaggt.
- **Gedankenstrich:** `–` (U+2013, Halbgeviertstrich, mit Leerzeichen) ist korrekt
  und wird nachsichtig behandelt. `—` (U+2014, Geviertstrich) ist im Deutschen
  untypisch → eigentliches Paste-aus-englischem-LLM-Tell (siehe §5, `em-dash`).

### 3.3 Identität & Versionierung

- `name: avoid-ai-writing` bleibt (stabiler Identifier). Verzeichnispfade bleiben.
- Deutsch werden: `description`, Titel, alle Trigger-Phrasen, sämtliche Inhalte.
- **Maschinen-Tokens bleiben** stabil (Code/Tests/API): `--mode rewrite|detect|edit`,
  `contextMode general|technical`, Voice-Keys (`casual|professional|technical|warm|
  blunt`), Context-Keys (`linkedin|blog|technical-blog|investor-email|docs|casual`).
  Deutsche Aliasse werden in der Prosa dokumentiert.
- **Version → 4.0.0** (Sprache = Breaking Change) synchron in SKILL.md-Frontmatter,
  `plugin.json` und `package.json` (steht aktuell inkonsistent auf 3.4.0).
- **Attribution:** Upstream-Credit (Conor Bronsdon, MIT) bleibt erhalten
  (Lizenzpflicht); Hinweis auf die deutsche/schweizer Portierung kommt dazu.
  Install-/Repo-URLs zeigen auf `gardenbaum/avoid-ai-writing`.

---

## 4. SKILL.md — Source of Truth (Phase 2)

Reihenfolge zuerst, weil Detector und Doku sie spiegeln.

### 4.1 Vokabeltabellen (Tier 1/2/3)

Komplett neu aus recherchierten deutschen LLM-Floskeln, jeder Eintrag mit konkretem,
schlichterem Ersatz (kein „umformulieren"). Kandidaten (Recherche bestätigt/erweitert
sie in der Umsetzung):

- **Tier 1 (immer flaggen):** nahtlos, mühelos, ganzheitlich, bahnbrechend,
  revolutionär, vielfältig, eintauchen / „tauchen wir ein", beleuchten, Wendepunkt,
  Meilenstein, „im Bereich/in der Welt der", „es lohnt sich", facettenreich, robust,
  „auf ein neues Level heben", „in der heutigen schnelllebigen Welt", Zeugnis (für).
- **Tier 2 (im Cluster):** nutzen/„zunutze machen", navigieren, fördern, stärken,
  ermöglichen, optimieren, transformativ, Ökosystem, Vielzahl, Fülle, Eckpfeiler,
  von grösster Bedeutung, aufkeimend, entscheidend.
- **Tier 3 (nur bei Dichte):** bedeutend, innovativ, effektiv, dynamisch, skalierbar,
  überzeugend, beispiellos, aussergewöhnlich, bemerkenswert, ausgeklügelt.
- **Tier-3-Phrasen (Boilerplate):** „die Integration von", „die Schnittstelle von",
  „community-getrieben", „langfristige Nachhaltigkeit", „Nutzer-Engagement" usw.

### 4.2 Kategorien-Disposition

Pro Kategorie: **Äquivalent** / **Redesign** / **Streichen** / **Neu (deutsch)** —
Detailtabelle in §5 (gilt für SKILL.md-Prosa und Detector gemeinsam). Deutsche
**Zusatzregeln**:

- **Nominalstil / Funktionsverbgefüge:** „zur Verfügung stellen" → „geben", „in
  Anspruch nehmen" → „nutzen", „Durchführung von", `-ung`-Häufung.
- **Passivlastigkeit:** „es wird … durchgeführt/ermöglicht" — Häufung als Tell.

### 4.3 Profile, Severity, Output

- **Context-Profile:** Keys bleiben; Beschreibungen + Toleranzmatrix auf Deutsch.
- **Voice-Profile:** Keys bleiben; Zielwerte sprachgerecht. Starker deutscher Hebel:
  „Aktiv statt Passiv/Nominalstil".
- **Severity-Tiers (P0–P2), Self-Reference-Escape-Hatch, Auto-Detection-Cues,
  Output-Format, Ton-Kalibrierung:** vollständig deutsch.

---

## 5. Detector-Engine (Phase 3)

Mechanik, Scoring-Modell und Math bleiben; Inhalte werden deutsch. Disposition je
Detector-`type`:

| `type` | Disposition | Hinweis |
|---|---|---|
| tier1 / tier2 / tier3 / tier3-phrase(-cluster) | Äquivalent | deutsche Listen (§4.1) |
| transition | Äquivalent | „Darüber hinaus", „Des Weiteren", „Zudem", „Abschliessend" |
| chatbot | Äquivalent | „Gerne!", „Natürlich!", „Ich hoffe, das hilft", „Zögere nicht" |
| sycophantic | Äquivalent | „Grossartige Frage!", „Du hast völlig recht" |
| filler | Äquivalent | „Es ist wichtig zu beachten, dass", „Im Hinblick auf" |
| generic-conclusion | Äquivalent | „Die Zukunft ist vielversprechend", „Nur die Zeit wird zeigen" |
| lets-construction | Äquivalent | „Lassen Sie uns", „Tauchen wir ein", „Werfen wir einen Blick" |
| reasoning-artifact | Äquivalent | „Schritt für Schritt", „Lass uns das aufschlüsseln" |
| acknowledgment-loop | Äquivalent | „Du fragst nach", „Um deine Frage zu beantworten" |
| significance-inflation | Äquivalent | „markiert einen Wendepunkt", „ein Meilenstein für" |
| vague-attribution | Äquivalent | „Experten glauben", „Studien zeigen", „Forschung legt nahe" |
| hollow-intensifier | Äquivalent | „wirklich", „ehrlich gesagt", „in der Tat" |
| emotional-flatline | Äquivalent | „Was mich am meisten überrascht hat", „Faszinierend war" |
| novelty-inflation | Äquivalent | „ein Begriff, den niemand nennt" |
| cutoff-disclaimer | Äquivalent | „Als KI-Sprachmodell", „Stand meines letzten Updates" |
| template-phrase | Äquivalent | „ein [Adj] Schritt in Richtung", „Ob Sie nun X oder Y sind" |
| false-concession | Äquivalent | „Zwar ist X beeindruckend, doch Y bleibt …" |
| rhetorical-question | Äquivalent | „Aber was bedeutet das für …?", „Warum sollte dich das interessieren?" |
| hedge-stack | Äquivalent | „könnte möglicherweise", „dürfte letztlich", „mag eventuell" |
| future-narrative | Äquivalent | „könnte zu einem der wichtigsten Narrative … werden" |
| real-actual-inflation | Äquivalent | „echte Tokenomics", „tatsächlicher Nutzen" |
| formulaic-opener | Äquivalent | „In der heutigen schnelllebigen Welt", „hat sich als führend etabliert" |
| confidence-calibration | Äquivalent | „Interessanterweise", „Bemerkenswerterweise", „Zweifellos" |
| parenthetical-hedge | Äquivalent | „(und zunehmend auch X)", „(genauer gesagt, Y)" |
| ai-placeholder | Äquivalent | `[Ihr Name]`, `[QUELLE EINFÜGEN]`, `[Firmenname]`, `TT.MM.JJJJ` |
| hashtag-stuff | Sprach-neutral | unverändert |
| formatting (Bold/Emoji) | Sprach-neutral | unverändert |
| ai-citation-markup | Sprach-neutral | `citeturn0search0` etc. unverändert |
| ai-utm-source | Sprach-neutral | `utm_source=chatgpt.com` etc. unverändert |
| punct-distribution | Sprach-neutral | Math; Schwelle als Heuristik (§5.1) |
| cross-para-burstiness | Sprach-neutral | Math; Schwelle als Heuristik (§5.1) |
| uniformity | Sprach-neutral | Math; Schwelle als Heuristik (§5.1) |
| normalization-flag | Sprach-neutral+ | Roleplay-Verben um „nickt/seufzt/lacht/lächelt" ergänzt |
| **em-dash** | **Redesign** | `—` (U+2014) ist das Tell; `–` (U+2013, gespacet) ist korrekt → nachsichtig |
| **smart-punct-signature** | **Redesign** | Oxford-Komma raus; Signatur aus `—` + `„ "` + fehlerfreiem Tippmuster (keine fehlenden Apostrophe in „gibt's/geht's") |
| **bullet-np-list** | **Redesign** | Verb-/Hilfsverb-Regex deutsch (ist/sind/war/hat/haben/wird/werden/kann/…) |
| **fnword-trigram-entropy** | **Redesign** | deutsche Funktionswortliste (der/die/das/und/oder/aber/in/auf/mit/von/zu/ist/…) |
| low-ttr | Heuristik-Vorbehalt | §5.1 |
| **title-case-header** | **Streichen** | Deutsch schreibt alle Substantive gross → kein Tell; in CATEGORIES.md als entfallen dokumentiert |
| **(neu) nominalstil** | **Neu (deutsch)** | Funktionsverbgefüge/-ung-Häufung (Regex + Judgment-Anteil) |

**Hinweis Title-Case:** Streichung wird **nicht** durch ein erzwungenes Analogon
ersetzt, sondern durch die deutschen Zusatzregeln (nominalstil/Passiv) kompensiert.

### 5.1 Stylometrie-Ehrlichkeit (Risiko/Annahme)

TTR-Schwelle (0.4), CV-Schwellen (0.25/0.08) und Entropie-Schwelle (0.82) sind auf
**englischen** Korpora kalibriert. Deutsche Flexion und Komposita verschieben diese
Verteilungen (Flexion senkt TTR, Komposita erhöhen die Type-Zahl). Ohne deutschen
Referenzkorpus werden die Schwellen als **dokumentierte Heuristik mit
Kalibrierungs-Vorbehalt** übernommen (Code-Kommentar + `CATEGORIES.md`), nicht durch
erfundene deutsche Zahlen ersetzt. Konservativ halten (FN-Bias bleibt). Passt zum
Repo-Ethos „precision over recall / cite your sources".

### 5.2 Tests

- Alle Fixtures in `patterns.test.js` mit deutschen **True-Positive- und
  Must-not-fire**-Beispielen neu (Schweizer Schreibweise).
- `categories.test.js`-Vertrag bleibt strukturell; Typliste aktualisiert
  (`title-case-header` raus, `nominalstil` rein), `TYPE_LABELS` ↔ `CATEGORIES.md`
  müssen exakt zueinander passen.

---

## 6. Doku, Integrationen & CI (Phase 4)

- **README.md:** komplett deutsch — Pitch, Install (Pfade gleich, URLs → gardenbaum),
  Muster-Referenztabellen, Vorher/Nachher-Beispiele deutsch/schweizerisch, Credits
  erhalten + Port-Hinweis, „**NN pattern categories**"-Bullet an neue SKILL.md
  angepasst (siehe §7, Pattern-Count-Guard).
- **CHANGELOG.md:** Historie auf Deutsch + neuer Top-Eintrag
  `## [4.0.0] — 2026-06-02 — Deutsche/Schweizer Portierung`.
- **CONTRIBUTING.md, PULL_REQUEST_TEMPLATE.md, CLAUDE.md:** deutsch. CLAUDE.md
  zugleich faktisch korrigiert (beschreibt aktuell fälschlich „single file, no tests";
  Detector/Tests/Plugin/Cursor existieren).
- **cursor-rules/`.mdc` + README:** deutsch, aus SKILL.md gespiegelt; `.mdc`-Frontmatter
  (`description`, `globs`) deutsch/angepasst.
- **plugin.json / marketplace.json:** deutsche Beschreibungen/Keywords; Version 4.0.0.

---

## 7. Skripte & Guards

- **`scripts/check-pattern-count.sh`:** awk-Anker auf die **deutschen** Abschnittstitel
  umstellen (statt „## What to remove or fix" der neue deutsche Titel; statt
  „(structure test)/(content test)/When to rewrite from scratch" die deutschen
  Pendants). README-Regex `**NN pattern categories**` → deutsches Pendant; Skript und
  README-Bullet konsistent halten.
- **`scripts/sync-plugin-skill.sh`:** liest `version:` aus Frontmatter (sprach-neutral);
  nur prüfen, dass Pfade/Logik weiter stimmen. Plugin-Kopie aus SKILL.md regenerieren.
- **`.github/workflows/*.yml`:** pfadbasiert → bleiben unverändert; nur sicherstellen,
  dass die deutschen Inhalte die Checks weiter bestehen.

---

## 8. Build-Reihenfolge

1. **Konventionen/Glossar fixieren** (dieses Dokument als Referenz; deutsches
   Tell-Glossar je Kategorie).
2. **SKILL.md** neu aufbauen (Source of Truth).
3. **Detector** (`patterns.js`) + `CATEGORIES.md` + Tests an SKILL.md spiegeln.
4. **Doku/Integrationen/CI** (README, CHANGELOG, CONTRIBUTING, PR-Template, CLAUDE.md,
   Cursor-Rule, Plugin/Marketplace, Skripte).
5. **Verifikation** (§9).

Umsetzung unter *ultracode* mit **Workflow-Orchestrierung**: parallele Agents für
Vokabel-Recherche, Detector-Regeln und Test-Fixtures, mit **adversarischer
Verifikation** der recherchierten deutschen Tells (jede behauptete Floskel muss als
echtes LLM-Tell bestätigt und gegen False-Positives auf normalem Menschentext geprüft
werden).

---

## 9. Definition of Done / Verifikation

- [ ] `npm test` grün (Fixtures + `categories.test.js`-Vertrag).
- [ ] `bash scripts/check-pattern-count.sh` grün (deutsche Anker, Count stimmt).
- [ ] `bash scripts/sync-plugin-skill.sh` grün (Plugin-Kopie + Version synchron).
- [ ] **Kein Eszett** im gesamten Repo (`grep -rnP '\x{00DF}'` → leer).
- [ ] Kein verbliebener englischer Fliesstext in den portierten Dateien (Stichprobe +
      gezielte Greps auf typische englische Funktionswörter in Prosa).
- [ ] `name`, Pfade, Maschinen-Tokens unverändert; Version überall `4.0.0`.
- [ ] Upstream-MIT-Attribution erhalten; Repo-URLs → gardenbaum.
- [ ] End-to-End-Selbstaudit: das portierte Skill auf die neue README anwenden — sie
      soll sauber durchlaufen.

---

## 10. Risiken & Annahmen

- **Stylometrie-Schwellen** sind englisch-kalibriert (§5.1) — als Heuristik mit
  dokumentiertem Vorbehalt übernommen, nicht empirisch deutsch neu kalibriert
  (kein Korpus vorhanden).
- **Vokabel-Recherche** ist die qualitätskritische Aktivität — adversarisch
  verifizieren, FN-Bias halten, Carve-outs für Fachsprache/ESL/Schweizer Eigenheiten.
- **Konsistenz SKILL.md ↔ Detector ↔ CATEGORIES.md** muss erhalten bleiben; der
  `categories.test.js`-Vertrag erzwingt das maschinell.
- **Em-Dash-Umkehrung** (`—` als Tell, `–` legitim) ist eine bewusste deutsch-
  typografische Entscheidung (Duden) und weicht von der englischen Logik ab.
