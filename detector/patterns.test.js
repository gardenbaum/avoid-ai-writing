/**
 * Avoid AI Writing — Detector-Fixtures (deutsche/schweizer Portierung)
 *
 * Node-lauffaehige Smoke-Tests fuer die Erkennungs-Engine. Bewusst klein und
 * abhaengigkeitsfrei, damit sie auf jedem `node >= 18` ohne Installation
 * laufen. Aufruf ueber `npm run test:detector` und in der CI.
 *
 * Schweizer Schreibweise: kein Eszett, durchgaengig ss. Umlaute bleiben.
 *
 * Aufbau: pro wichtiger Kategorie ein True-Positive (Tell feuert) UND ein
 * Must-not-fire (normale Schweizer Prosa loest die Regel nicht aus). Dazu die
 * stabilen Vertraege (Laenge-Gates, Dedup-Mathematik, Trinary-API, deutsche
 * Label-Strings).
 */

const assert = require('node:assert/strict');
const AIDetector = require('./patterns.js');

let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

const typesOf = (r) => new Set(r.issues.map((i) => i.type));

console.log('Detector-Fixtures (Deutsch)');

// ─── Laenge-Gates + deutsche Sonderfall-Labels ──────────────────────

test('leerer Text liefert Label „Leer"', () => {
  const r = AIDetector.analyzeText('');
  assert.equal(r.label, 'Leer');
  assert.equal(r.issues.length, 0);
});

test('Text unter 10 Woertern liefert „Zu kurz" + tooShort', () => {
  const r = AIDetector.analyzeText('Ein kurzer, nicht bewertbarer Schnipsel.');
  assert.equal(r.tooShort, true);
  assert.equal(r.label, 'Zu kurz');
});

test('Text ueber 10k Woertern liefert „Text zu lang" + tooLong', () => {
  const r = AIDetector.analyzeText('wort '.repeat(10001));
  assert.equal(r.tooLong, true);
  assert.equal(r.label, 'Text zu lang');
});

// ─── Tier 1 / Tier 2 / Tier 3 ───────────────────────────────────────

test('flaggt deutsche Tier-1-Vokabel', () => {
  const r = AIDetector.analyzeText('Diese Loesung ist nahtlos und ganzheitlich. '.repeat(4) + 'Wir tauchen jetzt tief in die Materie ein und beleuchten die Details ausfuehrlich fuer alle Beteiligten.');
  assert.ok(typesOf(r).has('tier1'), 'tier1 deutsch erkannt');
});

test('flaggt normalen Schweizer Satz NICHT als Tier-1', () => {
  const r = AIDetector.analyzeText('Wir haben die Offerte gestern verschickt und warten nun auf die Rueckmeldung des Kunden aus Zuerich, die bis Freitag eintreffen soll.');
  assert.ok(!typesOf(r).has('tier1'), 'kein Fehlalarm');
});

test('flaggt Tier-1-Mehrwort-Phrase „tauchen wir ein"', () => {
  const r = AIDetector.analyzeText('Tauchen wir ein in das Thema und sehen uns die einzelnen Punkte gemeinsam genauer an, bevor wir weitermachen.');
  assert.ok(typesOf(r).has('tier1'), 'tier1-Phrase erkannt');
});

test('flaggt Tier-2-Cluster (>= 2 pro Absatz)', () => {
  const r = AIDetector.analyzeText('Das Oekosystem laesst sich optimieren und transformieren, wenn wir die Vielzahl an Schnittstellen geschickt navigieren und das Umfeld entscheidend staerken.');
  assert.ok(typesOf(r).has('tier2'), 'tier2-Cluster erkannt');
});

test('einzelnes Tier-2-Wort in normaler Prosa loest KEIN Cluster aus', () => {
  const r = AIDetector.analyzeText('Wir mussten die Route durch die Berge sorgfaeltig navigieren, weil der Pass wegen Schnee teilweise gesperrt war und Umwege noetig wurden.');
  assert.ok(!typesOf(r).has('tier2'), 'einzelnes tier2 kein Cluster');
});

test('flaggt Tier-3 bei Dichte (mehrfaches „innovativ")', () => {
  const r = AIDetector.analyzeText(('Das Produkt ist innovativ und das Team ist innovativ. Auch der Markt bleibt innovativ, weil alle innovativ denken und innovativ handeln. ').repeat(2));
  assert.ok(typesOf(r).has('tier3'), 'tier3-Dichte erkannt');
});

test('Tier-3-Phrase feuert bei Wiederholung (>= 2 Treffer)', () => {
  const r = AIDetector.analyzeText('Die Integration von Zahlungen zaehlt fuer die Akzeptanz. Die Integration von Identitaet ist der naechste Schritt. Beides setzt Mittel frei.');
  assert.ok(typesOf(r).has('tier3-phrase'), 'tier3-phrase bei 2x Wiederholung');
});

