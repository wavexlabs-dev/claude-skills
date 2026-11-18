#!/usr/bin/env bash
# Descarga una generación del conector de ElevenLabs a assets/tomas/<nombre>.mp3 (opcional: solo si tienes cuenta).
# creative_get_generations devuelve una URL firmada (vence en ~2 h); pásala completa entre comillas.
#   bash <skill>/scripts/descargar-eleven.sh vo1_2 "https://storage.googleapis.com/…"
set -euo pipefail
name="${1:?nombre}"; url="${2:?url firmada}"
mkdir -p assets/tomas
curl -sfL -o "assets/tomas/$name.mp3" "$url" && echo "ok $name" || { echo "FALLÓ $name (¿URL vencida? vuelve a pedir creative_get_generations)"; exit 1; }
