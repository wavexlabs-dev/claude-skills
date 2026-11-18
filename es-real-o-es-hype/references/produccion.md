# Producción paso a paso

`M=<ruta de esta skill>/motor/scripts` y `K=<ruta de esta skill>/scripts`. Los scripts del motor se corren con
`$M/py $M/<script>.py <proyecto>`. Sintaxis completa de `edit.md`: `motor/reference.md`.

## 1. Carpeta del episodio
```
<Es Real o Hype>/EPn/real-o-hype-epN/
  edit.md  style.json  src.mov  broll/  voz/  work/  renders/  borradores/
```
Copia `assets/plantillas/style.json`, `pad_estrellas.jpg`, `titulo.html`, `veredicto.html` a `broll/` (style a la
raíz) y las fuentes de `assets/fuentes/` a `fonts/`. Copia `assets/audio/musica_base.mp3` si no hay música nueva.

## 2. Proxy y velocidad
Clips Sony verticales (3840x2160, rotación −90; ffmpeg ya rota: nunca recortes como si fuera horizontal):
```
ffmpeg -i C08xx.MP4 -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.35,setpts=PTS/1.2" -af atempo=1.2 \
  -c:v libx264 -crf 14 -preset medium -c:a pcm_s16le work/s_C08xx.mov
```
(1.2x solo si Pablo lo confirma). No uses `h264_videotoolbox` para la entrega: se ve más suave. Si los clips aún
se están copiando, espera a que `ffprobe` los lea (sale «moov atom not found»).
Transcribe cada proxy: `$M/py $M/transcribe.py work/s_C08xx.mov work/t_C08xx`.

## 3. Fuente en orden de historia
`cut.py` ordena los cortes por tiempo, así que primero se arma `src.mov` concatenando los tramos buenos en el orden
del guion (`trim`/`atrim`, fades de 20 ms). La reacción en silencio va al inicio con `volume=0` y dura lo mismo que
`apertura.mp4`. Para un hueco (p. ej. espacio para el jingle), inserta ~2 s de su toma en silencio con `volume=0`
y desplaza los cortes y escenas posteriores. Guarda cada `edit.md` en `work/edit_vN.md` antes de tocarlo.

## 4. Apertura
`$K/apertura.sh work/s_C0863.mov <seg_inicio> <duración> broll/reel.mp4 broll/apertura.mp4` → revisa
`apertura_inicio.jpg` y `apertura_fin.jpg`. La duración = silencio inicial de `clean.mp4` (hasta que habla).

## 5. Cortes, escenas y plantillas
- `## Cuts`: tramos del `src.mov`; `$M/py $M/cut.py .` → `work/clean.mp4` + `transcript_clean`.
- `## Scenes`: ver `references/formato.md` y `assets/ejemplo-ep1/edit.md`. Visuales: `broll/x.mp4 @a-b zoom x,y,w hold`
  o `graphic: broll/titulo.html`.
- Plantillas: ajusta `data-duration` a lo que dura la escena y los tiempos del timeline GSAP a las palabras
  (en `titulo.html` las líneas entran cuando dice «¿Es real» y «o es hype»).
- Grabaciones de pantalla: recorta a 1325x1080 (proporción del panel 1080x880) y acelera con `setpts` para que
  dure lo que dura la frase. Zoom con `zoom x,y,w` para que se lea lo importante (verifícalo en un cuadro).

## 6. Borrador y revisión
```
$M/py $M/render.py . --draft
python3 $K/ajustar_subtitulos.py .          # mueve inicios de frase al final del silencio real
$M/py $M/render.py . --draft                # otra vez si cambiaron tiempos
$M/py $M/qa.py .
bash $K/tira_cortes.sh . renders/<proyecto>-vN.mp4
```
Mira cada tira (`work/qa/tiras`) antes de mandar: cuadros sueltos, cortes a media palabra, subtítulos sobre el
título. Mezcla el jingle en cada borrador (paso 8) para que Pablo lo oiga. Manda la copia ligera.

## 7. Voz limpia
Exporta `ffmpeg -i work/clean.mp4 -vn -c:a pcm_s16le -ar 48000 voz/limpieza/voz.wav` y mándasela. Él la pasa por
Adobe Podcast y regresa un WAV de la misma duración: respalda `clean.mp4` en `borradores/` y reemplaza el audio con
`-map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k` (sin `-shortest`).

## 8. Final
1. Respalda los borradores en `borradores/`.
2. `$M/py $M/render.py .` (final) → mueve el render a `borradores/final_sinjingle.mp4`.
3. `$K/mezcla_final.sh borradores/final_sinjingle.mp4 <skill>/assets/audio/jingle.wav broll/reel.mp4 <seg_jingle> <dur_apertura> renders/real-o-hype-epN-final.mp4`
4. `$K/copia_ligera.sh renders/...-final.mp4 renders/share/...-final-1080-ligero.mp4` y mándala.
5. Dile cuál es el master y que lo pase por AirDrop si pesa más de 30 MB.

## Disco
Revisa `df -h ~` antes de renderizar. Borra intermedios regenerables (proxies viejos, fuentes viejas, borradores
sin jingle). HyperFrames en 4K local con varios procesos pide ~23 GB temporales.