test('Tier-3-Phrasen-Cluster feuert bei 3 verschiedenen Floskeln', () => {
  const r = AIDetector.analyzeText('Die Integration von Zahlungen ist community-getrieben gedacht. Die langfristige Nachhaltigkeit des Netzes zaehlt am meisten. Die Akzeptanz steigt.');
  const ts = typesOf(r);
  assert.ok(ts.has('tier3-phrase-cluster'), 'cluster bei 3 verschiedenen Phrasen');
  assert.ok(!ts.has('tier3-phrase'), 'per-Phrase-Regel feuert hier nicht');
});

// ─── Phrasen-Kategorien: je ein TP + ein Must-not-fire ──────────────

test('flaggt deutschen Chatbot-Artefakt', () => {
  const r = AIDetector.analyzeText('Gerne! Ich hoffe, das hilft dir weiter. Zoegere nicht, dich bei Fragen jederzeit wieder bei mir zu melden.');
  assert.ok(typesOf(r).has('chatbot'));
});

test('Chatbot-Artefakte zaehlen als P0 (critical)', () => {
  const r = AIDetector.analyzeText('Gerne! In diesem Artikel werden wir das Thema beleuchten. Ich hoffe, das hilft dir weiter.');
  const chatbot = r.issues.filter((i) => i.type === 'chatbot');
  assert.ok(chatbot.length >= 1, `Chatbot-Treffer erwartet, ${chatbot.length}`);
  assert.equal(AIDetector.SEVERITY_LABELS[chatbot[0].severity], 'P0');
});

test('flaggt deutschen Cutoff-Disclaimer', () => {
  const r = AIDetector.analyzeText('Als KI-Sprachmodell habe ich keinen Zugriff auf Echtzeitdaten und kann dir den aktuellen Kurs daher leider nicht nennen.');
  assert.ok(typesOf(r).has('cutoff-disclaimer'));
});

test('flaggt deutsche Vage-Attribution', () => {
  const r = AIDetector.analyzeText('Experten glauben, dass der Markt waechst. Studien zeigen einen klaren Trend nach oben in den naechsten Jahren.');
  assert.ok(typesOf(r).has('vague-attribution'));
});

test('normaler Bericht loest Chatbot/Cutoff/Vage NICHT aus', () => {
  const r = AIDetector.analyzeText('Der Verwaltungsrat hat das Budget fuer 2027 gestern genehmigt. Die Investitionen fliessen vor allem in die Produktion in Winterthur.');
  const ts = typesOf(r);
  assert.ok(!ts.has('chatbot') && !ts.has('cutoff-disclaimer') && !ts.has('vague-attribution'), 'kein Fehlalarm');
});

test('flaggt deutsche Uebergangs-Floskel', () => {
  const r = AIDetector.analyzeText('Das Produkt deckt die Hardware ab. Darueber hinaus gibt es einen Support-Vertrag. Des Weiteren faellt eine jaehrliche Lizenzgebuehr an.');
  assert.ok(typesOf(r).has('transition'));
});

test('flaggt schmeichelhaften Ton', () => {
  const r = AIDetector.analyzeText('Das ist eine grossartige Frage. Du hast voellig recht, und ich gehe gleich naeher darauf ein, was dahintersteckt.');
  assert.ok(typesOf(r).has('sycophantic'));
});

test('flaggt Fuell-Floskel', () => {
  const r = AIDetector.analyzeText('Es ist wichtig zu beachten, dass die Frist am Freitag ablaeuft. Im Hinblick auf die Planung sollten wir das frueh einplanen.');
  assert.ok(typesOf(r).has('filler'));
});

test('sachliche Notiz loest Fuell-Floskel NICHT aus', () => {
  const r = AIDetector.analyzeText('Achtung: Die Frist laeuft schon am Freitag ab, nicht erst am Montag. Bitte die Unterlagen vorher einreichen.');
  assert.ok(!typesOf(r).has('filler'), 'kein Fehlalarm');
});

test('flaggt generischen Schluss', () => {
  const r = AIDetector.analyzeText('Zusammenfassend laesst sich sagen, dass der Markt wachsen wird. Nur die Zeit wird zeigen, wohin die Reise geht.');
  assert.ok(typesOf(r).has('generic-conclusion'));
});

test('flaggt „Lassen Sie uns"-Konstruktion', () => {
  const r = AIDetector.analyzeText('Lassen Sie uns die einzelnen Schritte durchgehen. Schauen wir uns das genauer an, bevor wir weitermachen.');
  assert.ok(typesOf(r).has('lets-construction'));
});

test('flaggt Reasoning-Artefakt', () => {
  const r = AIDetector.analyzeText('Lass mich das Schritt fuer Schritt durchgehen. Gehen wir das systematisch an, damit nichts vergessen geht.');
  assert.ok(typesOf(r).has('reasoning-artifact'));
});

test('flaggt Bedeutungs-Inflation', () => {
  const r = AIDetector.analyzeText('Das Update markiert einen Wendepunkt und ist ein Meilenstein fuer die ganze Branche, behaupten die Anbieter.');
  assert.ok(typesOf(r).has('significance-inflation'));
});

