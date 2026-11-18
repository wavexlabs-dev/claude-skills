#!/usr/bin/env bash
# Revisión cuadro por cuadro: una tira de 1 s a 30 fps alrededor de cada cambio de escena de edit.md.
# Sirve para ver cuadros sueltos de otra toma, cortes a media palabra y subtítulos encima de un título.
# Uso: tira_cortes.sh <proyecto> <render.mp4>   → work/qa/tiras/*.jpg
set -euo pipefail
P="$1"; V="$2"; O="$P/work/qa/tiras"; mkdir -p "$O"
python3 - "$P/edit.md" <<'PY' | while read -r id t; do
import re,sys
for l in open(sys.argv[1]):
    m=re.match(r"\| (s\d+) \| ([\d.]+) \|",l)
    if m and float(m.group(2))>0: print(m.group(1), m.group(2))
PY
  s=$(python3 -c "print(max(0,$t-0.5))")
  ffmpeg -y -v error -ss "$s" -t 1 -i "$V" -vf "fps=30,scale=120:-1,tile=30x1" -frames:v 1 "$O/${id}_${t}.jpg"
done
ls "$O" | wc -l
