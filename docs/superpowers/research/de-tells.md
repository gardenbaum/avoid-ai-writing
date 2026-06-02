# Kanonische deutsche Tell-Listen (verifiziert)

> Single Source für Vokabular und Phrasen-Tells der deutschen/schweizer Portierung
> (Task 1 des Plans). Jeder Eintrag ist als echtes deutsches LLM-Tell bestätigt und
> gegen False-Positives auf normaler Schweizer Prosa geprüft (adversarische
> Verifikation, FN-Bias). Format je Eintrag: **Tell → Ersatz**, dann *Warum* (Beleg,
> dass es ein LLM-Tell ist) und *Mensch* (Must-not-fire-Gegenbeispiel aus normaler
> Prosa, das nicht geflaggt werden darf).
>
> **Schweizer Schreibweise:** kein Eszett, durchgängig `ss`. Umlaute bleiben.
> SKILL.md (Tabellen) und Detector (Objekte/Regex-Arrays) speisen sich aus dieser
> Datei. Mehrfach belegte Floskeln stehen genau einmal, in ihrer treffendsten
> Kategorie (Querverweise vermerkt).

---

## Tier 1 – immer flaggen (Token, kleingeschrieben)

### nahtlos → reibungslos, ohne Unterbruch, problemlos
- **Warum:** Direkte Lehnübersetzung von „seamless". Im deutschen LLM-Output Dauergast in Marketing- und Tech-Prosa („nahtlose Integration", „nahtloses Erlebnis"); Menschen sagen meist konkret „ohne Unterbruch" oder „reibungslos".
- **Mensch:** Die Naht am Ärmel ist sauber gearbeitet und praktisch nahtlos verarbeitet.

### mühelos → leicht, einfach, ohne Aufwand
- **Warum:** Kalkiert „effortless". LLMs streuen es als Komfort-Floskel („mühelos verwalten", „mühelos skalieren"); im echten Schweizer Gebrauch selten und dann konkret begründet.
- **Mensch:** Der Bergführer stieg mühelos voraus, während wir hinter ihm schnauften.

### ganzheitlich → umfassend benennen, was gemeint ist; oder streichen
- **Warum:** Lehnübersetzung von „holistic". Im LLM-Deutsch leeres Güteversprechen („ganzheitlicher Ansatz", „ganzheitliche Lösung") ohne Inhalt.
- **Mensch:** Die anthroposophische Klinik wirbt ausdrücklich mit einem ganzheitlichen Therapiekonzept.

### bahnbrechend → neu, das erste; sagen, was konkret zuvor unmöglich war
- **Warum:** Kalkiert „groundbreaking". LLMs inflationieren damit Alltägliches zu Sensationen; ohne prüfbaren Vergleich ein klares Tell.
- **Mensch:** Röntgens Entdeckung der X-Strahlen war damals tatsächlich bahnbrechend für die Medizin.

### revolutionieren → verändern, umkrempeln; beschreiben, was sich ändert
- **Warum:** Direkter Treffer in der Recherche als typisches ChatGPT-Buzzword. „X revolutioniert die Branche" ist die LLM-Default-Steigerung ohne Beleg.
- **Mensch:** Die Bauern wollten 1653 die alte Ordnung nicht reformieren, sondern revolutionieren.

### eintauchen → anschauen, untersuchen, durchgehen
- **Warum:** Deutsche Entsprechung von „dive in / deep dive", besonders als Opener „Tauchen wir ein". Metaphorisches Eintauchen in ein Thema ist ein starkes LLM-Tell. (Vgl. lets-construction „tauchen wir ein in".)
- **Mensch:** Nach dem Sprung vom Steg tauchte sie tief in den kühlen Vierwaldstättersee ein.

### beleuchten → erklären, zeigen, darstellen
- **Warum:** Metaphorisches „beleuchten" (Thema/Aspekt) übersetzt „illuminate / shed light on" und ist im LLM-Deutsch überproportional häufig statt schlicht „zeigen".
- **Mensch:** Der Elektriker hat die Einstellhalle neu mit LED-Streifen beleuchtet.

### wendepunkt → sagen, was sich konkret änderte; oder streichen
- **Warum:** Deutsche Form von „watershed / turning point moment". LLMs erheben Routineereignisse zu historischen Wendepunkten ohne Begründung. (Vgl. significance-inflation „markiert einen Wendepunkt".)
- **Mensch:** Die Geburt seiner Tochter war für ihn der Wendepunkt, danach hörte er mit dem Rauchen auf.

### meilenstein → konkretes Ergebnis nennen (Zahl, Datum, Lieferung)
- **Warum:** Kalkiert „milestone" als Bedeutungsaufblähung. Im LLM-Deutsch wird damit jeder Zwischenschritt zur Errungenschaft erklärt. (Vgl. significance-inflation „ein Meilenstein in der Entwicklung von".)
- **Mensch:** Beim Strassenbau steht alle hundert Meter noch ein alter steinerner Meilenstein.

### facettenreich → die einzelnen Aspekte nennen; oder streichen
- **Warum:** Kalkiert „multifaceted". Verspricht Vielschichtigkeit, ohne eine einzige Facette zu benennen – typische LLM-Füllfloskel.
- **Mensch:** Der geschliffene Brillant wirkte unter dem Licht des Juweliers besonders facettenreich.

### robust → stabil, zuverlässig, belastbar
- **Warum:** Lehnwort aus „robust", von LLMs als pauschales Güteattribut überstrapaziert („robuste Lösung", „robustes Wachstum"). Im Technik-Fachtext legitim (Carve-out), sonst ein Tell.
- **Mensch:** Der alte Landrover ist robust genug für die Alpwege im Berner Oberland.

---

## Tier 1 – Mehrwort-Phrasen

### in der heutigen schnelllebigen welt → konkreten Kontext nennen oder direkt zur Sache; oft ganz streichen
- **Warum:** Häufigster deutscher LLM-Opener („in today's fast-paced world"). Inhaltsleerer Einstieg, der Bedeutung simuliert; durch Web-Quellen als Top-Tell bestätigt. (Querverweis: transition, formulaic-opener.)
- **Mensch:** Heute Morgen war die Welt noch in Ordnung, bis das Auto nicht ansprang.

### es lohnt sich, zu erwähnen → die Tatsache einfach hinschreiben
- **Warum:** Deutsches Pendant zu „it's worth noting". Ankündigung statt Aussage; der Inhalt steht erst danach und braucht die Vorrede nicht. (Vgl. filler „es ist erwähnenswert, dass"; hollow-intensifier „es lohnt sich, einen genaueren Blick darauf zu werfen".)
- **Mensch:** Der Ausflug auf den Pilatus lohnt sich vor allem bei klarer Sicht.

### ein zeugnis für → zeigt, beweist, belegt
- **Warum:** Lehnübersetzung von „a testament to". Pathosformel („ein Zeugnis für Innovationskraft"), die im deutschen Alltag so nie als Wendung gebraucht wird.
- **Mensch:** Am Freitag bekommt meine Tochter ihr erstes Zeugnis der Sekundarschule.

### auf ein neues level heben → verbessern, ausbauen; oder sagen, was besser wird
- **Warum:** Kalkiert „take it to the next level", dazu Anglizismus „Level". Reine Steigerungsfloskel ohne prüfbaren Inhalt – starkes LLM-Tell.
- **Mensch:** Im Computerspiel mussten wir erst genug Punkte sammeln, um ins nächste Level zu kommen.

