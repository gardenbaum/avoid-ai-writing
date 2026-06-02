# Cursor-Regel — avoid-ai-writing

Eine direkt einsetzbare [Cursor](https://cursor.sh)-Regel, die das Skill [`avoid-ai-writing`](../SKILL.md) auf Cursors `.mdc`-Regelformat portiert. Funktional identisch zum Upstream-Skill — gleiches Stufen-Vokabular, gleiche Context-Profile, gleiche detect-/rewrite-Modi.

## Installation

Kopiere `avoid-ai-writing.mdc` in das Verzeichnis `.cursor/rules/` deines Projekts:

```sh
mkdir -p .cursor/rules
curl -o .cursor/rules/avoid-ai-writing.mdc \
  https://raw.githubusercontent.com/gardenbaum/avoid-ai-writing/main/cursor-rules/avoid-ai-writing.mdc
```

Standardmässig aktiviert sich die Regel bei `.md`-, `.mdx`-, `.txt`-, `.rst`- und `.adoc`-Dateien (über das Feld `globs` im Frontmatter). Passe die Globs in der Regeldatei an, wenn du sie für andere Dateitypen willst — oder setze `alwaysApply: true`, wenn du sie in jeder Cursor-Sitzung willst.

## Auslöser-Phrasen

Sobald die Regel installiert ist, bitte Cursor:
- *„Entferne die KI-Floskeln aus diesem Abschnitt."*
- *„Prüfe diesen Entwurf auf KI-Schreibmuster."*
- *„Lass das weniger nach KI klingen."*
- *„Führe avoid-ai-writing im detect-Modus aus."* (markieren, ohne umzuschreiben)

## Alte Cursor-Projekte

Bist du auf einer Cursor-Version, die noch `.cursorrules` nutzt (eine einzelne Datei im Repo-Wurzelverzeichnis), kannst du den Body von `avoid-ai-writing.mdc` (den Teil unterhalb des `---`-Frontmatters) direkt an deine bestehende `.cursorrules`-Datei anhängen. Moderne Cursor-Projekte sollten das Layout `.cursor/rules/*.mdc` bevorzugen.

## Aktualisieren

Diese Datei ist eine Kopie von [`SKILL.md`](../SKILL.md) mit Cursor-spezifischem Frontmatter. Aktualisiert sich das Upstream-Skill, sollte diese Datei neu synchronisiert werden. Es gibt heute keine automatische Synchronisation zwischen beiden — öffne ein Issue, falls die Drift zum Problem wird.
