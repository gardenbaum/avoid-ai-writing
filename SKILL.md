---
name: avoid-ai-writing
description: Prüft Texte auf KI-Schreibmuster („KI-Floskeln") und schreibt sie um. Nutze dieses Skill bei „entferne KI-Floskeln", „KI-Stil bereinigen", „auf KI-Muster prüfen", „klingt das nach KI?" oder „mach das menschlicher". Unterstützt einen Nur-Prüfen-Modus, einen In-Place-Bearbeiten-Modus für Dateien, ein optionales Voice-Profil (casual / professional / technical / warm / blunt) und einen Iterieren-bis-stabil-Durchlauf.
version: 4.0.0
license: MIT
compatibility: Jeder KI-Coding-Assistent, der das agentskills.io-SKILL.md-Format unterstützt (Claude Code, Cursor, VS Code Copilot, Hermes Agent, OpenHands usw.) oder OpenClaw. Keine externen Tools oder APIs nötig.
metadata:
  author: Conor Bronsdon
  tags: writing editing voice quality
  agentskills_spec: "1.0"
  openclaw:
    emoji: "✍️"
---

# Avoid AI Writing — Prüfen & Umschreiben

Du bearbeitest Texte, um KI-Schreibmuster („KI-Floskeln") zu entfernen, die einen Text maschinengeneriert wirken lassen.

## Was dieses Skill ist und was nicht

Das ist ein **Werkzeug für die Schreibqualität**, kein Urteil. Die hier markierten Muster kommen in LLM-Ausgaben statistisch häufiger vor, aber auch Menschen im Autopiloten — besonders unter Zeitdruck, in unvertrauten Textsorten oder in einer Zweitsprache — erzeugen dieselben Formen. Unabhängige Prüfungen kommerzieller KI-Detektoren fanden Falsch-Positiv-Raten über 60 % bei Nicht-Muttersprachlern (Liang et al., Stanford, *Patterns* 2023) und Fehlklassifikationsraten über 70 % bei Open-Source-Detektoren (Jabarian & Imas, BFI Working Paper 2025-116, 2025). Adversarische Paraphrase senkt die Erkennungsgenauigkeit über alle getesteten Methoden um etwa 88 % (arXiv:2506.07001, 2025).

Die Muster taugen als Signal — sowohl zum Aufräumen des eigenen Texts als auch zur Einschätzung, ob ein Text wie KI-generiert wirkt. Mach sie nur nicht zur alleinigen Grundlage einer folgenreichen Entscheidung (akademische Integrität, Einstellung, Veröffentlichung, Urheberschaft). Mehrere Regeln hier schlagen auch bei Zweitsprach-Texten, bei Menschen unter Zeitdruck und bei Fachtextsorten an, die ihren Wortschatz bewusst verdichten. Verbinde das Signal mit dem Kontext: Wer hat geschrieben, welche Textsorte, wie sieht die übliche Stimme der schreibenden Person aus, welche weiteren Belege gibt es.

Kurz: Signale, kein Beweis. Wert, etwas darauf zu geben; nicht den Wert, jemandem den Tag zu ruinieren.

## Modi

Dieses Skill arbeitet in einem von drei Modi:

**`rewrite`** (Standard) — KI-Floskeln markieren und den Text korrigierend umschreiben.

**`detect`** — Nur KI-Floskeln markieren. Kein Umschreiben. Nutze diesen Modus, wenn:
- Die schreibende Person sehen will, was markiert wird, und selbst entscheidet, was sie ändert
- Die markierten Muster bewusst gesetzt sein könnten (KI-Muster sind nicht immer schlecht — in kleinen Dosen können sie wirken)
- Du Text prüfst, den du nicht verändern willst (veröffentlichte Inhalte, fremder Text, Referenzmaterial)
- Du einen schnellen Scan willst, ohne auf ein vollständiges Umschreiben zu warten

**`edit`** — Eine Datei direkt bearbeiten, statt umgeschriebenen Text zurückzugeben. Nutze das, wenn die schreibende Person dich auf eine Datei verweist („räum `draft.md` auf", „korrigiere die KI-Floskeln direkt in dieser Datei") und die Datei selbst geändert haben will, keine Kopie zum Zurückkopieren. Mach **minimale, gezielte Änderungen** mit dem Edit-Tool — ändere die markierten Stellen, nicht das ganze Dokument. **Lass Passagen unangetastet, die schon menschlich sind**: Hat ein Absatz keine Tells, rühr ihn nicht an. **Bearbeite keine Zitate, Code-Blöcke oder Text, der jemand anderem zugeschrieben ist** — markiere die, statt sie umzuschreiben. Bei einer grossen Datei klärst du zuerst, welcher Abschnitt bereinigt werden soll, bevor du etwas änderst. Nach dem Bearbeiten liest du die Datei erneut und bestätigst, dass die markierten Muster behoben sind.

Löse den detect-Modus aus, wenn die Person sagt „prüfen", „nur markieren", „nur auditieren", „nur flaggen", „scannen", „welche KI-Muster stecken da drin" oder Ähnliches. Löse den edit-Modus aus, wenn die Person eine Datei nennt und dich bittet, sie direkt zu korrigieren oder aufzuräumen. Ohne Angabe gilt der rewrite-Modus.

**Aufruf.** Natürliche Sprache genügt („schreib das in einem direkten Ton für LinkedIn um", „bearbeite `post.md` direkt", „scann das, schreib es nicht um"). Wer will, kann explizite Optionen übergeben, die zu den Abschnitten unten passen: `[--mode rewrite|detect|edit]`, `[--voice casual|professional|technical|warm|blunt]`, `[--context linkedin|blog|technical-blog|investor-email|docs|casual]`, `[--file PATH]`, `[--iterate N]` (max. 2).

**Iterieren bis stabil (optional).** Der rewrite-Modus läuft ohnehin einen korrigierenden zweiten Durchlauf (siehe Output-Format) — dieser eingebaute Durchlauf *ist* Durchlauf 2, `--iterate` stapelt sich also nicht darauf. Wenn die Person bittet zu „iterieren", „weiterzumachen, bis es sauber ist", oder `--iterate N` übergibt, wiederholst du den Zyklus Prüfen→Umschreiben, bis keine Muster mehr bleiben oder **N Durchläufe** erreicht sind. Begrenze **N auf 2**: ein Umschreiben plus ein korrigierender Durchlauf räumt die markierten Muster ab, ein dritter kostet eine volle Neugenerierung und findet selten mehr. Melde, wie viele Durchläufe es brauchte („stabil nach 2 Durchläufen").

---

Im **rewrite**-Modus ist deine Aufgabe:

1. **Prüfen**: jede vorhandene KI-Floskel finden, mit Zitat der konkreten Stelle
2. **Umschreiben**: eine saubere Fassung ohne KI-Floskeln zurückgeben
3. **Diff-Zusammenfassung zeigen**: kurz auflisten, was du geändert hast und warum

Im **detect**-Modus ist deine Aufgabe:

1. **Prüfen**: jede vorhandene KI-Floskel finden, mit Zitat der konkreten Stelle
2. **Einschätzen**: festhalten, welche Treffer klare Probleme sind und welche bewusst oder im Kontext wirksam sein könnten

Im **edit**-Modus ist deine Aufgabe:

1. **Lesen** der von der Person genannten Datei
2. **Direkt bearbeiten**: minimale, gezielte Korrekturen an den markierten Stellen mit dem Edit-Tool, schon menschliche Passagen unangetastet lassen
3. **Verifizieren**: die Datei erneut lesen und bestätigen, dass die markierten Muster behoben sind; melden, was du geändert hast

---

## Was zu entfernen oder zu korrigieren ist

### Formatierung
- **Geviertstriche (— und --)**: Der englische Geviertstrich (—, U+2014) ist im Deutschen untypisch und das eigentliche Paste-aus-LLM-Tell. Ersetze ihn durch Kommas, Punkte, Klammern oder einen korrekten Halbgeviertstrich mit Leerzeichen (–, U+2013). Zielwert: null Geviertstriche. Harte Obergrenze: einer pro 1'000 Wörter. Gilt auch für Überschriften und Titel, nicht nur für den Fliesstext. Fang sowohl den Unicode-Geviertstrich (—) als auch den Doppelbindestrich-Ersatz (--) ab. **Carve-out:** Der Halbgeviertstrich (–, mit Leerzeichen) ist korrekte deutsche Zeichensetzung und wird nicht geflaggt.
- **Fett-Überladung**: Streiche Fettdruck aus den meisten Wendungen. Höchstens eine fettgesetzte Wendung pro grösserem Abschnitt, oder keine. Ist etwas wichtig genug zum Fettsetzen, bau den Satz so um, dass er damit beginnt.
- **Emoji in Überschriften**: Ganz entfernen. Kein `## 🚀 Was das bedeutet`. Ausnahme: Social-Posts dürfen sparsam ein oder zwei Emoji verwenden — am Zeilenende, nie mitten im Satz.
- **Übermässige Aufzählungslisten**: Wandle aufzählungslastige Abschnitte in Fliesstext um. Aufzählungen nur für echt listenartigen Inhalt (Feature-Vergleiche, Schritt-für-Schritt-Anleitungen, API-Parameter).
- **Anführungszeichen**: Die deutschen Anführungszeichen („ " und ‚ ', U+201E/U+201C/U+201A/U+2018) und die Guillemets (« » und ‹ ›) gelten als lokal-korrekte Zeichensetzung und werden **nie** geflaggt. Geschwungene englische Anführungszeichen (" " ' ') sind höchstens ein *schwaches* Aus-dem-Chat-kopiert-Signal — relevant vor allem in Klartext-Kontexten wie Code-Kommentaren, Commit-Nachrichten oder Klartext-Entwürfen, wo nichts automatisch umsetzt. Behandle das als stützend, nie als schlüssig: Word, Google Docs, macOS und iOS setzen Anführungszeichen standardmässig um, also enthält auch viel menschliche Prosa sie. Geschwungene Apostrophe (') allein nicht flaggen. In Klartext/Code durch gerade Anführungszeichen ersetzen; in fertigen Publikationen und bei lokal-korrekter Zeichensetzung stehen lassen.

### Satzstruktur
- **„Es ist nicht X — es ist Y" / „Dabei geht es nicht um X, sondern um Y"**: Schreib es als direkte positive Aussage um. Höchstens eine pro Text, und nur wenn es dem Argument dient.
- **Hohle Verstärker**: Streiche `wirklich`, `echt` (wie in „eine echte Verbesserung"), `ehrlich gesagt`, `um ehrlich zu sein`, `seien wir ehrlich`, `es lohnt sich zu erwähnen`. Nenn einfach die Tatsache.
- **Vage Empfehlung („lohnt sich zu [Verb]")**: Streiche oder ersetze `lohnt sich zu lesen`, `verdient Beachtung`, `einen Blick wert`, `lohnt sich zu erkunden`, `lohnt sich anzuschauen`. Das setzt einen pauschalen Daumen-hoch an die Stelle eines konkreten Grundes. Sag stattdessen *warum* etwas zählt.
- **Absicherungen**: Streiche `vielleicht`, `könnte möglicherweise`, `es ist wichtig zu beachten, dass`, `um es klar zu sagen`. Bring den Punkt direkt.
- **Fehlende Brückensätze**: Jeder Absatz sollte an den vorigen anknüpfen. Liessen sich die Absätze umstellen, ohne dass es jemandem auffiele, fehlt das verbindende Gewebe.
- **Zwanghafte Dreierregel**: Variiere die Gruppierungen. Nimm zwei Punkte, vier Punkte oder einen ganzen Satz statt Dreiergruppen. Höchstens ein „Adjektiv, Adjektiv und Adjektiv"-Muster pro Text.

### Wörter und Wendungen zum Ersetzen

Die Wörter sind in drei Stufen geordnet, je nachdem, wie zuverlässig sie auf KI-generierten Text hinweisen. Dieser Stufen-Ansatz — angelehnt an die Vokabelrecherche von [brandonwise/humanizer](https://github.com/brandonwise/humanizer) — senkt Falsch-Positive bei Wörtern, die einzeln in Ordnung sind, aber im Cluster verdächtig.

- **Tier 1 — immer flaggen.** Diese Wörter erscheinen in KI-Text 5–20× häufiger als in menschlichem Text. Auf Sicht ersetzen.
- **Tier 2 — im Cluster flaggen.** Einzeln in Ordnung, aber zwei oder mehr im selben Absatz sind ein starkes KI-Signal. Flaggen, wenn sie zusammen auftreten.
- **Tier 3 — nach Dichte flaggen.** Gewöhnliche Wörter, die KI schlicht überbeansprucht. Nur flaggen, wenn sie einen merklichen Anteil des Texts ausmachen (ungefähr ab 3 % aller Wörter).

#### Tier 1 — immer ersetzen

| Ersetze | Durch |
|---|---|
| nahtlos | reibungslos, ohne Unterbruch, problemlos |
| mühelos | leicht, einfach, ohne Aufwand |
| ganzheitlich | umfassend benennen, was gemeint ist (oder streichen) |
| bahnbrechend | neu, das erste (oder sagen, was konkret zuvor unmöglich war) |
| revolutionär | verändernd (oder beschreiben, was sich ändert) |
| revolutionieren | verändern, umkrempeln (oder beschreiben, was sich ändert) |
| eintauchen (metaphorisch) | anschauen, untersuchen, durchgehen |
| beleuchten (metaphorisch) | erklären, zeigen, darstellen |
| wendepunkt | sagen, was sich konkret änderte (oder streichen) |
| meilenstein | konkretes Ergebnis nennen (Zahl, Datum, Lieferung) |
| facettenreich | die einzelnen Aspekte nennen (oder streichen) |
| robust | stabil, zuverlässig, belastbar |
| in der heutigen schnelllebigen welt | konkreten Kontext nennen oder direkt zur Sache (oft ganz streichen) |
| es lohnt sich, zu erwähnen | die Tatsache einfach hinschreiben |
| ein zeugnis für | zeigt, beweist, belegt |
| auf ein neues level heben | verbessern, ausbauen (oder sagen, was besser wird) |

#### Tier 2 — flaggen, wenn 2+ im selben Absatz auftreten

Diese Wörter sind einzeln berechtigt. Tauchen zwei oder mehr zusammen auf, braucht der Absatz wahrscheinlich ein Umschreiben.

| Ersetze | Durch |
|---|---|
| das volle potenzial ausschöpfen | konkret sagen, was man damit erreicht |
| navigieren (metaphorisch) | bewältigen, durchkommen, umgehen mit |
| optimieren | verbessern, beschleunigen, einfacher machen |
| transformativ | sagen, was sich ändert und wie |
| transformation | beschreiben, was sich änderte |
| ökosystem (metaphorisch) | System, Netzwerk, Umfeld, Markt |
| vielzahl | viele, mehrere (oder eine konkrete Zahl) |
| fülle | viel, reichlich (oder eine konkrete Menge) |
| eckpfeiler | Grundlage, Kern, wichtigster Teil |
| von grösster bedeutung | wichtig, zentral, entscheidend (oder sagen, wofür) |
| aufkeimend | neu, jung, im Entstehen (oder mit Zahl belegen) |
| fördern | unterstützen, aufbauen |
| stärken | verbessern |
| ermöglichen | erlauben, lassen |
| entscheidend | wichtig, nötig |
| umfassend | vollständig, gründlich |
| katalysieren | auslösen, beschleunigen |
| neugestalten | überdenken, umbauen |

#### Tier 3 — nur bei hoher Dichte flaggen

Das sind normale Wörter. Flagge sie nur, wenn der Text damit gesättigt ist — ein Zeichen, dass die KI Raum mit vagem Lob statt mit Konkretem gefüllt hat.

| Wort | Was tun |
|---|---|
| innovativ / innovation | Sagen, was konkret neu ist |
| bedeutend | Durch Konkretes ersetzen: Zahlen, Vergleiche, Beispiele |
| effektiv | Sagen wie, oder eine Kennzahl nennen |
| dynamisch / dynamik | Die konkreten Kräfte oder Veränderungen nennen |
| skalierbar / skalierbarkeit | Sagen, was wächst und bis wohin |
| überzeugend | Sagen, was genau überzeugt |
| beispiellos | Den Präzedenzfall nennen, der gebrochen wird (oder streichen) |
| aussergewöhnlich | Sagen, was die Ausnahme ausmacht |
| bemerkenswert | Sagen, was genau bemerkenswert ist |
| ausgeklügelt | Die konkrete Raffinesse beschreiben |
| hochmodern | Einen Massstab oder Vergleich nennen |

#### Tier-3-Phrasen — bei Dichte oder im Cluster flaggen

Mehrwort-Boilerplate, die einzeln unauffällig ist, sich aber in KI-generiertem Inhalt stapelt (Krypto, Web3, DePIN, KI-/Infra-Reviews sind die schlimmsten Fälle). Flagge bei **2+ Verwendungen derselben Phrase** (die Pro-Phrase-Regel — niedrigere Schwelle als beim einzelnen Tier-3-Wort, weil eine zweimal wiederholte Mehrwort-Übereinstimmung schon stärker belegt als ein erneutes „bedeutend"), *plus* eine **Cluster-Regel**: drei oder mehr *verschiedene* Phrasen aus dieser Tabelle in einem Text sind ein starkes Signal, selbst wenn jede Phrase nur einmal vorkommt — das ist die Form, die LLMs annehmen, wenn sie ihre eigene Boilerplate variieren, um weniger repetitiv zu wirken.

| Phrase | Was tun |
|---|---|
| die integration von (X mit Y) | Sagen, was zusammenkommt und was sich für den Nutzer ändert |
| die schnittstelle von (X und Y) | Die konkrete Überschneidung nennen, die zählt, oder den Rahmen streichen |
| community-getrieben | Sagen, was die Community konkret tut. „Community-getrieben" allein ist Füllsel |
| langfristige nachhaltigkeit | Zeithorizont und Bedingung nennen (bis wann, woraus finanziert) |
| nutzer-engagement | Die konkrete Handlung nennen (Klicks, Kommentare, Verweildauer) |
| dezentrale rechenleistung | Die Architektur angeben oder streichen. Die Phrase ist zum Kategorie-Etikett geworden, nicht zur Aussage |
| nachhaltige token-ausschüttungen | Den Ausschüttungsplan und die Senke nennen |
| tokenisierte anreizstrukturen | Den konkreten Mechanismus beschreiben (Vesting, Gauge, gebundene LP usw.) |

### Template-Phrasen (vermeiden)

Diese Schablonen-Konstruktionen verraten, dass ein Satz generiert, nicht geschrieben wurde. Hat eine Wendung eine Lücke, in die ein beliebiges Nomen oder Adjektiv passen würde, ohne dass sie anders klänge, ist sie zu generisch.

- „ein [Adjektiv] Schritt in Richtung [Adjektiv] KI-Infrastruktur" → die konkrete Fähigkeit, den Massstab oder das Ergebnis beschreiben
- „ein [Adjektiv] Schritt für [Nomen]" → gleiche Regel: sagen, was sich tatsächlich änderte
- „Ob Sie nun [X] oder [Y] sind" → Pseudo-Breite-Konstruktion. Wähle das Publikum, das du tatsächlich ansprichst, oder streiche. „Ob Sie nun Start-up-Gründerin oder Konzernarchitekt sind" sagt nichts — es heisst nur „alle".
- „Ich hatte kürzlich das Vergnügen, zu [Verb]" → Review-/Social-KI-Muster. Sag einfach, was passiert ist: „Letzte Woche war ich an der Konferenz X."

### Übergangsphrasen entfernen oder umschreiben
- „Darüber hinaus" / „Des Weiteren" / „Zudem" / „Ferner" / „Überdies" → so umstrukturieren, dass der Bezug offensichtlich ist, oder „und", „auch", „ausserdem" verwenden
- „In der heutigen [X]" / „In einer Zeit, in der" → streichen oder den konkreten Kontext nennen
- „Es ist erwähnenswert, dass" / „Wenn es um … geht" → einfach die Tatsache nennen / direkt über die Sache schreiben
- „Hier wird es interessant" / „Was mir auffiel" / „Was heraussticht" → Leser-Lenk-Rahmen. Lass den Inhalt seine eigene Bedeutung signalisieren. Brauchst du einen Einstieg, mach ihn konkret: „Die Umsatzzahl zählt, weil…" statt „Hier kommt der interessante Teil".
- „Zusammenfassend lässt sich sagen" / „Abschliessend lässt sich festhalten" → dein Fazit sollte ohnehin klar sein
- „Bei der Sache mit" / „Was … betrifft" → sprich einfach direkt über die Sache
- „Letztendlich" / „Am Ende des Tages" → streichen
- „Allerdings" / „Gleichwohl" / „Dennoch" → streichen oder „aber", „doch", „jedoch" verwenden. Keines davon überstrapazieren.

### Strukturelle Probleme
- **Gleichförmige Absatzlänge**: Variiere bewusst. Bau einige Ein- bis Zwei-Satz-Absätze und einige längere ein. Ist jeder Absatz ungefähr gleich gross, korrigier das.
- **Schablonenhafte Einstiege**: Öffnet der Text mit breitem Kontext, bevor er zum Punkt kommt („In der sich rasant verändernden Welt von…"), schreib ihn so um, dass er mit der Neuigkeit oder der Einsicht beginnt. Der Kontext kann danach kommen.
- **Verdächtig saubere Grammatik**: Schleif nicht jede Persönlichkeit weg. Bewusste Fragmente, Sätze, die mit „Und" oder „Aber" beginnen, Satzbrüche zur Wirkung: Wenn die natürliche Stimme sie nutzt, behalt sie.

### Bedeutungs-Aufblähung
- Wendungen wie „markiert einen Wendepunkt in der Entwicklung von…" oder „ein Meilenstein für die Branche" blähen Routineereignisse zu geschichtsträchtigen auf. Sag, was passiert ist, und lass den Leser die Bedeutung beurteilen.
- Funktioniert der Satz noch, nachdem du die Aufblähungs-Klausel gelöscht hast, lösch sie.

### Generische Zukunfts-Schlüsse
- „Es bleibt abzuwarten, wie sich das entwickelt", „könnte zum prägenden Trend des kommenden Jahrzehnts werden", „dürfte zum nächsten grossen Kapitel von [X] werden". KI greift auf diese Form zurück, wenn sie einen Schlussgedanken landen muss, ohne sich auf eine prüfbare Aussage festzulegen. Der Schluss ist grammatisch eine Prognose, enthält aber keinen testbaren Inhalt.
- Muster: Modal (könnte / dürfte / wird / mag) + „werden" + (eines von) der wichtigsten/bedeutendsten [Adjektiv] + (Narrative / Geschichte / Trend / Thema / Kapitel / Entwicklung).
- Fix: Wähle die falsifizierbare Variante. „DePIN-Rechenleistung könnte für massiv parallele Lasten bis 2027 günstiger sein als AWS-Spot-Preise" ist eine Prognose. „Die Schnittstelle von KI und DePIN könnte zu einem der wichtigsten Narrative des nächsten Marktzyklus werden" ist keine.

### Gestapelte Absicherungen in Prognosen
- Ein Modalverb mit einem Hedge-Adverb stapeln: „könnte möglicherweise", „dürfte letztlich", „mag eventuell". Jedes Wort allein ist akzeptabel; der Stapel ist das Tell. Jede Absicherung hebt die nächste auf und lässt einen Satz zurück, der nichts behauptet, aber vorsichtig und bedacht klingt.
- Fix: Wähle eines. Meinst du „könnte schaffen", sag das. Meinst du „schafft möglicherweise", sag das. Beides zusammen ist Füllsel.

### „Echt/tatsächlich"-Adjektiv-Aufblähung
- „echte On-Chain-Tokenomics", „tatsächliche Belohnungs-Nachhaltigkeit", „echter Nutzen", „wahre Produkt-Markt-Passung". `echt` / `tatsächlich` / `wahr` als leerer Verstärker vor einem abstrakten Nomen unterstellt, der Rest des Felds sei unecht oder oberflächlich — ohne zu benennen, was diesen Fall zum echten macht. Häufig in Krypto-/KI-/Web3-Texten, wo die schreibende Person Raffinesse signalisieren will.
- Unterscheidet sich von der „hohle Verstärker"-Regel (wirklich / ehrlich gesagt / seien wir ehrlich als Satz-Absicherungen). Das hier ist die Nomen-Modifikator-Form, bei der sich der Verstärker an ein abstraktes Nomen heftet, um einen ungesagten Kontrast zu erzeugen.
- **Carve-out — benannter Kontrast:** Nennt der Satz ausdrücklich, was die unechte/oberflächliche Variante ist, lass ihn stehen. „Echte On-Chain-Abwicklung, keine gebrückten Schuldscheine" oder „tatsächlicher Umsatz von zahlenden Kunden, keine Fördergelder" ist ehrliches Kontrast-Schreiben. Das KI-Tell ist der ungesagte Kontrast.
- Fix, wenn kein Kontrast benannt ist: Streiche das Adjektiv und ergänze die konkrete Aussage. „Belohnungs-Nachhaltigkeit" → „Belohnungen finanziert aus X CHF/Monat an Gebühren statt aus Ausschüttungen".

### Hashtag-Stopfen
- Lange Hashtag-Blöcke am Ende (6+ Hashtags auf einem einzelnen kurzen Post) sind in LLM-generiertem Social-Content nahezu universell und in durchdachten menschlichen Posts selten. Der Block mischt meist einen projektspezifischen Tag mit breiten Kategorie-Tags (#KI #Krypto #Web3 #Innovation #ZukunftTech #Technologie) — die kategorischen tun nichts für die Auffindbarkeit und lesen sich wie Bot-Ausgabe.
- **Warum 6?** Empirische Untergrenze. Organische Reichweite auf LinkedIn und X stagniert oder sinkt ab 3–5 Tags; menschliche Posts über 5 sind meist Launch-Posts, die Reichweite gegen Engagement tauschen, während LLM-generierte Posts standardmässig 10–15 setzen. Sechs ist die Schwelle, ab der Falsch-Positive bei legitimer menschlicher Nutzung unter die Falsch-Negative bei KI-Ausgabe sinken. Der Detector behandelt 6+ als harten Treffer; die Spec behandelt 5+ als weiches Tell, das auf `linkedin`- und `investor-email`-Profilen einen zweiten Blick wert ist.
- Fix: höchstens 2–3 konkrete Tags, oder keine. Hilft ein Hashtag dem Leser nicht, verwandte Arbeit zu finden, ist er Füllsel.

### Aufzählungslisten aus blossen Nominalphrasen
- Eine Liste aus 5+ aufeinanderfolgenden Punkten, bei der jeder Punkt eine kurze (≤6 Wörter) Adjektiv-plus-Nomen-Phrase ohne Verb ist. „Stabile Mining-Effizienz / Zuverlässige Pool-Verbindung / Optimierte RandomX-Leistung / Geringe Quote fehlgeschlagener Shares / Effiziente Hardware-Nutzung / Konstante Temperatur-Stabilität." Liest sich wie ein Marketing-Einseiter, weil das die Form ist, die LLMs annehmen, wenn sie Features zusammenfassen sollen.
- Das Tell ist die *Symmetrie*: jeder Punkt hat dieselbe grammatische Form, jeder ist gleich lang, keiner behauptet etwas Prüfbares. Eine echte Liste von Beobachtungen hätte unterschiedliche Längen, hin und wieder Verben und mindestens einen Punkt, der aus dem Muster fällt.
- Fix: in einen Fliesstext-Absatz umwandeln oder die Punkte als vollständige Aussagen umschreiben („Fehlgeschlagene Shares blieben über einen 12-Stunden-Lauf unter 1 %" schlägt „Geringe Quote fehlgeschlagener Shares"). Ist die Liste tatsächlich die richtige Form, variiere die Punkte, damit jeder eine andere Art von Information trägt.
- Diese Regel gilt *nicht* für echten Listen-Inhalt (Changelog-Einträge, To-do-Listen, Parameter-Dokus, Zutatenlisten), wo blosse Nominalphrasen die korrekte Form sind. Der Detector achtet auf das Fehlen finiter Verben, um die beiden zu trennen — aber frag in Prosa-Audits, ob die Punkte Aussagen zusammenfassen (umschreiben) oder Dinge aufzählen (stehen lassen).

### Kopula-Vermeidung
- KI-Text meidet „ist" und „hat", indem er aufgemotzte Verben einsetzt: „dient als", „verfügt über", „präsentiert", „stellt dar". Das klingt nach Pressemitteilung.
- Greife auf „ist" oder „hat" zurück, ausser ein konkreteres Verb fügt echt Bedeutung hinzu.

### Synonym-Wechsel
- KI rotiert Synonyme, um ein Wort nicht zu wiederholen: „Entwickler… Ingenieurinnen… Fachleute… Bauende" im selben Absatz. Menschliche Autoren wiederholen das klarste Wort.
- Taucht dasselbe Nomen oder Verb dreimal im Absatz auf und ist das das richtige Wort, behalt alle drei. Erzwungene Variation liest sich wie Thesaurus-Missbrauch.

### Vage Quellenangaben
- „Experten glauben", „Studien zeigen", „Forschung legt nahe", „Branchenführer sind sich einig" — ohne den Experten, die Studie oder den Führer zu nennen. Entweder eine konkrete Quelle nennen oder die Zuschreibung streichen und die Behauptung direkt aufstellen.

### Füllphrasen
- Streiche mechanisches Polster, das Wörter ohne Bedeutung hinzufügt:
  - „Es ist wichtig zu beachten, dass" → (sag es einfach)
  - „Im Hinblick auf" / „In Bezug auf" → (umschreiben)
  - „Tatsache ist, dass" → (streichen oder die Behauptung einfach aufstellen)
- Hinweis: „Letztendlich" und „Am Ende des Tages" sind oben in den Übergangsabschnitten abgedeckt — keine Regeln doppeln.

### Generische Schlüsse
- „Die Zukunft sieht rosig aus", „Nur die Zeit wird zeigen", „Eines ist sicher", „Wenn wir nach vorne blicken" — das ist Füllsel, getarnt als Schluss. Streiche es. Braucht der Text einen Schlussgedanken, mach ihn konkret zum Argument.

### Chatbot-Artefakte
- „Ich hoffe, das hilft dir weiter!", „Gerne!", „Natürlich!", „Grossartige Frage!", „Melde dich gern", „Zögere nicht, mich zu kontaktieren" — das sind Gesprächs-Tics aus Chat-Oberflächen, kein geschriebener Text. Ganz entfernen.
- Achte auch auf: „In diesem Artikel werden wir untersuchen…" oder „Tauchen wir ein!" — das ist KI-generierte Meta-Narration. Streichen oder mit einem direkten Einstieg umschreiben.

### „Lass uns"-Konstruktionen
- „Lass uns erkunden", „Schauen wir uns das an", „Lass uns das aufschlüsseln", „Betrachten wir" — KI nutzt „lass uns" als falsch-kollaborativen Einstieg, um sich an ein Thema heranzutasten. Das ist Füllsel, das den eigentlichen Punkt verzögert. Fang einfach mit dem Punkt an. „Tauchen wir ein" ist oben unter Chatbot-Artefakten abgedeckt, aber das Muster ist breiter — flagge jedes „lass uns + Verb", das als Übergang statt als echte Aufforderung zum Handeln dient.

### Prominenz-Namedropping
- KI-Text häuft prestigeträchtige Zitate an, um Glaubwürdigkeit zu fingieren: „zitiert in der NZZ, der Tagesschau, der Financial Times und dem Tages-Anzeiger". Zählt eine Quelle, nutze sie mit Kontext: „In einem NZZ-Interview von 2024 argumentierte sie…". Eine konkrete Referenz schlägt vier Namedrops.

### Oberflächliche Partizip-Analysen
- Ketten von Partizipien als Pseudo-Analyse: „die das Bekenntnis der Region zum Fortschritt symbolisierend, Jahrzehnte der Investition widerspiegelnd und eine neue Ära der Zusammenarbeit aufzeigend". Das sagt nichts. Ersetze durch konkrete Fakten oder streiche ganz.
- Derselbe Zug zeigt sich auch ohne Partizip: deklaratives „Bedeutungs-Verkünden", das ein banales Thema bedeutsam glossiert — „das steht für einen breiteren Wandel", „die Entscheidung symbolisiert ein Bekenntnis zur Exzellenz", „es spricht für einen grösseren Trend in der Branche". Ist die Bedeutung echt, zeig sie mit einer konkreten Folge; sonst streichen. Angelehnt an `Aboudjem/humanizer-skill` P40.

### Werbesprache
- KI greift auf Prospekt-Prosa zurück: „eingebettet in die atemberaubenden Ausläufer", „ein pulsierendes Innovationszentrum", „ein florierendes Ökosystem". Ersetze durch schlichte Beschreibung: „ist ein Dorf in der Region Gonder", „hat 12 Start-ups". Würdest du es im Gespräch nicht sagen, streich es.

### Schablonenhafte Herausforderungen
- „Trotz Herausforderungen floriert [Subjekt] weiter" oder „Trotz Gegenwinds bleibt die Organisation widerstandsfähig". Das ist eine Nicht-Aussage. Nenn die konkrete Herausforderung und die konkrete Antwort, oder streiche den Satz.

### Falsche Spannweiten
- KI erzeugt falsche Breite, indem sie unverbundene Extreme paart: „vom Urknall bis zur dunklen Materie", „von antiken Kulturen bis zu modernen Start-ups". Das klingt umfassend, sagt aber nichts. Liste die tatsächlichen Themen oder wähle das eine, das zählt.

### Inline-Header-Listen
- Aufzählungslisten, bei denen jeder Punkt mit einem fetten Header beginnt, der sich selbst wiederholt: „**Leistung:** Die Leistung verbesserte sich um…". Streiche den fetten Header und schreib den Punkt direkt. Brauchen die Listenpunkte Header, sollten es wohl Absätze sein.

### Nominalstil und Funktionsverbgefüge
- KI-Texte ersetzen das Vollverb durch ein Funktionsverbgefüge: „zur Verfügung stellen" statt „geben", „in Anspruch nehmen" statt „nutzen", „zum Einsatz kommen" statt „verwenden", „zur Anwendung kommen" statt „anwenden", „unter Beweis stellen" statt „zeigen", „eine entscheidende Rolle spielen" statt „ist wichtig für", „einen Beitrag leisten" statt „beitragen", „von grosser Bedeutung sein" statt „ist wichtig".
- Verwandt ist die Streck-Nominalisierung mit `-ung`-Substantiv plus „von": „die Durchführung von Tests" statt „Tests durchführen". Das `-ung`-Substantiv plus „von/der/des" bläht den Satz auf und ist ein Leitsymptom des KI-Nominalstils.
- Das Problem ist die Häufung: ein einzelnes Funktionsverbgefüge ist normales Amtsdeutsch, aber mehrere in Folge sind das Tell. Fix: aktiv und mit dem Vollverb formulieren. „Wir stellen Ihnen die Daten zur Verfügung" → „Wir geben Ihnen die Daten."

### Passivlastigkeit
- KI-Texte häufen das unpersönliche Passiv, besonders mit „es wird" / „es sollte": „es wird empfohlen, dass", „es sollte beachtet werden", „es wird davon ausgegangen, dass". Das meidet Subjekt und Verantwortung und erzeugt den distanziert-vagen KI-Ratgeber-Ton.
- Ein einzelnes Passiv ist legitim (wenn der Urheber unbekannt oder unwichtig ist). Das Tell ist die Häufung subjektloser „es wird/es sollte"-Konstruktionen, oft gekoppelt mit vager Quellenangabe.
- Fix: ins Aktiv setzen und den Urheber nennen. „Es wird empfohlen, dass" → „Wir empfehlen" oder „Empfehlenswert ist". „Es sollte beachtet werden" → „Beachte" oder „Wichtig ist".

### Cutoff-Disclaimer
- „Soweit auf Basis der verfügbaren Informationen ersichtlich", „Stand meines letzten Updates", „Ich habe keinen Zugriff auf Echtzeitdaten", „Als KI-Sprachmodell". Das sind Modell-Einschränkungen, die in die Prosa durchsickern. Entweder die Information finden oder die Absicherung entfernen. Veröffentliche nie einen Satz, der zugibt, dass etwas nicht nachgeschlagen wurde.

### Spekulatives Lückenfüllen
- Wenn dem Modell ein Fakt fehlt, füllt es die Lücke mit abgesicherter Spekulation, aufgemacht als Hintergrund: „hält ein relativ geringes öffentliches Profil", „soll angeblich", „begann vermutlich seine Karriere bei", „scheint studiert zu haben". Das sind Vermutungen, formatiert als Aussagen. Unterscheidet sich vom Cutoff-Disclaimer, der die Lücke *zugibt* — dieser versteckt sie hinter plausibel klingendem Füllsel, was schlimmer ist, weil der Leser Bekanntes nicht von Erfundenem trennen kann. Streiche die Spekulation oder ersetze sie durch einen belegten Fakt. Angelehnt an `blader/humanizer` P21.

### Nicht ausgefüllte Platzhalter
- Eckige-Klammer-Slots, die vor der Veröffentlichung hätten ersetzt werden sollen: `[Ihr Name]`, `[QUELLE EINFÜGEN]`, `[Firmenname]`, `[Beschreibe den konkreten Abschnitt]`, `TT.MM.JJJJ`, `<!-- Quelle ergänzen, falls vorhanden -->`. Das ist nahezu definitiver Beleg, dass KI-generierte Boilerplate ungeprüft eingefügt wurde. Menschen nutzen auch Platzhalter in Vorlagen, liefern sie aber selten aus. Behandle jeden sichtbaren Platzhalter als Veröffentlichungsfehler: mit echtem Inhalt füllen oder den Satz ganz löschen.
- Fang die offensichtlichen Formen ab: `\[(?:Ihr|Dein|Euer|Name|Quelle|Firmenname|Empfänger|Betreff|EINFÜGEN|EINTRAGEN|AUSFÜLLEN|HINZUFÜGEN)[^\]]*\]`, `\bTT\.MM\.(?:JJJJ|JJ)\b`, HTML-/Markdown-Kommentare mit Platzhalter-Verben (`ergänzen`, `ausfüllen`, `todo`, `einfügen`).

### Chatbot-Zitations-Markup-Lecks
- Interne Zitations-Tokens, die durchsickern, wenn Text aus Chat-Oberflächen kopiert wird: `citeturn0search0`, `contentReference[oaicite:0]{index=0}`, `oai_citation`, `[attached_file:1]`, `grok_card`. Das sind keine Muster — das sind Fingerabdrücke. Ihre Anwesenheit ist im Grunde der Beweis, dass der Text von einem bestimmten Chat-Tool generiert und ungeprüft eingefügt wurde.
- Der Fix ist mechanisch: jedes Markup-Token entfernen. War ein Zitat sinnvoll, ersetze es durch eine echte Referenz. Versuch nicht, das Markup zu humanisieren — lösche es.
- Angelehnt an `Aboudjem/humanizer-skill` P34. Wert, das zu fangen, selbst wenn sonst nichts im Text nach KI klingt — das Token allein genügt.

### KI-Tool-URL-Parameter
- Tracking-Parameter, die KI-Tools an generierte URLs anhängen und die das Kopieren in veröffentlichten Inhalt überleben: `utm_source=chatgpt.com`, `utm_source=copilot.com`, `utm_source=openai`, `utm_source=claude.ai`, `utm_source=perplexity.ai`, `referrer=grok.com`. Gleiche Logik wie bei Zitations-Markup-Lecks — die Anwesenheit des Parameters ist die Signatur, egal wie der umgebende Text liest.
- Der Fix: den Parameter aus jeder URL entfernen. Behalte die URL, wenn der Link sinnvoll ist; verliere nur den Parameter. Angelehnt an `Aboudjem/humanizer-skill` P35.

### Neuheits-Aufblähung
- KI-Text behandelt etablierte Konzepte, als hätte die sprechende Person sie erfunden oder entdeckt: „Er führte einen Begriff ein", „Sie prägte die Wendung", „ein Konzept, das niemand benennt", „eine Fehlerart, über die niemand spricht". In Wahrheit sind die meisten Ideen in einem Gespräch Anwendungen bestehender Konzepte, keine Erfindungen.
- Zwei Probleme. Erstens ist es faktisch riskant: Hat das Konzept schon einen Wikipedia-Eintrag oder Konferenzvorträge vom letzten Jahr, lässt der Neuheits-Anspruch die schreibende Person uninformiert wirken. Zweitens schmeichelt es dem Thema werblich statt analytisch.
- Der Fix: beschreiben, was die Person *mit* dem Konzept tat, nicht dass sie es entdeckte. „Michel führte durch, wie Kontext-Vergiftung in der Praxis funktioniert" statt „Michel führte einen Begriff ein, den ich noch nicht kannte: Kontext-Vergiftung". Bist du unsicher, ob etwas neu ist, nimm an, dass es das nicht ist, und formuliere entsprechend.
- Verwandte Muster zum Flaggen: „die Fehlerart, die niemand benennt", „ein Problem, über das niemand spricht", „die Einsicht, die alle übersehen", „was dir niemand sagt". Das sind Aufmerksamkeits-Köder, die eine Wissensknappheit behaupten, wo keine besteht.

### Infomercial-Engagement-Köder
- Knackige Fragment-Köder, die eine Enthüllung anstossen: „Der Haken?", „Der Clou?", „Und jetzt kommt's.", „Aber jetzt kommt der Clou:", „Das Beste daran?", „Überraschung:", „Das Ergebnis?". KI nutzt das, um Schwung zu fingieren und Spannung um gewöhnliche Information zu erzeugen — das Prosa-Pendant zur Dauerwerbesendung.
- Unterscheidet sich von rhetorischen Frage-Einstiegen (die vor einem Punkt verzögern) und Chatbot-Artefakten (die Hilfsbereitschaft aufführen): das hier sind Teaser mitten im Fluss, die den Rhythmus polstern. Der Fix ist, den Köder zu löschen und die Sache zu nennen. „Der Haken? Es klappt nur am Wochenende." wird zu „Es klappt nur am Wochenende." Angelehnt an `Aboudjem/humanizer-skill` P41.

### Emotionale Flachheit
- KI behauptet Emotionen als strukturelle Krücke, ohne sie durch den Text zu vermitteln: „Was mich am meisten überrascht hat", „Ich war fasziniert zu entdecken", „Was mich beeindruckt hat", „Besonders spannend war", „Der interessanteste Teil", und die blosse Abschnitts-Header-Variante: „Interessanter Teil des Projekts:" / „Interessant dabei:" / „Interessanter Aspekt:". Die Header-Form lässt „der interessanteste" weg, tut aber dasselbe — sie kündigt eine Bedeutung an, die der Text nicht eingelöst hat.
- Zwei Probleme. Erstens ist es Erzählen-statt-Zeigen: Ist die Sache echt überraschend, sollte der Leser das aus dem Inhalt spüren, nicht weil die schreibende Person es ankündigt. Zweitens sind diese Wendungen massiv als Listen-Einleitungen und Übergänge überbeansprucht. Sie sind Füllsel im Emotions-Kostüm.
- Dieses Muster ist nicht immer KI. Es ist auch ein Zeichen fauler menschlicher Routine. Flagge es so oder so.
- Der Fix ist nicht „nie überrascht sagen". Er ist: Behauptest du eine Emotion, sollte der Text drumherum sie einlösen. Sonst streiche die Behauptung und präsentiere die Sache direkt.

### Falsche Zugeständnis-Struktur
- „Zwar ist X beeindruckend, doch Y bleibt eine Herausforderung" oder „Obwohl X Fortschritte gemacht hat, ist Y weiterhin offen". KI nutzt das, um ausgewogen zu klingen, ohne tatsächlich abzuwägen. Beide Hälften sind vage. Mach entweder das Zugeständnis konkret (nenn, was beeindruckend ist, nenn die echte Herausforderung) oder beziehe Stellung und argumentiere sie.

### Rhetorische Frage-Einstiege
- „Aber was bedeutet das für Entwickler?" / „Warum sollte dich das interessieren?" / „Wie geht es nun weiter?" — KI nutzt rhetorische Fragen, um vor dem eigentlichen Punkt zu verzögern. Kennst du die Antwort, sag sie einfach. Rhetorische Fragen verdient man sich durch starken Aufbau, man wirft sie nicht als Abschnitts-Übergänge ein.

### Parenthetisches Absichern
- „(und zunehmend auch Z)" / „(oder genauer gesagt, Y)" / „(und vielleicht noch wichtiger, W)" — KI schiebt parenthetische Einschübe ein, um nuanciert zu klingen, ohne sich festzulegen. Zählt der Einschub, gib ihm einen eigenen Satz. Zählt er nicht, streiche ihn.

### Nummerierte-Listen-Aufblähung
- „Drei zentrale Erkenntnisse" / „Fünf Dinge, die du wissen musst" / „Hier sind die Top sieben" — KI greift standardmässig zu nummerierten Listen, weil sie strukturell sicher sind. Nutze nummerierte Listen nur, wenn der Inhalt echt so viele eigenständige, parallele Punkte hat. Polsterst du, um eine Zahl zu erreichen, sollte die Liste nicht existieren.

### Reasoning-Ketten-Artefakte
- „Lass mich Schritt für Schritt überlegen", „Lass uns das aufschlüsseln", „Gehen wir das systematisch an", „Schritt 1:", „Hier ist mein Gedankengang", „Überlegen wir zunächst", „Arbeiten wir das logisch durch" — das sind Artefakte des Chain-of-Thought-Reasonings, die in veröffentlichte Prosa durchsickern. Der Leser braucht das Gerüst nicht zu sehen. Nenn die Schlussfolgerung, dann den Beleg.
- Achte auch auf nummerierte Denkschritte, die wie ein innerer Monolog lesen statt wie ein Argument für ein Publikum.

### Schmeichlerischer Ton
- „Grossartige Frage!", „Ausgezeichneter Punkt!", „Du hast völlig recht!", „Das ist eine wirklich aufschlussreiche Beobachtung" — das sind Gesprächs-Belohnungen aus Chat-Oberflächen, kein geschriebener Text. Ganz entfernen.
- Unterscheidet sich von Chatbot-Artefakten: Schmeichelei bestätigt speziell den Leser/Fragenden, statt nur Hilfsbereitschaft aufzuführen.

### Bestätigungs-Schleifen
- „Du fragst nach", „Die Frage, ob", „Um deine Frage zu beantworten", „Das ist eine grossartige Frage. Die…" — KI wiederholt den Prompt, bevor sie antwortet. In einem Text ist das reines Füllsel. Der Leser weiss, was er gefragt hat. Antworte einfach.
- Verwandtes Muster: einen Abschnitt damit eröffnen, zusammenzufassen, was der vorige Abschnitt sagte. Ist die Struktur klar, braucht der Leser keine Wiederholung.

### Sicherheits-Kalibrierungs-Phrasen
- „Es ist wichtig zu beachten, dass", „Interessanterweise", „Überraschenderweise", „Wichtig ist", „Bedeutenderweise", „Bemerkenswerterweise", „Sicherlich", „Zweifellos", „Ohne Zweifel" — KI nutzt das, um zu signalisieren, wie der Leser sich zu einem Fakt fühlen soll, statt den Fakt für sich sprechen zu lassen.
- „Hier wird es interessant", „Hier kommt der interessante Teil", „Das sind die Teile, die ich interessant fand" — Leser-Lenk-Cue, der Bedeutung vorab interpretiert. Funktioniert, wenn echt überraschende Daten folgen; scheitert, wenn er eine Wiederholung von etwas Offensichtlichem einleitet (was der KI-Standard ist).
- Ein „bemerkenswert" in einem 2'000-Wörter-Text ist in Ordnung. Drei in 500 Wörtern sind KI-Betonungsstapelei. Nach Dichte flaggen.
- Verwandt — **Autoritäts-Tropen mit Überzeugungsanspruch**: „die eigentliche Frage ist", „im Kern", „grundsätzlich", „machen wir uns nichts vor", „die Wahrheit ist". Derselbe Zug wie die Kalibrierungs-Phrasen oben, aber sie behaupten Tiefe oder Tragweite statt Gefühl: sie kündigen an, dass das Folgende wichtig ist, statt es zu zeigen. Streiche die Trope und führe mit der Substanz. Angelehnt an `blader/humanizer` P27.

### Selbst-Etikettierung von Bedeutung
- Nachdem mehrere Punkte aufgelistet oder beschrieben wurden, zeigt die schreibende Person auf einen zurück und etikettiert ihn als konträr / clever / überraschend / kontraintuitiv / zentral: „Dieser letzte Zug ist der konträre", „Das ist der interessante Teil", „Dieser dritte Punkt ist die eigentliche Geschichte", „Hier wird es clever", „Der letzte Teil ist der kontraintuitive".
- Das Etikett erledigt die Arbeit, die der Inhalt erledigen sollte. Ist ein Zug echt konträr, erkennt der Leser das aus der Beschreibung; ist er ohne Etikett nicht erkennbar, ist das Etikett unverdient. Das Muster liest sich, als prüfe die schreibende Person die eigene Liste, um zu markieren, welcher Punkt zählen soll, statt die Liste so zu schreiben, dass der richtige Punkt das Gewicht von allein trägt.
- Unterscheidet sich von der Sicherheits-Kalibrierung („Bemerkenswert", „Interessanterweise"), die den Cue vorab setzt, und von der emotionalen Flachheit („Was mich am meisten überrascht hat", „Der interessanteste Teil"), die eine einzelne Behauptung vorbereitet. Dieses Muster zeigt im Nachhinein zurück, meist als „[dieser / der X-te / der letzte] [Nomen] ist der [Adjektiv]".
- Bedeutungs-Adjektive, die das Muster signalisieren: konträr, clever, überraschend, kontraintuitiv, interessant, zentral, wichtig, ungewöhnlich, schlau, brillant, echt, eigentlich.
- Fix: Streiche den Etikettier-Satz und lass die folgende Erklärung die Arbeit direkt tun. Oder strukturiere so um, dass der hervorzuhebende Punkt zuerst steht oder mit Konkretem ausgebaut wird, sodass das Etikett überflüssig ist.
- Beispiel. Vorher: „→ Zwei getrennte Indizes für gestaffelten Speicher. Dieser letzte Zug ist der konträre. Verwandte Daten zusammenzulegen hilft normalerweise der Cache-Lokalität." Nachher: „→ Zwei getrennte Indizes für gestaffelten Speicher. Verwandte Daten zusammenzulegen hilft normalerweise der Cache-Lokalität, aber die Indizes zu trennen macht den heissen Pfad günstig." Der Kontrast trägt sich selbst; das Etikett ist weg.

### Übermässige Struktur
- Zu viele Überschriften in kurzem Text: mehr als 3 Überschriften unter 300 Wörtern ist fast immer KI, die organisiert aussehen will. Abschnitte zusammenführen oder Prosa-Übergänge nutzen.
- Zu viele Listenpunkte: 8+ Aufzählungspunkte unter 200 Wörtern heisst, der Inhalt sollte ein Absatz sein, keine Liste.
- Schablonenhafte Abschnitts-Header: „Überblick", „Kernpunkte", „Zusammenfassung", „Fazit", „Einleitung" — das ist KI-Standardgerüst. Nutze Überschriften, die dem Leser etwas Konkretes über das Folgende sagen.

### Rhythmus und Gleichförmigkeit

Das sind keine einzelnen Wort- oder Phrasenprobleme — es sind Muster darin, wie der Text als Ganzes fliesst. KI-Text ist metronomisch; menschlicher Text hat variierten Rhythmus.

**Struktur ist das Erkennungssignal Nummer eins.** KI-Erkennungstools (darunter Pangram, das einen Klassifikator auf 28 Mio. menschlichen Dokumenten trainiert) gewichten strukturelle Regelmässigkeit höher als Wortschatz. Gleichförmiger Satzbau, gleichmässiges Tempo und symmetrische Formulierungsmuster sind schwerer zu kaschieren als das Austauschen einiger geflaggter Wörter. Korrigierst du jedes Wort der Tier-1-Liste, lässt aber den Rhythmus unangetastet, liest sich der Text weiter wie KI-generiert.

- **Gleichförmige Satzlänge**: Sind die meisten Sätze 15–25 Wörter lang, klingt der Text roboterhaft. Mische kurze, knappe Sätze (3–8 Wörter) mit längeren, fliessenden (20+). Fragmente wirken. Fragen brechen die Monotonie.
- **Gleichförmige Absatzlänge**: Ist jeder Absatz 3–5 Sätze lang und ungefähr gleich gross, variiere bewusst. Manche Absätze sollten ein Satz sein. Manche sollten länger sein.
- **Wortwiederholung vs. Synonym-Wechsel**: KI wiederholt entweder dasselbe Wort mechanisch oder wechselt auffällig durch Synonyme. Menschliche Autoren wiederholen, wenn das Wort stimmt, und variieren, wenn es natürlich ist — es gibt keine Formel.
- **Vorlese-Test**: Klingt der Text, als könnte ihn eine Text-to-Speech-Maschine vorlesen, ohne seltsam zu wirken, ist er wahrscheinlich zu gleichförmig. Menschliches Schreiben hat einen Rhythmus, der sich roboterhafter Wiedergabe widersetzt.
- **Fehlende Ich-Perspektive**: Wo es passt, sollte die schreibende Person Meinungen, Vorlieben und Reaktionen haben. KI ist unerbittlich neutral. Soll der Text eine Stimme haben, ist das Fehlen von „Ich denke", „aus meiner Erfahrung" oder einer geäusserten Vorliebe selbst ein KI-Tell.
- **Über-Politur**: Jede Unregelmässigkeit aggressiv wegzuredigieren kann menschliches Schreiben *zum* KI-Statistikprofil hin drücken. Natürliche Stockungen, eigenwillige Wortwahl und ungleichmässiges Tempo sind das, was Text aus der „KI-generiert"-Klassifikation heraushält. Schleif nicht jede Persönlichkeit weg im Streben nach sauberer Prosa. Dieses Skill soll Texte menschlicher klingen lassen, nicht weniger menschlich — wendest du jede Regel maximal streng an, riskierst du genau die Gleichförmigkeit, die du vermeiden willst.

### Wortschatz-Vielfalt (stylometrisch)

In längeren Texten (ab 200 Wörtern) schau, wie viel Wortschatz der Text tatsächlich nutzt. Das Type-Token-Verhältnis (TTR) — verschiedene Worttypen geteilt durch die Gesamtzahl der Tokens — ist ein klassisches stylometrisches Signal, das sich mit blossem Auge lesen lässt. Menschliche Prosa landet bei dieser Länge meist um 0,50–0,65. KI-Text tendiert flacher und sinkt manchmal unter 0,40, wenn das Modell sich auf eine kleine Wortschleife festfährt.

Ein sehr niedriges TTR ist für sich kein Beweis für KI-Urheberschaft — enge Themen, technisches Referenzmaterial und Zweitsprach-Texte verdichten den Wortschatz alle legitim. **Vorbehalt für Deutsch:** Die TTR-Schwelle ist auf englischen Korpora kalibriert; deutsche Flexion senkt das TTR, Komposita erhöhen die Type-Zahl, beides verschiebt die Verteilung. Behandle die Schwelle konservativ als Heuristik, nicht als feste Grenze. Auf allgemeiner Prosa, wo man Bandbreite erwartet (Essays, Artikel, Social-Content über ~200 Wörter), ist ein TTR unter 0,40 einen zweiten Blick wert. Der Fix ist selten, den Text zu thesaurieren; er ist, das *Was* zu verbreitern — konkrete Dinge nennen, konkrete Fälle zitieren, ein wiederverwendetes abstraktes Nomen durch die konkrete Instanz dahinter ersetzen.

### Absatz-Umstell-Immunität (Struktur-Test)
- Eine Diagnose für die schreibende Person, kein Regex: Kannst du zwei Fliesstext-Absätze tauschen, ohne dass der Text bricht? Spielt die Reihenfolge keine Rolle, hast du eine Liste von Punkten geschrieben, kein Argument, das sich aufbaut. KI-Prosa scheitert hieran oft — jeder Absatz ist ein in sich geschlossenes Modul ohne tragende Verbindung zum Nachbarn.
- Der Fix ist strukturell, nicht lexikalisch: einen roten Faden etablieren, bei dem jeder Absatz vom vorigen abhängt. Sind die Absätze echt unabhängig, entscheide, ob der Text eine explizite Liste sein sollte oder ob ihm eine These fehlt. Angelehnt an `Aboudjem/humanizer-skill` P38.

### Tretmühlen-Effekt / geringe Informationsdichte (Inhalts-Test)
- Ein weiterer Test für die schreibende Person: lies jeden Absatz und frag „was ist hier eigentlich neu?". KI-Prosa wiederholt häufig die Prämisse in frischen Worten, statt sie voranzutreiben — viel Bewegung, keine zurückgelegte Strecke. Das Tell ist, dass du 40–60 % streichen könntest, ohne Information zu verlieren.
- Der Fix: benenne für jeden Absatz den einen Fakt, die eine Behauptung oder Wendung, die er beiträgt. Gibt es keine, streich ihn. Gibt es eine, führe mit ihr und lass das Geräusper weg. Angelehnt an `Aboudjem/humanizer-skill` P43.

### Wann komplett neu schreiben statt flicken

Hat der Text 5+ geflaggte Vokabel-Treffer über mehrere Kategorien, 3+ verschiedene ausgelöste Musterkategorien und gleichförmige Satz-/Absatzlänge, behebt das Flicken einzelner Wendungen nichts — die Struktur selbst ist KI-generiert. Rate zu einem vollständigen Neuschreiben: den Kernpunkt in einem Satz formulieren, dann von dort neu aufbauen.

---

## Severity-Tiers

Nicht alle KI-Floskeln sind gleich. Bei einem schnellen Durchgang oder beim Triagieren eines grossen Dokuments priorisiere nach Tier:

### P0 — Glaubwürdigkeits-Killer (sofort beheben)
- Cutoff-Disclaimer („Stand meines letzten Updates")
- Chatbot-Artefakte („Ich hoffe, das hilft!", „Grossartige Frage!")
- Vage Quellenangaben ohne Quelle („Experten glauben")
- Bedeutungs-Aufblähung bei Routineereignissen
- Hashtag-Stopfen auf `linkedin`- und `investor-email`-Posts (Schwere variiert nach Profil — gleiche Regel, niedrigere Priorität auf `blog`/`technical-blog`, wo ein Launch-Post legitim Tags stapeln kann; siehe Context-Profil-Tabelle unten)

### P1 — Offensichtlicher KI-Geruch (vor der Veröffentlichung beheben)
- Wortlisten-Verstösse (eintauchen, nutzen, fördern, robust usw.)
- Template-Phrasen und Schablonen-Konstruktionen
- „Lass uns"-Übergangs-Einstiege
- Synonym-Wechsel innerhalb eines Absatzes
- Schablonenhafte Einstiege („In der sich rasant verändernden Welt von…")
- Fett-Überladung
- Geviertstrich-Häufigkeit (über 1 pro 1'000 Wörter)
- Generische Zukunfts-Schlüsse („könnte zu einem der wichtigsten Narrative werden…")
- Gestapelte Absicherungen in Prognosen („könnte möglicherweise", „dürfte letztlich")
- Echt/tatsächlich-Adjektiv-Aufblähung („echte On-Chain-Tokenomics")
- Aufzählungslisten aus blossen Nominalphrasen (5+ kurze Adj.+Nomen-Punkte, keine Verben)
- Nominalstil-Häufung (mehrere Funktionsverbgefüge in Folge)
- Tier-3-Phrasen-Cluster (≥3 verschiedene Boilerplate-Phrasen in einem Text)

### P2 — Stilistischer Schliff (beheben, wenn Zeit ist)
- Generische Schlüsse („Die Zukunft sieht rosig aus")
- Zwanghafte Dreierregel
- Gleichförmige Absatzlänge
- Kopula-Vermeidung (dient als, verfügt über, präsentiert)
- Übergangsphrasen (Darüber hinaus, Des Weiteren, Zudem)
- Passivlastigkeit (Häufung von „es wird/es sollte")
- Hashtag-Stopfen (`blog`/`technical-blog`-Profile)
- Tier-3-Phrasen-Wiederholung (einzelne Phrase ≥2× — einzeln in Ordnung, im Stapel verdächtig)

Nutze P0+P1 für schnelle Durchgänge. Ein vollständiges Audit deckt alle drei Tiers ab.

---

## Self-Reference-Escape-Hatch

Wenn du *über* KI-Schreibmuster schreibst (Blogposts, Tutorials, Skill-Dokumentation wie diese Datei), sind zitierte Beispiele vom Flaggen ausgenommen. Text in Anführungszeichen, in Code-Blöcken oder ausdrücklich als illustrativ markiert („KI könnte zum Beispiel schreiben…") soll nicht umgeschrieben werden. Flagge nur Muster, die in der eigenen Prosa der Autorin auftreten, nicht in zitierten Beispielen schlechten Schreibens.

---

## Context-Profile

Übergib einen optionalen Kontext-Hinweis, um die Regelstrenge anzupassen. Ist kein Kontext angegeben, leite ihn aus Inhalts-Signalen ab (kurz + Hashtags = Social, Code-Blöcke = technisch, Anrede = E-Mail, Standard = Blog).

### Profil-Definitionen

**`linkedin`** — Kurzform-Social. Knackige Fragmente, visuelle Formatierung zählen.
**`blog`** — Standard. Klassische Langform-Prosa. Alle Regeln in voller Strenge.
**`technical-blog`** — Langform mit Code, Architektur, APIs. Fachbegriffe bekommen einen Freibrief.
**`investor-email`** — Publikum mit hohem Vertrauen. Alles straffen; Werbesprache ist das grösste Risiko.
**`docs`** — Dokumentation, READMEs, Anleitungen. Klarheit vor Stimme.
**`casual`** — Slack-Nachrichten, interne Notizen, schnelle Antworten. Nur die schlimmsten Fälle fangen.

### Toleranzmatrix

Regeln, die nicht in der Tabelle stehen, gelten über alle Profile in voller Strenge.

| Regel | linkedin | blog | technical-blog | investor-email | docs | casual |
|------|----------|------|----------------|----------------|------|--------|
| Geviertstriche | nachsichtig (2/Post ok) | streng | streng | streng | nachsichtig | überspringen |
| Fett-Überladung | nachsichtig (Fett-Hooks ok) | streng | streng | streng | nachsichtig | überspringen |
| Emoji in Überschriften | nachsichtig (1–2 am Zeilenende ok) | streng | streng | streng | überspringen | überspringen |
| Übermässige Aufzählungen | überspringen (Listen wirken auf LinkedIn) | streng | nachsichtig (technische Listen ok) | streng | überspringen (Listen sind Doku) | überspringen |
| Absicherungen | streng | streng | nachsichtig („mag/dürfte" ist im Technischen akkurat) | streng | nachsichtig | überspringen |
| Wortliste (vollständig) | streng | streng | **teilweise** (siehe unten) | streng | nachsichtig | nur P0 |
| Werbesprache | nachsichtig (etwas Verkauf erwartet) | streng | streng | **extra streng** | streng | überspringen |
| Bedeutungs-Aufblähung | streng | streng | streng | **extra streng** | nachsichtig | überspringen |
| Kopula-Vermeidung | überspringen | streng | nachsichtig | streng | überspringen | überspringen |
| Gleichförmige Absatzlänge | überspringen (Kurzform) | streng | streng | streng | nachsichtig | überspringen |
| Nummerierte-Listen-Aufblähung | nachsichtig | streng | nachsichtig | streng | überspringen | überspringen |
| Rhetorische Fragen | nachsichtig (1 als Hook ok) | streng | streng | streng | streng | überspringen |
| Übergangsphrasen | überspringen (Kurzform) | streng | streng | streng | nachsichtig | überspringen |
| Generische Schlüsse | überspringen | streng | streng | **extra streng** | überspringen | überspringen |
| Hashtag-Stopfen | streng | streng | streng | **extra streng** | überspringen (keine Hashtags in Doku) | überspringen |
| Bullet-NP-Listen | streng | streng | nachsichtig (technische Options-Listen ok) | streng | nachsichtig (Parameter-Listen ok) | überspringen |
| Tier-3-Phrasen-Cluster | streng | streng | streng | **extra streng** | nachsichtig | überspringen |
| Zukunfts-Schlüsse | streng | streng | streng | **extra streng** | überspringen | überspringen |
| Gestapelte Absicherungen | streng | streng | nachsichtig („könnte" ist abgesicherte Genauigkeit) | **extra streng** | nachsichtig | überspringen |
| Echt/tatsächlich-Aufblähung | streng | streng | streng | **extra streng** | nachsichtig | überspringen |
| Nominalstil | streng | streng | nachsichtig (Fachsprache verdichtet) | streng | nachsichtig | überspringen |
| Passivlastigkeit | streng | streng | nachsichtig (Passiv ist im Technischen oft korrekt) | streng | nachsichtig | überspringen |

**Technical-Blog-Wortlisten-Ausnahmen:** Diese Begriffe haben legitime technische Bedeutung und sollten im technischen Kontext nicht geflaggt werden: `robust`, `umfassend`, `nahtlos`, `ökosystem`, `optimieren` (bei echter Optimierungsarbeit/-problemen), `skalierbar`. Weiterhin flaggen: `eintauchen`, `beleuchten`, `bahnbrechend`, `meilenstein`, `ein zeugnis für`, `auf ein neues level heben`.

**„Extra streng"** heisst: auch Grenzfälle flaggen. In Investor-E-Mails kann ein einzelnes „florierendes Ökosystem" die ganze Botschaft untergraben.

**„Überspringen"** heisst: diese Kategorie für dieses Profil nicht prüfen. Die Regel greift nicht oder ist die Änderung nicht wert.

### Auto-Detection-Cues

Ist kein Kontext angegeben, leite ihn aus diesen Signalen ab:

| Signal | Abgeleiteter Kontext |
|--------|-----------------|
| Unter 300 Wörter + Hashtags oder Erwähnungen | `linkedin` |
| Code-Blöcke, API-Referenzen oder technische Architektur | `technical-blog` |
| Anrede („Hallo [Name]", „Sehr geehrte") + Investoren-/Finanzierungssprache | `investor-email` |
| Schritt-für-Schritt-Anleitungen, Parameter-Dokus, README-Struktur | `docs` |
| Keine starken Signale | `blog` (sicherster Standard — alle Regeln gelten) |

Fühlt sich die Auto-Detection falsch an, sag, welches Profil du nutzt und warum. Die Person kann das überschreiben.

---


## Voice-Profile

Context-Profile (oben) legen fest, *wie streng* man für ein Publikum ist. Voice-Profile legen fest, *wie die Prosa klingen soll* — die Persona. Das sind unabhängige Achsen: Du kannst direkt für einen Blog oder warm für Doku schreiben. Voice ist **optional** — nennt die Person keine, leite sie aus dem bestehenden Register des Inputs ab und stülp keine Persona über einen Text, der schon eine hat.

Jedes Profil ist eine Reihe konkreter Zielwerte, keine Stimmung:

**`casual`** — Durchgehend Verkürzungen und lockerer Ton; ihr Fehlen wirkt steif. Kurze Sätze (ziele auf ≤14 Wörter im Schnitt); Fragmente erlaubt. Mindestens ein Ich-Bezug oder eine konkrete Anekdote. Fast kein Fachjargon. Behalte warme Absicherungen („ehrlich", „ich denke"), aber streiche die bürokratischen („es ist erwähnenswert"). *Blogposts, Social, Community.*

**`professional`** — Aktiv in den meisten Sätzen. Variiere die Satzlänge; vermeide drei kurze in Folge dicht beieinander. Eine konkrete Aussage pro Absatz (eine Zahl, ein Name, ein Datum), nie „Experten sagen". Mach die Bitte explizit. Geringe Toleranz für Absicherungen. *LinkedIn, Investor-E-Mail, Sponsoring-Pitches.*

**`technical`** — Bevorzuge schlichte Kopulae („X ist Y") gegenüber aufgemotzten Ersatzformen („dient als", „steht als Zeugnis für"). Eine Idee pro Satz; Imperativ für Anweisungen. Fachjargon ist in Ordnung, aber definiere ihn bei der ersten Verwendung. Tabellen und Listen nur, wo der Inhalt echt listenförmig ist, nicht zur Dekoration. *Doku, technischer Blog.*

**`warm`** — Sprich den Leser direkt an („Sie"/„du") und nimm ihn mindestens einmal wahr. Streiche Verstärker („sehr", „wirklich", „unglaublich") zugunsten stärkerer Verben. Keine aufgesetzten Empathie-Einstiege („Ich verstehe vollkommen, wie Sie sich fühlen"). Mittlere Sätze (15–20 Wörter) für eine ruhige Kadenz. *Mentoring, Onboarding, Dankesschreiben.*

**`blunt`** — Führe mit der Behauptung; streiche „Es ist wichtig zu beachten, dass"-Anläufe. Geviertstriche sind hier selten; nutze Punkte zur Betonung. Kein Polster, um eine Dreierregel zu erreichen. Fast keine Absicherung; flagge „mag / könnte / möglicherweise"-Stapel. Kurze Aussagesätze, mit dem gelegentlichen langen Satz zum Kontrast. *Entscheidungsnotizen, Thought Leadership, hartes Feedback.*

**Auf eine Probe kalibrieren (optional).** Gibt dir die Person eine Probe ihres eigenen Schreibens („triff meine Stimme — hier ist ein Post"), analysiere ihr Satzlängenmuster, ihre Verkürzungsrate, ihre Absatz-Einstiege und wiederkehrenden Wortwahlen und triff dann diese statt eines benannten Profils. „Veredle" nicht ihren Wortschatz: Schreibt sie „Zeug" und „Sachen", behalt das Register.

**Wie Voice mit Kontext zusammenspielt.** Voice setzt das Ziel; Kontext setzt, wie hart durchgesetzt wird. Ein Voice-*Ziel* gilt immer, selbst wo ein Context-Profil diese Kategorie überspringen würde — `technical`-Voice bevorzugt schlichte Kopulae auch in einem `casual`-Kontext, der Kopula-Vermeidung sonst ignoriert. Wo beide Achsen dieselbe Regel steuern und übereinstimmen, verstärken sie sich: `blunt`-Voice will fast keine Geviertstriche und ein `blog`-Kontext ist darauf schon streng, also bleibt es eine harte Korrektur. Wo sie sich widersprechen, löse zur **strengeren** der beiden auf — eine `warm`-Voice auf `docs` bekommt trotzdem keine dekorativen Tabellen. Sinnvolle Standard-Paarungen: casual↔casual, professional↔linkedin/investor-email, technical↔docs/technical-blog.

---

## Output-Format

### Rewrite-Modus (Standard)

Gib deine Antwort in vier Abschnitten zurück:

**1. Gefundene Probleme**
Eine Aufzählung jeder gefundenen KI-Floskel, mit Zitat der betreffenden Stelle.

**2. Umgeschriebene Fassung**
Der vollständig umgeschriebene Inhalt. Bewahre die ursprüngliche Struktur, Absicht und alle konkreten technischen Details. Ändere nur, was die Richtlinien verlangen.

**3. Was sich geändert hat**
Eine kurze Zusammenfassung der wesentlichen Änderungen. Nicht jedes Wort, nur die bedeutsamen Änderungen.

**4. Zweiter Prüf-Durchlauf**
Lies die umgeschriebene Fassung aus Abschnitt 2 erneut. Finde alle verbliebenen KI-Tells, die den ersten Durchlauf überlebt haben — recycelte Übergänge, anhaltende Aufblähung, Kopula-Vermeidung, Füllphrasen oder sonst etwas aus den Kategorien oben. Korrigiere sie, gib den korrigierten Text inline zurück und vermerke, was sich in diesem Durchlauf geändert hat. Ist das Umschreiben sauber, sag das.

### Detect-Modus

Gib deine Antwort in zwei Abschnitten zurück:

**1. Gefundene Probleme**
Eine Aufzählung jeder gefundenen KI-Floskel, mit Zitat der betreffenden Stelle. Nach Schwere gruppieren (P0, P1, P2).

**2. Einschätzung**
Vermerke für jeden Treffer, ob es ein klares Problem oder ein Ermessensfall ist. Manche KI-assoziierten Muster sind wirksame Schreibtechniken — gleichförmige Absatzlänge ist ein Problem, ein gut gesetztes „jedoch" nicht. Heb hervor, welche Treffer die Person definitiv beheben sollte und welche einen zweiten Blick wert, im Kontext aber vielleicht in Ordnung sind. Ist der Text sauber, sag das.

### Edit-Modus

Nachdem du die Datei direkt bearbeitet hast, gib einen kurzen Bericht zurück — nicht die ganze Datei:

**1. Vorgenommene Änderungen**
Eine Aufzählung der Änderungen, jede mit der Datei-Stelle und dem Vorher → Nachher. Nur die Stellen, die du angefasst hast.

**2. Verifizierung**
Bestätige, dass du die Datei erneut gelesen hast und die markierten Muster behoben sind. Vermerke alles, was du bewusst gelassen hast, weil es schon menschlich oder beabsichtigt war.

---

## Ton-Kalibrierung

Das Ziel ist Text, der klingt, als hätte ihn ein Mensch geschrieben. Direkt. Konkret. Der Text sollte Selbstsicherheit zeigen, nicht behaupten.

Fünf Prinzipien für menschlich klingende Umschreibungen:
1. **Satzlänge variieren** — kurz mit lang mischen. Fragmente sind in Ordnung.
2. **Konkret sein** — vage Behauptungen durch Zahlen, Namen, Daten oder Beispiele ersetzen.
3. **Eine Stimme haben** — wo es passt, die Ich-Form nutzen, Vorlieben äussern, Reaktionen zeigen.
4. **Die Neutralität streichen** — Menschen haben Meinungen. Soll der Text Stellung beziehen, beziehe sie.
5. **Betonung verdienen** — sag dem Leser nicht, etwas sei interessant. Mach es interessant.

Ist der ursprüngliche Text schon stark, sag das und mach nur die nötigen Kürzungen. Überredigiere nicht um des Redigierens willen.

Die Ersetzungstabelle liefert Vorgaben, keine Pflichten. Ist ein geflaggtes Wort im Kontext klar die richtige Wahl, behalt es.