test('flaggt hohlen Verstaerker (gestapelt)', () => {
  const r = AIDetector.analyzeText('Ehrlich gesagt ist das wirklich ein gutes Resultat. Seien wir ehrlich, in der Tat haetten wir mehr erwartet.');
  assert.ok(typesOf(r).has('hollow-intensifier'));
});

test('flaggt emotionale Flachheit', () => {
  const r = AIDetector.analyzeText('Was mich am meisten ueberrascht hat, war das Tempo. Besonders faszinierend ist, wie schnell das ging.');
  assert.ok(typesOf(r).has('emotional-flatline'));
});

test('flaggt Neuheits-Inflation', () => {
  const r = AIDetector.analyzeText('Was dir niemand sagt, bevor du startest: Die Wahrheit, die alle uebersehen, steckt im Kleingedruckten.');
  assert.ok(typesOf(r).has('novelty-inflation'));
});

test('flaggt Template-Phrase', () => {
  const r = AIDetector.analyzeText('Das ist ein wichtiger Schritt in Richtung Automatisierung. Ob Sie nun Anfaenger oder Profi sind, es lohnt sich.');
  assert.ok(typesOf(r).has('template-phrase'));
});

test('flaggt Schein-Zugestaendnis', () => {
  const r = AIDetector.analyzeText('Zwar ist das Tempo beeindruckend, doch die Kosten bleiben ein Problem fuer kleinere Betriebe in der Region.');
  assert.ok(typesOf(r).has('false-concession'));
});

test('flaggt rhetorische Frage', () => {
  const r = AIDetector.analyzeText('Aber was bedeutet das fuer dich konkret? Warum sollte dich das interessieren, wenn du nicht im Vertrieb arbeitest?');
  assert.ok(typesOf(r).has('rhetorical-question'));
});

test('flaggt Hedge-Stapelung', () => {
  // Echte Umlaute (Schweizer Schreibweise behaelt Umlaute): „könnte
  // möglicherweise" / „dürfte letztlich eventuell".
  const r = AIDetector.analyzeText('Das Verfahren könnte möglicherweise schneller werden. Der Aufwand dürfte letztlich eventuell sinken, wenn alles passt.');
  assert.ok(typesOf(r).has('hedge-stack'));
});

test('einzelnes Modalverb in normaler Prosa loest KEINE Hedge-Stapelung aus', () => {
  const r = AIDetector.analyzeText('Es könnte sein, dass der Zug Verspaetung hat, weil der Wind heute stark ist und Aeste auf den Gleisen liegen.');
  assert.ok(!typesOf(r).has('hedge-stack'), 'kein Fehlalarm');
});

test('flaggt generisches Zukunfts-Narrativ', () => {
  const r = AIDetector.analyzeText('Der Sektor könnte zu einem der wichtigsten Narrative der naechsten Jahre werden, schreiben die Beobachter ohne Beleg.');
  assert.ok(typesOf(r).has('future-narrative'));
});

test('flaggt „Echt/tatsaechlich"-Inflation', () => {
  const r = AIDetector.analyzeText('Das Projekt verspricht echte Wertschoepfung und tatsaechlichen Nutzen, ohne eine einzige Zahl zu nennen.');
  assert.ok(typesOf(r).has('real-actual-inflation'));
});

test('flaggt formelhafte Eroeffnung', () => {
  const r = AIDetector.analyzeText('In der heutigen schnelllebigen Welt zaehlt jede Sekunde. Das Werkzeug wird zunehmend wichtiger fuer kleine Teams.');
  assert.ok(typesOf(r).has('formulaic-opener'));
});

test('flaggt Confidence-Stapelung (>= 3 Adverbien)', () => {
  const r = AIDetector.analyzeText('Interessanterweise stieg der Umsatz. Bemerkenswerterweise blieb die Marge stabil. Zweifellos liegt das am neuen Team.');
  assert.ok(typesOf(r).has('confidence-calibration'));
});

test('flaggt parenthetischen Hedge', () => {
  const r = AIDetector.analyzeText('Das Werkzeug funktioniert (und zunehmend auch fuer kleinere Betriebe) sehr zuverlaessig im Alltag der Teams.');
  assert.ok(typesOf(r).has('parenthetical-hedge'));
});

// ─── Task-5-Redesigns: em-dash, smart-punct, bullet-np, Funktionswoerter

test('flaggt englischen Geviertstrich — als Tell', () => {
  const r = AIDetector.analyzeText('Das Produkt ist gut — wirklich gut — und schnell. Es liefert — ohne Frage — beste Resultate fuer das ganze Team und alle Kunden.');
  assert.ok(typesOf(r).has('em-dash'));
});

