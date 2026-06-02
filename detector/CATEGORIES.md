# Kategorien-Map: SKILL.md ↔ Detector

Diese Tabelle ist der Anti-Drift-Vertrag zwischen den menschenlesbaren Regeln in
`../SKILL.md` und der ausführbaren Engine in `patterns.js`. Wenn du dem Skill eine
Regel hinzufügst, entscheide hier, ob sie per Regex erkennbar ist (dann bekommt sie
einen Detector-`type`) oder ob sie ein LLM-Urteil bleibt (dann markiere sie als
solches). Wenn du einen Detector-`type` hinzufügst, verweise von hier zurück auf den
SKILL-Abschnitt, den er durchsetzt.

Die Engine stellt 43 Issue-`type`s bereit (siehe `TYPE_LABELS` in `patterns.js`). Das
Skill hat mehr `###`-Abschnitte als das — die Lücke ist **keine** fehlende Abdeckung,
sondern Regeln, die Ermessensentscheidungen sind, die ein Regex nicht treffen kann.
Die drei Gruppen unten erfassen jeden Eintrag auf beiden Seiten.

Drei Zahlen existieren bewusst nebeneinander und sollen nicht erzwungen gleichgesetzt
werden: die **Muster-Kategorien-Zahl** des README (der menschenseitige Prosa-Katalog,
aus SKILL.md abgeleitet und in der CI bewacht), die **43 `type`s** der Engine (die die
Vokabel-Tiers aufsplitten und stylometrische Signale ergänzen) und die `###`-Abschnitte
von SKILL.md (die auch schreiberseitige Tests ohne erkennbare Form enthalten). Der
Check in `categories.test.js` erzwingt nur das Mapping Engine ↔ diese Datei.

## A. Direktes Mapping (Skill-Regel → Detector-`type`)

| Detector-`type` | Label | SKILL.md-Abschnitt |
|---|---|---|
| `tier1` / `tier2` / `tier3` | KI-Vokabular / Wort-Cluster / Überstrapaziertes Wort | Wörter und Wendungen zum Ersetzen |
| `transition` | KI-Übergang | Übergangsphrasen entfernen oder umschreiben |
| `template-phrase` | Template-Phrase | Template-Phrasen (vermeiden) |
| `tier3-phrase` / `tier3-phrase-cluster` | Boilerplate-Floskel / Boilerplate-Cluster | Template-Phrasen (vermeiden) |
| `chatbot` | Chatbot-Artefakt | Chatbot-Artefakte |
| `sycophantic` | Schmeichelhafter Ton | Schmeichlerischer Ton |
| `acknowledgment-loop` | Quittungs-Schleife | Bestätigungs-Schleifen |
| `filler` | Füll-Floskel | Füllphrasen |
| `hollow-intensifier` | Hohler Verstärker | Füllphrasen (Verstärker) |
| `generic-conclusion` | Generischer Schluss | Generische Schlüsse |
| `future-narrative` | Generisches Zukunfts-Narrativ | Generische Zukunfts-Schlüsse |
| `lets-construction` | „Lassen Sie uns"-Eröffnung | „Lass uns"-Konstruktionen |
| `reasoning-artifact` | Reasoning-Artefakt | Reasoning-Ketten-Artefakte |
| `significance-inflation` | Bedeutungs-Inflation | Bedeutungs-Aufblähung |
| `novelty-inflation` | Neuheits-Inflation | Neuheits-Aufblähung |
| `real-actual-inflation` | „Echt/tatsächlich"-Inflation | „Echt/tatsächlich"-Adjektiv-Aufblähung |
| `vague-attribution` | Vage Attribution | Vage Quellenangaben |
| `emotional-flatline` | Emotionale Flachheit | Emotionale Flachheit / Oberflächliche Partizip-Analysen |
| `cutoff-disclaimer` | Cutoff-Disclaimer | Cutoff-Disclaimer |
| `false-concession` | Schein-Zugeständnis | Falsche Zugeständnis-Struktur |
| `rhetorical-question` | Rhetorische Frage | Rhetorische Frage-Einstiege |
| `formulaic-opener` | Formelhafte Eröffnung | Schablonenhafte Herausforderungen |
| `confidence-calibration` | Gewissheits-Stapelung | Sicherheits-Kalibrierungs-Phrasen |
| `hedge-stack` | Hedge-gestapelte Aussage | Gestapelte Absicherungen in Prognosen |
| `parenthetical-hedge` | Parenthetischer Hedge | Parenthetisches Absichern |
| `hashtag-stuff` | Hashtag-Überladung | Hashtag-Stopfen |
| `bullet-np-list` | Nominalphrasen-Aufzählung | Aufzählungslisten aus blossen Nominalphrasen |
| `nominalstil` | Nominalstil | Nominalstil und Funktionsverbgefüge |
| `em-dash` / `formatting` | Geviertstrich-Übermass / Formatierung | Formatierung |
| `uniformity` | Rhythmus-Gleichförmigkeit | Rhythmus und Gleichförmigkeit |
| `low-ttr` | Geringe Vokabularvielfalt | Wortschatz-Vielfalt (stylometrisch) |
| `ai-placeholder` | Nicht ausgefüllter Platzhalter | Nicht ausgefüllte Platzhalter |
| `ai-citation-markup` | Durchgesickertes Chatbot-Zitat-Markup | Chatbot-Zitations-Markup-Lecks |
| `ai-utm-source` | KI-Werkzeug-URL-Parameter | KI-Tool-URL-Parameter |
| `smart-punct-signature` | Zeichensetzungs-Signatur | Formatierung (Geviertstrich-Signatur) — *partiell* |

