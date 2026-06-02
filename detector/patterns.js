/**
 * Avoid AI Writing — Erkennungs-Engine (kanonische Single Source of Truth)
 * Deutsche/Schweizer Portierung (Schweizer Schreibweise: kein Eszett, nur ss).
 * Erkennt 43 Muster-Kategorien. Die SKILL.md dieses Repos katalogisiert die
 * menschenlesbaren Musterregeln; diese Engine ist der ausfuehrbare Ausdruck der
 * regex-erkennbaren Teilmenge und ergaenzt ihn um stylometrische und
 * KI-Werkzeug-Fingerabdruck-Detektoren, die sich als Skill-Prosa nicht eignen
 * (Burstiness ueber Absaetze, Schreib-Zeichensetzungs-Signatur, Funktionswort-
 * Trigramm-Entropie, niedrige Type-Token-Ratio, KI-Werkzeug-URL-Parameter,
 * durchgesickerte Chatbot-Zitat-Markup, nicht ausgefuellte Platzhalter).
 *
 * Scoring-Modell (unveraendert gegenueber dem Original):
 *   Jede Kategorie hat ein Gewicht in der ISSUE_WEIGHTS-Tabelle. Die
 *   Erkennungslaeufe erzeugen rohe (moeglicherweise doppelte) Treffer, die
 *   anschliessend nach dem Paar (type, text) dedupliziert werden. rawScore ist
 *   die Summe der Kategorie-Gewichte ueber die deduplizierte Liste — die Zahl
 *   spiegelt also dieselben Signale, die der Nutzer in der Trefferliste sieht.
 *
 *   Gewichte sind ueber die Severity-Stufen bewusst ungleich. Cutoff-
 *   Disclaimer (10) und Chatbot-Artefakte (8) wiegen mehr als vage
 *   Attributionen (5), obwohl alle drei als `critical` markiert sind, weil
 *   das Skill sie als staerkere oder schwaechere KI-Herkunfts-Signale behandelt.
 *
 *   rawScore wird dann ueber `log2(wordCount/50)` auf 0-100 normalisiert, damit
 *   laengere Texte bei gleicher Musterdichte nicht unbegrenzt anwachsen.
 */

