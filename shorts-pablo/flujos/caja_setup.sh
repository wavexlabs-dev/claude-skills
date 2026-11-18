#!/usr/bin/env bash
# Corre DENTRO de la caja GPU de Higgsfield (Ubuntu 24.04, root, solo trae python3).
# Uso en la caja: bash caja_setup.sh <URL_del_tar_de_hf>   (la URL la da media_upload de Higgsfield)
set -x
mkdir -p /w && cd /w
curl -sL -o node.tar.xz https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz
curl -sL -o ff.tar.xz https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz
curl -sL -o hf.tar "$1"
# la caja no trae xz: se extrae con python
python3 -c "import tarfile;[tarfile.open(f).extractall('/w') for f in ['node.tar.xz','ff.tar.xz','hf.tar']]"
export PATH=/w/node-v22.12.0-linux-x64/bin:/w/ffmpeg-master-latest-linux64-gpl/bin:$PATH
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq && apt-get install -y -qq libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2t64 libxshmfence1 fonts-liberation >/dev/null 2>&1
cd /w/hf && npx -y hyperframes@0.8.169 browser ensure && npx -y hyperframes@0.8.169 lint . | tail -2
echo SETUP_DONE
