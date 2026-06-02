# Changelog

Alle nennenswerten Änderungen an diesem Projekt sind hier dokumentiert.

---

## [4.0.0] — 2026-06-02 — Deutsche/Schweizer Portierung

### Geändert
- Gesamtes Repository auf Deutsch in Schweizer Schreibweise (kein Eszett, durchgängig
  `ss`) umgestellt – Skill, Detector-Engine, Tests, Doku und CI. Vokabular und Muster
  stammen aus recherchierten deutschen LLM-Tells (siehe
  `docs/superpowers/research/de-tells.md`), nicht aus einer Übersetzung der englischen
  Listen: KI-Schreib-Tells sind sprachspezifisch.
- Detector: `em-dash` umgekehrt – der Geviertstrich `—` (U+2014) ist im Deutschen das
  Tell, der Halbgeviertstrich `–` (U+2013, mit Leerzeichen) ist die korrekte
  Zeichensetzung und wird nachsichtig behandelt.
- Detector: `smart-punct-signature` neu ohne Oxford-Komma (kein deutsches Konstrukt) –
  die Signatur setzt sich aus dem Geviertstrich, den Schreib-Anführungszeichen und
  einem fehlerfreien Tippmuster zusammen.
- Detector: `bullet-np`-Liste, Funktionswort-Listen und `nominalstil` auf Deutsch;
  Anführungszeichen-Carve-out für `„ "` und die Guillemets `« »`.
- Detector: `title-case-header` entfernt – Deutsch schreibt alle Substantive gross,
  damit gibt es keine „Title Case" als Tell. Dafür `nominalstil`
  (Funktionsverbgefüge / `-ung`-Häufung) neu aufgenommen; netto weiter 43 `type`s.
- Stylometrie-Schwellen (Type-Token-Ratio, Burstiness, Trigramm-Entropie) als
  dokumentierte Heuristik mit Kalibrierungs-Vorbehalt gekennzeichnet: sie sind auf
  englischen Korpora kalibriert, deutsche Flexion und Komposita verschieben die
  Verteilung.
- Score-Labels auf Deutsch: „Sauber", „Minimale KI-Signale", „Einige KI-Muster",
  „Moderate KI-Signale", „Starke KI-Signale", „Viele KI-Muster".
- Repo- und Install-URLs auf `github.com/gardenbaum/avoid-ai-writing` umgestellt;
  Version überall auf `4.0.0` synchronisiert.

### Attribution
- Aufbauend auf dem Upstream-Skill von Conor Bronsdon (MIT-Lizenz). Diese Fassung ist
  die deutsche/schweizer Portierung; die Upstream-Attribution bleibt erhalten.

---

## [3.8.0] — 2026-05-29