test('korrekter deutscher Gedankenstrich – wird NICHT geflaggt', () => {
  const lang = 'Der Bericht – er liegt seit gestern vor – fasst alles zusammen. '.repeat(3) + 'Die Zahlen stammen aus dem internen System und wurden vom Controlling geprueft und freigegeben.';
  const r = AIDetector.analyzeText(lang);
  assert.ok(!typesOf(r).has('em-dash'));
});

test('Bullet-NP-Liste deutsch erkannt', () => {
  const r = AIDetector.analyzeText('Vorteile:\n- Stabile Leistung\n- Zuverlaessige Verbindung\n- Optimierte Geschwindigkeit\n- Geringe Fehlerquote\n- Effiziente Nutzung\n- Konstante Qualitaet');
  assert.ok(typesOf(r).has('bullet-np-list'));
});

test('deutsche Stichwortliste mit Verben wird NICHT als Bullet-NP geflaggt', () => {
  const r = AIDetector.analyzeText('Changelog:\n- behebt den Absturz beim Start\n- entfernt die alte API\n- ergaenzt die Doku um Beispiele\n- aktualisiert die Abhaengigkeiten\n- korrigiert einen Tippfehler');
  assert.ok(!typesOf(r).has('bullet-np-list'));
});

test('deutsche Anfuehrungszeichen „ " loesen KEINE Zeichensetzungs-Signatur aus', () => {
  const txt = 'Das Produkt ist „gut“ und schnell. Es liefert beste Resultate. '.repeat(6) + 'Die Zahlen stammen aus dem internen System.';
  const r = AIDetector.analyzeText(txt);
  assert.ok(!typesOf(r).has('smart-punct-signature'), 'lokale Anfuehrungszeichen sind Carve-out');
});

test('Guillemets « » loesen KEINE Zeichensetzungs-Signatur aus', () => {
  const txt = 'Das Produkt ist «gut» und schnell. Es liefert beste Resultate fuer alle. '.repeat(6) + 'Die Zahlen stammen aus dem internen System.';
  const r = AIDetector.analyzeText(txt);
  assert.ok(!typesOf(r).has('smart-punct-signature'), 'Guillemets sind Carve-out');
});

test('Geviertstrich + englische Schreib-Quotes + sauberes Tippen -> Zeichensetzungs-Signatur', () => {
  const txt = 'Das “Produkt” ist gut — wirklich gut. Es liefert beste Resultate fuer das ganze Team. '.repeat(6) + 'Die Zahlen stammen aus dem System und wurden geprueft.';
  const r = AIDetector.analyzeText(txt);
  assert.ok(typesOf(r).has('smart-punct-signature'));
});

test('Funktionswort-Trigramm-Entropie feuert auf gleichfoermiger Struktur', () => {
  // Viele verschiedene Inhaltswoerter, aber ein dominantes Funktionswort-
  // Geruest („das … ist das … von dem …") -> schiefe Trigramm-Verteilung
  // mit niedriger normalisierter Entropie (< 0.82).
  const base = 'Das Modul ist das Werkzeug von dem Anbieter. Das System ist das Mittel von dem Team. Das Geraet ist das Ziel von dem Markt. ';
  const variation = 'Wir bauen es und wir testen es, weil es wichtig ist. ';
  const r = AIDetector.analyzeText(base.repeat(10) + variation.repeat(2));
  assert.ok(typesOf(r).has('fnword-trigram-entropy'), `erwartet fnword-trigram-entropy, hatte: ${[...typesOf(r)].join(',')}`);
});

// ─── Task 6: title-case raus, nominalstil rein ──────────────────────

test('Title-Case-Header existiert nicht mehr', () => {
  assert.ok(!('title-case-header' in AIDetector.TYPE_LABELS), 'type entfernt');
});

test('flaggt Funktionsverbgefuege (Nominalstil)', () => {
  const r = AIDetector.analyzeText('Wir stellen Ihnen die Daten zur Verfuegung und nehmen Ihr Feedback in Anspruch, damit die Durchfuehrung der Migration reibungslos zum Einsatz kommt.');
  assert.ok(typesOf(r).has('nominalstil'));
});

test('normaler Verbalstil loest Nominalstil NICHT aus', () => {
  const r = AIDetector.analyzeText('Wir geben Ihnen die Daten und hoeren auf Ihr Feedback, damit die Migration reibungslos laeuft.');
  assert.ok(!typesOf(r).has('nominalstil'));
});

// ─── Sprach-neutrale Detektoren (unveraendert) ──────────────────────

test('em-dash-Detektor ignoriert CLI-Flags wie --save-dev', () => {
  const r = AIDetector.analyzeText('Fuehre npm install --save-dev aus und dann npm run build --no-verify --silent. Das dauert rund zehn Sekunden auf dieser Maschine, danach liegt das Paket direkt in node_modules.');
  assert.equal(r.issues.filter((i) => i.type === 'em-dash').length, 0, 'CLI-Flags zaehlen nicht als Geviertstrich');
});

