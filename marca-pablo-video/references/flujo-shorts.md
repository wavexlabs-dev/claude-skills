# Flujo acordado para Shorts/Reels (aprendido en el Short de Maya, nov 2026)

Rules Pablo set or confirmed while making the Maya Short (2026-11-10/11), to reuse on every new Short:

- Skills: `video-short` for the process + `marca-pablo-video` for the look (Nocturno morado, Inter Tight, accent #8a6bff only on the key word). Write a project `style.json` with the brand fonts/colors.
- Source footage: see [[camara-vertical-4k-shorts]] — make a lanczos x264 1080x1920 proxy from the vertical 4K before cutting.
- Visuals come from the real source (article images, its own video, receipts of official documents); label any AI-generated image on screen as "Recreación hecha con IA … no es una foto".
- Music: ElevenLabs Music v2.5 (instrumental, length of the Short), quote USD with estimate_only and ask before generating; make 2 takes and let him pick by ear (he chose take B).
- He wanted the finished cut sped up to 1.2x (atempo keeps pitch). Ask whether he wants it again rather than assuming.
- Delivery loudness for Reels: about -13 LUFS, true peak ≤ -1.5 dBTP (loudnorm, then alimiter at 192 kHz).
- He judges quality on the full file, not the 720p share copy — say clearly which file is the master. Files over 30 MB don't reach him over Remote Control; tell him to AirDrop it.
- Back up drafts in `borradores/` before a final render (render.py final prunes earlier versions).
- He wants to render early and see drafts fast; keep long encodes in the background and give short status lines.

**Why:** he corrected framing, quality and music during review; these are what he approved.
**How to apply:** start every new Short from these defaults; ask only about what changes per video (topic, sources, speed, music).

## Cámara vertical 4K

For Shorts/Reels Pablo records vertical on the Sony: files are 3840x2160 with rotation -90 (displayed 2160x3840). ffmpeg autorotates before filters, so never crop them as if landscape (2026-11-10 Maya short: a 1216x2160 "vertical crop" zoomed into the top-right corner).

Prep a 1080x1920 proxy once: `scale=1080:1920:flags=lanczos,unsharp=5:5:0.35`, libx264 crf 12. Pablo noticed the h264_videotoolbox 25 Mbps proxy looked visibly softer than his 4K original, so don't use the hardware encoder for the delivery path (fine for a quick draft only). Face center ≈ Framing 0.5, 0.40.

**Why:** cutting straight from the 4K file at crf16 took 30+ min; the proxy makes cut/render ~5x faster without the softness of the hardware encode.
**How to apply:** any video-short / html-reel job on his C08xx footage. Related: [[pablo-video-preferencias]].

## Lo aprendido en «¿Es real o es hype?» EP1 (2026-11-15)

### Armado de la fuente
- `cut.py` ordena los cortes por tiempo: para reordenar tomas (hook, nueva toma, tutorial), arma primero una fuente
  concatenada en orden de historia (`src.mov`) con `trim`/`atrim` + fades de 20 ms, y corta sobre ella.
- Para meter un hueco (silencio de cámara) en medio, inserta el pedazo de video con `volume=0` en la fuente y
  desplaza los cortes y escenas posteriores. Guarda cada versión de `edit.md` en `work/edit_vN.md` antes de tocarlo.
- Grabaciones de pantalla nuevas: sube el archivo a `broll/`, recorta a 1325x1080 (proporción del panel split
  1080x880) y acelera con `setpts` para que dure lo que dura la frase que la acompaña.

### Formato de la serie (apertura y título)
- Hook: Pablo viendo el video viral en silencio, a pantalla completa con zoom 1.3 (sin estirar la toma), y el reel
  como tarjeta redondeada (r=30) abajo a la izquierda. **Sin texto ni jingle** en el hook: crea expectativa. El
  audio original del reel sí suena (−1 dB, fade al final) y la apertura termina justo cuando él empieza a hablar.
- Tarjeta del título: `b-roll` a pantalla completa (sin Pablo a cámara), texto centrado, píldora «NUEVA SERIE · EP N».
  Las líneas entran al ritmo de su voz diciendo «¿Es real o es hype?» y **después** suena el jingle (no encima).
  El título dura hasta que vuelve a hablar.
- Jingle de la serie: `voz/jingle_B_norm.wav` (ElevenLabs Music, voz femenina con acento mexicano, estilo concurso).
  Se mezcla después del render con `adelay` (build.py no mezcla SFX propios). Ver `flujos/mezcla_final.sh`.
- Veredicto: tarjeta «VEREDICTO» + sello «HYPE» y dos renglones (✕ lo falso, ✓ lo real).
- Cierre: su mano tapando la cámara se queda (le gusta como cierre); la mano en «Vamos» sirve de transición.

### Subtítulos y cortes (errores que costaron revisiones)
- El reconocedor marca el inicio de las frases 0.1–0.4 s ANTES de que hable cuando hay silencio previo. Ajusta los
  `start` de `work/transcript_clean.json` al final del silencio real (`silencedetect=n=-40dB:d=0.2`) y pon los
  límites de escena en el silencio, no en la palabra del transcript.
- Antes de mandar un borrador, revisa cada corte cuadro a cuadro (`qa.py` + tira de 1 s a 30 fps alrededor de cada
  cambio): cuadros sueltos de otra toma, cortes a media palabra y subtítulos encima de títulos.
- Los subtítulos aparecen sobre cualquier escena: si un gráfico tiene texto propio, mueve el límite para que no se
  empalmen.

### Voz y audio
- Pablo limpia la voz en Adobe Podcast (Enhance v2 ~61%): se exporta `work/clean.mp4` a WAV, él regresa un WAV de la
  misma duración y se reemplaza el audio de `clean.mp4` (respaldo en `borradores/`).
- Clics: los picos cortos vienen de la toma (boca / micrófono en la mano), no de los cortes (cut.py ya pone fades de
  12 ms). Adobe los baja 50–75%. `adeclick` de ffmpeg casi no los toca; si molestan, bajar solo agudos (>3 kHz)
  −20 dB por 8 ms en cada clic. Siempre mandarle un audio A/B para que identifique el ruido de oído.
- Entrega: loudnorm de dos pasadas a −13 LUFS / TP −2, luego `alimiter=limit=0.83` a 192 kHz → −13.3 LUFS, pico −1.8.
  En zsh usa `${VAR}` antes de `:` (`$OFF:linear` se rompe).

### Disco
- El Mac llega a quedarse sin espacio: borra intermedios regenerables (proxies viejos, `src2.mov`, borradores sin
  jingle) antes de renderizar. HyperFrames en 4K con varios procesos pide ~23 GB temporales; `--workers 1` no.

### Render 4K en Higgsfield (probado, funciona)
Ver `flujos/render_4k_higgsfield.md`. Resumen: subir `hf/` como .tar a Higgsfield, rentar H100 (120 créditos/h,
L40S a veces no tiene stock), instalar Node + ffmpeg + Chrome en la caja, renderizar `--resolution portrait-4k`,
subir el resultado en partes de <500 MB, apagar la caja, bajar y ponerle el audio del master.
EP1: 10 min de render, 28.65 créditos. La H100 no tiene NVENC: codifica con CPU. La cámara sigue siendo el proxy
1080 escalado; solo texto y gráficos son 4K nativo.
