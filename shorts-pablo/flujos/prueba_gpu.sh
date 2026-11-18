#!/usr/bin/env bash
# Prueba corta de una caja GPU de Higgsfield para el render de Shorts en 4K.
# Corre en una sola llamada (<90 s) y responde: ¿hay internet?, ¿qué GPU/CPU/RAM/disco?,
# ¿ffmpeg con NVENC?, ¿Chrome ve la GPU (WebGL por hardware)?, ¿Node/Blender instalables?
set -u
t0=$(date +%s)
echo "== sistema"; uname -a; cat /etc/os-release 2>/dev/null | head -2
echo "== cpu/ram/disco"; nproc; free -g | head -2; df -h . | tail -1
echo "== gpu"; nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>&1 | head -3
echo "== internet"; curl -s -o /dev/null -w "github %{http_code} %{time_total}s\n" https://github.com; \
  curl -s -o /dev/null -w "npm %{http_code}\n" https://registry.npmjs.org/
echo "== velocidad de bajada (100 MB)"; curl -s -o /dev/null -w "%{speed_download} B/s\n" --max-time 20 https://speed.cloudflare.com/__down?bytes=100000000
echo "== herramientas ya presentes"; for b in ffmpeg node npm python3 blender google-chrome chromium; do printf "%s: " $b; command -v $b || echo no; done
echo "== ffmpeg estático con NVENC"
cd /tmp && curl -sL --max-time 25 -o ff.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && tar xf ff.tar.xz && FF=$(ls -d /tmp/ffmpeg-*-static | head -1)/ffmpeg
if [ -x "${FF:-}" ]; then $FF -hide_banner -encoders 2>/dev/null | grep -E "nvenc" || echo "sin nvenc en este build";
  $FF -hide_banner -loglevel error -f lavfi -i testsrc2=size=2160x3840:rate=30 -t 2 -c:v h264_nvenc -preset p7 -b:v 60M -f null - && echo "NVENC 4K OK" || echo "NVENC 4K FALLO"; fi
echo "== tiempo total: $(( $(date +%s) - t0 )) s"