test('Hashtag-Ueberladung feuert auf langem Tag-Block', () => {
  const r = AIDetector.analyzeText('Diese Woche etwas gebaut.\n#startup #krypto #web3 #ki #devlog #versand #foundermode');
  assert.ok(typesOf(r).has('hashtag-stuff'), 'erwartet hashtag-stuff bei 7 Tags');
});

test('Hashtag-Ueberladung feuert NICHT bei 2-3 Tags', () => {
  const r = AIDetector.analyzeText('Gestern den neuen Build ausgeliefert. Mit der neuen Instrumentierung finden wir Fehler schneller. Notizen sind im Dokument. #buildinpublic #devlog');
  assert.ok(!typesOf(r).has('hashtag-stuff'));
});

test('ai-placeholder feuert auf deutsche Slot-Platzhalter', () => {
  for (const txt of [
    'Sehr geehrte/r [Empfaenger], ich schreibe Ihnen wegen [Thema der Diskussion].',
    'Mit freundlichen Gruessen, [Ihr Name], [Firmenname].',
    'Quelle: [QUELLE EINFUEGEN]. Datum: TT.MM.JJJJ.',
    '<!-- TODO: Zitat einfuegen, sobald die Studie erscheint -->',
  ]) {
    const r = AIDetector.analyzeText(txt + ' Zusaetzlicher Fuelltext, um das Wortzahl-Gate zu erreichen. '.repeat(2));
    assert.ok(typesOf(r).has('ai-placeholder'), `erwartet ai-placeholder fuer: ${txt}`);
  }
});

test('ai-placeholder feuert NICHT auf legitime eckige Klammern', () => {
  const r = AIDetector.analyzeText('Die Release-Notes zu [v1.2.3] decken den [auth.refresh]-Pfad ab und verweisen auf Commit [a3f7b21]. Fuelltext, damit das Wortzahl-Gate sauber erreicht wird und der ganze Durchlauf laeuft.');
  assert.ok(!typesOf(r).has('ai-placeholder'), `kein ai-placeholder erwartet, hatte: ${[...typesOf(r)].join(',')}`);
});

test('ai-citation-markup feuert auf Chatbot-interne Tokens (sprach-neutral)', () => {
  const r = AIDetector.analyzeText('Mehr dazu unten. citeturn0search1 Der Bericht nennt die Details. ' + 'Fuelltext, um das Gate zu erreichen. '.repeat(3));
  assert.ok(typesOf(r).has('ai-citation-markup'));
});

test('ai-utm-source feuert auf KI-Werkzeug-Tracking-Parameter (sprach-neutral)', () => {
  const r = AIDetector.analyzeText('Siehe https://example.com/artikel?utm_source=chatgpt.com fuer die Quelle. Fuelltext, um das Wortzahl-Gate sauber zu erreichen und alle Kategorien zu durchlaufen.');
  assert.ok(typesOf(r).has('ai-utm-source'));
});

test('ai-utm-source feuert NICHT auf harmlose utm_source-Werte', () => {
  const r = AIDetector.analyzeText('Siehe https://example.com/artikel?utm_source=newsletter fuer die Quelle. Fuelltext, um das Wortzahl-Gate sauber zu erreichen und den vollen Durchlauf zu garantieren.');
  assert.ok(!typesOf(r).has('ai-utm-source'));
});

test('low-ttr feuert auf 200+ Tokens mit engem Wortschatz', () => {
  const satz = 'Das System zeigt das System verbessert das System bei jedem Durchlauf erneut. ';
  const r = AIDetector.analyzeText(satz.repeat(20));
  assert.ok(typesOf(r).has('low-ttr'), `erwartet low-ttr, hatte: ${[...typesOf(r)].join(',')}`);
});

test('low-ttr feuert NICHT auf natuerliche Prosa bei 200+ Tokens', () => {
  const text = `Als der Build heute Morgen brach, habe ich das letzte Auth-Refactoring zurueckgerollt und
die Integrationstests erneut laufen lassen. Die meisten liefen sauber durch, ein paar
Randfaelle rund um die Token-Erneuerung stolperten aber noch ueber die Staging-Umgebung.
Safari-Nutzer trafen beim zweiten Aufruf einer Sitzung nach einer Stunde auf einen Fehler,
waehrend Firefox-Sitzungen wie erwartet angemeldet blieben. In den Protokollen sah der
Verursacher nach einem Cookie-Geltungsbereich aus, eingeschleppt beim Umzug auf die neue
Domain. Ich habe den Pfad-Parameter angepasst, neu auf Staging ausgeliefert und das
Metrik-Dashboard zwanzig Minuten beobachtet, bevor ich auf die Produktion ging. Der
Speicher blieb flach, die Latenz haengte stabil um vierzig Millisekunden, und die Fehlerrate
fiel nach dem Rollout wieder unter den Ausgangswert. Jetzt schliesse ich das Ticket und
schreibe die Notizen fuer die Retrospektive von morgen.`;
  const r = AIDetector.analyzeText(text);
  assert.ok(!typesOf(r).has('low-ttr'), `low-ttr sollte nicht feuern, hatte: ${[...typesOf(r)].join(',')}`);
});

