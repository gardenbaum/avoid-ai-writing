#!/usr/bin/env bash
# Erzeugt das im Plugin gebuendelte Skill neu aus dem kanonischen Root-SKILL.md.
# Das Root-SKILL.md ist die einzige Quelle der Wahrheit; die Plugin-Kopie wird
# generiert. Nach dem Bearbeiten von SKILL.md ausfuehren. Die CI schlaegt fehl,
# wenn die Kopie nicht synchron ist.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$repo_root/SKILL.md"
dest="$repo_root/plugins/avoid-ai-writing/skills/avoid-ai-writing/SKILL.md"

cp "$src" "$dest"

# Haelt die Version in plugin.json im Gleichschritt mit der Version im
# SKILL.md-Frontmatter. Liest die Version nur aus dem ersten
# YAML-Frontmatter-Block und entfernt jedes CR, damit ein CRLF-Checkout keinen
# Mismatch bei optisch identischen Strings vortaeuschen kann.
skill_version="$(sed -n '/^---[[:space:]]*$/,/^---[[:space:]]*$/ s/^version:[[:space:]]*//p' "$src" | head -n1 | tr -d '\r')"
if [ -z "$skill_version" ]; then
  echo "Konnte 'version:' nicht aus dem SKILL.md-Frontmatter lesen" >&2
  exit 1
fi
plugin_version="$(
  python3 - "$repo_root/plugins/avoid-ai-writing/.claude-plugin/plugin.json" <<'PY'
import json
import sys

path = sys.argv[1]
try:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Plugin-Manifest fehlt: {path}", file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError as e:
    print(f"Ungueltiges JSON im Plugin-Manifest: {path}: {e}", file=sys.stderr)
    sys.exit(1)

version = data.get("version")
if not isinstance(version, str) or not version:
    print(f'Ungueltige oder fehlende "version" im Plugin-Manifest: {path}', file=sys.stderr)
    sys.exit(1)

print(version)
PY
)"

if [ "$skill_version" != "$plugin_version" ]; then
  echo "Versions-Mismatch: SKILL.md=$skill_version plugin.json=$plugin_version" >&2
  echo "Passe \"version\" in plugin.json an das SKILL.md-Frontmatter an." >&2
  exit 1
fi

echo "synchron: Plugin-Skill + Version ($skill_version)"
