#!/usr/bin/env bash
# Schutz gegen Drift der Muster-Anzahl. Die Zahl ist ein abgeleiteter Fakt und
# steht an genau einer nutzerseitigen Stelle - im README-Bullet
# "**NN Muster-Kategorien**" - und dieses Skript prueft, dass sie zum
# Erkennungskatalog von SKILL.md passt. Laeuft in der CI, damit ein neues Muster
# ohne README-Update ein roter Check ist und nicht stiller Zerfall.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skill="$repo_root/SKILL.md"
readme="$repo_root/README.md"

# Erkennungs-Kategorien = die `###`-Eintraege unter
# "## Was zu entfernen oder zu korrigieren ist", abzueglich der schreiberseitigen
# Tests (Beurteilungs-Checks ohne erkennbare Form): Absatz-Umstell-Immunitaet,
# Tretmuehlen-Effekt und Neuschreiben-statt-Flicken.
detection_count="$(awk '
  /^## Was zu entfernen oder zu korrigieren ist/ { inside = 1; next }
  /^## / { inside = 0 }
  inside && /^### / {
    if ($0 ~ /\(Struktur-Test\)/) next
    if ($0 ~ /\(Inhalts-Test\)/) next
    if ($0 ~ /^### Wann komplett neu schreiben/) next
    n++
  }
  END { print n + 0 }
' "$skill")"

# Das einzige nutzerseitige Zahl-Literal.
readme_count="$(sed -n 's/.*\*\*\([0-9][0-9]*\) Muster-Kategorien\*\*.*/\1/p' "$readme" | head -n1)"

if [ -z "$readme_count" ]; then
  echo "Konnte das Bullet '**NN Muster-Kategorien**' in README.md nicht finden" >&2
  exit 1
fi

if [ "$detection_count" != "$readme_count" ]; then
  echo "Drift der Muster-Anzahl: SKILL.md hat $detection_count Erkennungs-Kategorien, README sagt $readme_count" >&2
  echo "Passe das Bullet '**NN Muster-Kategorien**' in README.md auf $detection_count an (oder korrigiere SKILL.md)." >&2
  exit 1
fi

echo "Muster-Anzahl synchron: $detection_count"