// ─── Stats / Dedup / Severity ───────────────────────────────────────

test('Stats-Felder summieren sich zur issues-Laenge', () => {
  const r = AIDetector.analyzeText('In der heutigen Welt nutzen wir nahtlose Oekosysteme, um die Transformation zu navigieren. Es ist wichtig zu beachten, dass Experten glauben, das sei entscheidend.');
  const sum = r.stats.tier1Count + r.stats.tier2Count + r.stats.tier3Count + r.stats.patternCount;
  assert.equal(sum, r.issues.length, `Stats-Summe (${sum}) != issues (${r.issues.length})`);
});

test('wiederholte Tier-1-Phrase blaeht den Score nicht linear auf', () => {
  const single = AIDetector.analyzeText('Wir tauchen ein in die Welt der vielen Dinge von heute und morgen.');
  const fünffach = AIDetector.analyzeText('Wir tauchen ein. Wir tauchen ein. Wir tauchen ein. Wir tauchen ein. Wir tauchen ein in die Welt der Dinge.');
  assert.ok(fünffach.score <= single.score + 20, `wiederholte Phrase darf den Score nicht ver-5-fachen (single=${single.score}, fuenffach=${fünffach.score})`);
});

test('Severity-Labels sind ueber alle vier Stufen verschieden', () => {
  const labels = new Set(Object.values(AIDetector.SEVERITY_LABELS));
  assert.equal(labels.size, 4, 'P0/P1/P2/P3 als vier verschiedene Labels erwartet');
});

// ─── Gesamtbewertung: AI-dicht vs. menschliche Prosa ────────────────

test('KI-dichter Absatz erreicht Starke/Viele KI-Muster', () => {
  const text = [
    'In der heutigen schnelllebigen Welt tauchen wir ein in die nahtlose, ganzheitliche Welt der Innovation.',
    'Es ist wichtig zu beachten, dass dieses robuste Oekosystem die Transformation entscheidend navigiert.',
    'Darueber hinaus markiert dieser Meilenstein einen Wendepunkt. Lass uns das Schritt fuer Schritt durchgehen.',
    'Experten glauben, dass die Zukunft rosig aussieht. Gerne! Ich hoffe, das hilft dir weiter.',
  ].join(' ');
  const r = AIDetector.analyzeText(text);
  assert.ok(r.score >= 60, `erwartet Score >= 60, hatte ${r.score}`);
  assert.ok(['Starke KI-Signale', 'Viele KI-Muster'].includes(r.label), `Label: ${r.label}`);
});

test('schlichte menschliche Fehlerbericht-Prosa bleibt im Minimal-Bereich', () => {
  const text = [
    'Der Build ist heute Morgen wieder gebrochen. Ich habe das Auth-Refactoring zurueckgerollt,',
    'jetzt laufen die Tests durch. Bleibt die Frage, warum der Token-Refresh fuer Safari-Nutzer',
    'einen 401 wirft, fuer Firefox aber nicht – vermutlich ein Cookie-Geltungsbereich, das will',
    'ich aber bestaetigen, bevor ich einen Fix ausliefere.',
  ].join(' ');
  const r = AIDetector.analyzeText(text);
  assert.ok(r.score <= 20, `erwartet Score <= 20, hatte ${r.score}`);
});

// ─── Trinary-API + Kalibrierungs-Vertraege ──────────────────────────

test('Trinary-Ausgabe vorhanden + FN-vorsichtig bei mehrdeutigem Text', () => {
  const text = 'Der Build ist heute Morgen wieder gebrochen. Ich habe das Auth-Refactoring zurueckgerollt, jetzt laufen die Tests durch. Bleibt die Frage, warum der Token-Refresh fuer Safari-Nutzer einen 401 wirft, fuer Firefox aber nicht.';
  const r = AIDetector.analyzeText(text);
  assert.ok(r.document_classification, 'document_classification erwartet');
  assert.ok(['HUMAN_ONLY', 'MIXED'].includes(r.document_classification), `Menschenprosa wurde ${r.document_classification}`);
  const sum = r.class_probabilities.human + r.class_probabilities.mixed + r.class_probabilities.ai;
  assert.ok(Math.abs(sum - 1) < 0.02, `Wahrscheinlichkeiten sollten ~1 ergeben, hatten ${sum}`);
  assert.ok(['high', 'medium', 'low'].includes(r.confidence_category), 'confidence_category erwartet');
});

