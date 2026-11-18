#!/usr/bin/env bash
# Copia «1080 ligera» (<30 MB) para mandar por chat. El master sigue siendo el archivo completo (AirDrop si pesa >30 MB).
# Uso: copia_ligera.sh <master.mp4> <salida.mp4>
set -euo pipefail
LOG=$(mktemp -d)/p
ffmpeg -y -v error -i "$1" -c:v libx264 -b:v 2500k -pass 1 -passlogfile "$LOG" -an -f null /dev/null
ffmpeg -y -v error -i "$1" -c:v libx264 -b:v 2500k -pass 2 -passlogfile "$LOG" -c:a aac -b:a 160k -movflags +faststart "$2"
ls -lh "$2" | awk '{print $5}'
