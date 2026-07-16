#!/usr/bin/env bash
# Theme-agnosticism guard (see THEME_CONTRACT.md).
# ERROR  = accent-palette primitive in a component (must use --accent-*/semantic tokens).
# WARN   = raw brand hex / brand rgba (needs review; some are legit neutrals).
# Usage:  bash check-theme-agnostic.sh [dir]   (default: the shared layer)
# Exit 1 if any ERROR is found.

set -u
DIR="${1:-ui_kits/shared}"
# Resolve relative to the project root (parent of ui_kits), regardless of CWD.
cd "$(dirname "$0")/../.." || exit 2

# Accent-palette primitives — always a violation inside a component.
ACCENT_PRIMS='--color-(tide|cadmium|sage|iris|peach|blue)-[0-9]'
# Raw brand colors — warn (neutral rgba(0,0,0)/rgba(255,255,255) and #fff/#000 excluded).
BRAND_HEX='#[0-9A-Fa-f]{6}'
BRAND_RGBA='rgba\((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9]),'

status=0
errfiles=0
warnfiles=0

while IFS= read -r f; do
  [ -f "$f" ] || continue
  case "$f" in */image-slot.js) continue;; esac   # editor chrome, out of scope
  errs=$(grep -nE -e "$ACCENT_PRIMS" "$f" 2>/dev/null)
  hexs=$(grep -nEo "$BRAND_HEX" "$f" 2>/dev/null | grep -viE '#(fff|ffffff|000|000000|fffefb)$')
  rgbas=$(grep -nE "$BRAND_RGBA" "$f" 2>/dev/null | grep -vE 'rgba\((0|255), ?(0|255), ?(0|255)')
  if [ -n "$errs" ]; then
    echo "ERROR  $f"
    echo "$errs" | sed 's/^/    /'
    status=1; errfiles=$((errfiles+1))
  fi
  if [ -n "$hexs$rgbas" ]; then
    echo "WARN   $f"
    [ -n "$hexs" ] && echo "$hexs" | sed 's/^/    hex:  /'
    [ -n "$rgbas" ] && echo "$rgbas" | sed 's/^/    rgba: /'
    warnfiles=$((warnfiles+1))
  fi
done < <(find "$DIR" -type f \( -name '*.jsx' -o -name '*.js' \) 2>/dev/null | sort)

echo "-----"
echo "scanned: $DIR   errors: $errfiles file(s)   warnings: $warnfiles file(s)"
[ "$status" -eq 0 ] && echo "PASS (no palette primitives)" || echo "FAIL (palette primitives present)"
exit $status
