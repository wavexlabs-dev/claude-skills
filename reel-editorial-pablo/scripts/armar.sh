#!/bin/zsh
# Une los cuadros de frames/ con el audio y entrega el mp4.
# Uso: armar.sh <audio.wav> <salida.mp4>      (sin audio: armar.sh - salida.mp4)
set -e
A="$1"; O="$2"; mkdir -p "$(dirname "$O")"
if [ "$A" = "-" ]; then
  ffmpeg -v error -y -framerate 30 -i frames/f_%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 15 -preset slow -movflags +faststart "$O"
else
  ffmpeg -v error -y -framerate 30 -i frames/f_%04d.jpg -i "$A" -c:v libx264 -pix_fmt yuv420p -crf 15 -preset slow -c:a aac -b:a 256k -shortest -movflags +faststart "$O"
fi
echo "listo: $O"
