#!/usr/bin/env bash
# Apertura (hook) de «¿Es real o es hype?»: Pablo viendo el video viral en silencio, a pantalla completa con
# zoom 1.3, y el reel como tarjeta redondeada abajo a la izquierda. Sin texto ni audio (el audio del reel se
# suma en la mezcla final). Termina justo cuando él empieza a hablar.
# Uso: apertura.sh <toma_silenciosa_1080.mov> <seg_inicio> <duracion> <reel.mp4> <salida.mp4>
# EP1: apertura.sh work/s_C0863.mov 2.0 6.81 broll/reel.mp4 broll/apertura.mp4
set -euo pipefail
CAM="$1"; SS="$2"; D="$3"; REEL="$4"; OUT="$5"
END=$(python3 -c "print($SS+$D)")
ffmpeg -y -v error -i "$CAM" -ss 0 -t "$D" -i "$REEL" -filter_complex "
[0:v]trim=${SS}:${END},setpts=PTS-STARTPTS,scale=1404:2496:flags=lanczos,crop=1080:1920:20:330,setsar=1[pv];
[1:v]scale=470:836,format=yuva420p,geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='if(gt(abs(X-W/2),W/2-30)*gt(abs(Y-H/2),H/2-30),if(lte(hypot(abs(X-W/2)-(W/2-30),abs(Y-H/2)-(H/2-30)),30),255,0),255)'[card];
[pv][card]overlay=x=44:y=990,format=yuv420p" -t "$D" -r 30000/1001 -c:v libx264 -crf 14 -an "$OUT"
# revisa el cuadro 0 y el último: la cara completa, la tarjeta sin taparla
ffmpeg -y -v error -i "$OUT" -vf "select='eq(n\,0)',scale=360:-1" -frames:v 1 "${OUT%.*}_inicio.jpg"
ffmpeg -y -v error -sseof -0.2 -i "$OUT" -vf scale=360:-1 -frames:v 1 "${OUT%.*}_fin.jpg"
echo "ok $OUT"