test('stark KI-markierter Text erreicht AI_ONLY mit Korroboratoren', () => {
  const text = [
    'Als KI-Sprachmodell habe ich keinen Zugriff auf Echtzeitdaten. In der heutigen schnelllebigen Welt tauchen wir ein in die nahtlose, ganzheitliche Welt der Innovation.',
    'Es ist wichtig zu beachten, dass dieses robuste Oekosystem die Transformation entscheidend navigiert. Darueber hinaus markiert dieser Meilenstein einen Wendepunkt.',
    'Lass uns das Schritt fuer Schritt durchgehen. Gerne! Ich hoffe, das hilft dir weiter.',
  ].join(' ');
  const r = AIDetector.analyzeText(text);
  assert.equal(r.document_classification, 'AI_ONLY', `erwartet AI_ONLY, hatte ${r.document_classification} (score=${r.score})`);
  assert.ok(['medium', 'high'].includes(r.confidence_category), `erwartet medium/high, hatte ${r.confidence_category}`);
});

test('kanonischer „Als KI-Sprachmodell"-Disclaimer -> cutoff + AI_ONLY (high)', () => {
  const text = 'Als KI-Sprachmodell kann ich keine Rechtsberatung geben. Ich kann dir aber empfehlen, eine Anwaeltin zu konsultieren. Das Vertragsrecht ist je nach Kanton verschieden.';
  const r = AIDetector.analyzeText(text);
  assert.ok(typesOf(r).has('cutoff-disclaimer'), 'cutoff-disclaimer erwartet');
  assert.equal(r.document_classification, 'AI_ONLY', `erwartet AI_ONLY, hatte ${r.document_classification}`);
  assert.equal(r.confidence_category, 'high', `erwartet high, hatte ${r.confidence_category}`);
});

test('Wahrscheinlichkeiten summieren sich exakt auf 1 (kein Float-Drift)', () => {
  const texte = [
    'In der heutigen schnelllebigen Welt tauchen wir ein in die nahtlose, ganzheitliche Welt der Innovation, die das robuste Oekosystem entscheidend transformiert und katalysiert.',
    'Der Build ist gebrochen. Zurueckgerollt. Tests laufen. Die Ursache schaue ich mir morgen nach dem Standup mit dem Pikett an.',
    'Ein neutraler Absatz, der ein paar markierte Woerter wie robust und umfassend in ganz normalem Kontext nutzt, so wie es eine Ingenieurin bei einem Kaffee beschreiben wuerde.',
  ];
  for (const t of texte) {
    const r = AIDetector.analyzeText(t);
    const sum = r.class_probabilities.human + r.class_probabilities.mixed + r.class_probabilities.ai;
    assert.ok(Math.abs(sum - 1) < 0.0005, `Wahrscheinlichkeiten sollten exakt 1 ergeben, hatten ${sum} fuer: ${t.slice(0, 40)}...`);
  }
});

test('mittlerer Score mit isolierten Stylometrie-Treffern erreicht NICHT AI_ONLY (FN-Bias)', () => {
  const text = 'Das Team kommt beim Aufbau der Plattform weiter voran. Das System traegt vieles. Die Zusammenarbeit ueber Teams hinweg bleibt wichtig. Der Pfad fuer die Auslieferung wird besser. Der Aufbau gibt allen eine Grundlage.';
  const r = AIDetector.analyzeText(text);
  assert.ok(!typesOf(r).has('cutoff-disclaimer'), 'Vorbedingung: kein Cutoff');
  assert.ok(r.score < 70, `Vorbedingung: Score < 70, hatte ${r.score}`);
  assert.notEqual(r.document_classification, 'AI_ONLY', `ohne starke Korroboratoren unter Score 70 nicht AI_ONLY, hatte ${r.document_classification} bei Score ${r.score}`);
});

test('contextMode „technical" bleibt als API-Token gueltig', () => {
  const text = 'Der Dienst stellt die Daten zur Verfuegung. Wir setzen einen Cache ein. Die Migration laeuft naechste Woche. Jede Komponente hat klare Schnittstellen und Vertraege.';
  const r = AIDetector.analyzeText(text, { contextMode: 'technical' });
  assert.equal(r.stats.contextMode, 'technical', 'technical bleibt gueltig');
});

test('unbekannter contextMode faellt auf general zurueck + setzt contextModeFallback', () => {
  const r = AIDetector.analyzeText('Wir stellen die Daten zur Verfuegung und setzen einen Cache ein, damit die Auslieferung reibungslos laeuft und alle zugreifen koennen.', { contextMode: 'tecnical' });
  assert.equal(r.stats.contextMode, 'general', 'ungueltiger Modus auf general gezwungen');
  assert.equal(r.stats.contextModeFallback, 'tecnical', 'Fallback spiegelt das Original');
});

test('Trinary-Felder bei tooShort / tooLong / leer sind UNSCORED', () => {
  const empty = AIDetector.analyzeText('');
  const tooShort = AIDetector.analyzeText('Kurzer Text.');
  const tooLong = AIDetector.analyzeText('wort '.repeat(10001));
  for (const [name, r] of [['empty', empty], ['tooShort', tooShort], ['tooLong', tooLong]]) {
    assert.equal(r.document_classification, 'UNSCORED', `${name}: erwartet UNSCORED, hatte ${r.document_classification}`);
    assert.equal(r.confidence_category, 'low', `${name}: erwartet low confidence`);
    assert.ok(r.class_probabilities, `${name}: class_probabilities fehlt`);
    assert.ok(Array.isArray(r.highlight_sentence_for_ai), `${name}: highlight-Array fehlt`);
  }
  assert.equal(tooShort.stats.contextMode, 'general', 'tooShort stats enthaelt contextMode');
  assert.equal(tooLong.stats.contextMode, 'general', 'tooLong stats enthaelt contextMode');
});

