# Detector-Engine

`patterns.js` ist der ausfuehrbare Ausdruck der Regeln dieses Skills – eine
abhaengigkeitsfreie Detektor-Engine ohne Build-Schritt, die Text auf
KI-Schreibmuster bewertet. Sie laeuft identisch in Node (`>=18`) und im Browser.

Die `SKILL.md` ist der menschenlesbare Katalog der Regeln; diese Engine ist die
deterministische, testbare Umsetzung der regex-erfassbaren Teilmenge, ergaenzt
um stylometrische Detektoren und KI-Werkzeug-Fingerabdruecke, die als Prosa
keinen Sinn ergeben. Die Datei [`CATEGORIES.md`](./CATEGORIES.md) haelt das
Mapping Regel ↔ Kategorie fest, das beide synchron haelt.

## Ausfuehren

```bash
npm test          # fuehrt detector/patterns.test.js aus (keine Dependencies)
# oder direkt:
node detector/patterns.test.js
```

```js
const AIDetector = require("./detector/patterns.js");
const result = AIDetector.analyzeText("Dein Text hier …");
console.log(result.score, result.label, result.issues.length);
```

Im Browser laedst du `patterns.js` als gewoehnliches Script – es registriert
sich selbst als globales `AIDetector` (der `module.exports`-Block ist abgesichert
und laeuft nur unter CommonJS).

## `analyzeText(text, options?)` → result

| Feld | Typ | Bedeutung |
|---|---|---|
| `score` | `0–100` | 0 = sauber, 100 = stark KI-gepraegt |
| `label` | string | `Sauber` / `Minimale KI-Signale` / `Einige KI-Muster` / `Moderate KI-Signale` / `Starke KI-Signale` / `Viele KI-Muster` (oder `Leer` / `Zu kurz` / `Text zu lang`) |
| `issues[]` | `{type, text, severity, …}` | ein Eintrag pro erkanntem Muster; die `type`-Schluessel verweisen auf [`CATEGORIES.md`](./CATEGORIES.md) |
| `stats` | object | `wordCount`, Zaehler je Tier, `contextMode`, `denseAIVocab`, Normalisierungs-Flags usw. |
| `document_classification` | string | trinaer `HUMAN_ONLY` / `MIXED` / `AI_ONLY` (Form an GPTZero angelehnt, fuer einfaches Austauschen) |
| `class_probabilities` | `{human, mixed, ai}` | summiert sich exakt zu 1.0 |
| `confidence_category` | `low` / `medium` / `high` | |
| `highlight_sentence_for_ai` | region[] | Satz-Spannen mit Byte-Offsets und Score je Region, fuer UI-Hervorhebung |

### Score-Labels

Die `label`-Werte folgen festen Schwellen (`getLabel` in `patterns.js`):

| Score | Label |
|---|---|
| 0 | `Sauber` |
| bis 15 | `Minimale KI-Signale` |
| bis 35 | `Einige KI-Muster` |
| bis 60 | `Moderate KI-Signale` |
| bis 80 | `Starke KI-Signale` |
| darueber | `Viele KI-Muster` |

Sonderfaelle ausserhalb der Score-Skala: leerer Text → `Leer`; zu kurzer Text
(unter ~10 Woertern, nicht bewertbar) → `Zu kurz`; zu langer Text (ueber
10'000 Woerter) → `Text zu lang`.

`options.contextMode` akzeptiert `general` (Default) oder `technical` (sowie
`marketing` / `personal`). In der deutschen Portierung gibt es keine
Title-Case-Sonderbehandlung mehr – Substantiv-Grossschreibung macht „Title Case"
im Deutschen zu keinem Tell –, daher laeuft in allen Modi der volle Regelsatz.
Der Modus bleibt als API-Token erhalten und wird in `stats.contextMode`
ausgewiesen. Ungueltige Modi fallen auf `general` zurueck und setzen
`stats.contextModeFallback`.

## Design-Notizen

- **FN-Bias.** Falsch-Positive schaden dem Vertrauen mehr als Falsch-Negative,
  deshalb ist `MIXED` breit angelegt und `AI_ONLY` verlangt mehrere sich
  bestaetigende Signale. Im Zweifel lieber nicht flaggen.
- **Lokal-korrekte Typografie wird nie geflaggt.** Die deutschen
  Anfuehrungszeichen (`„ "` `‚ '`) und die Guillemets (`« »` `‹ ›`) gelten als
  korrekt. Das Tell beim Gedankenstrich ist der Geviertstrich `—` (U+2014); der
  gespacete Halbgeviertstrich `–` (U+2013) ist korrektes Deutsch und nachsichtig.
- **Scoring ist nicht-linear.** Wiederholte Treffer derselben Phrase werden
  dedupliziert; die Kategoriegewichte stehen in der Tabelle `ISSUE_WEIGHTS`.
- **Stylometrie-Schwellen sind eine Heuristik mit Kalibrierungs-Vorbehalt.** Die
  Werte (TTR, Variationskoeffizient, Trigramm-Entropie) wurden urspruenglich an
  englischem Text kalibriert; deutsche Flexion und Komposita verschieben die
  Verteilung, daher sind die Schwellen bewusst konservativ gehalten.
- **Laengen-Gates.** Unter ~10 Woertern → `Zu kurz` (nicht bewertbar); ueber
  10'000 Woertern → `Text zu lang`.