const AIDetector = (() => {
  // ═══ Tier 1 pre-pass: normalize bypass tricks ══════════════════════
  //
  // Humanizer tools and prompt-injection bypass techniques insert
  // invisible / lookalike chars to defeat exact-string detectors. Strip
  // them BEFORE pattern matching so "delve" with a Cyrillic 'е' still
  // hits the Tier 1 list. Unicode ranges sourced from
  // It-s-AI/llm-detection/detection/attacks/.
  //
  // Tracks what was stripped so the trinary classifier can use
  // "normalization triggered" as a corroborating AI signal — humans don't
  // paste ZWSPs into their own writing.
  const CYRILLIC_LOOKALIKES = {
    'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x',
    'у': 'y', 'к': 'k', 'м': 'm', 'н': 'h', 'в': 'b', 'т': 't',
    'А': 'A', 'Е': 'E', 'О': 'O', 'Р': 'P', 'С': 'C', 'Х': 'X',
    'У': 'Y', 'К': 'K', 'М': 'M', 'Н': 'H', 'В': 'B', 'Т': 'T',
  };
  const GREEK_LOOKALIKES = { 'ο': 'o', 'Ο': 'O', 'α': 'a', 'Α': 'A', 'ρ': 'p', 'Ρ': 'P' };

  function normalizeText(text) {
    const flags = { zeroWidth: 0, homoglyph: 0, roleplay: 0 };
    let out = text;

    // 1. Strip zero-width chars (ZWSP U+200B, ZWNJ U+200C, ZWJ U+200D,
    //    BOM U+FEFF, word joiner U+2060).
    out = out.replace(/[​-‍﻿⁠]/g, () => { flags.zeroWidth++; return ''; });

    // 2. Swap Cyrillic / Greek Latin-lookalike chars back to Latin so
    //    pattern matching catches obfuscated tokens.
    out = out.replace(/[Ѐ-ӿͰ-Ͽ]/g, (m) => {
      const swap = CYRILLIC_LOOKALIKES[m] ?? GREEK_LOOKALIKES[m];
      if (swap) { flags.homoglyph++; return swap; }
      return m;
    });

    // 3. Strip *roleplay-action* markers — paired *...* containing an
    //    action verb (nickt, seufzt, lacht, laechelt, nods, sighs, ...)
    //    anchored to the start of the inner phrase. This is the actual
    //    chat-model artifact shape. Markdown `**bold**` is rejected by the
    //    lookbehind/lookahead; legitimate multi-word `*italic*` is
    //    preserved because the verb whitelist is narrow. Deutsche Rollenspiel-
    //    Verben (nickt/seufzt/lacht/laechelt/fluestert/ueberlegt usw.) sind
    //    ergaenzt; die englischen Formen bleiben fuer kopierte Chat-Ausgaben.
    const ROLEPLAY_VERBS = /^(?:nickt|seufzt|lacht|laechelt|laechelnd|zuckt|grinst|fluestert|denkt|ueberlegt|nickend|seufzend|lachend|fluesternd|zwinkert|raeuspert|nods|sighs|laughs|smiles|frowns|shrugs|grins|winks|chuckles|gasps|pauses|thinks|wonders|whispers|shouts|gestures|raises|leans|turns|looks|glances|smirks|blinks|nodding|sighing|laughing|smiling|thinking|gesturing)\b/i;
    out = out.replace(/(?<!\*)\*([^*\n]{1,80}?)\*(?!\*)/gu, (m, inner) => {
      if (ROLEPLAY_VERBS.test(inner)) { flags.roleplay++; return ''; }
      return m;
    });

    return { text: out, flags };
  }

  // ─── Tier 1: Immer flaggen ─────────────────────────────────────────
  // Deutsche LLM-Tells (Single Source: docs/superpowers/research/de-tells.md).
  // Keys kleingeschrieben, weil der Tokenizer lowercased; Substantive wie
  // „Synergie" werden also unter „synergie" geflaggt.
  const TIER1 = {
    'nahtlos': 'reibungslos, ohne Unterbruch, problemlos',
    'mühelos': 'leicht, einfach, ohne Aufwand',
    'ganzheitlich': 'umfassend benennen, was gemeint ist; oder streichen',
    'bahnbrechend': 'neu, das erste; sagen, was konkret zuvor unmöglich war',
    'revolutionär': 'verändernd; beschreiben, was sich ändert',
    'revolutioniert': 'verändert, krempelt um; beschreiben, was sich ändert',
    'vielfältig': 'verschieden, breit; oder die Vielfalt benennen',
    'facettenreich': 'die einzelnen Aspekte nennen; oder streichen',
    'eintauchen': 'anschauen, untersuchen, durchgehen',
    'beleuchten': 'erklären, zeigen, darstellen',
    'beleuchtet': 'erklärt, zeigt, stellt dar',
    'wendepunkt': 'sagen, was sich konkret änderte; oder streichen',
    'meilenstein': 'konkretes Ergebnis nennen (Zahl, Datum, Lieferung)',
    'robust': 'stabil, zuverlässig, belastbar',
    'synergie': 'das Zusammenspiel beschreiben',
    'synergien': 'das Zusammenspiel beschreiben',
    'zukunftsweisend': 'benennen, was es leistet',
    'wegweisend': 'wichtig; oder benennen',
    'herausragend': 'benennen, was es auszeichnet',
  };

  // Mehrwort-Tier-1-Phrasen
  const TIER1_PHRASES = [
    { pattern: /\btauchen\s+wir\s+(?:tief\s+)?ein\b/gi, replace: 'sehen wir uns an; das Thema direkt nennen' },
    { pattern: /\beintauchen\s+in\b/gi, replace: 'ansehen, untersuchen' },
    { pattern: /\bes\s+lohnt\s+sich,?\s+(?:zu\s+)?erwaehnen\b/gi, replace: 'die Tatsache einfach hinschreiben' },
    { pattern: /\bein\s+zeugnis\s+(?:fuer|der|des|von)\b/gi, replace: 'zeigt, beweist, belegt' },
    { pattern: /\bauf\s+ein\s+neues\s+(?:level|niveau)\s+(?:heben|bringen)\b/gi, replace: 'verbessern; sagen, was besser wird' },
    { pattern: /\bin\s+der\s+welt\s+der\b/gi, replace: 'im Bereich; oder konkret benennen' },
    { pattern: /\bim\s+bereich\s+der\b/gi, replace: 'konkret benennen' },
    { pattern: /\bdie\s+zukunft\s+sieht\s+rosig\s+aus\b/gi, replace: 'konkret werden oder streichen' },
    { pattern: /\bnur\s+die\s+zeit\s+wird\s+(?:es\s+)?zeigen\b/gi, replace: 'konkret werden oder streichen' },
  ];

  // ─── Tier 2: Im Cluster flaggen (>= 2 pro Absatz) ─────────────────
  const TIER2 = {
    'navigieren': 'bewältigen, durchkommen, umgehen mit',
    'navigiert': 'bewältigt, kommt durch',
    'optimieren': 'verbessern, beschleunigen, einfacher machen',
    'optimiert': 'verbessert, beschleunigt',
    'fördern': 'unterstützen, aufbauen',
    'stärken': 'verbessern',
    'ermöglichen': 'erlauben, lassen',
    'ermöglicht': 'erlaubt, lässt',
    'nutzen': 'verwenden, brauchen',
    'transformativ': 'sagen, was sich ändert und wie',
    'transformation': 'beschreiben, was sich änderte',
    'ökosystem': 'System, Netzwerk, Umfeld, Markt',
    'vielzahl': 'viele, mehrere, eine konkrete Zahl',
    'fülle': 'viel, reichlich, eine konkrete Menge',
    'eckpfeiler': 'Grundlage, Kern, wichtigster Teil',
    'massgeblich': 'wichtig, zentral',
    'aufkeimend': 'neu, jung, im Entstehen; oder mit Zahl belegen',
    'entscheidend': 'wichtig, nötig',
    'umfassend': 'vollständig, gründlich',
    'revolutionieren': 'verändern',
    'katalysieren': 'auslösen, beschleunigen',
    'neugestalten': 'überdenken, umbauen',
  };

  // ─── Tier 3: Nur bei Dichte flaggen ────────────────────────────────
  const TIER3 = [
    'bedeutend', 'innovativ', 'effektiv', 'dynamisch', 'dynamische',
    'skalierbar', 'überzeugend', 'beispiellos', 'aussergewöhnlich',
    'bemerkenswert', 'ausgeklügelt', 'hochmodern',
  ];

  // Mehrwort-Tier-3-Phrasen. Dichte-gegated wie einzelne Tier-3-Woerter, weil
  // sie in echter Schweizer Tech-/Web3-Prosa vorkommen. Schwelle bewusst
  // niedriger als bei Einzelwoertern (>= 2 Vorkommen derselben Phrase) —
  // dieselbe Mehrwort-Floskel zu wiederholen ist ein staerkeres KI-Tell als
  // ein zweites „bedeutend".
  const TIER3_PHRASES = [
    /\bdie\s+integration\s+von\b/gi,
    /\bdie\s+schnittstelle\s+von\b/gi,
    /\bcommunity-?getrieben\b/gi,
    /\blangfristige\s+nachhaltigkeit\b/gi,
    /\bnutzer-?engagement\b/gi,
    /\bdezentrale\s+rechenleistung\b/gi,
    /\bnachhaltige\s+token-?ausschuettungen?\b/gi,
    /\btokenisierte\s+anreizstrukturen?\b/gi,
  ];

  // O(1) lookup from any token form (hyphenated or dashless) to its canonical
  // Tier 3 word. Counting originally did nested-loop word matching which was
  // O(tokens × TIER3) — slow on long pastes.
  const TIER3_LOOKUP = new Map();
  for (const word of TIER3) {
    TIER3_LOOKUP.set(word, word);
    const dashless = word.replace(/-/g, '');
    if (dashless !== word) TIER3_LOOKUP.set(dashless, word);
  }

  // Per-category score weights. Applied to distinct (deduplicated) issues so
  // the score reflects the same signals the user sees in the issue list.
  // Non-uniform on purpose: critical rules like cutoff disclaimers (×10) and
  // chatbot artifacts (×8) weigh more than vague attributions (×5), even
  // though all three are tagged `critical`.
  const ISSUE_WEIGHTS = {
    tier1: 5,
    tier2: 3,
    tier3: 2,
    transition: 2,
    chatbot: 8,
    sycophantic: 8,
    filler: 2,
    'generic-conclusion': 3,
    'lets-construction': 2,
    'reasoning-artifact': 6,
    'acknowledgment-loop': 3,
    'significance-inflation': 4,
    'vague-attribution': 5,
    'hollow-intensifier': 2,
    'emotional-flatline': 2,
    'novelty-inflation': 3,
    'cutoff-disclaimer': 10,
    'template-phrase': 3,
    'false-concession': 2,
    'rhetorical-question': 2,
    'confidence-calibration': 2,
    'em-dash': 4,
    uniformity: 5,
    formatting: 3,
    'tier3-phrase': 3,
    // Structural / cluster signals are deliberately weighted high. Unlike
    // single-vocabulary hits they're near-dispositive on social-length
    // posts (a 15-hashtag block, a 6-item bullet-NP list, three distinct
    // crypto-shill phrases stacked) and would otherwise be suppressed by
    // the log2(words/50) length divisor on short pastes.
    'tier3-phrase-cluster': 12,
    'hashtag-stuff': 12,
    'bullet-np-list': 10,
    'hedge-stack': 6,
    'future-narrative': 12,
    'real-actual-inflation': 5,
    'formulaic-opener': 8,
    'nominalstil': 3,
    'parenthetical-hedge': 3,
    'smart-punct-signature': 6,
    'punct-distribution': 6,
    'fnword-trigram-entropy': 5,
    'cross-para-burstiness': 5,
    'normalization-flag': 9,
    // Vocabulary-diversity signal (type-token ratio). Weighted modestly
    // because the threshold (>=200 tokens AND TTR<0.4) is conservative;
    // it stacks with structural signals to push borderline scores up.
    'low-ttr': 3,
    // AI-tool fingerprints. Weighted higher than statistical patterns
    // because each is a near-definitive single-hit signal — the AI tool
    // literally left its mark in the text. citation-markup ranks highest
    // (smoking gun: the literal internal markup of ChatGPT/Grok/etc.),
    // UTM tracking second (auto-appended by the tool to URLs it writes),
    // placeholders third (strong but humans use bracketed slots in
    // templates legitimately and forget them — still a publishing bug
    // but slightly less definitive AI evidence).
    'ai-placeholder': 10,
    'ai-citation-markup': 15,
    'ai-utm-source': 12,
  };

  // ─── Uebergangs-Floskeln ────────────────────────────────────────────
  const TRANSITIONS = [
    /\bdarüber\s+hinaus\b/gi,
    /\bdes\s+weiteren\b/gi,
    /\bzudem\b/gi,
    /\bferner\b/gi,
    // Woerter, die mit einem Umlaut beginnen, brauchen einen
    // Lookbehind-Anker statt `\b` (ohne u-Flag ist `ü` kein Wortzeichen,
    // sodass `\bü` nie matcht). (?<![\wäöü]) = kein vorangehendes Wortzeichen.
    /(?<![\wäöü])überdies\b/gi,
    /\babschliessend\b/gi,
    /\bzusammenfassend\b/gi,
    /\bletztendlich\b/gi,
    /\bin\s+der\s+heutigen\b/gi,
    /\bin\s+einer\s+zeit,?\s+in\s+der\b/gi,
    /\bwenn\s+es\s+um\s+.{1,40}\s+geht\b/gi,
  ];

  // ─── Chatbot-Artefakte ─────────────────────────────────────────────
  const CHATBOT_ARTIFACTS = [
    /\bgerne!/gi,
    /\bnatürlich!/gi,
    /\baber\s+gerne\b/gi,
    /\bgerne\s+helfe\s+ich\s+dir\s+weiter\b/gi,
    /\bich\s+hoffe,?\s+(?:das|dies)\s+hilft\s+dir\s+weiter\b/gi,
    /\bich\s+hoffe,?\s+(?:das|dies)\s+hilft\b/gi,
    /\bzögere\s+nicht,?\s+(?:mich|uns)?\s*(?:zu\s+kontaktieren)?\b/gi,
    /\bmelde\s+dich\s+gern\b/gi,
    /\blass\s+es\s+mich\s+wissen\b/gi,
    /\bin\s+diesem\s+artikel\s+werden\s+wir\b/gi,
    /\bich\s+hoffe,?\s+diese\s+e-?mail\s+erreicht\s+sie\s+gut\b/gi,
  ];

  // ─── Schmeichelhafter Ton ──────────────────────────────────────────
  const SYCOPHANTIC = [
    /\b(?:das\s+ist\s+eine\s+)?grossartige\s+frage\b/gi,
    /\bdas\s+ist\s+eine\s+ausgezeichnete\s+frage\b/gi,
    /\bdu\s+hast\s+(?:völlig|vollkommen)\s+recht\b/gi,
    /\beine\s+sehr\s+aufschlussreiche\b/gi,
    /\bdas\s+ist\s+ein\s+sehr\s+aufschlussreicher\s+punkt\b/gi,
  ];

  // ─── Fuell-Floskeln ────────────────────────────────────────────────
  const FILLERS = [
    /\bes\s+ist\s+wichtig\s+zu\s+beachten,?\s+dass\b/gi,
    /\bes\s+ist\s+wichtig\s+zu\s+erwähnen,?\s+dass\b/gi,
    /\bes\s+ist\s+erwähnenswert,?\s+dass\b/gi,
    /\bes\s+sei\s+darauf\s+hingewiesen,?\s+dass\b/gi,
    /\bim\s+hinblick\s+auf\b/gi,
    /\bin\s+bezug\s+auf\b/gi,
    /\btatsache\s+ist,?\s+dass\b/gi,
  ];

  // ─── Generische Schluesse ──────────────────────────────────────────
  const GENERIC_CONCLUSIONS = [
    /\bdie\s+zukunft\s+(?:sieht|ist)\s+(?:rosig|vielversprechend)\b/gi,
    /\bnur\s+die\s+zeit\s+wird\s+(?:es\s+)?zeigen\b/gi,
    /\beines\s+ist\s+sicher\b/gi,
    /\bwenn\s+wir\s+nach\s+vorne\s+blicken\b/gi,
    /\bzusammenfassend\s+lässt\s+sich\s+sagen\b/gi,
    /\babschliessend\s+lässt\s+sich\s+festhalten\b/gi,
    /\binsgesamt\s+zeigt\s+sich,?\s+dass\b/gi,
    /\bes\s+bleibt\s+abzuwarten,?\s+(?:wie|ob)\b/gi,
  ];

  // ─── „Lassen Sie uns"-Konstruktionen ───────────────────────────────
  const LETS_PATTERNS = [
    /\blassen\s+sie\s+uns\b/gi,
    /\blasst\s+uns\b/gi,
    /\blass\s+uns\s+(?:eintauchen|gemeinsam\s+erkunden|das\s+aufschlüsseln|erkunden)\b/gi,
    /\bschauen\s+wir\s+uns\s+.{0,30}?\s*an\b/gi,
    /\bwerfen\s+wir\s+einen\s+blick\b/gi,
    /\bbetrachten\s+wir\b/gi,
    /\bgehen\s+wir\s+.{0,30}?\s*durch\b/gi,
  ];

  // ─── Reasoning-Artefakte (verbalisierte Chain-of-Thought) ──────────
  const REASONING_ARTIFACTS = [
    /\bschritt\s+für\s+schritt\s+(?:durchgehen|durch)\b/gi,
    /\blass(?:t|\s+mich)?\s+(?:uns\s+)?das\s+(?:schritt\s+für\s+schritt\s+)?(?:durchgehen|aufschlüsseln)\b/gi,
    /\bgehen\s+wir\s+(?:das\s+)?systematisch\s+(?:an|vor)\b/gi,
    /\bhier\s+ist\s+mein\s+gedankengang\b/gi,
    /(?<![\wäöü])überlegen\s+wir\s+zunächst\b/gi,
    /\blass\s+mich\s+(?:kurz\s+)?nachdenken\b/gi,
  ];

  // ─── Quittungs-Schleifen (Acknowledgment-Loops) ────────────────────
  const ACKNOWLEDGMENT_LOOPS = [
    /\bdu\s+fragst\s+(?:dich\s+)?(?:vielleicht\s+)?(?:nach|warum|wie|ob)?\b/gi,
    /\bum\s+(?:deine|ihre)\s+frage\s+zu\s+beantworten\b/gi,
    /\bdie\s+frage,?\s+ob\b/gi,
  ];

  // ─── Bedeutungs-Inflation ──────────────────────────────────────────
  const SIGNIFICANCE_INFLATION = [
    /\bmarkiert\s+einen\s+wendepunkt\b/gi,
    /\bein\s+meilenstein\s+(?:für|in)\b/gi,
    /\bin\s+der\s+entwicklung\s+von\b/gi,
    /\bein\s+(?:entscheidender|prägender)\s+moment\b/gi,
    /\bspielt\s+eine\s+(?:entscheidende|wichtige|zentrale)\s+rolle\b/gi,
  ];

  // ─── Vage Attributionen ────────────────────────────────────────────
  const VAGUE_ATTRIBUTIONS = [
    /\bexperten\s+(?:glauben|sagen|gehen\s+davon\s+aus|sind\s+sich\s+einig)\b/gi,
    /\bstudien\s+(?:zeigen|belegen|legen\s+nahe|deuten\s+darauf\s+hin)\b/gi,
    /\b(?:die\s+)?forschung\s+(?:zeigt|legt\s+nahe|deutet\s+darauf\s+hin)\b/gi,
    /\bbranchenführer\s+sind\s+sich\s+einig\b/gi,
  ];

  // ─── Hohle Verstaerker ─────────────────────────────────────────────
  const HOLLOW_INTENSIFIERS = [
    /\bwirklich\b/gi,
    /\behrlich\s+gesagt\b/gi,
    /\bum\s+ehrlich\s+zu\s+sein\b/gi,
    /\bin\s+der\s+tat\b/gi,
    /\bseien\s+wir\s+ehrlich\b/gi,
    /\bes\s+lohnt\s+sich,?\s+einen\s+genaueren\s+blick\b/gi,
  ];

  // ─── Emotionale Flachheit ──────────────────────────────────────────
  // „besonders faszinierend"/„spannend"-Familie als vorgeschaltetes
  // Gefuehls-Etikett, plus die Listen-Intro-Wendung „was mich am meisten
  // ueberrascht hat". /m, damit `^`-Anker auch an Position 0 greift.
  const EMOTIONAL_FLATLINE = [
    /\bwas\s+mich\s+am\s+meisten\s+überrascht\s+(?:hat|hatte)\b/gi,
    /\bfaszinierend\s+(?:war|fand\s+ich)\b/gi,
    /\b(?:besonders|wirklich)\s+faszinierend\s+ist\b/gi,
    /\bwas\s+mich\s+(?:beeindruckt|beeindruckte)\s+(?:hat|hatte)?\b/gi,
    /\bbesonders\s+spannend\s+war\b/gi,
    /\bes\s+bleibt\s+spannend\s+zu\s+sehen\b/gi,
    /\bdas\s+interessanteste\s+(?:teil|daran)\b/gi,
  ];

  // ─── Neuheits-Inflation ────────────────────────────────────────────
  const NOVELTY_INFLATION = [
    /\bein\s+(?:begriff|problem),?\s+(?:den|über\s+das)\s+niemand\s+(?:nennt|spricht)\b/gi,
    /\bein\s+problem,?\s+über\s+das\s+niemand\s+spricht\b/gi,
    /\bwas\s+dir\s+niemand\s+sagt\b/gi,
    /\bdie\s+(?:erkenntnis|wahrheit),?\s+die\s+alle\s+übersehen\b/gi,
  ];

  // ─── Cutoff-Disclaimer ─────────────────────────────────────────────
  // Enthaelt die kanonischen LLM-Selbstauskunfts-Phrasen — fuer sich allein
  // nahezu beweisend (ein Mensch schreibt nie „als KI-Sprachmodell" in der
  // Ich-Form). Die Muster decken die Default-Disclaimer der grossen Modell-
  // familien ab. „als ki-sprachmodell" ist gemaess Plan zwingend enthalten.
  const CUTOFF_DISCLAIMERS = [
    /\bals\s+ki-?sprachmodell\b/gi,
    /\bals\s+künstliche\s+intelligenz\s+habe\s+ich\s+keinen\s+zugriff\b/gi,
    /\bals\s+künstliche\s+intelligenz\b/gi,
    /\bstand\s+meines\s+letzten\s+updates\b/gi,
    /\bmein\s+wissensstand\s+reicht\s+bis\b/gi,
    /\bich\s+habe\s+keinen\s+zugriff\s+auf\s+echtzeitdaten\b/gi,
    /\bbasierend\s+auf\s+den\s+verfügbaren\s+informationen\b/gi,
  ];

  // ─── KI-Werkzeug-Fingerabdruecke ───────────────────────────────────
  // Drei nahezu beweisende KI-Herkunfts-Signale (uebernommen aus dem
  // Original, Aboudjem/humanizer-skill P33-P35). Anders als die
  // statistischen Muster oben ist ein einziger Treffer hier starkes Indiz —
  // das KI-Werkzeug hat seinen Fingerabdruck buchstaeblich hinterlassen.

  // Nicht ausgefuellte Slot-Platzhalter. Faengt die kanonische „[Ihr Name]"-
  // Familie plus Datums-Schablonen und HTML/MD-Kommentare mit Platzhalter-
  // Verben. Die englischen Verb-Slots bleiben fuer kopierte KI-Vorlagen.
  const AI_PLACEHOLDERS = [
    // Direktive Slots mit Possessiv („[Ihr Name]", „[Dein Name]",
    // „[Euer Betreff]") — verbartig, der Nutzer sollte sie ausfuellen.
    /\[(?:Ihr|Ihre|Dein|Deine|Euer|Eure|Your|Insert|Add|Enter|Describe|Specify|Choose|Pick)[^\]\n]{1,60}\]/gi,
    // Nomen-Slots aus KI-Mail-/Brief-Boilerplate. Konservative Liste: nur
    // Nomen, die fast nie als geklammerter Echtinhalt vorkommen.
    /\[(?:Name|Quelle|Firmenname|Firma|Empfänger|Absender|Betreff|Thema|Datum|Abteilung|Position|Anrede|Grussformel|Projektname|Recipient|Sender|Topic|Subject|Company Name|Date)(?:\s+[^\]\n]{0,60})?\]/gi,
    // Grossbuchstaben-Direktiven („[QUELLE EINFÜGEN]", „[HIER AUSFÜLLEN]")
    // — die Grossschreibung verraet den Slot statt Echtinhalt.
    /\[(?:[A-ZÄÖÜ\s]{0,40}(?:EINFÜGEN|EINTRAGEN|AUSFÜLLEN|HINZUFÜGEN|ERGÄNZEN|PLATZHALTER)|INSERT|FILL\s+IN|ADD|TODO|TBD|PLACEHOLDER)[^\]\n]{0,80}\]/g,
    // Datums-Schablonen (deutsches und englisches Format).
    /\bTT\.MM\.(?:JJJJ|JJ)\b/g,
    /\b(?:19|20)\d{2}-XX-XX\b/g,
    /\bXX\/XX\/(?:19|20)\d{2}\b/g,
    // HTML-/Markdown-Kommentar-Platzhalter mit Platzhalter-Verben.
    /<!--\s*(?:einfügen|ausfüllen|ergänzen|add|fill\s+in|insert|todo|placeholder)[^>]{0,120}-->/gi,
  ];

  // Chatbot citation/markup tokens that leak through copy-paste.
  // `citeturn0search0` / `citeturn0news5` from ChatGPT, contentReference
  // tokens, oai_citation, attached_file references, grok_card markers.
  // Each is a near-definitive signature of a specific tool.
  const AI_CITATION_MARKUP = [
    /\bcite(?:turn|news|search|navigation)\d+(?:search|turn|news|navigation)\d+/gi,
    /contentReference\s*\[oaicite:[^\]]+\]\s*\{[^}]*\}/gi,
    /\boai_citation\b/gi,
    /\[attached_file:\d+\]/gi,
    /\bgrok_card\b/gi,
  ];

  // UTM/tracking parameters auto-appended by AI tools to URLs they
  // generate. Survives copy-paste even when nothing else does.
  const AI_UTM_SOURCE = [
    /[?&]utm_source=(?:chatgpt|openai|copilot|claude|grok|gemini|perplexity)(?:\.com|\.ai)?\b/gi,
    /[?&]referrer=(?:chatgpt|copilot|grok|claude|gemini|perplexity)\.(?:com|ai)\b/gi,
  ];

  // ─── Template-Phrasen ──────────────────────────────────────────────
  const TEMPLATE_PHRASES = [
    /\bein\s+(?:wichtiger|grosser|bedeutender|entscheidender)?\s*schritt\s+in\s+richtung\b/gi,
    /\bob\s+(?:sie|du)\s+nun\s+\S+\s+oder\s+\S+\s+(?:sind|bist)\b/gi,
    /\bich\s+hatte\s+(?:kürzlich|vor\s+kurzem)\s+das\s+vergnügen\b/gi,
  ];

  // ─── Schein-Zugestaendnis ──────────────────────────────────────────
  const FALSE_CONCESSION = [
    /\bzwar\s+ist\s+.{1,40}\s+beeindruckend,?\s+(?:doch|aber)\b/gi,
    /\bobwohl\s+.{1,40}\s+fortschritte\s+gemacht\s+hat\b/gi,
  ];

  // ─── Rhetorische Frage-Eroeffnungen ────────────────────────────────
  const RHETORICAL_QUESTIONS = [
    /\baber\s+was\s+bedeutet\s+das\s+für\b/gi,
    /\bwarum\s+(?:sollte\s+(?:dich|sie)\s+das\s+interessieren|ist\s+das\s+wichtig)\b/gi,
    /\bwie\s+geht\s+es\s+(?:nun\s+)?weiter\b/gi,
    /\bwas\s+kommt\s+als\s+nächstes\?/gi,
  ];

  // ─── Hedge-gestapelte Aussagen ─────────────────────────────────────
  // Stapelt ein Modalverb mit einem Hedge-Adverb: „koennte moeglicherweise",
  // „duerfte letztlich eventuell". Jedes Wort fuer sich ist normal; die
  // Stapelung ist das Tell.
  const HEDGE_STACK = [
    /\b(?:könnte|dürfte|mag|kann|würde)\s+(?:\S+\s+){0,3}(?:möglicherweise|eventuell|letztlich|womöglich|unter\s+umständen|vermutlich)\b/gi,
    /\b(?:möglicherweise|eventuell|letztlich|womöglich)\s+(?:\S+\s+){0,2}(?:könnte|dürfte|mag|kann)\b/gi,
  ];

  // ─── Generische Zukunfts-Narrativ-Schluesse ────────────────────────
  // Das „koennte zu einem der wichtigsten Narrative … werden"-Template —
  // vage Zukunftsbedeutung ohne falsifizierbare Aussage.
  const FUTURE_NARRATIVE = [
    /\b(?:könnte|dürfte|wird|mag)\s+(?:\S+\s+){0,4}zu\s+(?:einem|einer)\s+der\s+(?:wichtigsten|bedeutendsten|entscheidendsten|grössten)\s+(?:\S+\s+){0,3}(?:narrative|geschichten|trends|themen|entwicklungen|kräfte)\s+(?:\S+\s+){0,4}werden\b/gi,
    /\b(?:könnte|dürfte)\s+zu\s+(?:einem|einer)\s+(?:entscheidenden|wichtigen|prägenden)\s+(?:trend|narrativ|entwicklung)\s+werden\b/gi,
  ];

  // ─── „Echt/tatsaechlich"-Adjektiv-Inflation ────────────────────────
  // „echte Wertschoepfung", „tatsaechlicher Nutzen" — echt/wahr/tatsaechlich
  // als leerer Verstaerker vor einem abstrakten Nomen, der unterstellt, der
  // Rest der Branche sei unecht.
  const REAL_ACTUAL_INFLATION = [
    /\b(?:echte|echter|echtes|echten|tatsächliche|tatsächlicher|tatsächlichen|wahre|wahrer|wahres)\s+(?:tokenomics|nutzen|akzeptanz|nachhaltigkeit|wirkung|nachfrage|wertschöpfung|wertschoepfung|innovation|substanz|relevanz)\b/gi,
  ];

  // ─── Formelhafte Eroeffnungen ──────────────────────────────────────
  // Die „In der heutigen schnelllebigen Welt …"-Familie — LLM-Default-
  // Aufmacher fuer Essay-/Marketing-Prosa.
  const FORMULAIC_OPENERS = [
    /\bin\s+der\s+heutigen\s+(?:schnelllebigen|digitalen|vernetzten|modernen)\s+welt\b/gi,
    /\bin\s+einer\s+(?:zeit|welt),?\s+in\s+der\b/gi,
    /\bhat\s+sich\s+als\s+(?:führend|wegweisend|zentral|unverzichtbar)\s+etabliert\b/gi,
    /\bwird\s+(?:immer|zunehmend)\s+(?:wichtiger|relevanter|bedeutender)\b/gi,
  ];

  // ─── Nominalstil / Funktionsverbgefuege (NEU, deutsch) ─────────────
  // Funktionsverbgefuege wie „zur Verfuegung stellen", „in Anspruch nehmen",
  // „Durchfuehrung von" blaehen den Satz auf und ersetzen das Vollverb.
  // Deutsches LLM-Kern-Tell, das im Englischen kein Aequivalent hat (ersetzt
  // die gestrichene Title-Case-Regel). Quelle: de-tells.md, Abschnitt
  // nominalstil.
  const NOMINALSTIL = [
    /\bzur\s+verfügung\s+(?:stellen|gestellt|stehen|steht)\b/gi,
    /\bin\s+anspruch\s+(?:nehmen|genommen)\b/gi,
    /\bzum\s+einsatz\s+(?:kommen|kommt|gebracht)\b/gi,
    /\bzur\s+anwendung\s+(?:kommen|kommt|bringen)\b/gi,
    /\bunter\s+beweis\s+(?:stellen|gestellt)\b/gi,
    /\bdie\s+durchführung\s+(?:von|der|des)\b/gi,
    /\beine\s+(?:entscheidende|wichtige)\s+rolle\s+spielen\b/gi,
    /\beinen\s+beitrag\s+(?:leisten|leistet)\b/gi,
    /\bvon\s+(?:grosser|grösster)\s+bedeutung\s+(?:sein|ist)\b/gi,
  ];

  // ─── Parenthetische Hedge-Einschuebe ───────────────────────────────
  // „(und zunehmend auch X)", „(oder genauer gesagt, Y)", „(zumindest in
  // der Theorie)" — Pseudo-Beiseite, das keine Information liefert, sondern
  // Nachdenklichkeit auffuehrt.
  const PARENTHETICAL_HEDGE = [
    /\(\s*(?:und\s+)?(?:zunehmend|insbesondere|vor\s+allem|bemerkenswerterweise|vielleicht)[,]?\s+[^)]{3,60}\)/gi,
    /\(\s*(?:oder\s+)?genauer\s+gesagt[,]?\s+[^)]{3,60}\)/gi,
    /\(\s*zumindest\s+(?:in\s+der\s+)?(?:theorie|theoretisch|prinzip|teilweise)[,]?\s*[^)]{0,60}\)/gi,
  ];

  // ─── Confidence-Kalibrierung ───────────────────────────────────────
  // Vorgeschaltete Bewertungs-Adverbien auf -weise, die LLMs streuen, um
  // Gewicht vorzutaeuschen. Erst bei Stapelung (>= 3) geflaggt.
  const CONFIDENCE_CALIBRATION = [
    /\binteressanterweise\b/gi,
    /(?<![\wäöü])überraschenderweise\b/gi,
    /\bbemerkenswerterweise\b/gi,
    /\bzweifellos\b/gi,
    /\bohne\s+zweifel\b/gi,
    /\bes\s+sei\s+darauf\s+hingewiesen\b/gi,
    /\bwichtig\s+ist\b/gi,
  ];

  // ═══ Helpers ═══════════════════════════════════════════════════════

  // Tokenizer: `\w` allein erfasst im Deutschen die Umlaute aeoeue nicht
  // (kein Unicode-Flag), darum sind aeoeue explizit in die Zeichenklasse
  // aufgenommen. Ohne diese Ergaenzung wuerden Tokens wie „muehelos" (mit
  // echtem Umlaut) zerfallen und die Tier-Lookups nie matchen. Eszett kommt
  // in Schweizer Schreibweise nicht vor und muss nicht abgedeckt werden.
  function tokenize(text) {
    return text.toLowerCase().match(/[\wäöü'-]+/g) || [];
  }

  function countWords(text) {
    return (text.match(/\S+/g) || []).length;
  }

  function getParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  }

  function getSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  }

  function matchPatterns(text, patterns, category, severity) {
    const issues = [];
    for (const pat of patterns) {
      const regex = new RegExp(pat.source, pat.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          type: category,
          text: match[0],
          index: match.index,
          severity,
          suggestion: null,
        });
      }
    }
    return issues;
  }

  // ═══ Main analysis ═════════════════════════════════════════════════

  // Upper bound for one scan. Above this we bail rather than running all
  // regex passes over a huge buffer — protects page perf on pasted novels.
  const MAX_WORDS = 10000;

  // V2 contract defaults so early-exit paths (Empty/tooShort/tooLong)
  // still return the same field shape a v2 consumer expects. Without
  // this, `result.document_classification === 'AI_ONLY'` is `undefined`
  // on edge inputs and fails open.
  // UNSCORED is returned on empty / too-short / too-long inputs where
  // we declined to score. Distinct from HUMAN_ONLY (which is a positive
  // classification) so a caller can't mistake a refused scan for a
  // confident human verdict — a 50k-word LLM-generated document is
  // not "human", it's just outside our scoring window.
  function buildV2Defaults(classification, confidence) {
    const probs = classification === 'HUMAN_ONLY'
      ? { human: 1, mixed: 0, ai: 0 }
      : classification === 'AI_ONLY'
        ? { human: 0, mixed: 0, ai: 1 }
        : { human: 0.333, mixed: 0.334, ai: 0.333 };
    return {
      document_classification: classification,
      class_probabilities: probs,
      confidence_category: confidence,
      highlight_sentence_for_ai: [],
    };
  }

  function analyzeText(text, options = {}) {
    if (!text || text.trim().length === 0) {
      return { ...buildV2Defaults('UNSCORED', 'low'), score: 0, label: 'Leer', issues: [], stats: {}, tooShort: true };
    }

    // contextMode steuert Regeln, die in technischer Prosa rauschen. Modi
    // (Maschinen-Tokens stabil):
    //   'general' (Default) — voller Regelsatz
    //   'technical' — voller Regelsatz; in der deutschen Portierung gibt es
    //                 keine Title-Case-Sonderbehandlung mehr (Substantiv-
    //                 Grossschreibung macht „Title Case" im Deutschen zu
    //                 keinem Tell). Der Modus bleibt als API-Token erhalten.
    //   'marketing' / 'personal' — voller Regelsatz.
    // Der Modus ist ein reines Soft-Gate; nichts wird still unterdrueckt,
    // ohne in stats.contextMode sichtbar zu sein.
    // Validierung: ein unbekannter String (z. B. Tippfehler „tecnical") wuerde
    // sonst still auf General-Verhalten zurueckfallen. Auf 'general' zwingen
    // und den Originalwert fuer die Nachvollziehbarkeit in stats ausweisen.
    const VALID_CONTEXT_MODES = new Set(['general', 'technical', 'marketing', 'personal']);
    const requestedMode = options.contextMode || 'general';
    const contextMode = VALID_CONTEXT_MODES.has(requestedMode) ? requestedMode : 'general';
    const contextModeFallback = requestedMode !== contextMode ? requestedMode : null;

    // Pre-pass: strip Markdown blockquotes before scoring. A human
    // reacting to AI text by quoting it shouldn't have the quoted block
    // counted against their own writing. Requires ≥2 consecutive `> `
    // lines to count as a blockquote — single-line `> ls -la` shell
    // prompts in technical docs stay in the text.
    let quotedLines = 0;
    const rawLines = text.split(/\r?\n/);
    const isQuote = rawLines.map((l) => /^\s*>\s/.test(l));
    const stripIdx = new Set();
    for (let i = 0; i < rawLines.length; i++) {
      if (isQuote[i] && ((isQuote[i - 1] && i > 0) || isQuote[i + 1])) {
        stripIdx.add(i);
        quotedLines++;
      }
    }
    text = rawLines.filter((_, i) => !stripIdx.has(i)).join('\n');

    // Pre-pass: strip bypass-trick chars before pattern matching so
    // "delve" with a Cyrillic 'е' still hits Tier 1. Original text is
    // preserved so reported `match.index` values remain visually accurate.
    const norm = normalizeText(text);
    text = norm.text;

    const wordCount = countWords(text);
    if (wordCount < 10) {
      return { ...buildV2Defaults('UNSCORED', 'low'), score: 0, label: 'Zu kurz', issues: [], stats: { wordCount, contextMode, contextModeFallback }, tooShort: true };
    }
    if (wordCount > MAX_WORDS) {
      return {
        ...buildV2Defaults('UNSCORED', 'low'),
        score: 0,
        label: 'Text zu lang',
        issues: [],
        stats: { wordCount, contextMode, contextModeFallback },
        tooLong: true,
      };
    }

    const tokens = tokenize(text);
    const paragraphs = getParagraphs(text);
    const sentences = getSentences(text);
    const issues = [];
    let rawScore = 0;

    // ── 1. Tier 1 words ──────────────────────────────────────────
    const tier1Found = new Set();
    for (const token of tokens) {
      if (TIER1[token] && !tier1Found.has(token)) {
        tier1Found.add(token);
        issues.push({
          type: 'tier1',
          text: token,
          severity: 'high',
          suggestion: TIER1[token],
        });
      }
    }

    // Tier 1 multi-word phrases. Adds each distinct phrase (lowercased) to
    // `tier1Found` so the same phrase hit multiple times only produces one
    // issue — matches the downstream dedup behavior.
    for (const phrase of TIER1_PHRASES) {
      const regex = new RegExp(phrase.pattern.source, phrase.pattern.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        const lower = match[0].toLowerCase();
        if (tier1Found.has(lower)) continue;
        tier1Found.add(lower);
        issues.push({
          type: 'tier1',
          text: match[0],
          severity: 'high',
          suggestion: phrase.replace,
        });
      }
    }

    // ── 2. Tier 2 clusters ───────────────────────────────────────
    let tier2Clusters = 0;
    for (const para of paragraphs) {
      const paraTokens = tokenize(para);
      const found = [];
      for (const token of paraTokens) {
        if (TIER2[token] && !found.includes(token)) {
          found.push(token);
        }
      }
      if (found.length >= 2) {
        tier2Clusters++;
        for (const word of found) {
          issues.push({
            type: 'tier2',
            text: word,
            severity: 'medium',
            suggestion: TIER2[word],
          });
        }
      }
    }

    // ── 3. Tier 3 density ────────────────────────────────────────
    const tier3Counts = {};
    for (const token of tokens) {
      const canonical = TIER3_LOOKUP.get(token);
      if (canonical) tier3Counts[canonical] = (tier3Counts[canonical] || 0) + 1;
    }
    // Flag at 3% of word count, but never below 3 occurrences. Previous
    // floor of 1 meant a 50-word text with one "significant" got flagged
    // as Tier 3 overuse, which was noise.
    const densityThreshold = Math.max(3, Math.floor(wordCount * 0.03));
    let tier3Flags = 0;
    for (const [word, count] of Object.entries(tier3Counts)) {
      if (count >= densityThreshold) {
        tier3Flags++;
        issues.push({
          type: 'tier3',
          text: `"${word}" x${count}`,
          severity: 'low',
          suggestion: `Überstrapaziert (${count} Mal in ${wordCount} Wörtern)`,
        });
      }
    }

    // ── 4–21. Pattern categories ─────────────────────────────────
    issues.push(...matchPatterns(text, TRANSITIONS, 'transition', 'medium'));
    issues.push(...matchPatterns(text, CHATBOT_ARTIFACTS, 'chatbot', 'critical'));
    issues.push(...matchPatterns(text, SYCOPHANTIC, 'sycophantic', 'critical'));
    issues.push(...matchPatterns(text, FILLERS, 'filler', 'medium'));
    issues.push(...matchPatterns(text, GENERIC_CONCLUSIONS, 'generic-conclusion', 'medium'));
    issues.push(...matchPatterns(text, LETS_PATTERNS, 'lets-construction', 'medium'));
    issues.push(...matchPatterns(text, REASONING_ARTIFACTS, 'reasoning-artifact', 'critical'));
    issues.push(...matchPatterns(text, ACKNOWLEDGMENT_LOOPS, 'acknowledgment-loop', 'medium'));
    issues.push(...matchPatterns(text, SIGNIFICANCE_INFLATION, 'significance-inflation', 'high'));
    issues.push(...matchPatterns(text, VAGUE_ATTRIBUTIONS, 'vague-attribution', 'critical'));
    issues.push(...matchPatterns(text, HOLLOW_INTENSIFIERS, 'hollow-intensifier', 'medium'));
    issues.push(...matchPatterns(text, EMOTIONAL_FLATLINE, 'emotional-flatline', 'low'));
    issues.push(...matchPatterns(text, NOVELTY_INFLATION, 'novelty-inflation', 'medium'));
    issues.push(...matchPatterns(text, CUTOFF_DISCLAIMERS, 'cutoff-disclaimer', 'critical'));
    issues.push(...matchPatterns(text, AI_PLACEHOLDERS, 'ai-placeholder', 'critical'));
    issues.push(...matchPatterns(text, AI_CITATION_MARKUP, 'ai-citation-markup', 'critical'));
    issues.push(...matchPatterns(text, AI_UTM_SOURCE, 'ai-utm-source', 'critical'));
    issues.push(...matchPatterns(text, TEMPLATE_PHRASES, 'template-phrase', 'high'));
    issues.push(...matchPatterns(text, FALSE_CONCESSION, 'false-concession', 'medium'));
    issues.push(...matchPatterns(text, RHETORICAL_QUESTIONS, 'rhetorical-question', 'medium'));
    issues.push(...matchPatterns(text, HEDGE_STACK, 'hedge-stack', 'high'));
    issues.push(...matchPatterns(text, FUTURE_NARRATIVE, 'future-narrative', 'high'));
    issues.push(...matchPatterns(text, REAL_ACTUAL_INFLATION, 'real-actual-inflation', 'medium'));

    // ── Tier 1 v2: formulaic openers + parenthetical hedges ──────────
    issues.push(...matchPatterns(text, FORMULAIC_OPENERS, 'formulaic-opener', 'high'));
    issues.push(...matchPatterns(text, PARENTHETICAL_HEDGE, 'parenthetical-hedge', 'medium'));

    // Nominalstil / Funktionsverbgefuege (deutsche Zusatzregel; ersetzt die
    // im Deutschen entfallene Title-Case-Regel). Sprach-unabhaengig vom
    // contextMode, weil Funktionsverbgefuege auch in technischer Prosa ein
    // Aufblaeh-Tell sind.
    issues.push(...matchPatterns(text, NOMINALSTIL, 'nominalstil', 'medium'));

    // ── Normalization-trigger flag ───────────────────────────────────
    // ZWSPs or homoglyphs in pasted prose are near-dispositive: humans
    // don't insert these into their own writing. Single roleplay marker
    // can be a false positive on Markdown emphasis (filtered to multi-
    // word inner already), so requires ≥2.
    if (norm.flags.zeroWidth > 0 || norm.flags.homoglyph >= 2) {
      issues.push({
        type: 'normalization-flag',
        text: `${norm.flags.zeroWidth} unsichtbare + ${norm.flags.homoglyph} Homoglyphen-Ersetzung${norm.flags.homoglyph === 1 ? '' : 'en'}`,
        severity: 'critical',
        suggestion: 'Text enthält unsichtbare oder verwechselbare Zeichen, wie sie KI-Humanizer-Werkzeuge zur Umgehung einsetzen. Neu von der eigenen Tastatur tippen.',
      });
    }
    if (norm.flags.roleplay >= 2) {
      issues.push({
        type: 'normalization-flag',
        text: `${norm.flags.roleplay} *Rollenspiel-Aktions*-Marker entfernt`,
        severity: 'high',
        suggestion: 'Eingeklammerte *Aktions*-Marker sind ein Chatmodell-Artefakt.',
      });
    }

    // ── Zeichensetzungs-Signatur (Co-Vorkommen) ──────────────────────
    // Deutsch-Redesign: Der englische Geviertstrich „—" (U+2014) ist im
    // Deutschen untypisch und das eigentliche Paste-aus-LLM-Signal. Das
    // Oxford-Komma faellt weg (kein deutsches Konstrukt). Die deutschen
    // Anfuehrungszeichen «  » und „ " sind lokal-korrekt (Carve-out) und
    // gelten NICHT als Signal — als „Schreib-Anfuehrungszeichen" zaehlen
    // hier nur die geraden/englischen Schreibquotes “ ” ‘ ’.
    // Drei Signale: Geviertstrich + Schreib-Anfuehrungszeichen +
    // fehlerfreies Tippen (keine fehlenden Apostrophe in deutschen
    // Elisionen wie „gibts/gehts"). Einzeln bedeutungslos; das Co-Vorkommen
    // mit dem Geviertstrich ist das Signal.
    {
      const hasCurly = /[“”‘’]/.test(text);    // gerade Schreibquotes, NICHT die lokalen „ " « »
      const hasEmDash = /—/.test(text);        // englischer Geviertstrich U+2014
      const doubleSpaces = (text.match(/[^.!?]  +/g) || []).length;
      // Fehlende Apostrophe in haeufigen deutschen Elisionen als
      // „Mensch-Tippfehler"-Signal (Negativsignal fuer „clean").
      const missingApos = /(?<![\wäöü])(?:gibts|gehts|wars|machts|kommts|habs|aufs|ins|ginge?s|stehts)(?![\wäöü])/i.test(text);
      const clean = doubleSpaces === 0 && !missingApos;
      const signals = [hasCurly, hasEmDash, clean].filter(Boolean).length;
      if (hasEmDash && signals >= 3 && wordCount >= 80) {
        issues.push({
          type: 'smart-punct-signature',
          text: 'Geviertstrich + Schreib-Anführungszeichen + fehlerfreies Tippen',
          severity: 'high',
          suggestion: 'Signatur passt zu aus einem LLM kopiertem Text; der englische Geviertstrich — ist im Deutschen untypisch (korrekt waere der Halbgeviertstrich – mit Leerzeichen).',
        });
      }
    }

    // ── Punctuation distribution mode ────────────────────────────────
    // Humans cluster trimodal across paragraphs (some paras heavy, some
    // light, some none). AI converges on a normal distribution. We can't
    // run a real modality test client-side, but we can flag the AI
    // signature: low variance of per-paragraph punctuation density.
    // Requires ≥4 paragraphs to be meaningful.
    if (paragraphs.length >= 4) {
      const densities = paragraphs.map((p) => {
        const words = (p.match(/\S+/g) || []).length;
        if (words < 5) return null;
        const puncts = (p.match(/[,;:—()]/g) || []).length;
        return puncts / words;
      }).filter((d) => d !== null);
      if (densities.length >= 4) {
        const mean = densities.reduce((a, b) => a + b, 0) / densities.length;
        const variance = densities.reduce((s, d) => s + (d - mean) ** 2, 0) / densities.length;
        const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
        // CV < 0.25 ueber die Absaetze heisst: jeder Absatz hat dieselbe
        // Zeichensetzungsdichte — die KI-Signatur. Menschen schwanken
        // staerker. Schwelle aus Stylometrie-Papers (arxiv 2507.00838),
        // englisch kalibriert — als Heuristik mit Kalibrierungs-Vorbehalt
        // uebernommen, konservativ gehalten (FN-Bias; siehe Spec §5.1).
        if (cv < 0.25 && mean >= 0.04) {
          issues.push({
            type: 'punct-distribution',
            text: `Zeichensetzungsdichte über die Absätze gleichförmig (CV=${cv.toFixed(2)})`,
            severity: 'medium',
            suggestion: 'KI-Text hält die Zeichensetzungsdichte konstant; menschliche Autoren wechseln zwischen dichten und sparsamen Absätzen.',
          });
        }
      }
    }

    // ── Function-word trigram entropy ────────────────────────────────
    // POS-trigram entropy is the academic signal; function-word trigram
    // entropy approximates it without a tagger (function words ARE the
    // closed-class POS classes). AI text has lower entropy because LLM
    // sampling collapses onto a narrower set of grammatical templates.
    //
    // Method: extract function-word indicators per sentence, build
    // trigrams over the sequence, compute Shannon entropy. Bins below
    // threshold flag.
    // Schwellen-Vorbehalt (englisch kalibriert): Die Entropie-Schwelle 0.82
    // (wie TTR 0.4 und die CV-Schwellen 0.25/0.08) stammt aus englischen
    // Korpora. Deutsche Flexion und Komposita verschieben die Verteilung
    // (Flexion senkt die TTR, Komposita erhoehen die Type-Zahl). Ohne
    // deutschen Referenzkorpus wird die Schwelle als dokumentierte Heuristik
    // mit Kalibrierungs-Vorbehalt uebernommen und bewusst konservativ
    // gehalten (FN-Bias). Siehe Spec §5.1.
    if (wordCount >= 150) {
      const FUNC_WORDS = new Set([
        'der','die','das','den','dem','des','ein','eine','einen','einem','einer','eines',
        'und','oder','aber','doch','sondern','denn','sowie','sowohl',
        'in','im','an','am','auf','aus','bei','mit','nach','seit','von','vom','vor','zu','zur','zum','über','unter','durch','für','gegen','ohne','um','bis',
        'ist','sind','war','waren','sein','bin','bist','wird','werden','wurde','worden','hat','haben','hatte','kann','könnte','muss','soll','will','wäre',
        'ich','du','er','sie','es','wir','ihr','man','sich','mich','dich','ihm','ihn',
        'nicht','kein','keine','auch','noch','schon','nur','so','wenn','dann','als','wie','dass','weil','damit','ob','wo','was','wer','welche','welcher',
        'dieser','diese','dieses','hier','dort','da','sehr','mehr',
      ]);
      const seq = tokens.map((t) => FUNC_WORDS.has(t) ? t : '_').filter((_, i, arr) => arr[i] !== '_' || (i > 0 && arr[i - 1] !== '_'));
      if (seq.length >= 50) {
        const trigrams = {};
        for (let i = 0; i < seq.length - 2; i++) {
          const tg = `${seq[i]}|${seq[i + 1]}|${seq[i + 2]}`;
          trigrams[tg] = (trigrams[tg] || 0) + 1;
        }
        const total = seq.length - 2;
        let entropy = 0;
        for (const c of Object.values(trigrams)) {
          const p = c / total;
          entropy -= p * Math.log2(p);
        }
        // Normalize by log2(distinct trigrams) so entropy ranges roughly
        // 0..1 and threshold is interpretable. Empirical threshold: human
        // prose ~0.85-0.95 normalized, AI prose ~0.70-0.82.
        const distinctCount = Object.keys(trigrams).length;
        const normalized = distinctCount > 1 ? entropy / Math.log2(distinctCount) : 1;
        if (normalized < 0.82 && total >= 50) {
          issues.push({
            type: 'fnword-trigram-entropy',
            text: `Funktionswort-Trigramm-Entropie ${normalized.toFixed(2)} (niedrig)`,
            severity: 'medium',
            suggestion: 'Die grammatische Struktur ist ungewöhnlich repetitiv. KI-Sampling fällt auf engere Schablonen zurück als menschliches Schreiben.',
          });
        }
        // Degenerate case: single distinct trigram repeated across the
        // whole document is the strongest possible AI signal but the
        // normalized fallback returns 1.0 (= "fully human"), inverting
        // the signal. Catch it explicitly.
        if (distinctCount === 1 && total >= 50) {
          issues.push({
            type: 'fnword-trigram-entropy',
            text: 'Ein einziges Funktionswort-Trigramm im ganzen Dokument wiederholt',
            severity: 'high',
            suggestion: 'Die grammatische Struktur ist vollständig degeneriert — jeder Teilsatz nutzt dasselbe Funktionswort-Gerüst.',
          });
        }
      }
    }

    // ── Cross-paragraph burstiness ───────────────────────────────────
    // We already check within-paragraph sentence-length uniformity. AI
    // is also flat ACROSS paragraphs — every paragraph has roughly the
    // same sentence-length variance. Humans vary: terse paras next to
    // discursive paras. Measure variance of CV across paragraphs.
    if (paragraphs.length >= 4) {
      const cvs = paragraphs.map((p) => {
        const sents = getSentences(p);
        if (sents.length < 3) return null;
        const lens = sents.map(countWords);
        const m = lens.reduce((a, b) => a + b, 0) / lens.length;
        if (m === 0) return null;
        const v = lens.reduce((s, l) => s + (l - m) ** 2, 0) / lens.length;
        return Math.sqrt(v) / m;
      }).filter((c) => c !== null);
      if (cvs.length >= 4) {
        const cvMean = cvs.reduce((a, b) => a + b, 0) / cvs.length;
        const cvVar = cvs.reduce((s, c) => s + (c - cvMean) ** 2, 0) / cvs.length;
        const cvStd = Math.sqrt(cvVar);
        // Std-der-CV unter 0.08 heisst: jeder Absatz hat etwa denselben
        // inneren Rhythmus — KI-Signatur. Menschliche Prosa schwankt ueber
        // Absaetze gemischten Zwecks typisch 0.15-0.40. Schwelle englisch
        // kalibriert, als Heuristik mit Vorbehalt uebernommen (Spec §5.1).
        if (cvStd < 0.08 && cvMean < 0.45) {
          issues.push({
            type: 'cross-para-burstiness',
            text: `Satzrhythmus über die Absätze gleichförmig (σCV=${cvStd.toFixed(2)})`,
            severity: 'medium',
            suggestion: 'Jeder Absatz hat denselben inneren Rhythmus. Menschen wechseln die Kadenz zwischen knappen und ausführlichen Absätzen.',
          });
        }
      }
    }

    // ── Tier 3 multi-word phrase density ─────────────────────────
    // Two complementary rules:
    //   (a) Per-phrase density — same gating as single-word Tier 3: each
    //       phrase fine alone, repetition is the tell. Threshold = 2.
    //   (b) Cross-phrase clustering — ≥3 *distinct* boilerplate phrases
    //       in one piece. LLMs varying their own boilerplate often use
    //       each phrase only once but stack 5-10 across the text. The
    //       per-phrase rule misses this; the cluster rule catches it.
    // Track non-overlapping match spans so a longer phrase swallowing a
    // shorter one (e.g., "designed for long-term sustainability" matches
    // both "designed for long-term" AND "long-term sustainability") only
    // contributes one distinct hit. Without dedup the cluster threshold
    // can be reached by a single sentence stacking overlapping regexes.
    const claimedSpans = [];
    function spanOverlaps(start, end) {
      for (const [s, e] of claimedSpans) {
        if (start < e && end > s) return true;
      }
      return false;
    }
    let distinctPhrasesHit = 0;
    for (const phrase of TIER3_PHRASES) {
      const regex = new RegExp(phrase.source, phrase.flags);
      const phraseSpans = [];
      let phraseMatch;
      while ((phraseMatch = regex.exec(text)) !== null) {
        const start = phraseMatch.index;
        const end = start + phraseMatch[0].length;
        if (!spanOverlaps(start, end)) {
          phraseSpans.push([start, end, phraseMatch[0]]);
        }
      }
      if (phraseSpans.length === 0) continue;
      for (const [s, e] of phraseSpans) claimedSpans.push([s, e]);
      distinctPhrasesHit++;
      if (phraseSpans.length >= 2) {
        issues.push({
          type: 'tier3-phrase',
          text: `"${phraseSpans[0][2].toLowerCase()}" x${phraseSpans.length}`,
          severity: 'medium',
          suggestion: `Floskel ${phraseSpans.length}× wiederholt — mindestens eine durch Konkretes ersetzen`,
        });
      }
    }
    if (distinctPhrasesHit >= 3) {
      issues.push({
        type: 'tier3-phrase-cluster',
        text: `${distinctPhrasesHit} verschiedene Boilerplate-Floskeln`,
        severity: 'high',
        suggestion: 'Mehrere Standard-Floskeln in einem Text gestapelt. Um eine konkrete Aussage oder Beobachtung herum neu schreiben.',
      });
    }

    // ── Hashtag stuffing ─────────────────────────────────────────
    // 6+ hashtags in a single post is rare for thoughtful humans and
    // near-universal for LLM-generated social posts. Counted globally,
    // not per-paragraph, since the trailing hashtag block is the shape
    // we care about.
    // Match #tag at start of text or after any non-word char (whitespace,
    // punctuation, line breaks). URL fragments are already excluded
    // because the char immediately before `#` in a URL path is always
    // a word char (e.g. `example.com/page#section` — `e` before `#`).
    // Earlier char class `[\s\\]` had a literal backslash and silently
    // missed hashtags after sentence punctuation; an interim `[\s]` fix
    // on origin only caught whitespace-preceded tags.
    const hashtagMatches = text.match(/(?:^|\W)#\w[\w-]*/g) || [];
    if (hashtagMatches.length >= 6) {
      issues.push({
        type: 'hashtag-stuff',
        text: `${hashtagMatches.length} Hashtags`,
        severity: 'medium',
        suggestion: 'Auf 2-3 konkrete Tags kürzen oder ganz weglassen. Lange Hashtag-Blöcke wirken wie Bot-Ausgabe.',
      });
    }

    // ── Bullet list of bare noun phrases ─────────────────────────
    // ≥5 consecutive bullet items that are short (≤6 words) and contain
    // no finite-verb / modal token. Catches the "Stable mining efficiency
    // / Reliable pool connectivity / Optimized RandomX performance ..."
    // shape LLMs default to. Markdown bullets, escaped Markdown bullets,
    // unicode bullets, and dashes are all matched. Numbered lists are
    // excluded — those have a separate "numbered list inflation" rule.
    //
    // Hinweis: verbRe deckt deutsche Hilfs- und Modalverben ab (ist/sind/
    // war/hat/haben/wird/werden/kann/muss/…) sowie die haeufigsten flektierten
    // Vollverb-Formen aus Changelog-/Todo-Listen (behebt/entfernt/ergaenzt/
    // korrigiert/aktualisiert/fuegt/loest). So bleiben echte Stichwortlisten
    // mit Verben (Changelogs) draussen, waehrend die LLM-typische Liste aus
    // reinen Adjektiv+Nomen-Paaren (kein finites Verb) geflaggt wird. Die
    // <= 6-Wort-Schranke filtert laengere Prosa-Bullets zusaetzlich.
    const lines = text.split(/\r?\n/);
    const bulletRe = /^\s*(?:\*|-|•|\+)\s+(.+)$/;
    const verbRe = /(?<![\wäöü])(?:ist|sind|war|waren|wird|werden|wurde|wurden|hat|haben|hatte|hatten|kann|können|muss|müssen|soll|sollen|darf|wäre|sei|gibt|läuft|behebt|entfernt|ergänzt|korrigiert|aktualisiert|fügt|löst|bringt|macht|baut|schafft)(?![\wäöü])/i;
    const fenceRe = /^\s*(?:```|~~~)/;
    let run = [];
    let blankStreak = 0;
    let inFence = false;
    function flushRun() {
      if (run.length >= 5) {
        const bareNP = run.filter((it) => {
          const wc = (it.match(/\S+/g) || []).length;
          return wc > 0 && wc <= 6 && !verbRe.test(it);
        });
        if (bareNP.length >= 5 && bareNP.length / run.length >= 0.75) {
          issues.push({
            type: 'bullet-np-list',
            text: `Aufzählung mit ${run.length} reinen Nominalphrasen`,
            severity: 'high',
            suggestion: 'In einen Prosa-Absatz umwandeln oder Punkte zusammenfassen. Lange Listen aus reinen Adjektiv+Nomen-Paaren wirken wie KI-Geruest.',
          });
        }
      }
      run = [];
      blankStreak = 0;
    }
    for (const line of lines) {
      if (fenceRe.test(line)) {
        // Code-fence toggle. Bullets inside fences are CLI flag docs or
        // option dumps, not prose AI scaffolding — flush any prose run
        // we were tracking and skip until the fence closes.
        flushRun();
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const m = line.match(bulletRe);
      if (m) {
        run.push(m[1].trim());
        blankStreak = 0;
      } else if (line.trim() === '') {
        // A single blank line inside a list is normal Markdown spacing;
        // two or more blank lines break the run, since visually-disjoint
        // bullet sections shouldn't merge into one logical list.
        blankStreak++;
        if (blankStreak >= 2) flushRun();
      } else {
        flushRun();
      }
    }
    flushRun();

    // Confidence calibration is only flagged when it stacks (3+ instances).
    // Gating happens pre-dedup on raw match count, since that signals actual
    // stacking, not just vocabulary use.
    const confIssues = matchPatterns(text, CONFIDENCE_CALIBRATION, 'confidence-calibration', 'low');
    if (confIssues.length >= 3) issues.push(...confIssues);

    // ── 22. Geviertstrich-Haeufigkeit (Deutsch-Redesign) ─────────
    // Im Deutschen ist der Halbgeviertstrich „–" (U+2013, mit Leerzeichen)
    // der korrekte Gedankenstrich und wird NICHT gezaehlt. Das Tell ist der
    // englische Geviertstrich „—" (U+2014), den LLMs aus englischen
    // Trainingsdaten einstreuen. `--` wird wie bisher nur dann gewertet,
    // wenn es von Leerzeichen umgeben ist (ueberspringt CLI-Flags wie
    // --save-dev und YAML-`---`-Bloecke).
    const emDashCount = (text.match(/—|(?<=\s)--(?=\s|$)|(?<=^|\s)--(?=\s)/gm) || []).length;
    const emDashRate = emDashCount / (wordCount / 1000);
    if (emDashRate > 1) {
      issues.push({
        type: 'em-dash',
        text: `${emDashCount} Geviertstriche (—) in ${wordCount} Wörtern`,
        severity: 'medium',
        suggestion: 'Im Deutschen den Halbgeviertstrich – mit Leerzeichen, ein Komma oder einen Punkt verwenden. Der Geviertstrich — ist untypisch.',
      });
    }

    // ── 23. Sentence length uniformity ───────────────────────────
    if (sentences.length >= 5) {
      const lengths = sentences.map(s => countWords(s));
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      const cv = avg > 0 ? stdDev / avg : 0;

      if (cv < 0.25 && avg > 10) {
        issues.push({
          type: 'uniformity',
          text: `Satzlängen liegen alle um ${Math.round(avg)} Wörter (wenig Variation)`,
          severity: 'medium',
          suggestion: 'Kurze, prägnante Sätze mit längeren, fliessenden mischen',
        });
      }
    }

    // ── Type-Token-Ratio (stylometrisch — Vokabularvielfalt) ────
    // TTR = verschiedene Worttypen / alle Tokens. Schwelle 0.4 ist auf
    // ENGLISCHEN Korpora kalibriert (engl. Prosa ~0.50-0.65 bei 200+
    // Woertern). Deutsch verschiebt das: Flexion senkt die TTR, Komposita
    // erhoehen die Type-Zahl. Ohne deutschen Referenzkorpus wird die
    // Schwelle als dokumentierte Heuristik mit Kalibrierungs-Vorbehalt
    // uebernommen und bewusst konservativ gehalten (FN-Bias; Spec §5.1) —
    // kein POS-Tagger, kein Modell, reines JS.
    //
    // Flaggen nur, wenn die Stichprobe gross genug ist, dass niedrige TTR
    // wirklich verdaechtig ist (>= 200 Tokens) UND die TTR unter 0.40 liegt
    // (sehr wortarm). Fehlalarme auf kurzer oder themenenger Menschenprosa
    // sind sonst leicht ausgeloest und wuerden andere Signale uebertoenen.
    if (tokens.length >= 200) {
      const unique = new Set(tokens).size;
      const ttr = unique / tokens.length;
      if (ttr < 0.4) {
        issues.push({
          type: 'low-ttr',
          text: `Vokabularvielfalt ${(ttr * 100).toFixed(1)}% (${unique} verschiedene / ${tokens.length} Tokens)`,
          severity: 'low',
          suggestion: 'Der Text nutzt einen engen Wortschatz wieder. Nomen und Verben bewusst variieren, oder prüfen, ob das Thema die Wiederholung wirklich rechtfertigt.',
        });
      }
    }

    // ── 24. Paragraph length uniformity ──────────────────────────
    if (paragraphs.length >= 4) {
      const paraLengths = paragraphs.map(p => getSentences(p).length);
      const avg = paraLengths.reduce((a, b) => a + b, 0) / paraLengths.length;
      const allSimilar = paraLengths.every(l => Math.abs(l - avg) <= 1);
      if (allSimilar && avg >= 3) {
        issues.push({
          type: 'uniformity',
          text: `Alle Absätze umfassen ~${Math.round(avg)} Sätze`,
          severity: 'low',
          suggestion: 'Absatzlänge bewusst variieren',
        });
      }
    }

    // ── 25. Fettschrift-Übermass ─────────────────────────────────
    const boldMatches = text.match(/\*\*[^*]+\*\*/g) || [];
    if (boldMatches.length > 3) {
      issues.push({
        type: 'formatting',
        text: `${boldMatches.length} fett gesetzte Passagen`,
        severity: 'medium',
        suggestion: 'Bei den meisten die Fettschrift entfernen; so umbauen, dass die Kernaussage zuerst kommt',
      });
    }

    // ── Score from the deduped issue list ───────────────────────
    // Previously rawScore was accumulated inline per pattern hit, so
    // repeated hits of the same phrase (or overlapping matches) inflated
    // the score while the displayed issue list was deduplicated. That
    // produced the UX regression where a "heavy AI patterns" label sat
    // above a list of two items. Now the dedup runs first, then each
    // distinct issue contributes its category weight — so the number
    // reflects the same signals the user actually sees.
    const deduped = deduplicateIssues(issues);
    for (const issue of deduped) {
      rawScore += ISSUE_WEIGHTS[issue.type] ?? 2;
    }

    // Scale by text length: longer text gets more chances to trigger.
    const lengthFactor = Math.max(1, Math.log2(wordCount / 50));
    const normalizedScore = Math.min(100, Math.round(rawScore / lengthFactor));

    const label = getLabel(normalizedScore);

    // ── Sentence-region smoothing (HMM-style without an HMM) ─────────
    // Map each text-bearing issue back to its sentence indexes, then
    // merge adjacent flagged sentences into contiguous regions for UI
    // highlighting. Borrowed from GPTZero's sentence-highlighting model
    // — gives users "this paragraph is AI" rather than scattered hits.
    const regions = buildSentenceRegions(text, deduped);

    // Stats derived from the same deduped list so tier counts + patternCount
    // sum to `deduped.length`. Previously patternCount subtracted
    // `tier2Clusters` (a paragraph count) which produced inconsistent totals.
    const tier1Count = deduped.filter((i) => i.type === 'tier1').length;
    const tier2Count = deduped.filter((i) => i.type === 'tier2').length;
    const tier3Count = deduped.filter((i) => i.type === 'tier3').length;

    // ── Trinary classification (GPTZero-shaped) ──────────────────────
    // Decouples confidence from AI-proportion. Maps the 0-100 score plus
    // structural signals into HUMAN_ONLY / MIXED / AI_ONLY with a
    // confidence band. Thresholds are FN-biased: ambiguity routes to
    // MIXED, never AI_ONLY. Quote from GPTZero's design principle:
    // "biases the detector to prefer making less-harmful false-negative
    // errors over false-positive errors."
    // Dense-AI-vocab trifecta: ≥5 distinct tier1 hits + ≥2 tier2 cluster
    // paragraphs + ≥1 transition phrase, AND ≥150 words. Catches
    // saturated ChatGPT prose without firing on dense-jargon human
    // technical writing where the tier1 vocabulary (robust,
    // comprehensive, leverage, ecosystem) legitimately overlaps with
    // systems-programming idiom. Word-count gate prevents short ESL or
    // contrived adversarial sentences from tripping the corroborator.
    const tier1Distinct = new Set(deduped.filter((i) => i.type === 'tier1').map((i) => (i.text || '').toLowerCase())).size;
    const hasTier2Cluster = tier2Clusters >= 2;
    const hasTransition = deduped.some((i) => i.type === 'transition');
    const denseAIVocab = wordCount >= 150 && tier1Distinct >= 5 && hasTier2Cluster && hasTransition;

    const trinary = classifyTrinary({
      score: normalizedScore,
      issues: deduped,
      regions,
      normFlags: norm.flags,
      wordCount,
      denseAIVocab,
    });

    return {
      // Legacy fields preserved for existing callers.
      score: normalizedScore,
      label,
      issues: deduped,
      stats: {
        wordCount,
        tier1Count,
        tier2Count,
        tier2Clusters,
        tier3Count,
        tier3Flags,
        patternCount: deduped.length - tier1Count - tier2Count - tier3Count,
        contextMode,
        contextModeFallback,
        normalization: norm.flags,
        quotedLines,
        unmappedHighlights: regions._unmapped ?? 0,
        denseAIVocab,
        tier1Distinct,
      },
      // Trinary API — shape mirrors GPTZero so integrators can swap.
      document_classification: trinary.classification,
      class_probabilities: trinary.probabilities,
      confidence_category: trinary.confidence,
      highlight_sentence_for_ai: regions,
    };
  }

  // ═══ Sentence regions + trinary classifier ═════════════════════════

  function buildSentenceRegions(text, issues) {
    // Split text into sentences with byte offsets preserved so the UI
    // can highlight spans accurately. Sentence boundaries are coarse
    // (.!?) — fine for highlighting, not for linguistic correctness.
    const sentences = [];
    const sentenceRe = /[^.!?]+[.!?]+|\S[^.!?]*$/g;
    let m;
    while ((m = sentenceRe.exec(text)) !== null) {
      const trimmed = m[0].trim();
      if (trimmed.length < 4) continue;
      sentences.push({ start: m.index, end: m.index + m[0].length, text: trimmed });
    }
    if (sentences.length === 0) return [];

    // Map issue.text back to sentence indexes via substring search. Issues
    // without a meaningful text (e.g. summary signals like "Punctuation
    // density uniform across paragraphs") have no sentence anchor — they
    // contribute to the document-level signal but not to highlights.
    // Filter by issue TYPE not text-regex: text-based filtering used to
    // drop legitimate phrase issues containing "across" / "density".
    const SUMMARY_ONLY_TYPES = new Set([
      'punct-distribution',
      'cross-para-burstiness',
      'fnword-trigram-entropy',
      'smart-punct-signature',
      'normalization-flag',
      'uniformity',
      'em-dash',
      'formatting',
      'tier3',
      'tier3-phrase',
      'tier3-phrase-cluster',
      'hashtag-stuff',
      'bullet-np-list',
    ]);
    const hits = sentences.map(() => ({ count: 0, weight: 0 }));
    const lowerText = text.toLowerCase();
    let unmappedHighlights = 0;
    for (const issue of issues) {
      if (!issue.text || issue.text.length > 200) continue;
      if (SUMMARY_ONLY_TYPES.has(issue.type)) continue;
      const needle = issue.text.toLowerCase();
      let idx = 0;
      let matched = false;
      while ((idx = lowerText.indexOf(needle, idx)) !== -1) {
        matched = true;
        for (let i = 0; i < sentences.length; i++) {
          if (idx >= sentences[i].start && idx < sentences[i].end) {
            hits[i].count++;
            hits[i].weight += ISSUE_WEIGHTS[issue.type] ?? 2;
            break;
          }
        }
        idx += needle.length;
      }
      if (!matched) unmappedHighlights++;
    }

    // Window-merge contiguous flagged sentences. Allow 1 unflagged
    // sentence gap between two flagged ones (the "smoothing" — keeps
    // a single boring sentence from breaking what's clearly an AI
    // passage). A sentence is "flagged" if it has ≥1 hit.
    const regions = [];
    let cur = null;
    for (let i = 0; i < sentences.length; i++) {
      if (hits[i].count > 0) {
        if (cur === null) {
          cur = { startSentence: i, endSentence: i, start: sentences[i].start, end: sentences[i].end, hitCount: hits[i].count, weight: hits[i].weight };
        } else {
          cur.endSentence = i;
          cur.end = sentences[i].end;
          cur.hitCount += hits[i].count;
          cur.weight += hits[i].weight;
        }
      } else if (cur !== null) {
        // Allow one-sentence gap.
        const next = hits[i + 1];
        if (next && next.count > 0) {
          cur.endSentence = i;
          cur.end = sentences[i].end;
          continue;
        }
        regions.push(finalizeRegion(cur));
        cur = null;
      }
    }
    if (cur !== null) regions.push(finalizeRegion(cur));
    // Expose the unmapped-highlight count via a non-enumerable property
    // so the array length still reads naturally for consumers; the
    // analyzer pulls it into stats.unmappedHighlights for diagnostics.
    Object.defineProperty(regions, '_unmapped', { value: unmappedHighlights, enumerable: false });
    return regions;
  }

  function finalizeRegion(r) {
    // Map cumulative weight inside the region to a 0-1 score. Cap at 20
    // weight = 1.0 (matches Heavy threshold density).
    const score = Math.min(1, r.weight / 20);
    return {
      startSentence: r.startSentence,
      endSentence: r.endSentence,
      start: r.start,
      end: r.end,
      hitCount: r.hitCount,
      score: Math.round(score * 100) / 100,
    };
  }

  // FN-biased: false positives damage trust more than false negatives,
  // so MIXED is wide and AI_ONLY requires multiple signals. Quote from
  // GPTZero: "biases the detector to prefer making less-harmful
  // false-negative errors over false-positive errors."
  function classifyTrinary({ score, issues, regions, normFlags, wordCount, denseAIVocab }) {
    // Strong corroborators — each is near-dispositive on its own:
    //   - cutoff-disclaimer (LLM self-identifies as an AI)
    //   - reasoning-artifact + chatbot-artifact co-occurrence
    //   - normalization-flag at threshold (≥2 ZWSP or homoglyphs).
    //     Threshold parity prevents a single stray ZWSP in copy-paste
    //     from Word/Notion from flipping to AI_ONLY at score 0.
    //   - denseAIVocab: ≥4 distinct tier1 hits AND ≥1 tier2 cluster AND
    //     ≥1 transition phrase — the trifecta that saturated ChatGPT
    //     prose triggers without needing whitelisted stylometric hits.
    const hasCutoff = issues.some((i) => i.type === 'cutoff-disclaimer');
    const hasNormFlag = normFlags.zeroWidth >= 2 || normFlags.homoglyph >= 2;
    const hasReasoning = issues.some((i) => i.type === 'reasoning-artifact');
    const hasChatbot = issues.some((i) => i.type === 'chatbot');
    const strongCorrob =
      (hasCutoff ? 1 : 0) +
      (hasNormFlag ? 1 : 0) +
      (hasReasoning && hasChatbot ? 1 : 0) +
      (denseAIVocab ? 1 : 0);

    // Weak (stylometric) corroborators — suggestive on their own,
    // dispositive in combination. Smart-punct-signature matches
    // Word-edited human prose so doesn't count without other support.
    const stylometricHits = ['punct-distribution', 'cross-para-burstiness', 'fnword-trigram-entropy']
      .filter((t) => issues.some((i) => i.type === t)).length;
    const hasSmartPunct = issues.some((i) => i.type === 'smart-punct-signature');
    const weakCorrob = (stylometricHits >= 2 ? 1 : 0) + (hasSmartPunct ? 1 : 0);

    // Thresholds:
    //   score < 15 with no strong → HUMAN_ONLY
    //   strong ≥ 1 OR score ≥ 70 → AI_ONLY (lowered from 80; high
    //     density of AI vocab is sufficient evidence)
    //   score ≥ 40 with any corroborator → AI_ONLY
    //   everything else with score ≥ 15 → MIXED
    const totalCorrob = strongCorrob + weakCorrob;
    let classification;
    if (score < 15 && strongCorrob === 0) classification = 'HUMAN_ONLY';
    else if (strongCorrob >= 1 || score >= 70) classification = 'AI_ONLY';
    else if (score >= 40 && totalCorrob >= 1) classification = 'AI_ONLY';
    else classification = 'MIXED';

    // Humanizer-flag escalation: presence of bypass-trick chars is
    // adversarial signal. If a normalization-flag fired we already
    // counted it in strongCorrob → AI_ONLY. Confidence also gets a
    // floor of 'medium' in that case (an adversary actively evading
    // detection should never read as low-confidence noise).

    // Soft probability distribution. Not calibrated against a labeled
    // corpus yet (TODO when corpus exists — see roadmap.md). Largest
    // class is computed as `1 - others` after rounding to guarantee
    // sum=1 exactly. Sub-1% drift would otherwise hide in toFixed.
    const aiSoft = Math.min(0.97, score / 100 + totalCorrob * 0.06 + strongCorrob * 0.08);
    let p;
    if (classification === 'HUMAN_ONLY') p = { human: Math.max(0.6, 1 - aiSoft), mixed: Math.min(0.35, aiSoft * 0.8), ai: Math.min(0.1, aiSoft * 0.3) };
    else if (classification === 'AI_ONLY') p = { human: Math.max(0.02, 1 - aiSoft - 0.05), mixed: 0.1, ai: aiSoft };
    else p = { human: Math.max(0.15, 0.6 - aiSoft * 0.5), mixed: 0.5, ai: aiSoft * 0.7 };
    const rawSum = p.human + p.mixed + p.ai;
    p.human = +(p.human / rawSum).toFixed(3);
    p.mixed = +(p.mixed / rawSum).toFixed(3);
    // Assign ai as the remainder so the three values sum to exactly 1.
    // Clamp to >= 0 in case rounding pushes human+mixed above 1 (the
    // remainder would otherwise show as -0 or -0.001 — surfaces as a
    // negative percentage in any UI doing Math.round(p.ai * 100)).
    p.ai = Math.max(0, +(1 - p.human - p.mixed).toFixed(3));
    const probabilities = p;

    // Confidence band:
    //   high   — strongCorrob ≥ 2, OR cutoff-disclaimer, OR score < 8 (clean long doc)
    //   medium — strongCorrob ≥ 1, OR score ≥ 45 with weak corroborator, OR score < 20
    //   low    — everything else
    let confidence;
    if (strongCorrob >= 2 || hasCutoff || (score < 8 && wordCount >= 100)) confidence = 'high';
    else if (strongCorrob >= 1 || (score >= 45 && weakCorrob >= 1) || score < 20) confidence = 'medium';
    else confidence = 'low';

    return { classification, probabilities, confidence };
  }

  // Feste deutsche Score-Labels (verbindlich, ueberall identisch verwendet).
  function getLabel(score) {
    if (score === 0) return 'Sauber';
    if (score <= 15) return 'Minimale KI-Signale';
    if (score <= 35) return 'Einige KI-Muster';
    if (score <= 60) return 'Moderate KI-Signale';
    if (score <= 80) return 'Starke KI-Signale';
    return 'Viele KI-Muster';
  }

  function getColor(score) {
    if (score <= 15) return '#44bb66';
    if (score <= 35) return '#88bb44';
    if (score <= 60) return '#ddaa00';
    if (score <= 80) return '#ff8833';
    return '#ff4444';
  }

  function deduplicateIssues(issues) {
    const seen = new Set();
    return issues.filter(issue => {
      const key = `${issue.type}:${issue.text.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ─── Severity labels ──────────────────────────────────────────
  const SEVERITY_LABELS = {
    critical: 'P0',
    high: 'P1',
    medium: 'P2',
    low: 'P3',
  };

  const TYPE_LABELS = {
    'tier1': 'KI-Vokabular',
    'tier2': 'Wort-Cluster',
    'tier3': 'Überstrapaziertes Wort',
    'transition': 'KI-Übergang',
    'chatbot': 'Chatbot-Artefakt',
    'sycophantic': 'Schmeichelhafter Ton',
    'filler': 'Füll-Floskel',
    'generic-conclusion': 'Generischer Schluss',
    'lets-construction': '„Lassen Sie uns"-Eröffnung',
    'reasoning-artifact': 'Reasoning-Artefakt',
    'acknowledgment-loop': 'Quittungs-Schleife',
    'significance-inflation': 'Bedeutungs-Inflation',
    'vague-attribution': 'Vage Attribution',
    'hollow-intensifier': 'Hohler Verstärker',
    'emotional-flatline': 'Emotionale Flachheit',
    'novelty-inflation': 'Neuheits-Inflation',
    'cutoff-disclaimer': 'Cutoff-Disclaimer',
    'template-phrase': 'Template-Phrase',
    'false-concession': 'Schein-Zugeständnis',
    'rhetorical-question': 'Rhetorische Frage',
    'confidence-calibration': 'Gewissheits-Stapelung',
    'em-dash': 'Geviertstrich-Übermass',
    'uniformity': 'Rhythmus-Gleichförmigkeit',
    'formatting': 'Formatierung',
    'tier3-phrase': 'Boilerplate-Floskel',
    'tier3-phrase-cluster': 'Boilerplate-Cluster',
    'hashtag-stuff': 'Hashtag-Überladung',
    'bullet-np-list': 'Nominalphrasen-Aufzählung',
    'hedge-stack': 'Hedge-gestapelte Aussage',
    'future-narrative': 'Generisches Zukunfts-Narrativ',
    'real-actual-inflation': '„Echt/tatsächlich"-Inflation',
    'formulaic-opener': 'Formelhafte Eröffnung',
    'nominalstil': 'Nominalstil',
    'parenthetical-hedge': 'Parenthetischer Hedge',
    'smart-punct-signature': 'Zeichensetzungs-Signatur',
    'punct-distribution': 'Zeichensetzungs-Verteilung',
    'fnword-trigram-entropy': 'Grammatik-Wiederholung',
    'cross-para-burstiness': 'Rhythmus über Absätze',
    'normalization-flag': 'Umgehungs-Zeichen',
    'low-ttr': 'Geringe Vokabularvielfalt',
    'ai-placeholder': 'Nicht ausgefüllter Platzhalter',
    'ai-citation-markup': 'Durchgesickertes Chatbot-Zitat-Markup',
    'ai-utm-source': 'KI-Werkzeug-URL-Parameter',
  };

  return {
    analyzeText,
    normalizeText,
    getLabel,
    getColor,
    SEVERITY_LABELS,
    TYPE_LABELS,
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIDetector;
}