> **Title-Case entfällt im Deutschen.** Der frühere `type` `title-case-header`
> (Title Case headings) wurde mit der Portierung gestrichen: Deutsche Substantive
> werden grundsätzlich grossgeschrieben, deshalb ist eine durchgehende Grossschreibung
> von Inhaltswörtern in Überschriften kein KI-Signal, sondern reguläre Orthografie.
> Eine Title-Case-Regel würde im Deutschen nur Fehlalarme erzeugen und hat daher
> weder im Skill noch in der Engine eine Entsprechung.

> **Partielles Mapping:** `smart-punct-signature` feuert nur, wenn der englische
> Geviertstrich (—, U+2014) mit Schreib-Anführungszeichen und fehlerfreiem Tippen
> (≥80 Wörter) zusammenfällt — nie auf Zeichensetzung allein. Die lokal korrekten
> deutschen Anführungszeichen (`„ "`, `‚ '`) und die Guillemets (`« »`, `‹ ›`) sowie
> der korrekte Halbgeviertstrich (–, U+2013, mit Leerzeichen) gelten als
> lokal-korrekt und lösen für sich allein nichts aus. Die Formatierungs-Regel in
> SKILL.md behandelt den Geviertstrich als das eigentliche Tell und die
> Zeichensetzung sonst als schwaches, nur bestätigendes Signal. Beide stimmen im
> Geist überein (Zeichensetzung ist nie für sich allein beweisend), unterscheiden
> sich aber im Mechanismus — daher partielles Mapping, nicht 1:1.

## B. Detector-only (stylometrisch / Fingerabdruck — keine Skill-Prosa)

Diese erweitern das Skill um Signale, die als Rechnung über das ganze Dokument
funktionieren, nicht als Wendung, die eine redigierende Person nachschlagen würde:

| Detector-`type` | Label | Warum nur in der Engine |
|---|---|---|
| `punct-distribution` | Zeichensetzungs-Verteilung | Gleichförmigkeit der Zeichensetzung je Absatz |
| `fnword-trigram-entropy` | Grammatik-Wiederholung | Entropie der Funktionswort-Trigramme |
| `cross-para-burstiness` | Rhythmus über Absätze | Varianz der Satzlänge über Absätze hinweg |
| `normalization-flag` | Umgehungs-Zeichen | Erkennung von Zero-Width-/Homoglyph-Zeichen zur Humanizer-Umgehung |

> **Kalibrierungs-Vorbehalt:** Die stylometrischen Schwellen (TTR, Variationskoeffizient,
> Trigramm-Entropie) sind auf englischem Text kalibriert. Deutsche Flexion und Komposita
> verschieben die Verteilungen; die Schwellen sind daher bewusst konservativ gehalten und
> dokumentierte Heuristik, kein hartes Urteil. Siehe die Kommentare in `patterns.js`.

## C. Skill-only (LLM-Urteil — kein Detector-`type`)

Regeln, die Verständnis des Sinns erfordern, leben in der Skill-Prosa und werden vom
Modell angewandt, nicht von der Regex-Engine. Hier gelistet, damit künftige
Mitwirkende ihr Fehlen nicht für eine Abdeckungslücke halten:

- Satzstruktur
- Passivlastigkeit
- Synonym-Wechsel
- Kopula-Vermeidung
- Werbesprache
- Prominenz-Namedropping
- Strukturelle Probleme / Übermässige Struktur / Inline-Header-Listen / Nummerierte-Listen-Aufblähung
- Falsche Spannweiten
- Spekulatives Lückenfüllen
- Infomercial-Engagement-Köder
- Selbst-Etikettierung von Bedeutung
- Wann komplett neu schreiben statt flicken
- Severity-Tiers (P0 / P1 / P2)
- Self-Reference-Escape-Hatch
- Output-Format

> **Partiell:** Die **Context-Profile / Toleranzmatrix / Auto-Detection-Cues** des
> Skills werden teilweise durch `options.contextMode` der Engine (`general` /
> `technical`) realisiert, das kontext-unpassende Flags unterdrückt. Die volle
> profilbasierte Toleranz bleibt ein LLM-seitiges Urteil.
