#!/usr/bin/env bash
# Primera vez en una computadora: revisa lo que pide el estilo editorial.
# Uso: bash ~/.claude/skills/reel-editorial-pablo/scripts/setup.sh
ok=1
for c in ffmpeg ffprobe node python3; do
  if command -v "$c" >/dev/null; then echo "ok  $c"; else echo "FALTA  $c"; ok=0; fi
done
command -v google-chrome >/dev/null || [ -d "/Applications/Google Chrome.app" ] && echo "ok  Chrome (Playwright usa channel chrome)" || { echo "FALTA  Google Chrome"; ok=0; }
python3 -c "import numpy, PIL" 2>/dev/null && echo "ok  numpy + Pillow" || { echo "FALTA  pip3 install numpy pillow"; ok=0; }
command -v mlx_whisper >/dev/null && echo "ok  mlx_whisper" || { echo "FALTA  pip3 install mlx-whisper  (transcripción por palabra, Mac con Apple Silicon)"; ok=0; }
echo
echo "En cada proyecto nuevo: npm i playwright-core   y copiar scripts/render.mjs a la carpeta del proyecto."
[ $ok = 1 ] && echo "Listo." || echo "Instala lo que falta y vuelve a correrlo."