---

## Tier 2 – im Cluster (>= 2 pro Absatz)

### das volle potenzial ausschöpfen → konkret sagen, was man damit erreicht
- **Warum:** „Potenzial ausschöpfen" kalkiert „unlock the full potential". Im Cluster mit weiteren Tier-2-Wörtern ein klares LLM-Muster; einzeln tolerierbar.
- **Mensch:** Mit dem neuen Trainer schöpfte der FC Thun sein Potenzial endlich besser aus.

### navigieren → bewältigen, durchkommen, umgehen mit
- **Warum:** Metaphorisches „navigieren" (durch Herausforderungen/Komplexität) übersetzt „navigate" und häuft sich in LLM-Text. Wörtliches Navigieren (Schiff, Karte) bleibt unverdächtig.
- **Mensch:** Der Kapitän navigierte das Kursschiff sicher durch den Nebel auf dem Genfersee.

### fördern → unterstützen, anregen, helfen bei
- **Warum:** Im LLM-Deutsch als Allzweck-Verb überdehnt („fördert Innovation", „fördert Zusammenarbeit"). Nur im Cluster mit anderen Tier-2-Floskeln ein Tell, weil das Wort im Förderwesen völlig normal ist.
- **Mensch:** Der Kanton fördert den Bau von Photovoltaikanlagen mit einem Beitrag.

### stärken → verbessern, ausbauen, sicherer machen
- **Warum:** Kalkiert „bolster / strengthen" als vages Verbesserungsverb. Im Cluster mit fördern/ermöglichen/optimieren ein Muster; allein zu alltäglich zum Flaggen.
- **Mensch:** Nach dem Bandriss machte sie Übungen, um das Knie wieder zu stärken.

### ermöglichen → lassen, erlauben, möglich machen; oder Aktivsatz
- **Warum:** LLM-Lieblingsverb für Nominal-/Passivkonstruktionen („ermöglicht es, … zu"). Erst die Häufung im Cluster ist ein Tell.
- **Mensch:** Das Stipendium ermöglichte ihm das Studium an der ETH.

### optimieren → verbessern, beschleunigen, einfacher machen
- **Warum:** Recherche nennt „optimiert" als ChatGPT-Buzzword. Im Cluster mit Tier-2-Vokabular ein Muster; im Ingenieur-/Mathekontext (Optimierungsproblem) legitim.
- **Mensch:** Der Velomechaniker optimierte die Schaltung, bis sie sauber durchschaltete.

### transformativ → sagen, was sich ändert und wie
- **Warum:** Lehnwort aus „transformative". Vage Bedeutungssteigerung ohne prüfbaren Inhalt; im Cluster ein deutliches LLM-Muster.
- **Mensch:** Die Lehrerin sprach in der Weiterbildung von transformativem Lernen als Fachbegriff.

### ökosystem → System, Netzwerk, Umfeld, Markt
- **Warum:** Metaphorisches „Ökosystem" (Anbieter/Tools/Partner) kalkiert „ecosystem" und ist im LLM-Tech-Deutsch inflationär. Biologisches Ökosystem bleibt unverdächtig (Carve-out im Fachtext).
- **Mensch:** Das Moor bei Rothenthurm ist ein empfindliches Ökosystem mit seltenen Pflanzen.

### vielzahl → viele, mehrere, eine konkrete Zahl
- **Warum:** Kalkiert „myriad / a multitude of". Nominalstil-Füller („eine Vielzahl von Möglichkeiten") statt schlicht „viele". Im Cluster ein Tell.
- **Mensch:** Auf dem Markt in Bern gab es eine Vielzahl alter Apfelsorten zu kaufen.

### fülle → viel, reichlich, eine konkrete Menge
- **Warum:** „eine Fülle an" kalkiert „plethora / wealth of". Typischer LLM-Mengen-Füller; im Cluster mit Vielzahl/zahlreich ein Muster.
- **Mensch:** Im alten Estrich fand sie eine Fülle vergilbter Familienfotos.

### eckpfeiler → Grundlage, Kern, wichtigster Teil
- **Warum:** Kalkiert „cornerstone". Pathos-Metapher („Eckpfeiler unserer Strategie"), die LLMs zur Bedeutungsaufladung streuen.
- **Mensch:** Beim Abbruch stiess man unter dem Eckpfeiler des Hauses auf eine Inschrift von 1880.

### von grösster bedeutung → wichtig, zentral, entscheidend; oder sagen, wofür
- **Warum:** Kalkiert „of paramount importance". Aufgeblähte Wichtigkeitsformel; im Cluster ein klares LLM-Muster, einzeln noch tolerierbar.
- **Mensch:** Für die Bergrettung ist die Wetterlage von grösster Bedeutung.

### aufkeimend → neu, jung, im Entstehen; oder mit Zahl belegen
- **Warum:** Kalkiert „burgeoning / nascent". LLM-Attribut für „junge" Märkte/Trends; im echten Gebrauch selten und bildhaft anders besetzt.
- **Mensch:** Im März sah man im Garten schon das erste aufkeimende Grün.

### entscheidend → wichtig, zentral; oder sagen, wofür es entscheidet
- **Warum:** Recherche nennt „Es ist entscheidend" als ChatGPT-Muster. Als pauschales Verstärkungswort überdehnt; im Cluster ein Tell, einzeln ganz normal.
- **Mensch:** Das entscheidende Tor fiel erst in der Nachspielzeit.

---

## Tier 3 – nur bei Dichte

### bedeutend → konkret werden: Zahl, Vergleich, Beispiel
- **Warum:** Deutsches „significant". Bei Dichte ein Zeichen, dass vage Bedeutung statt Fakten gesetzt wird; einzeln völlig unauffällig.
- **Mensch:** Gottfried Keller war ein bedeutender Schweizer Schriftsteller des 19. Jahrhunderts.

### innovativ → sagen, was konkret neu ist
- **Warum:** Inflations-Adjektiv im LLM-Marketing. Nur bei hoher Dichte flaggen, weil es in Wirtschaftstexten alltäglich ist.
- **Mensch:** Das Start-up aus Lausanne gilt in der Branche als ausgesprochen innovativ.

### effektiv → sagen, wie wirksam, mit Mass oder Mechanismus
- **Warum:** Vages Wirksamkeits-Adjektiv, von LLMs bei Dichte übernutzt. Einzeln und im Sinn von „tatsächlich" (effektiver Wert) völlig normal.
- **Mensch:** Der effektive Zinssatz lag am Ende höher als der beworbene.