// ─── Normalisierung / Bypass-Tricks ─────────────────────────────────

test('Zero-Width-Zeichen loesen normalization-flag aus', () => {
  const zwsp = '​';
  const text = `In der heutigen Welt tauchen wir ein in die nah${zwsp}tlose, ganzheitliche Welt. Dieses robuste Oekosystem zeigt umfassende Rahmen. Der Rahmen beleuchtet, wie Organisationen Werkzeuge nutzen.`;
  const r = AIDetector.analyzeText(text);
  assert.ok(typesOf(r).has('normalization-flag'), 'normalization-flag bei ZWSP erwartet');
  assert.ok(r.stats.normalization.zeroWidth > 0, 'norm.zeroWidth sollte zaehlen');
});

test('Markdown **fett** wird vom Normalisierungs-Vorlauf bewahrt', () => {
  const norm = AIDetector.normalizeText('**Erster fett** und **noch ein fett** sowie **ein dritter**.');
  assert.equal(norm.flags.roleplay, 0, `roleplay=0 bei Markdown-Fett erwartet, hatte ${norm.flags.roleplay}`);
  assert.ok(norm.text.includes('**Erster fett**'), 'Fett-Marker bewahrt');
});

test('deutsche *Rollenspiel-Aktion* wird entfernt', () => {
  const norm = AIDetector.normalizeText('Ich denke nach *nickt nachdenklich* und ueberlege die Optionen *seufzt tief* bevor ich antworte.');
  assert.ok(norm.flags.roleplay >= 2, `>= 2 Rollenspiel-Strips erwartet, hatte ${norm.flags.roleplay}`);
});

test('legitime *kursive Phrase* wird NICHT entfernt', () => {
  const norm = AIDetector.normalizeText('Wir nutzen *kursive Phrase hier* zur Betonung und *noch eine Phrase* an anderer Stelle.');
  assert.equal(norm.flags.roleplay, 0, `roleplay=0 bei Kursiv erwartet, hatte ${norm.flags.roleplay}`);
  assert.ok(norm.text.includes('*kursive Phrase hier*'), 'Kursiv bewahrt');
});

// ─── Rueckwaertskompatibilitaet ─────────────────────────────────────

test('Rueckwaertskompatibel — score, label, issues, stats weiterhin vorhanden', () => {
  const r = AIDetector.analyzeText('Wir tauchen ein in die Welt der robusten Oekosysteme. Das Team navigiert diese umfassende Transformation entscheidend weiter.');
  assert.ok(typeof r.score === 'number', 'score weiterhin numerisch');
  assert.ok(typeof r.label === 'string', 'label weiterhin String');
  assert.ok(Array.isArray(r.issues), 'issues weiterhin Array');
  assert.ok(r.stats && typeof r.stats === 'object', 'stats weiterhin Objekt');
});

test('highlight_sentence_for_ai liefert Regionen mit start/end-Offsets', () => {
  const text = 'In der heutigen Welt tauchen wir ein in die nahtlose Welt der KI. Das ist ein robustes, umfassendes Oekosystem. Ein ganz normaler zweiter Absatz ohne Tells. Das Team lieferte am Montag einen Fix nach erfolgreichem Rollback.';
  const r = AIDetector.analyzeText(text);
  assert.ok(Array.isArray(r.highlight_sentence_for_ai), 'highlight-Array erwartet');
  if (r.highlight_sentence_for_ai.length > 0) {
    const region = r.highlight_sentence_for_ai[0];
    assert.ok(typeof region.start === 'number', 'Region hat start-Offset');
    assert.ok(typeof region.end === 'number', 'Region hat end-Offset');
    assert.ok(region.end > region.start, 'end > start');
    assert.ok(typeof region.score === 'number' && region.score >= 0 && region.score <= 1, 'region.score 0-1');
  }
});

test('stats.denseAIVocab und stats.tier1Distinct fuer Observability vorhanden', () => {
  const r = AIDetector.analyzeText('Wir tauchen ein in die Welt mit nahtlosen, ganzheitlichen, robusten, herausragenden Loesungen.');
  assert.equal(typeof r.stats.denseAIVocab, 'boolean', 'denseAIVocab sollte boolean sein');
  assert.equal(typeof r.stats.tier1Distinct, 'number', 'tier1Distinct sollte number sein');
});

if (failed > 0) {
  console.error(`\n${failed} Test(s) fehlgeschlagen`);
  process.exit(1);
}
console.log('\nAlle Detector-Fixtures bestanden.');
