# Render 4K de un Short en una GPU de Higgsfield

Probado con «¿Es real o es hype?» EP1 el 2026-11-15. Funcionó a la primera con la H100.

| Paso | Dónde | Tiempo EP1 |
|---|---|---|
| 1. Sacar el final en 1080 con `render.py` (eso deja `hf/` listo) | Mac | — |
| 2. `tar -cf work/hf.tar hf` y subirlo con `media_upload` (archivo general, PUT con `If-None-Match: *`) + `media_confirm type=file` | Mac | 70 s (423 MB) |
| 3. `gpu_list_gpus` → cotizar y pedir permiso del precio por hora → `gpu_rent` (auto-pausa 10 min) | Higgsfield | 5 s – 4 min en arrancar |
| 4. `scripts/caja_setup.sh <url_cloudfront_del_tar>` en segundo plano (`nohup`) | Caja | ~2 min |
| 5. `scripts/caja_render.sh` en segundo plano; revisar `@hf-progress` en el log | Caja | 10 min (7 captura + 3 codificación) |
| 6. Pedir 2 URLs con `media_upload` (archivos `.tar`) y subir `p00`/`p01` desde la caja | Caja | 20 s |
| 7. **`gpu_rental_stop`** en cuanto termine la subida | Higgsfield | — |
| 8. Bajar las partes, `cat p00 p01 > video.mp4`, comparar md5, poner el audio del master: `ffmpeg -i video.mp4 -i final_1080.mp4 -map 0:v -map 1:a -c copy final_4k.mp4` | Mac | 1 min |

Costo EP1: **28.65 créditos** (H100 a 120/h, ~14 min de caja). La prueba previa sin render costó 3.89.

## Lo que hay que saber
- La caja es Ubuntu 24.04 en gVisor, usuario root, 512 GB de disco e internet muy rápido. Solo trae python3:
  Node, ffmpeg y las librerías de Chrome se instalan en cada renta (todo se borra al apagarla).
- `gpu_rental_exec` corta a los 90 s: todo lo largo va con `nohup … &` y se revisa el log.
- La H100 **no tiene NVENC**; la codificación es por CPU y aun así va rápido. La L40S sí tiene NVENC, pero a menudo
  no hay stock (la renta se cancela sola a los 5 min sin cobrar).
- HyperFrames usa 4 procesos de Chrome en la caja (~8 cuadros/s en 4K).
- La cámara viene del proxy 1080, así que la toma de Pablo sale escalada; texto y gráficos sí son 4K nativo.
  Para 4K real de cámara habría que armar el proyecto desde los clips 4K originales.
- Los archivos subidos (tar del proyecto y partes del render) se quedan en el almacenamiento de Higgsfield;
  bórralos desde la web si no los quieres ahí.
- Pide siempre permiso del precio por hora antes de rentar; reporta créditos gastados al apagar.
