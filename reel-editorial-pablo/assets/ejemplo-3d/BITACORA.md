# Bitácora · reel "Pablo's Time"

## v1 (13 nov 2026) — referencia a velocidad normal
- Toma `C0844.MP4` cortada con `prep.py`: 23 tramos, silencios >0.30 s recortados, 81.96 s. Fuera: dos primeros intentos del gancho, "sin wifi y sin cables", muletilla 87.36–88.24 s.
- 12 escenas (`index.html`): Pablo completa en gancho y remates; tarjeta en 2; burbuja en 3; sin cámara en portadas y noche. Kindle 3D: giro real de 58 cuadros (`anim3d.py`) + poses fijas con pantalla puesta por homografía (`esquinas.js`), parpadeo de tinta al cambiar.
- Portadas: 1 original del repositorio + 3 recortadas de la captura del archivo del panel (280 px de ancho, ampliadas: algo suaves).
- Sonido: música del explainer (tercera vez que se usa), clic del cable, teclas, papel, un acento al despertar. −14.8 LUFS, pico −2.7 dBFS, voz 10 dB sobre la música. Nadie lo ha oído.
- Medido: sin tramos congelados reales, pero `freezedetect` marca las escenas gráficas como casi quietas (la deriva es de ~2 px/s y lo único que se mueve rápido es la burbuja).
- Sin hacer: escena con IA (sin cotizar), crítico a ciegas, versión 1.2x con voz limpia (enviada a Pablo `voz-kindle-1.2x-para-limpiar.wav`).

## v2 (13 nov 2026) — 1.2x
- Pablo preguntó si ya estaba a 1.2x. `V12=1 prep.py` saca la toma a 1.2x real (`pablo12/`, 2051 cuadros); `index12.html` = misma página con el tiempo multiplicado por SP=1.2·(30000/1001/30); `mezcla12.json`. 68.37 s, −14.9 LUFS, pico −2.5 dBFS.
- Voz: la original acelerada (`out/voz12_g.wav`). Al llegar la voz limpia de Adobe Podcast (se le envió a 68.31 s; ajustar con atempo≈0.9991 a 68.37 s) solo se cambia en `mezcla12.json` y se vuelve a unir.
- Aviso de la mezcla: el papel de los sobres (44.8 s) quedó +5 dB sobre su meta porque la música baja ahí.

## v3 (13 nov 2026) — cortes corregidos, 1.2x
- Pablo: "por el segundo 45… un corte medio extraño antes de la palabra Gmail… se repite una palabra". Causa: el tramo "Para alimentar | el periódico," tenía un corte a media palabra (88.24 s partía "el") y el arranque de "utilicé" (101.18 s) traía la cola de "mañanas", que se oía como "me utilicé".
- Corrección: se quitó "Para alimentar el periódico," y "utilicé" arranca en 101.40 s (hueco real de −45 dB). `index.html` conserva los tiempos anteriores de las escenas con `CUT0`/`DEL`. Verificado volviendo a transcribir la voz cortada: "…periódico. Utilicé todos los newsletters… Gmail." sin palabras sueltas.
- Se quitó el sonido de papel de los sobres (quedaba +17 dB sobre la música en ese punto). 66.53 s, −14.8 LUFS, pico −2.5 dBFS.
- Aprendizaje: whisper marca el inicio de las palabras hasta 0.2 s antes de tiempo; para cortar a mitad de una toma continua hay que mirar la envolvente a 40 ms y volver a transcribir el resultado. Audio para limpiar: `voz-kindle-1.2x-para-limpiar-v2.wav` (el primero ya no coincide).

## v4 (13 nov 2026) — sin el "de ahí" repetido
- Pablo: "en el 46 o 47 repites 'de ahí' dos veces seguiditas; creo que es el único error que veo en el audio ya". En la toma dice "De ahí" (105.64–106.10), pausa de 1 s, y repite "de ahí extrae…" (desde 107.10). El recorte de silencios había pegado los dos.
- Corrección: tramo partido en (101.40–105.10) y (107.02–116.15). `index.html` suma un segundo ajuste de tiempo (`C1`/`D1`). Transcripción completa de la voz cortada: un solo "De ahí", sin repeticiones. 66.03 s, −14.9 LUFS, pico −2.6 dBFS.
- Audio para limpiar vigente: `voz-kindle-1.2x-para-limpiar-v3.wav` (se borraron los dos anteriores).

## v5 (13 nov 2026) — luz
- Pablo: "lo sentí más oscuro… me faltó encender una luz… que se asemeje a los otros videos, no tanto". Medido contra la toma de Dreaming: la cara aquí es incluso más clara (mediana 0.35 vs 0.31); lo que falta es la luz morada (RGB de cara .43/.30/.23 vs .39/.26/.35; fondo negro vs morado oscuro).
- Corrección `LUZ` en `prep.py` (colorbalance + curves): tinte morado en sombras y medios, negros levantados apenas. Cara después: .48/.32/.29; fondo .09/.03/.11. No recrea la dirección de la luz. Mismo audio y cortes que v4.

## v5 en 4K (13 nov 2026)
- Mismo contenido que la v5 (cortes, luz, mezcla). 2160×3840, H.264 CRF 17, ~34 Mbps, 278 MB, 66.03 s, −14.9 LUFS, pico −2.7 dBFS.
- Cómo: `V12=1 K4=1 prep.py` (toma a 2160×3840 en `pablo12_4k/`), Kindle 3D renderizada al doble (`MULT=2`, `assets/k3d4k/`), `index12_4k.html`, `render4k.mjs` (deviceScaleFactor 2 → `frames4k/`).
- Blender por MCP agota el tiempo de espera con renders 4K pero sigue trabajando: lanzar el bloque y esperar a que aparezcan los archivos.
- Las tres portadas recortadas del panel siguen suaves (fuente de 280 px). Copia en Drive: "Mi unidad/Reel Pablos Time".

## v6 (13 nov 2026) — voz limpia
- Pablo devolvió `pablos-time-voz-final-para-limpiar-esv2-50p-bg-10p-music-10p.wav` (66.04 s). Alineación medida por envolventes contra la voz enviada: 0 ms de desfase en cuatro tramos, correlación 0.97. Venía a −25.5 LUFS: +8.5 dB con limitador → −15.9 LUFS (`out/voz12_limpia_g.wav`).
- Mezcla `mezcla12_limpia.json`: voz 10 dB sobre la música (la música bajó a −11.1 dB). Montada sin volver a codificar la imagen sobre el 4K y el 1080: −14.6 LUFS, pico −2.6/−2.8 dBFS. Nadie la ha oído salvo Pablo.

## v7 (13 nov 2026) — luz de la otra sesión
- Pablo trajo la corrección de `kindle-short/edit.md` ("quedó mejor que la tuya"): curvas que no tocan negros + colorbalance suave + lámpara morada simulada con `geq` desde la izquierda. Sustituye a mi `LUZ` de la v5, que teñía todo el fondo. Comparación: `out/luz_cmp2.jpg`.
- Misma mezcla con voz limpia (v6). Se rehacen 1080 y 4K.
- v7 terminada: 1080 (27.8 MB) y 4K (2160×3840, 306 MB), 66.03 s, −14.6 LUFS, pico −2.6/−2.8 dBFS. Pablo pidió NO subirla a Drive: queda solo en `reel/out/`. En Drive siguen las v5 y v6 hasta que diga si se borran.
