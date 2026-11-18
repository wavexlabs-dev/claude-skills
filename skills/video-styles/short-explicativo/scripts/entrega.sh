#!/usr/bin/env bash
# Volumen de entrega para Reels: −13 LUFS, pico ≈ −1.8 dB (loudnorm de dos pasadas + limitador a 192 kHz).
# Uso: entrega.sh <render_final.mp4> <salida.mp4>
set -euo pipefail
IN="$1"; OUT="$2"
J=$(ffmpeg -v info -i "$IN" -af "loudnorm=I=-13:TP=-2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
LN=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i "$IN" -af "loudnorm=I=-13:TP=-2:LRA=11:${LN}:linear=true,aresample=192000,alimiter=limit=0.83:level=false,aresample=48000" \
  -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
ffmpeg -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
