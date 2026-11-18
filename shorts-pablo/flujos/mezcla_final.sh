#!/usr/bin/env bash
# Mezcla final de un Short de la serie «¿Es real o es hype?».
# Toma el render de video-short (voz + música), le suma el jingle y el audio del reel del hook,
# y deja el volumen de entrega: −13 LUFS, pico −1.8 dB (loudnorm de dos pasadas + limitador a 192 kHz).
#
# Uso: mezcla_final.sh <render_sin_jingle.mp4> <jingle.wav> <reel.mp4> <seg_jingle> <seg_hook> <salida.mp4>
#   seg_jingle: segundo donde entra el jingle (justo después de que dice la frase)
#   seg_hook:   duración de la apertura; el audio del reel se desvanece en el último medio segundo
# Ejemplo EP1: mezcla_final.sh borradores/final_sinjingle.mp4 voz/jingle_B_norm.wav broll/reel.mp4 20.58 6.81 renders/final.mp4
set -euo pipefail
IN="$1"; JIN="$2"; REEL="$3"; JT="$4"; HOOK="$5"; OUT="$6"
MS=$(python3 -c "print(int(round($JT*1000)))"); FST=$(python3 -c "print(max(0,$HOOK-0.5))")
MIX="[1]adelay=${MS}|${MS}[j];[2:a]atrim=0:${HOOK},asetpts=PTS-STARTPTS,aresample=48000,volume=-1dB,afade=t=in:d=0.05,afade=t=out:st=${FST}:d=0.5[r];[0:a][j][r]amix=inputs=3:normalize=0:duration=first"
J=$(ffmpeg -v info -i "$IN" -i "$JIN" -i "$REEL" -filter_complex "${MIX},loudnorm=I=-13:TP=-2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
LN=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i "$IN" -i "$JIN" -i "$REEL" -filter_complex "${MIX},loudnorm=I=-13:TP=-2:LRA=11:${LN}:linear=true,aresample=192000,alimiter=limit=0.83:level=false,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
ffmpeg -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
