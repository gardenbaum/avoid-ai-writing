# Mitwirken

Danke, dass du dieses Skill verbessern hilfst. Es bringt einem LLM (und neu auch
einer deterministischen Engine) bei, KI-Schreib-Tells zu erkennen und zu beheben.
Beiträge sind willkommen – ein paar Dinge halten das Projekt kohärent.

## Schweizer Schreibweise

Dieses Repo ist auf Deutsch in Schweizer Schreibweise verfasst. **Kein Eszett:**
durchgängig `ss` – in Prosa, Tabellen, Beispielen, **Code-Kommentaren und
Test-Fixtures**. Umlaute bleiben. Beispiele: muss, dass, Strasse, grösser, heisst,
weiss, ausserdem, abschliessend. Beiträge, die das verletzen, werden nicht
übernommen.

## Wie das Repo zusammenhängt

| Pfad | Inhalt |
|------|--------|
| `SKILL.md` | Der menschenlesbare Regelkatalog. Die Source of Truth dafür, was als KI-Tell gilt. |
| `detector/patterns.js` | Die deterministische Engine – die ausführbare Teilmenge der Regeln. |
| `detector/CATEGORIES.md` | Die Zuordnung zwischen den SKILL.md-Regeln und den Detector-`type`s. Halte sie aktuell. |
| `README.md` | Der Pitch und die nummerierte Prosa-Muster-Liste. |
| `cursor-rules/`, `plugins/` | Editor- und Tool-Integrationen. |

## Eine Regel hinzufügen oder ändern

Entscheide zuerst, um welche Art Regel es sich handelt:

- **Regex-erkennbar** (eine Phrase, ein Zeichen, eine strukturelle Form) → ergänze sie
  in `SKILL.md`, füge die Erkennung in `detector/patterns.js` mit einem neuen `type`
  hinzu und ergänze eine Zeile in `detector/CATEGORIES.md`. Decke sie mit einer
  Fixture in `detector/patterns.test.js` ab (einen True-Positive *und* einen Fall, der
  *nicht* auslösen darf).
- **Nur Ermessen** (braucht Lesen nach Sinn – Ton, Struktur, Namedropping) → ergänze
  sie in der `SKILL.md`-Prosa und liste sie unter „Skill-only" in
  `detector/CATEGORIES.md`. Für diese gibt es keinen Detector-`type`.

Wenn du unsicher bist, was von beidem es ist, eröffne zuerst ein Issue, dann klären
wir das.

## Präzision vor Trefferquote

Dieses Skill ist bewusst auf False Negatives ausgerichtet: eine Regel, die
gewöhnliches menschliches Schreiben fälschlich flaggt, ist schlimmer als eine, die ein
Tell übersieht, weil False Positives das Vertrauen in jede andere Regel untergraben.
Bevor du eine Regel vorschlägst, frag dich, wer fälschlich geflaggt würde, und ergänze
Carve-outs für die legitimen Fälle. Ein Signal, das auf normaler Prosa auslöst, lohnt
sich nicht.

## Belege deine Quellen

Wenn deine Regel auf einer Tatsachenbehauptung darüber beruht, wie KI oder Menschen
schreiben – „der Geviertstrich `—` ist im Deutschen untypisch", „die meisten
Schreibenden tun X selten" – verlinke eine Quelle dafür. Diese Behauptungen werden
geprüft, und manche stellen sich als falsch oder vielschichtiger heraus, als sie
zuerst scheinen (typografische Anführungszeichen etwa sind ein Tipp-Zeit-Standard von
macOS und Word, kein Artefakt des Publikationsschritts). Eine Behauptung mit Quelle
lässt sich verifizieren, eine bloss behauptete nicht. Setze die Links in die
PR-Beschreibung oder direkt in die Regel.

## Tests ausführen

```bash
npm test
```

Das führt die Engine-Fixtures und den Vertrags-Check von `CATEGORIES.md` aus (jeder
Detector-`type` muss dokumentiert sein, und jeder dokumentierte Typ muss echt sein).
Beide müssen bestehen. Keine Abhängigkeiten zu installieren; nur Node 18+.

## Sauber schreiben

Dieses Repo überwacht die Schreibqualität, also muss die Prosa, die du ergänzt,
dieselbe Latte reissen. Lass deine Ergänzungen durch das Skill selbst laufen. Halte
Regel-Punkte knapp und beginne mit der Anweisung – orientiere dich an Länge und Ton der
Punkte, die schon in `SKILL.md` stehen. Streiche Verstärker wie „stark" oder
„mächtig"; lass die Regel für sich stehen.

## Changelog und Versionierung

Ergänze einen Eintrag in `CHANGELOG.md` unter einer datierten, versionierten
Überschrift (`## [X.Y.Z] – JJJJ-MM-TT`), passend zu den bestehenden Einträgen. Eine
neue Regel ist ein Minor-Versionssprung; aktualisiere das Feld `version:` in der
`SKILL.md`-Frontmatter entsprechend.