### dynamisch → die konkreten Kräfte oder Veränderungen nennen
- **Warum:** Leeres Schwung-Adjektiv („dynamisches Umfeld"), bei Dichte ein LLM-Tell. Im Fachsinn (dynamische Last, dynamische Webseite) legitim.
- **Mensch:** Die Brücke muss auch dynamische Lasten durch den Verkehr aushalten.

### skalierbar → sagen, was wächst und bis wohin
- **Warum:** Tech-Schlagwort, das LLMs bei Dichte streuen. Im Software-/Infrastruktur-Fachtext legitim, darum nur Density-Flag.
- **Mensch:** Wir haben die Datenbank so aufgesetzt, dass sie auf mehr Nutzer skalierbar bleibt.

### überzeugend → sagen, was genau überzeugt
- **Warum:** Deutsches „compelling". Pauschallob, bei Dichte ein Tell; einzeln völlig gebräuchlich.
- **Mensch:** Ihre Präsentation am Elternabend war kurz und überzeugend.

### beispiellos → das gebrochene Beispiel / den Vergleich nennen
- **Warum:** Deutsches „unprecedented". LLMs setzen es als Superlativ ohne genannten Präzedenzfall; bei Dichte ein Tell.
- **Mensch:** Die Hitze im Sommer 2003 war für die Schweiz damals beispiellos.

### aussergewöhnlich → sagen, was die Ausnahme ausmacht
- **Warum:** Deutsches „exceptional". Pauschallob, bei Dichte ein Tell; einzeln völlig normal.
- **Mensch:** Der Käse von dieser Alp schmeckt wirklich aussergewöhnlich gut.

### bemerkenswert → sagen, was genau bemerkenswert ist
- **Warum:** Deutsches „remarkable". Füllt Lob ohne Substanz; nur bei Dichte flaggen.
- **Mensch:** Bemerkenswert war, dass der Zug trotz Schneesturm pünktlich ankam.

### ausgeklügelt → die konkrete Raffinesse beschreiben
- **Warum:** Deutsches „sophisticated". Vages Komplexitätslob, bei Dichte ein Tell; einzeln gut gebräuchlich.
- **Mensch:** Der Uhrmacher zeigte uns das ausgeklügelte Räderwerk der alten Standuhr.

---

## Tier-3-Phrasen – Boilerplate (>= 2x oder >= 3 verschiedene)

### die integration von → sagen, was zusammenkommt und was sich für den Nutzer ändert
- **Warum:** Kalkiert „the integration of (X with Y)". Nominalstil-Boilerplate, das in LLM-Tech-Text gehäuft auftritt; bei Wiederholung/Cluster ein Tell.
- **Mensch:** Die Integration der Neuzugezogenen klappte im Dorf erstaunlich rasch.

### die schnittstelle von → die konkrete Überschneidung nennen, die zählt
- **Warum:** Kalkiert „the intersection of (X and Y)" im metaphorischen Sinn. LLM-Rahmenformel („an der Schnittstelle von KI und Medizin"). Technische Schnittstelle (API, Stecker) bleibt unverdächtig.
- **Mensch:** Die USB-Schnittstelle am alten Drucker funktioniert nicht mehr.

### community-getrieben → sagen, was die Community konkret tut
- **Warum:** Kalkiert „community-driven", dazu Anglizismus. Reines Füllwort in Web3-/Open-Source-LLM-Prosa; bei Wiederholung/Cluster ein Tell.
- **Mensch:** Das Quartierfest wird seit Jahren von einem Verein freiwillig organisiert.

### langfristige nachhaltigkeit → Zeithorizont und Bedingung nennen (bis wann, woraus finanziert)
- **Warum:** Kalkiert „long-term sustainability". Doppelte Beteuerung ohne Inhalt; „langfristig" und „Nachhaltigkeit" sagen einzeln schon dasselbe. Bei Wiederholung/Cluster ein Tell.
- **Mensch:** Der Förster achtet darauf, dass im Wald nur so viel geschlagen wird, wie nachwächst.

