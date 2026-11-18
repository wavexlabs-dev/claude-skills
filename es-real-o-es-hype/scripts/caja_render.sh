#!/usr/bin/env bash
# Corre DENTRO de la caja después de caja_setup.sh. Renderiza en 4K y parte el resultado en pedazos
# de 290 MB (Higgsfield rechaza subidas de ~570 MB con HTTP 413).
export PATH=/w/node-v22.12.0-linux-x64/bin:/w/ffmpeg-master-latest-linux64-gpl/bin:$PATH
cd /w/hf; s=$(date +%s)
npx -y hyperframes@0.8.169 render . -o /w/ep_4k.mp4 --quality delivery --resolution portrait-4k
echo "RENDER_EXIT $? en $(( $(date +%s)-s )) s"
cd /w && split -b 290000000 -d ep_4k.mp4 p && ls -la p0* && md5sum ep_4k.mp4
