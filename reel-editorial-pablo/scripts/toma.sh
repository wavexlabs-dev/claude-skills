#!/bin/zsh
# Extrae el tramo de la toma real: cuadros a 30 fps (pablo/f_0000.jpg…) y su audio (out/voz.wav, 48 kHz estéreo).
# Uso: toma.sh <video> <inicio_s> <duracion_s> [ancho_px=2880]
# El ancho 2880 alcanza para la burbuja y la mitad sin perder nitidez; con toma vertical usar 1620.
set -e
SRC="$1"; SS="$2"; D="$3"; W="${4:-2880}"
[ -f "$SRC" ] || { echo "no existe: $SRC"; exit 1; }
mkdir -p pablo out
ffmpeg -v error -y -ss "$SS" -t "$D" -i "$SRC" -vf "fps=30,scale=$W:-2" -q:v 3 -start_number 0 pablo/f_%04d.jpg
ffmpeg -v error -y -ss "$SS" -t "$D" -i "$SRC" -vn -ar 48000 -ac 2 -c:a pcm_s16le out/voz.wav
echo "cuadros: $(ls pablo | wc -l | tr -d ' ')  ·  audio: out/voz.wav"
# Cuadros de medición: uno al inicio, al medio y al final, para medir la cara (ver references/camara.md)
N=$(ls pablo | wc -l | tr -d ' ')
for i in 0 $((N/2)) $((N-1)); do cp "pablo/f_$(printf %04d $i).jpg" "out/medir_$i.jpg"; done
echo "medir la cara en out/medir_*.jpg y pasar las fracciones a layout.py"
