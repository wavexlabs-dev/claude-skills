#!/usr/bin/env bash
# Crea un proyecto de video nuevo desde la plantilla del motor e instala dependencias.
#   bash <skill>/scripts/nuevo-proyecto.sh <carpeta-destino>
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
dest="${1:?Uso: nuevo-proyecto.sh <carpeta-destino>}"
[ -e "$dest" ] && { echo "Ya existe $dest; elige otra carpeta"; exit 1; }
for bin in node npm ffmpeg ffprobe; do command -v "$bin" >/dev/null || { echo "Falta $bin en el PATH"; exit 1; }; done
cp -R "$here/assets/template" "$dest"
cd "$dest"
npm install --silent
npx playwright install chromium-headless-shell >/dev/null 2>&1 || npx playwright install chromium
npm run -s typecheck
echo "Proyecto listo en $dest. Prueba: npm run render -- --no-audio"
