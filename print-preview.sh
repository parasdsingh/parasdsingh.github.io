#!/usr/bin/env bash
#
# Render the print stylesheet to a PDF, so print changes can be checked against
# the real paginated output instead of guessed at.
#
#   ./print-preview.sh                  # render, report pages, open it
#   ./print-preview.sh out.pdf          # render to a specific path
#   NO_OPEN=1 ./print-preview.sh        # render without opening
#
# Debugging pagination: append a block like this to a *copy* of styles.css and
# render that copy, to see which box owns a gap.
#
#   @media print {
#     * { -webkit-print-color-adjust: exact !important; }
#     #experience { background: rgba(0,200,0,0.12) !important; }
#     .timeline { outline: 2pt solid red !important; }
#   }

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
out="${1:-${TMPDIR:-/tmp}/cv-print.pdf}"

chrome=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then
    chrome="$candidate"
    break
  fi
done

if [ -z "$chrome" ]; then
  echo "No Chrome or Chromium found. Install one, or print from the browser instead." >&2
  exit 1
fi

# virtual-time-budget gives the Google Fonts requests time to land before the
# snapshot; without it the PDF renders in fallback faces.
"$chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="$out" \
  "file://$here/index.html" 2>/dev/null

pages=$(python3 -c "
import re, sys
data = open(sys.argv[1], 'rb').read()
print(len(re.findall(rb'/Type\s*/Page[^s]', data)))
" "$out")

echo "$out ($pages pages)"
[ -n "${NO_OPEN:-}" ] || { command -v open >/dev/null && open "$out"; }
