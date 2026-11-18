#!/usr/bin/env bash
# Mide los renders: duración, frames, loudness, pico y tramos congelados (≥0.5 s sin cambio).
#   npm run measure            → out/video_16x9.mp4 y out/video_9x16.mp4
set -u
for f in "${@:-out/video_16x9.mp4 out/video_9x16.mp4}"; do
  for m in $f; do
    [ -f "$m" ] || { echo "falta $m"; continue; }
    echo "== $m"
    echo "   $(ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,nb_frames -show_entries format=duration -of csv=p=0 "$m" | tr '\n' ' ')"
    echo "   $(ffmpeg -nostats -i "$m" -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I|Peak):' | tr -s ' ' | tr '\n' ' ')"
    echo "   congelados: $(ffmpeg -nostats -i "$m" -vf freezedetect=n=0.001:d=0.5 -map 0:v -f null - 2>&1 | grep -oE 'freeze_(start|duration): [0-9.]+' | tr '\n' ' ')"
  done
done