### Hinzugefügt
- **Selbst-etikettierte Bedeutsamkeit** – rückverweisende Etiketten, die anzeigen, welches Element einer Liste eigentlich zählen soll („Der letzte Punkt ist der kontroverse", „Das ist der spannende Teil", „Der dritte Aufzählungspunkt ist die eigentliche Geschichte"), statt die Liste so zu schreiben, dass das richtige Element das Gewicht von selbst trägt. Verschieden von der Confidence-Kalibrierung (die den Hinweis voranstellt) und vom emotionalen Flatline (das eine einzelne Aussage anmoderiert) – diese Variante verweist nachträglich zurück. Der Katalog wächst von 46 auf 47 Erkennungskategorien. LLM-Judgment-Regel (kein Detector-`type`); dokumentiert in `detector/CATEGORIES.md` §C.

---

## [3.7.2] — 2026-05-28

### Geändert
- **Typografische Anführungszeichen** – neu kalibriert nach dem Review von #15. Vom „starken" Tell zu einem **schwachen, bestätigenden** Signal umgewertet, das vor allem in Klartext-Kontexten (Code-Kommentare, Commit-Nachrichten, Klartext-Entwürfe) aussagekräftig ist, weil Word/Google Docs/macOS/iOS Anführungszeichen standardmässig selbst runden. Typografische Apostrophe (U+2019) werden allein nicht mehr geflaggt (sie stecken in jeder Verkürzung). Behebt das deutsche Beispiel mit den unteren Anführungszeichen. Bleibt konsistent mit der Ko-Auftretens-Logik des deterministischen Detectors (#16).

---

## [3.7.1] — 2026-05-28

### Geändert
- **Typografische Anführungszeichen** – die Regel „gemischte gerade/typografische Zeichensetzung" aus 3.7.0 zu einer einzigen Formatierungsregel verfeinert: das unerklärte Auftreten typografischer Unicode-Anführungszeichen (U+201C / U+201D / U+2018 / U+2019) in sonst rein ASCII-haltigem Text als Fingerabdruck eines Copy-Paste aus dem Chat flaggen, mit Ausnahmen für bewusste Publikationstypografie und lokal korrekte Zeichensetzung (französische Guillemets, deutsche untere Anführungszeichen).
- Versionssprung auf 3.7.1.

### Dank
- Beigetragen von [@augustasas](https://github.com/augustasas) (#15).

---
## [3.7.0] — 2026-05-28

### Hinzugefügt
- **Überhäufte Bindestrich-Paare** – gestapelte zusammengesetzte Attribute („eine hochwertige, gut durchdachte, zukunftssichere Lösung") und der attributive/prädikative Fehler (Bindestrich bei „ein hochwertiger Bericht", aber nicht bei „der Bericht ist hochwertig").
- **Spekulatives Lückenfüllen** – abgesicherte Spekulation, die als Hintergrund getarnt ist („hält sich bedeckt", „soll angeblich", „begann vermutlich seine Karriere") und eine Wissenslücke verdeckt, statt sie einzugestehen. Verschieden vom Cutoff-Disclaimer.

### Geändert
- **Formatierung** – **gemischte gerade/typografische Zeichensetzung** ergänzt (Anführungszeichen-/Apostroph-Stil in einem Dokument gemischt – ein Paste-aus-dem-Chat-Tell).
- **Confidence-Kalibrierungs-Phrasen** – um **Autoritäts-Topoi** erweitert („die eigentliche Frage ist", „im Kern", „grundsätzlich", „eines steht fest").
- Versionssprung auf 3.7.0.

### Dank
- Muster übernommen aus `blader/humanizer` (P21, P26, P27) und Wikipedias „Signs of AI writing", ermittelt in der in #22 verfolgten Konkurrenz-Recherche.

---

## [3.6.0] — 2026-05-28

### Hinzugefügt
- **Voice-Profile** – eine optionale Persona-Achse, unabhängig von den Zielgruppen-Context-Profilen. Fünf Profile (`casual`, `professional`, `technical`, `warm`, `blunt`), jedes ein Satz konkreter Zielwerte (Satzlänge, Kürzungs-Politik, Hedging-Toleranz, Jargon-Niveau, Rhythmus) aus schreibhandwerklichen Quellen (Strunk, Provost, Ogilvy, Handley). Plus optionale Kalibrierung an einer vom Nutzer gelieferten Schreibprobe. Mit einer Kompositionsregel: Voice setzt das Ziel, Context die Strenge der Durchsetzung, Konflikte lösen sich zugunsten des Strengeren auf.
- **Edit-Modus** – ein dritter Modus neben `rewrite` und `detect`. Bearbeitet eine benannte Datei direkt über das Edit-Tool mit minimalen, gezielten Änderungen, bewahrt bereits menschliche Passagen und liest danach zur Prüfung erneut. Liefert einen Bericht über die gemachten Änderungen plus Prüfung, nicht die ganze Datei.
- **Iterieren bis stabil** – der Rewrite-Modus kann den Zyklus aus Prüfen und Umschreiben wiederholen, bis keine Muster mehr bleiben oder N Durchläufe erreicht sind (auf 2 begrenzt). Verallgemeinert den bestehenden eingebauten zweiten Durchlauf.
- **Aufruf-Oberfläche** – dokumentierte optionale Flags (`--mode`, `--voice`, `--context`, `--file`, `--iterate N`) neben den bestehenden natürlichsprachlichen Auslösern.

### Geändert
- Frontmatter-`description` aktualisiert, um die neuen Modi und Voice-Profile auszuweisen.
- Versionssprung auf 3.6.0.

### Anmerkungen
- Entworfen aus einem Konkurrenz-Feature-Audit (Aboudjem/humanizer-skill, brandonwise/humanizer, blader/humanizer) plus Detektions- und Schreibhandwerks-Recherche. Das `--score`-Feature und vier zusätzliche Katalog-Muster aus dieser Recherche werden separat verfolgt (#21, #22).

---

## [3.5.0] — 2026-05-27

### Hinzugefügt
- **Werbe-Aufhänger im Infomercial-Stil** – knackige Satzfragment-Haken, die um gewöhnliche Information herum Schwung vortäuschen: „Der Haken?", „Der Clou?", „Und jetzt kommts.", „Plot Twist:", „Das Beste daran?". Verschieden von rhetorischen Frage-Openern (die vor einem Punkt stocken) und Chatbot-Artefakten (die Hilfsbereitschaft aufführen).
- **Absatz-Umsortier-Test** – ein autorenseitiger Struktur-Test: Wenn du zwei Fliesstext-Absätze tauschen kannst, ohne den Text zu zerstören, hast du eine Liste von Punkten geschrieben, kein Argument, das aufbaut.
- **Tretmühlen-Effekt / geringe Informationsdichte** – ein autorenseitiger Inhalts-Test: Jeder Absatz sollte einen neuen Fakt, eine neue Behauptung oder eine Wendung beitragen, statt die Prämisse mit frischen Worten zu wiederholen. Das Tell ist, dass du 40–60 % streichen könntest, ohne Information zu verlieren.

### Geändert
- **Oberflächliche -ing-Analysen** – erweitert um die deklarative „Bedeutungs-Erzähl"-Variante („dies steht für einen breiteren Wandel", „verweist auf einen grösseren Trend"), die ein banales Thema als tiefgründig ausgibt, ohne die -ing-Konstruktion.
- Versionssprung auf 3.5.0.

### Dank
- Muster übernommen aus [`Aboudjem/humanizer-skill`](https://github.com/Aboudjem/humanizer-skill) (P38, P40, P41, P43), ermittelt bei einem Konkurrenz-Katalog-Audit.

---

## [3.4.0] — 2026-05-16

### Hinzugefügt
- **Tier-3-Phrasen** – Mehrwort-Boilerplate, das einzeln harmlos ist, sich aber in KI-generierten Krypto-/Web3-/DePIN-/KI-Infra-Texten stark stapelt: `die Integration von`, `die Schnittstelle von`, `community-getrieben`, `langfristige Nachhaltigkeit`, `Nutzer-Engagement`, `dezentrale Rechenleistung`, `nachhaltige Token-Ausschüttungen`, `tokenisierte Anreizstrukturen`. Geflaggt nach Phrasen-Dichte (≥2 Wiederholungen) *oder* im Cluster (≥3 verschiedene Phrasen in einem Text – die Form, in der das LLM sein eigenes Boilerplate variiert).
- **Generische Zukunfts-Erzählschlüsse** – die Vorlagen-Familie „könnte zu einem der wichtigsten Narrative der nächsten Jahre werden". Modal + „werden" + (eines der) wichtigsten/bedeutendsten + (Narrativ / Geschichte / Trend / Thema / Entwicklung).
- **Hedge-gestapelte Prognosen** – `könnte möglicherweise`, `dürfte eventuell`, `mag letztlich`. Modal + Hedge-Adverb-Stapel, in dem ein Wort das nächste aufhebt.
- **„Echt/tatsächlich"-Adjektiv-Inflation** – `echte Tokenomics`, `tatsächliche Nachhaltigkeit der Belohnung`, `echter Nutzen`, `wahre Marktreife`. Die Nomen-Modifikator-Form, verschieden von der bestehenden satzweiten Hohle-Verstärker-Regel.
- **Hashtag-Stopfen** – angehängte Blöcke von 6+ Hashtags auf kurzen Posts, besonders wenn ein Projekt-Tag mit breiten Kategorie-Tags gemischt wird (#KI #Krypto #Web3 #Innovation #ZukunftsTech).
- **Aufzählungslisten aus blossen Nominalphrasen** – 5+ aufeinanderfolgende Aufzählungspunkte, die jeweils ein kurzes Adjektiv-Nomen-Paar ohne Verb sind. Die Detector-Heuristik schliesst echten Listeninhalt aus (Verben in den Punkten, Zutatenlisten, Changelog-Einträge).

### Geändert
- **Emotionaler Flatline** – erweitert um die blosse Abschnitts-Überschrift-Variante: „Interessanter Teil des Projekts:" / „Interessant hier:" – dieselbe Rolle wie „der interessanteste Teil", aber als Überschrift-Opener.
- **Severity-Tiers** – alle sechs neuen Kategorien in die P0/P1/P2-Leiter eingebaut (Hashtag-Stopfen variiert nach Profil; der Rest ist P1, Phrasen-Wiederholung P2).
- **Toleranzmatrix der Context-Profile** – Zeilen für alle sechs neuen Kategorien ergänzt, damit die Profile `linkedin` und `docs` keine Fehlalarme bei legitimer Nutzung auslösen (z. B. Nominalphrasen-Listen auf `technical-blog` und `docs` gelockert, weil technische Optionslisten korrekt aus blossen Nominalphrasen bestehen).
- **„6+"-Hashtag-Schwelle** – Begründungs-Absatz ergänzt, der die empirische Untergrenze erklärt.
- **„Echt/tatsächlich"-Inflation** – benannter Kontrast-Carve-out ergänzt, damit ehrliches kontrastives Schreiben („echte On-Chain-Abwicklung, keine überbrückten Schuldscheine") nicht geflaggt wird.
- Versionssprung auf 3.4.0.

### Gemeldet von
- Ein Nutzer der avoid-ai-writing-Erweiterung meldete zwei Krypto-Werbe-Social-Posts (MineBench-Reviews), die der Wortlisten-/Regex-Detector der Version 3.3.x als „Minimale KI-Signale" bewertete, obwohl sie offensichtlich LLM-Output waren. Beide Posts umgingen jeden Tier-1-Vokabeleintrag durch Synonyme („aufstrebender Sektor", „skalierbarer Netzwerkbeitrag", „Tragfähigkeit") und nutzten strukturelle Formen (Hashtag-Block, Nominalphrasen-Listen, Hedge-Stapel, Zukunfts-Erzählvorlagen), für die der Detector keine Regel hatte. v3.4 ergänzt Regeln für die Strukturen, nicht nur für die Wörter.

---

## [3.3.0] — 2026-04-01

### Hinzugefügt
- **„Lohnt sich zu [Verb]"-Muster der vagen Empfehlung**: `lesenswert`, `beachtenswert`, `einen Blick wert`, `erkundenswert`, `einen Versuch wert`, `deine Zeit wert` – erweitert das bestehende „es ist erwähnenswert, dass" zur ganzen Familie
- **Leser-lenkende Rahmen**: `Das Interessante daran ist`, `Was mir ins Auge fiel`, `Was herausstach` – sowohl zu den Übergangs-Phrasen als auch zum Confidence-Kalibrierungs-Abschnitt ergänzt, mit Kontext dazu, wann das Muster ein echtes Problem ist und wann eine datengestützte Verwendung in Ordnung geht

### Geändert
- Versionssprung auf 3.3.0

---

## [3.2.0] — 2026-03-31

### Hinzugefügt
- **Detect-Modus**: ein Nur-Prüfen-Modus, der KI-Muster erkennt, ohne umzuschreiben. Wird ausgelöst mit „prüfen", „nur flaggen", „nur auditieren", „nur markieren", „scannen" oder Ähnlichem. Liefert nach Severity (P0/P1/P2) gruppierte Befunde plus eine Einschätzung, welche Flags klare Probleme und welche Ermessensfragen sind. Nützlich, wenn geflaggte Muster gewollt sind, wenn publizierte oder fremde Inhalte geprüft werden oder wenn man einen schnellen Scan ohne vollständiges Umschreiben will.

### Geändert
- Der Abschnitt zum Output-Format dokumentiert nun sowohl die Ausgaben des Rewrite-Modus (Standard) als auch des Detect-Modus
- Versionssprung auf 3.2.0

---

## [3.1.0] — 2026-03-25

### Hinzugefügt
- 3 neue Tier-1-Wörter aus der Detektions-Recherche von Pangram AI: `keck` (als Verstärker), `Sinfonie` (Metapher), `umarmen` (Metapher)
- 2 neue Vorlagen-Phrasen: „Ob du nun X oder Y bist" (falsche Breite), „Ich hatte kürzlich das Vergnügen" (Review-/Social-KI-Muster)
- „Zusammenfassend" zu den Übergangs-Phrasen ergänzt (neben dem bestehenden „Abschliessend" / „Um es zusammenzufassen")
- Hinweis zur Struktur-Priorität im Rhythmus-Abschnitt: strukturelle Regelmässigkeit ist das Signal Nr. 1, das KI-Detektoren gewichten, noch vor dem Vokabular
- Warnung vor Überpolieren: zu aggressives Bearbeiten kann das Geschriebene in Richtung der statistischen KI-Profile schieben, weil es natürliche Unebenheiten entfernt

### Geändert
- Vokabular gesamt: 106 → 109 Einträge (60 Tier 1 + 38 Tier 2 + 11 Tier 3)
- Vorlagen-Phrasen: 2 → 4 Einträge

### Quelle
- Detektions-Recherche von Pangram Labs (pangram.com) – Decoder-only-Klassifikator, trainiert auf 28 Mio. menschlichen Dokumenten. Kernerkenntnis: strukturelle Gleichförmigkeit und Tempo-Konsistenz werden höher gewichtet als einzelne Wortwahl.

---

## [3.0.0] — 2026-03-20

### Hinzugefügt
- Muster der Neuheits-Inflation (KI behandelt etablierte Konzepte als Erfindungen des Sprechenden)
- Muster des falschen Zugeständnisses
- Muster der rhetorischen Frage-Opener
- Muster des parenthetischen Hedging
- Muster der aufgeblähten nummerierten Listen
- Severity-Tiers (P0/P1/P2) für priorisiertes Auditieren
- Self-Reference-Escape-Hatch (nimmt zitierte Beispiele vom Flaggen aus)
- Context-Profile mit Toleranzmatrix (linkedin, blog, technical-blog, investor-email, docs, casual)
- Auto-Detection-Cues für die Kontext-Erschliessung
- Erweiterte Frontmatter: license, compatibility, author, tags, agentskills_spec

### Geändert
- Musteranzahl: 30 → 35 Kategorien

---

## [2.2.0] — 2026-03-18

### Hinzugefügt
- OpenClaw-Kompatibilität – `version` und `metadata.openclaw` zur SKILL.md-Frontmatter ergänzt
- OpenClaw-Installationsanleitung in der README (ClawHub und manuell)
- Das Skill funktioniert nun mit Claude Code und OpenClaw aus einer einzigen `SKILL.md`

### Geändert
- `README.md` – Beschreibung auf beide Plattformen erweitert, Installation in Claude-Code- und OpenClaw-Abschnitte gegliedert

---

## [2.1.0] — 2026-03-18

### Hinzugefügt
- 5 neue Musterkategorien: Reasoning-Chain-Artefakte, schmeichlerischer Ton, Bestätigungs-Schleifen, Confidence-Kalibrierungs-Phrasen, übermässige Struktur
- Neuer Abschnitt „Rhythmus und Gleichförmigkeit" – prüft auf gleichförmige Satzlängen, gleichförmige Absatzlängen, fehlende Ich-Perspektive und gibt eine Vorlese-Test-Anleitung
- Neuer Schwellenwert „Wann komplett neu schreiben statt flicken" – rät zu vollständigen Neuschrieben, wenn die KI-Dichte für ein Flicken zu hoch ist
- 5 Rewrite-Prinzipien im Ton-Kalibrierungs-Abschnitt (Länge variieren, konkret sein, eine Stimme haben, Neutralität streichen, Betonung verdienen)
- Neue Gruppe „Meta-Muster" in der README-Tabelle
- Erweiterte Credits: OpenClaw-Humanizer-Ökosystem (Community-Muster)

### Geändert
- Musteranzahl: 23 → 30 Kategorien
- `README.md` – Musteranzahl aktualisiert, Meta-Muster-Tabelle ergänzt, Credits um Quellenbeschreibungen erweitert
- Die Communication-Patterns-Tabelle in der README enthält nun alle Kommunikationsmuster

---

## [2.0.0] — 2026-03-18

### Hinzugefügt
- **Tiered-Vokabel-System** – Wörter sind nun nach KI-Signalstärke in drei Stufen geordnet:
  - Tier 1 (immer flaggen): 53 Einträge – eindeutige Verräter, die im KI-Text 5- bis 20-mal häufiger auftauchen
  - Tier 2 (im Cluster flaggen): 38 Einträge – legitime Wörter, die KI signalisieren, wenn 2+ im selben Absatz auftreten
  - Tier 3 (nach Dichte flaggen): 11 Einträge – gängige Wörter, die nur flaggen, wenn der Text mit ihnen gesättigt ist
- 39 neue Vokabeleinträge über alle Stufen, darunter: pulsierend, verschlungen, Komplexitäten, sich stetig entwickelnd, entmutigend, ganzheitlich, umsetzbar, wirkungsvoll, Erkenntnisse, Thought Leadership, Best Practices, Synergie, Wechselspiel, umfassen, katalysieren, neu denken, beleben, ergänzen, kultivieren, erleuchten, erläutern, gegenüberstellen, paradigmenverschiebend, transformativ, Eckpfeiler, von grösster Bedeutung, bereit, aufkeimend, im Entstehen, par excellence, übergeordnet, untermauernd, bedeutend, innovativ, dynamisch, skalierbar, überzeugend, beispiellos, ausgeklügelt, weltklasse
- Dank an [brandonwise/humanizer](https://github.com/brandonwise/humanizer) für die Tiered-Vokabel-Recherche

### Geändert
- Wort-/Phrasen-Tabelle von einer flachen Liste in eine gestufte Struktur mit Nutzungshinweisen umorganisiert
- Vokabular gesamt: 58 → 102 Einträge (53 Tier 1 + 38 Tier 2 + 11 Tier 3)
- `README.md` – Beschreibung der Ersetzungstabelle, Muster-Tabelle und Credits aktualisiert

---

## [1.4.0] — 2026-03-17

### Hinzugefügt
- 15 neue Wort-/Phrasen-Ersetzungen: nuanciert, entscheidend, vielschichtig, Ökosystem, Myriade, Fülle, Deep Dive / eintauchen, aufschlüsseln, stärken, vorantreiben, nachhallen, revolutionieren, erleichtern, untermauern
- Neue Musterkategorie: „Lass uns"-Konstruktionen (falsch-kollaborative Opener wie „lass uns erkunden", „lass uns das aufschlüsseln")
- Das Skill deckt nun 23 Musterkategorien mit 58 Wort-/Phrasen-Ersetzungen ab

### Geändert
- Doppelte Füllphrasen entfernt, die sowohl in der Wort-Tabelle als auch im Füller-Abschnitt standen
- `README.md` – Musteranzahl aktualisiert (22 → 23), Anzahl der Ersetzungstabelle (43 → 58), Zeile zu „Lass uns"-Konstruktionen in der Muster-Tabelle ergänzt

---

## [1.3.0] — 2026-03-17

### Geändert
- Die Gedankenstrich-Erkennung erfasst nun zusätzlich zum Unicode-Geviertstrich (`—`) auch den doppelten Bindestrich (`--`)
- `README.md` – Beschreibung des Formatierungsmusters aktualisiert, erwähnt nun `--`

---

## [1.2.0] — 2026-03-06

### Hinzugefügt
- Neue Musterkategorie: emotionaler Flatline (KI behauptet Gefühle als strukturelle Krücke, ohne sie zu vermitteln; flaggt auch faules menschliches Schreiben)
- Das Skill deckt nun 22 Musterkategorien mit 43 Wort-/Phrasen-Ersetzungen ab

---

## [1.1.0] — 2026-03-06

### Hinzugefügt
- 8 neue Musterkategorien: Prominenz-Namedropping, oberflächliche -ing-Analysen, werbliche Sprache, formelhafte Herausforderungen, falsche Bandbreiten, Inline-Überschriften-Listen, Title-Case-Überschriften, Cutoff-Disclaimer
- 5 neue Einträge in der Wort-Tabelle (eingebettet, lebendig, florierend, trotz Herausforderungen, präsentierend)
- Das Skill deckt nun 21 Musterkategorien mit 43 Wort-/Phrasen-Ersetzungen ab

### Geändert
- `README.md` – vollständiges Beispiel erweitert (6 Absätze → 4 saubere Sätze, 40+ geflaggte Tells); Vorher/Nachher-Tabelle pro Muster ergänzt, gegliedert in die Gruppen Content, Language, Structure, Communication; Musteranzahl und Anzahl der Ersetzungstabelle durchgehend aktualisiert

---

## [1.0.0] — 2026-03-05

### Hinzugefügt
- `SKILL.md` – Claude-Code-Skill mit 13 Musterkategorien: Formatierung, Satzbau, Wort-/Phrasen-Ersetzungen (38 Einträge), Vorlagen-Phrasen, Übergangs-Phrasen, strukturelle Probleme, Bedeutungs-Inflation, Kopula-Vermeidung, Synonym-Wechsel, vage Attributionen, Füllphrasen, generische Schlüsse, Chatbot-Artefakte
- Vierteiliges Output-Format: gefundene Probleme, umgeschriebene Fassung, was geändert wurde, Zweitdurchlauf-Prüfung
- `README.md` – Installationsanleitung (3 Methoden), vollständige Muster-Referenz, Nutzungsbeispiele
- `LICENSE` – MIT
- `.gitignore` – OS-/Editor-Ausschlüsse