### nutzer-engagement → die konkrete Handlung nennen (Klicks, Kommentare, Verweildauer)
- **Warum:** Anglizismus-Spur („user engagement"). Sammelbegriff, der die eigentliche Kennzahl verdeckt; in LLM-Marketing-Text gehäuft. Bei Wiederholung/Cluster ein Tell.
- **Mensch:** Sein politisches Engagement im Gemeinderat nahm viel Freizeit in Anspruch.

---

## Phrasen-Tells je Kategorie

Quelle für die Regex-Arrays des Detectors. Mehrfach belegte Floskeln stehen in ihrer
treffendsten Kategorie; Querverweise sind vermerkt.

### transition

#### darüber hinaus → ausserdem, zudem, auch
- **Warum:** Formelhafte Brücken-Phrase, mit der deutsche LLMs Absätze aneinanderreihen. Klingt gestelzt; ein Mensch sagt im Fliesstext meist schlicht „ausserdem" oder strukturiert so um, dass der Bezug ohne Floskel klar ist.
- **Mensch:** Die Offerte deckt die Hardware ab. Der Support kostet extra.

#### des weiteren → ausserdem, weiter, dann
- **Warum:** Behörden-/Aufzählungsfloskel, die LLMs als Standard-Konnektor streuen. In moderner Prosa selten nötig; häufiges Auftreten ist ein Reihungs-Tell.
- **Mensch:** Weiter braucht es noch die Unterschrift der Geschäftsleitung.

#### wenn es um … geht → direkt über die Sache schreiben
- **Warum:** Leerlauf-Rahmen („Wenn es um X geht, …"), mit dem LLMs ein Thema umständlich anmoderieren, statt es direkt zu behandeln.
- **Mensch:** Bei der Lohnabrechnung achten wir vor allem auf die Quellensteuer.

> Querverweis: „in der heutigen schnelllebigen welt" (siehe Tier 1 – Mehrwort-Phrasen, auch formulaic-opener) und „zusammenfassend lässt sich sagen" / „abschliessend lässt sich festhalten" (siehe generic-conclusion).

### filler

#### es ist wichtig zu beachten, dass → weglassen; die Aussage direkt machen
- **Warum:** Die kanonische deutsche LLM-Füllfloskel. Kündigt Wichtigkeit an, statt sie zu zeigen; der Satz funktioniert fast immer ohne den Vorspann.
- **Mensch:** Achtung: Die Frist läuft schon am Freitag ab, nicht erst am Montag.

#### es sei darauf hingewiesen, dass → weglassen; die Aussage direkt machen
- **Warum:** Passiv-Füllrahmen, den LLMs anstelle einer direkten Aussage setzen. Verschiebt den eigentlichen Inhalt nach hinten und klingt amtlich-distanziert.
- **Mensch:** Bitte beachten Sie, dass das Büro über Auffahrt geschlossen bleibt.

#### im hinblick auf → bei, für, zu
- **Warum:** Nominaler Füller-Konnektor, der eine simple Präposition aufbläht. LLMs greifen ihn statistisch bevorzugt; gehäuft ein Tell.
- **Mensch:** Für die neue Maschine brauchen wir noch eine CE-Konformitätserklärung.

#### in bezug auf → zu, bei, für
- **Warum:** Gleiche Füllfunktion wie „im Hinblick auf"; aufgeblähte Präposition, die LLMs reflexhaft einstreuen.
- **Mensch:** Zur Garantie steht alles im Kleingedruckten auf Seite zwei.

#### es ist erwähnenswert, dass → weglassen; den Punkt direkt nennen
- **Warum:** Direkte Übersetzung von „it is worth noting that". Signalisiert Bedeutsamkeit, ohne sie zu belegen; reiner Füller.
- **Mensch:** Übrigens hat der Lieferant diesmal zwei Tage früher geliefert.

### chatbot

#### gerne helfe ich dir weiter → weglassen; die Antwort direkt liefern
- **Warum:** Servicephrase aus dem Chat-Interface, die in fertige Texte durchsickert. Reines Gesprächs-Tic ohne Inhalt.
- **Mensch:** Melde dich, wenn beim Login etwas klemmt, dann schau ich kurz drüber.

#### ich hoffe, das hilft dir weiter → weglassen
- **Warum:** Direkte Entsprechung von „I hope this helps". Typischer Chatbot-Closer, der in publizierten Texten nichts verloren hat.
- **Mensch:** Sag Bescheid, ob das so passt oder ob ich etwas anpassen soll.

#### zögere nicht, mich zu kontaktieren → melde dich bei Fragen; oder weglassen
- **Warum:** Lehnübersetzung von „don't hesitate to reach out". „Zögere nicht" ist im Deutschen unidiomatisch und ein starker Anglizismus-Marker generierter Schlüsse.
- **Mensch:** Bei Fragen erreichen Sie mich am besten direkt auf dem Natel.

#### in diesem artikel werden wir untersuchen → direkt einsteigen, ohne Ankündigung
- **Warum:** Meta-Narration, mit der LLMs den Text über sich selbst ankündigen, statt zu liefern. In echter Prosa fast immer überflüssig.
- **Mensch:** Auf den nächsten Seiten finden Sie die Montageanleitung Schritt für Schritt.

#### ich hoffe, diese e-mail erreicht sie gut → weglassen oder konkreten Bezug nennen
- **Warum:** Lehnübersetzung von „I hope this email finds you well". Im Deutschen unüblicher Höflichkeits-Opener und verbreiteter LLM-E-Mail-Marker.
- **Mensch:** Ich melde mich kurz wegen des Termins am Donnerstag.

> Querverweis: „lassen sie uns eintauchen" als Chatbot-Opener – siehe lets-construction („lass uns eintauchen" / „tauchen wir ein in").

### sycophantic

#### das ist eine grossartige frage → weglassen; direkt antworten
- **Warum:** Direkte Übersetzung von „great question". Bewertet die Frage, statt sie zu beantworten; klassische Chat-Schmeichelei. (Vgl. acknowledgment-loop „das ist eine ausgezeichnete Frage".)
- **Mensch:** Gute Idee, das prüfen wir am Montag im Team.

#### du hast völlig recht → weglassen; auf die Sache eingehen
- **Warum:** Reflexhafte Zustimmungsfloskel („you're absolutely right"), die LLMs vor die eigentliche Aussage setzen. Inhaltsleere Schmeichelei.
- **Mensch:** Stimmt, den Posten hatte ich übersehen, ich korrigiere die Rechnung.

#### das ist ein sehr aufschlussreicher punkt → weglassen; den Punkt sachlich aufgreifen
- **Warum:** Lobende Leerformel („a really insightful point"), die generierte Antworten als Einstieg verwenden. Bewertet statt zu argumentieren.
- **Mensch:** Der Einwand trifft zu, deshalb planen wir den Puffer jetzt grosszügiger.

### generic-conclusion

#### zusammenfassend lässt sich sagen → weglassen und direkt das Fazit nennen, z. B. «Unterm Strich: X»
- **Warum:** Der häufigste deutsche LLM-Schluss-Trigger. Kündigt eine Zusammenfassung an, die nichts Neues bringt; menschliche Autoren springen direkt ins Fazit, statt es anzukündigen. (Auch als transition-Konnektor und Tier-3-Phrase belegt.)
- **Mensch:** Die Sitzung war kurz, weil sich alle schon einig waren.

#### abschliessend lässt sich festhalten → weglassen; den Schlusssatz selbst stehen lassen
- **Warum:** Floskelhafte Schluss-Ankündigung im Nominalstil (festhalten + lassen-Passiv), die typisch am Textende von ChatGPT-/Gemini-Ausgaben steht und keine Aussage transportiert.
- **Mensch:** Zum Schluss haben wir noch die Rechnung geteilt und sind heimgegangen.

#### insgesamt zeigt sich, dass → die Beobachtung direkt nennen, ohne Meta-Rahmen
- **Warum:** Leere Synthese-Formel mit reflexivem „zeigt sich" (Pseudo-Objektivität). LLMs setzen sie als Absatz- oder Textschluss ein, wo ein Mensch einfach das Ergebnis hinschreibt.
- **Mensch:** Insgesamt haben wir vierzig Franken bezahlt, das ging in Ordnung.

#### es bleibt abzuwarten, wie sich → konkrete offene Frage benennen, z. B. «Ob die Preise sinken, weiss niemand»
- **Warum:** Inhaltsleerer Zukunfts-Closer (deutsches Pendant zu „only time will tell"), der jede Festlegung vermeidet. Klassischer Aufsatz-Schluss von KI-Texten.
- **Mensch:** Wir mussten abwarten, bis der Zug in Olten endlich Anschluss hatte.

#### eines ist sicher → die sichere Aussage direkt behaupten, ohne Vorspann
- **Warum:** Dramatisierender Schluss-Opener (Pendant zu „one thing is certain"), der Bedeutung suggeriert, bevor irgendetwas gesagt ist. Stark formelhaft in deutschen LLM-Closern.
- **Mensch:** Sicher ist der Termin erst, wenn das Sekretariat ihn bestätigt.

### lets-construction

#### lass uns eintauchen → weglassen und mit dem ersten Punkt beginnen
- **Warum:** Direkte Lehnübersetzung von „let's dive in". „Eintauchen" als Metapher für „anfangen" ist im Deutschen unidiomatisch und ein eindeutiges Chatbot-Tell.
- **Mensch:** Im Hallenbad bin ich zuerst ins kalte Becken getaucht.

#### tauchen wir ein in → weglassen; das Thema direkt nennen
- **Warum:** Adhortativ-Variante desselben „dive in"-Calque, beliebter Themen-Opener in deutschen ChatGPT-Ausgaben. Kein Mensch leitet einen Sachtext so ein.
- **Mensch:** Tauchen wir am Wochenende wieder im Vierwaldstättersee?

#### lass uns das aufschlüsseln → direkt gliedern, z. B. «Es gibt drei Punkte:»
- **Warum:** Calque von „let's break this down". Kündigt eine Aufschlüsselung an, statt sie zu liefern; typische Chatbot-Conversational-Brüche.
- **Mensch:** Den Lohn musste ich nach Abzügen noch selber aufschlüsseln.

#### schauen wir uns das genauer an → weglassen und den Punkt direkt ausführen
- **Warum:** Deutsches „let's take a closer look". Füll-Überleitung ohne Information, die LLMs vor jedem neuen Abschnitt einstreuen.
- **Mensch:** Den Mietvertrag haben wir uns vor der Unterschrift genau angeschaut.

#### lass uns gemeinsam erkunden → weglassen; das Vorhaben sachlich nennen
- **Warum:** Wir-Pathos plus „explore"-Calque; das aufgesetzte „gemeinsam" ist reine Chatbot-Geselligkeit ohne Funktion im Text.
- **Mensch:** Wir wollten den Wald oberhalb des Dorfs gemeinsam erkunden.

### reasoning-artifact

#### lass mich das schritt für schritt durchgehen → einfach nummerieren oder die Schritte direkt aufzählen
- **Warum:** Lehnübersetzung von „let me go through this step by step"; verbalisiert die Chain-of-Thought-Anweisung. Ein Mensch zeigt die Schritte, statt sie anzukündigen.
- **Mensch:** Ich bin die Checkliste vor dem Abflug Schritt für Schritt durchgegangen.

#### gehen wir das systematisch an → weglassen; mit dem ersten konkreten Schritt starten
- **Warum:** Deutsches „let's approach this systematically". Meta-Kommentar über das eigene Vorgehen, ein klassisches Reasoning-Artefakt aus dem Prompt.
- **Mensch:** Die Lehrerin ist den Stoff systematisch von vorne aufgebaut.

#### lass mich kurz nachdenken → weglassen; direkt die Antwort liefern
- **Warum:** Verbalisierter Denkprozess („let me think"). Ein fertiger Text hat schon nachgedacht; die Ansage ist reines Chatbot-Performen von Bedachtheit.
- **Mensch:** Lass mich kurz nachdenken, ob wir am Samstag überhaupt Zeit haben.

### acknowledgment-loop

#### um deine frage zu beantworten → weglassen; die Antwort direkt geben
- **Warum:** Calque von „to answer your question". Spiegelt die Frage zurück, statt zu antworten – reine Dialog-Quittung, die in Fliesstext nichts verloren hat.
- **Mensch:** Um die Prüfung zu bestehen, musste ich drei Wochen lernen.

#### du fragst dich vielleicht → weglassen; die Information direkt liefern
- **Warum:** Deutsches „you might be asking". Unterstellt dem Leser eine Frage, um eine Pseudo-Überleitung zu bauen; typischer KI-Anrede-Loop.
- **Mensch:** Du fragst dich sicher, warum ich gestern nicht angerufen habe.

#### das ist eine ausgezeichnete frage → weglassen und direkt antworten
- **Warum:** Lehnübersetzung von „that's a great question". Reines Lob-Quittieren aus dem Chat-Kontext, das in einem Text keine Funktion hat und sofort als KI auffällt. (Vgl. sycophantic „das ist eine grossartige Frage".)
- **Mensch:** An der Tagung kam aus dem Publikum eine wirklich gute Frage zur Finanzierung.

#### die frage, ob → die Sache direkt behaupten oder verneinen, statt sie als Frage zu rahmen
- **Warum:** Nominalisierte Themen-Ankündigung („the question of whether"), die LLMs als Absatzeinstieg nutzen, um eine Entscheidung hinauszuzögern. Nominalstil statt klarer Aussage.
- **Mensch:** Die Frage, ob wir zügeln, hat uns das ganze Jahr beschäftigt.

### rhetorical-question

#### aber was bedeutet das für dich → die konkrete Folge direkt nennen, z. B. «Konkret heisst das: X»
- **Warum:** Deutsches „but what does this mean for you". Inszenierte Überleitungsfrage, die der Text sich selbst stellt; klassisches KI-Absatz-Scharnier ohne echten Adressaten.
- **Mensch:** Was die neue Verordnung für unseren Betrieb bedeutet, hat uns der Treuhänder erklärt.

#### warum ist das wichtig → weglassen und die Relevanz als Aussage formulieren
- **Warum:** Selbstgestellte Bedeutungsfrage („why does this matter") als Zwischenüberschrift oder Absatzstart – ein formelhaftes KI-Gliederungsmuster ohne Informationsgehalt.
- **Mensch:** Warum die Prüfung so wichtig war, hat mir erst später eingeleuchtet.

#### wie geht es nun weiter → die nächsten Schritte direkt benennen, statt sie als Frage anzukündigen
- **Warum:** Deutsches „what's next"; formelhafter Überleitungs- oder Schluss-Trigger, der einen Ausblick rhetorisch ankündigt, statt ihn zu geben.
- **Mensch:** Wie es nach der Lehre weitergeht, weiss ich noch nicht genau.

### significance-inflation

#### markiert einen wendepunkt → konkret nennen, was sich ändert (z. B. „ab 2026 gilt die neue Regel")
- **Warum:** Formelhafte Bedeutungs-Aufblähung deutscher LLMs: ein beliebiges Ereignis wird zum historischen Wendepunkt erklärt, ohne falsifizierbaren Inhalt. Äquivalent zu „marking a pivotal moment".
- **Mensch:** Der Streik 1918 war der Wendepunkt in der Schweizer Sozialgeschichte.

#### ein meilenstein in der entwicklung von → weglassen oder das Ergebnis direkt benennen („die erste Version, die offline läuft")
- **Warum:** „Meilenstein in der Entwicklung von X" ist eine LLM-Standardkadenz, die Wichtigkeit behauptet statt sie zu belegen. Der vollständige Floskel-Block ist das Tell, nicht das Einzelwort Meilenstein.
- **Mensch:** Der erste Tunneldurchstich am Gotthard war ein Meilenstein für das Dorf.

#### spielt eine entscheidende rolle → die Wirkung konkret beschreiben („senkt die Kosten um einen Drittel")
- **Warum:** „X spielt eine entscheidende/wichtige Rolle bei Y" ist eine der häufigsten Leerformeln deutscher KI-Texte: maximale Bedeutung, null Information. Wird in Erklär- und SEO-Texten reflexartig produziert. (Vgl. nominalstil „eine entscheidende Rolle spielen".)
- **Mensch:** Beim Jassen spielt der Trumpf eine entscheidende Rolle.

### vague-attribution

#### experten sind sich einig → konkrete Quelle nennen („das BAG empfiehlt", „Studie X der ETH zeigt")
- **Warum:** Anonyme Autoritätsberufung ohne Beleg, ein Kernmuster halluzinierender LLMs. Echte Fachtexte nennen Namen, Institutionen oder Quellen; „Experten sind sich einig" ohne Wer ist das Tell.
- **Mensch:** Die Experten der Kommission waren sich beim Bericht uneinig und stimmten getrennt ab.

#### studien belegen → konkrete Studie mit Autor/Jahr nennen, sonst die Behauptung streichen
- **Warum:** „Studien belegen/zeigen" ohne Angabe welcher Studie ist eine vage Quellen-Attribution, die deutsche LLMs zur Untermauerung erfundener Aussagen einstreuen. Pendant zu „studies show".
- **Mensch:** Die Studie des SECO von 2024 belegt einen Rückgang der Lehrstellen.

#### forschung zeigt, dass → Disziplin, Quelle oder Befund konkretisieren („Eine Metaanalyse von 2023 fand …")
- **Warum:** „Die Forschung zeigt, dass …" ist eine quellenlose Sammelberufung, typisch für KI-generierte Ratgeber- und Wissenstexte. Die Vagheit (welche Forschung?) ist das Signal.
- **Mensch:** In meiner Forschung zeige ich, dass die Methode bei kleinen Stichproben versagt.

### hollow-intensifier

#### ehrlich gesagt → weglassen, der Satz wird ehrlicher ohne die Ankündigung
- **Warum:** Als satzeröffnender Diskursmarker ist „ehrlich gesagt" ein hohler Verstärker, den LLMs zur vorgetäuschten Aufrichtigkeit voranstellen. Pendant zu „to be honest / quite frankly".
- **Mensch:** Hat er das ehrlich gesagt oder nur, um dich zu beruhigen?

#### seien wir ehrlich → weglassen und direkt die Aussage machen
- **Warum:** Formelhafter Pseudo-Klartext-Opener („let's be honest/clear"), der Nähe und Mut simuliert, ohne Inhalt hinzuzufügen. In deutschen LLM-Blogtexten ein wiederkehrendes Füllsel.
- **Mensch:** In dem Gespräch baten wir sie: Seien wir ehrlich zueinander, auch wenn es wehtut.

#### es lohnt sich, einen genaueren blick darauf zu werfen → den genaueren Blick einfach liefern, statt ihn anzukündigen
- **Warum:** Inhaltsleere Aufwertungsfloskel, mit der KI-Texte Relevanz behaupten, bevor etwas gesagt wird. Reine Verstärkung ohne Substanz, typischer LLM-Übergang.
- **Mensch:** Der Aufpreis für das Abo lohnt sich, weil der Support inbegriffen ist.

### emotional-flatline

#### was mich am meisten überrascht hat → die Beobachtung direkt und mit Detail schildern
- **Warum:** Aufgesetzte Pseudo-Emotion als Listen-Intro, typisch für KI-„persönliche" Texte. Die Emotion wird behauptet statt gezeigt; Pendant zu „what surprised me most".
- **Mensch:** Am meisten überrascht hat mich, dass meine Grossmutter noch Velo fährt.

#### es bleibt spannend zu sehen → die offene Frage konkret benennen oder den Satz streichen
- **Warum:** Flacher Pseudo-Spannungs-Closer ohne echte Aussage, deutsches LLM-Standardfazit. „Spannend" markiert Gefühl, das der Text nicht einlöst.
- **Mensch:** Das Cup-Spiel gegen YB wird spannend, weil unser Goalie verletzt ist.

#### besonders faszinierend ist → das Detail nennen, das faszinierend sein soll, ohne die Etikette
- **Warum:** „Faszinierend" als vorangestelltes Gefühls-Label ist emotionale Flachheit: das LLM behauptet Begeisterung, statt sie durch konkrete Beobachtung entstehen zu lassen.
- **Mensch:** Die Ausstellung über Tinguely fand ich faszinierend, vor allem die lärmenden Maschinen.

### novelty-inflation

#### was dir niemand sagt → die Information schlicht geben („Drei Punkte, die im Vertrag oft fehlen")
- **Warum:** Künstliche Geheimwissen-Aufblähung („what nobody tells you"), die Exklusivität vortäuscht. Clickbait-Muster, das deutsche LLMs aus Marketing-Trainingsdaten übernehmen.
- **Mensch:** Was dir niemand sagt, bevor du das Haus kaufst, hat mir mein Nachbar erklärt.

#### ein problem, über das niemand spricht → das Problem direkt benennen und belegen
- **Warum:** Behauptete Neuheit/Tabu, um Aufmerksamkeit zu erzeugen, obwohl das Thema breit diskutiert ist. Typischer KI-Aufmacher für Meinungs- und LinkedIn-Texte.
- **Mensch:** Über die Einsamkeit auf dem Hof spricht in unserem Dorf wirklich kaum jemand.

#### die wahrheit, die alle übersehen → die Aussage ohne Geheimnis-Rahmung treffen
- **Warum:** „Die Erkenntnis/Wahrheit, die alle übersehen" ist aufgeblasene Pseudo-Originalität, ein deutsches Pendant zu „the insight everyone's missing". Suggeriert exklusiven Durchblick ohne Substanz.
- **Mensch:** Beim Korrekturlesen hat sie den Tippfehler entdeckt, den alle übersehen hatten.

### cutoff-disclaimer

#### als ki-sprachmodell → streichen; den Inhalt direkt formulieren, ohne Selbstauskunft des Modells
- **Warum:** Kanonischer Selbst-Disclaimer von ChatGPT/Gemini im Deutschen. Ein Mensch bezeichnet sich nie als Sprachmodell; nahezu definitiver KI-Fingerabdruck.
- **Mensch:** Als langjähriger Projektleiter weiss ich, dass die Termine im Januar immer eng werden.

#### als künstliche intelligenz habe ich keinen zugriff → streichen oder konkret sagen, was fehlt: «Ich habe die Quartalszahlen noch nicht.»
- **Warum:** Modell identifiziert sich als KI und entschuldigt fehlende Daten in einem Atemzug. Reine Maschinen-Selbstauskunft, kommt in echter Schweizer Prosa nicht vor.
- **Mensch:** Künstliche Intelligenz ist bei uns seit zwei Jahren im Support-Team im Einsatz.

#### stand meines letzten updates → konkretes Datum nennen: «Stand März 2026» – oder die Einschränkung ganz weglassen
- **Warum:** Direkte Übersetzung von „as of my last update". Bezieht sich auf den Trainings-Cutoff des Modells; ein Mensch hat keinen „letzten Update-Stand" seines Wissens.
- **Mensch:** Stand letzter Woche sind noch drei Offerten offen, der Rest ist abgeschlossen.

#### mein wissensstand reicht bis → streichen; falls Aktualität wichtig ist, das Bezugsdatum der Fakten nennen
- **Warum:** Verweist auf den Trainings-Cutoff („my knowledge cutoff"). Charakteristische Modell-Floskel; Menschen formulieren Unsicherheit über konkrete Sachverhalte, nicht über einen „Wissensstand bis Datum X".
- **Mensch:** Mein Kenntnisstand zur Baustelle reicht bis zur letzten Sitzung, danach war ich in den Ferien.

#### ich habe keinen zugriff auf echtzeitdaten → streichen oder konkret: «Die aktuellen Börsenkurse kenne ich nicht.»
- **Warum:** Standard-Haftungsformel von Assistenz-Modellen („I don't have access to real-time data"). Beschreibt eine technische Eigenschaft des Modells, keine menschliche Situation.
- **Mensch:** Auf die Echtzeitdaten der Anlage habe ich von zu Hause aus leider keinen Zugriff.

### template-phrase

#### ein wichtiger schritt in richtung → konkret: „damit fällt die manuelle Freigabe weg" – die Wirkung statt das Etikett
- **Warum:** Template „a [Adj] step towards X". Inhaltsleeres Bedeutungs-Etikett, das LLMs reflexhaft an Ankündigungen hängen.
- **Mensch:** Der Umzug ins neue Büro war ein grosser Schritt für das ganze Team, vor allem fürs Lager.

#### ob sie nun anfänger oder profi sind → streichen; direkt sagen, für wen es relevant ist, falls nötig
- **Warum:** Template „whether you're X or Y" – die Pseudo-Inklusivität, mit der LLMs Marketing-Texte öffnen. In dieser symmetrischen Form fast nur in KI-Text.
- **Mensch:** Ob du nun mit dem Zug oder dem Auto kommst, melde dich bitte kurz vor der Abfahrt.

#### ich hatte kürzlich das vergnügen → direkt: „Letzte Woche war ich an der Konferenz X."
- **Warum:** LinkedIn-Post-Template („I recently had the pleasure of"), das LLMs als gefühlten Einstieg generieren. Geschwollene Standardwendung.
- **Mensch:** Es war mir ein Vergnügen, an Ihrer Hochzeit die Festrede halten zu dürfen.

### false-concession

#### zwar ist x beeindruckend, doch → die Einschränkung direkt machen, ohne das Lob-dann-Aber-Gerüst
- **Warum:** Rhetorisches Schein-Zugeständnis: erst eine pauschale Bewunderung, dann der eingeübte Schwenk. „Zwar … doch/aber" als Aufwertungs-Abwertungs-Schablone ist ein deutsches LLM-Strukturmuster.
- **Mensch:** Zwar regnete es den ganzen Tag, doch das Fest fand trotzdem statt.

#### obwohl x fortschritte gemacht hat, bleibt → konkret sagen, was fehlt, statt der ausgewogen wirkenden Floskel
- **Warum:** „Obwohl X grosse Fortschritte gemacht hat, bleibt Y eine Herausforderung" ist eine LLM-Balance-Schablone, die Differenziertheit vortäuscht. Pendant zu „although X has made strides".
- **Mensch:** Obwohl sie im Winter trainiert hatte, reichte es am Engadiner nicht aufs Podest.

### future-narrative

#### könnte zu einem der wichtigsten narrative der nächsten jahre werden → falsifizierbare Aussage oder streichen: „drei Anbieter planen für 2027 den Marktstart"
- **Warum:** Direkte Übersetzung des „may become one of the most important narratives"-Templates: vage Zukunftsbedeutung ohne prüfbaren Inhalt. Klassischer Krypto-/Tech-LLM-Closer.
- **Mensch:** Die Erzählung der Grossmutter über die Flucht 1945 ist für unsere Familie bis heute wichtig.

#### dürfte zu einem entscheidenden trend werden → konkrete Prognose mit Bezug: „Analysten von X erwarten bis 2027 ein Wachstum von Y"
- **Warum:** Variante des Future-Narrative-Closers (Modal + werden + vager Bedeutungs-Substantiv). Sagt nichts Prüfbares, suggeriert aber historische Tragweite – LLM-typisch.
- **Mensch:** Wenn das Wetter so bleibt, dürfte das ein guter Jahrgang für den Riesling werden.

### real-actual-inflation

#### echte wertschöpfung → die Wertschöpfung beziffern oder konkret beschreiben
- **Warum:** „echte/wahre/tatsächliche" als leerer Verstärker vor einem abstrakten Nomen, der unterstellt, der Rest der Branche sei unecht. KI-Pitch-Muster („real value", „genuine utility").
- **Mensch:** Die echte Bergkäse aus dem Greyerzerland kostet im Laden mehr.

#### tatsächlicher nutzen → den Nutzen konkret benennen („spart zwei Arbeitsschritte")
- **Warum:** „tatsächlicher Nutzen / echte Nachfrage / wahre Akzeptanz" sind LLM-Aufwertungen abstrakter Nomen, die Substanz suggerieren, wo keine belegt wird. Pendant zu „actual utility".
- **Mensch:** Der tatsächliche Stromverbrauch lag laut Zähler höher als die Schätzung.

### formulaic-opener

#### in der heutigen schnelllebigen welt → streichen und direkt mit dem konkreten Thema einsteigen
- **Warum:** Direkte Übersetzung des LLM-Default-Openers „in today's fast-paced world". Inhaltsleere Einleitung, in deutschen KI-Texten extrem überrepräsentiert; durch Web-Quellen als Top-Tell bestätigt. (Auch Tier 1 und transition.)
- **Mensch:** Die Welt des Skispringens ist schnelllebig, eine Saison entscheidet oft über die ganze Karriere.

#### in einer zeit, in der → streichen; mit der konkreten Beobachtung beginnen
- **Warum:** Floskelhafter Aufhänger („in an age where"), den LLMs als Aufmacher setzen, um Bedeutung zu suggerieren, ohne etwas zu sagen.
- **Mensch:** Es gab eine Zeit, in der wir den ganzen Lohn noch bar im Couvert ausbezahlt haben.

#### hat sich als führend etabliert → Beleg statt Behauptung: „hat 2025 den grössten Marktanteil erreicht"
- **Warum:** Inflationäre Bedeutungs-Behauptung („has emerged as a leader") ohne falsifizierbaren Beleg – typischer LLM-Aufmacher für Marketing-Prosa.
- **Mensch:** Unser kleiner Veloladen hat sich im Quartier über die Jahre einen guten Ruf erarbeitet.

#### wird zunehmend wichtiger → konkret werden: „die Nachfrage stieg 2025 um 40 Prozent" – oder weglassen
- **Warum:** Vage Bedeutungs-Steigerung („is becoming increasingly important") ohne Zahl oder Quelle. LLM-Standardfloskel; ein Mensch nennt meist das konkrete Was.
- **Mensch:** Seit der Pensionierung von Herrn Meier ist mir der direkte Draht zum Kunden wichtiger geworden.

### confidence-calibration

#### interessanterweise → streichen; den Befund für sich sprechen lassen
- **Warum:** Satz-Opener („interestingly"), mit dem LLMs Relevanz behaupten, statt sie zu zeigen. Als reflexhafter Absatz-/Satzanfang ein deutsches KI-Tell.
- **Mensch:** Was ich an dem Buch interessant fand, war die Schilderung des Berner Stadtlebens um 1900.

#### bemerkenswerterweise → streichen; den bemerkenswerten Sachverhalt direkt nennen
- **Warum:** „Notably"-Adverb als Bedeutungs-Marker am Satzanfang. LLMs streuen diese -weise-Adverbien, um Gewicht vorzutäuschen.
- **Mensch:** Der Kassensturz war dieses Jahr bemerkenswert genau, wir lagen nur drei Franken daneben.

#### überraschenderweise → streichen oder konkret begründen, warum es überrascht
- **Warum:** „Surprisingly" als vorgeschaltete Bewertung. Reflexhaftes Confidence-Adverb in KI-Prosa, das die Reaktion vorgibt, statt sie der Lesenden zu überlassen.
- **Mensch:** Überraschend kam dann doch noch der Bescheid von der Gemeinde, kurz vor Weihnachten.

#### zweifellos → streichen; eine Aussage wird durch „zweifellos" nicht wahrer, nur lauter
- **Warum:** Leere Gewissheits-Beteuerung („undoubtedly"). LLMs setzen sie als Füllwort vor unbelegte Behauptungen; häufte sich in deutschen KI-Marketing-Texten.
- **Mensch:** An der Echtheit der Unterschrift bestand für den Notar kein Zweifel.

#### ohne zweifel → streichen; statt zu beteuern, einen Beleg liefern
- **Warum:** Variante von „without a doubt", gleiche Funktion: Gewissheit behaupten ohne Begründung. Typischer LLM-Verstärker.
- **Mensch:** Ich bin ohne Zweifel um sieben Uhr am Bahnhof, der Zug fährt ja erst um Viertel nach.

### parenthetical-hedge

#### (und zunehmend auch für kleinere betriebe) → wenn die Erweiterung wichtig ist, in den Hauptsatz nehmen; sonst streichen
- **Warum:** Pseudo-Beiseite („and increasingly, X"), die keine Information liefert, sondern Nachdenklichkeit aufführt. In Klammern + „zunehmend" ein LLM-Reflex.
- **Mensch:** Die Halle ist (seit dem Umbau 2024) auch für Rollstühle zugänglich.

#### (oder genauer gesagt, im engeren sinne) → direkt die präzise Formulierung wählen, statt sie nachzuschieben
- **Warum:** „Or more precisely, Y" als parenthetische Selbstkorrektur, die Sorgfalt simuliert, aber nichts klärt. LLM-Manierismus.
- **Mensch:** Wir treffen uns beim Bahnhof (genauer gesagt beim Kiosk neben Gleis 3).

#### (zumindest in der theorie) → wenn es eine echte Einschränkung gibt, sie benennen; sonst streichen
- **Warum:** „At least in theory" als eingeschobenes Hedge, das eine Aussage relativiert, ohne die Bedingung zu nennen. Vage Absicherung, KI-typisch.
- **Mensch:** Die Prüfung kann man (zumindest theoretisch, wenn der Platz reicht) auch im Sommer ablegen.

### hedge-stack

#### könnte möglicherweise → auf ein Wort reduzieren: „könnte" oder „vielleicht" – nicht beides
- **Warum:** Modal + Hedge-Adverb gestapelt („could potentially"). Doppelte Absicherung; je einzeln normal, die Stapelung ist das Tell.
- **Mensch:** Es könnte sein, dass der Zug Verspätung hat, der Wind ist heute stark.

#### dürfte letztlich eventuell → eine Modalstufe wählen: „dürfte" – die Adverb-Häufung streichen
- **Warum:** Stapel aus Modalverb und mehreren Hedge-Adverbien („may eventually possibly"). Die Kumulation entwertet die Aussage und ist ein LLM-Reflex zur Risikovermeidung.
- **Mensch:** Letztlich dürfte sich der Aufwand lohnen, auch wenn der Anfang mühsam war.

#### möglicherweise könnte unter umständen → genau eine Unsicherheitsmarkierung behalten, den Rest streichen
- **Warum:** Adverb-vor-Modal-Stapel („potentially could") plus drittes Hedge. Drei Absicherungen in Folge sind kein menschlicher Stil, sondern LLM-Hedging.
- **Mensch:** Unter Umständen verschieben wir den Anlass, das entscheiden wir am Freitag.

### nominalstil (NEU)

#### zur verfügung stellen → geben, bieten, bereitstellen
- **Warum:** Klassisches Funktionsverbgefüge, das deutsche LLMs überdurchschnittlich oft statt des Vollverbs setzen; bläht den Satz auf und ist ein Kern-Nominalstil-Tell.
- **Mensch:** Der Verein hat uns den Saal gratis gegeben.

#### in anspruch nehmen → nutzen, brauchen
- **Warum:** Funktionsverbgefüge; in KI-Ausgaben ein Standardbaustein für „nutzen", wirkt amtsdeutsch-aufgebläht. Tell vor allem in Häufung.
- **Mensch:** Wir mussten letzte Woche zum ersten Mal die Spitex nutzen.

#### zum einsatz kommen → verwendet/eingesetzt werden – besser aktiv: „wir verwenden"
- **Warum:** Funktionsverbgefüge mit Passivnote, das LLMs reflexartig statt „verwenden/einsetzen" produzieren; typischer aufgeblähter Technik-Stil.
- **Mensch:** Auf der Baustelle setzen wir jetzt einen grösseren Kran ein.

#### zur anwendung kommen → angewendet werden – besser aktiv: „wir wenden an"
- **Warum:** Funktionsverbgefüge, das KI-Texte für simples „anwenden" einsetzen; reines Nominalstil-Padding ohne Mehrwert.
- **Mensch:** Die neue Regel gilt ab Januar für alle Filialen.

#### unter beweis stellen → zeigen, beweisen
- **Warum:** Funktionsverbgefüge; in deutschen LLM-Texten häufiges Floskel-Upgrade von „zeigen/beweisen", wirkt phrasenhaft.
- **Mensch:** Sie hat im Final gezeigt, was sie kann.

#### die durchführung von → durchführen – besser konkret: „wir machen / wir führen durch"
- **Warum:** Nominalisierung mit Streck-Genitiv („die Durchführung von Tests" statt „Tests durchführen") ist ein Leitsymptom des KI-Nominalstils; -ung-Substantiv plus „von".
- **Mensch:** Wir führen die Prüfung am Montag durch.

#### eine entscheidende rolle spielen → ist wichtig für, entscheidet über, prägt
- **Warum:** Floskelhaftes Funktionsverbgefüge, das deutsche Chatbots fast reflexartig für „ist wichtig" verwenden; kombiniert Nominalstil mit Bedeutungs-Inflation. (Vgl. significance-inflation „spielt eine entscheidende Rolle".)
- **Mensch:** Beim Skifahren ist die Bindung das Wichtigste.

#### einen beitrag leisten → beitragen, helfen, mitmachen
- **Warum:** Funktionsverbgefüge; KI-Texte schreiben „einen Beitrag leisten zu" statt schlicht „beitragen", oft in Nachhaltigkeits-/CSR-Floskeln.
- **Mensch:** Jede und jeder kann beim Quartierfest mithelfen.

#### von grosser bedeutung sein → ist wichtig, zählt, ist zentral
- **Warum:** Nominalstil-Streckform für „ist wichtig"; in deutschen LLM-Ausgaben sehr häufig, oft gekoppelt mit Bedeutungs-Inflation. Tell in Häufung.
- **Mensch:** Für unseren Hof ist gutes Wetter im Heuet einfach wichtig.

### passiv (NEU)

#### es wird empfohlen, dass → wir empfehlen, empfehlenswert ist
- **Warum:** Unpersönliches Passiv mit „es wird", das KI-Texte statt einer klaren Aktiv-Empfehlung setzen; meidet Subjekt und Verantwortung, klassisches LLM-Muster.
- **Mensch:** Ich empfehle dir, vorher kurz anzurufen.

#### es sollte beachtet werden → beachte, wichtig ist, merk dir
- **Warum:** „Es-wird-/es-sollte"-Passiv ist ein Kennzeichen des unpersönlichen KI-Ratgeber-Tons; häuft sich in generierten Anleitungen.
- **Mensch:** Pass beim Wandern auf, der Weg ist nach dem Regen rutschig.

#### es wird davon ausgegangen, dass → wir gehen davon aus, vermutlich, man nimmt an
- **Warum:** Subjektloses Passiv, mit dem LLMs Aussagen ohne Urheber treffen; typisch für den distanziert-vagen KI-Stil und oft mit vager Attribution gekoppelt.
- **Mensch:** Wir rechnen damit, dass am Samstag mehr Leute kommen.

### ai-placeholder

#### [ihr name] → den echten Namen einsetzen oder die Zeile löschen
- **Warum:** Nicht ausgefüllter Slot-Platzhalter aus KI-Vorlagen (Mail-/Brief-Boilerplate); im Fliesstext praktisch beweisend für ungeprüft eingefügten Generat-Text.
- **Mensch:** Bitte tragen Sie auf dem Formular Ihren Namen und Ihre Adresse ein.

#### [firmenname] → den echten Firmennamen einsetzen oder löschen
- **Warum:** Eckige-Klammer-Platzhalter aus KI-Templates, der unausgefüllt mitgeliefert wurde; ausgeliefert ein nahezu definitives Tell.
- **Mensch:** Tragen Sie im Vertrag den Firmennamen vollständig ein.

#### [quelle einfügen] → die echte Quelle nennen oder die Aussage streichen
- **Warum:** Imperativer Slot-Platzhalter („einfügen") aus KI-Generaten; verrät, dass Boilerplate ohne Nachbearbeitung übernommen wurde.
- **Mensch:** Kannst du mir die Quelle zu dieser Zahl noch schicken?

#### TT.MM.JJJJ → ein konkretes Datum einsetzen
- **Warum:** Datums-Schablone als Platzhalter im fertigen Text ist ein KI-Vorlagen-Rückstand; ein echtes Datum wäre eingesetzt worden.
- **Mensch:** Schreiben Sie das Datum bitte im Format Tag, Monat, Jahr.
