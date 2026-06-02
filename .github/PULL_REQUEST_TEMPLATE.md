## Zusammenfassung

<!-- Was ändert dieser PR und warum? -->

## Checkliste

- [ ] `npm test` läuft durch (Engine-Fixtures + Vertrags-Check von `CATEGORIES.md`)
- [ ] Falls ich einen Detector-`type` hinzugefügt habe: er ist in `detector/CATEGORIES.md` dokumentiert und hat eine Fixture in `detector/patterns.test.js` (einen True-Positive **und** einen Fall, der nicht auslösen darf)
- [ ] Falls ich eine Nur-Ermessen-Regel hinzugefügt habe: sie ist unter „Skill-only" in `detector/CATEGORIES.md` gelistet
- [ ] Ich habe False Positives bedacht und Carve-outs für legitimes menschliches Schreiben ergänzt
- [ ] Jede Tatsachenbehauptung darüber, wie KI oder Menschen schreiben (z. B. „ChatGPT gibt X aus", „Menschen tun Y selten"), nennt eine Quelle
- [ ] Die Prosa, die ich ergänzt habe, besteht die eigene Prüfung des Skills (keine KI-Schreib-Tells, knappe Punkte, keine hohlen Verstärker)
- [ ] Schweizer Schreibweise eingehalten – kein Eszett, durchgängig `ss` (auch in Code-Kommentaren und Fixtures)
- [ ] `CHANGELOG.md`-Eintrag unter einer datierten `## [X.Y.Z]`-Überschrift ergänzt, und `SKILL.md`-`version:` erhöht, falls sich eine Regel geändert hat
