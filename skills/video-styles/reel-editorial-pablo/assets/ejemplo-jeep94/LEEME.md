# Ejemplo "Jeep 94" (final del 17 nov 2026)

Copias de los archivos del proyecto `Documents/Personal Brand/Jeep 94/`, para tenerlas en cualquier computadora. Las imágenes y las tomas no vienen: la página no corre sola. Sirve como plantilla de código.

- `prep.py`: hace el corte multitoma. La lista SEG lleva (toma, inicio, fin). Recorta los silencios con PAD 0.12, acelera a 1.2x y aplica fades de 12/25 ms. Saca `pablo/f_*.jpg`, `tl.js` y `mapa.js` (anclas por palabra contra la primera versión del corte), además de la voz para limpiar.
- `index.html`: la versión final, con escenas SC, `T(tn)` (tiempo final → línea v1), la escena `s1b` (video de referencia a pantalla completa) y los subtítulos en píldora (`SUBG` / `subG()`).
- `index_v5_insertos.html` + `insertos.py`: la variante con insertos de la persona hablando en su voz y subtitulada (escena `sM`, `ubica(tf)`). Pablo eligió la versión sin ellos, pero el método funciona.
- `mezcla.json`: la mezcla con la voz limpia (`out/voz_limpia_g.wav`), un click y un acento.
- `GUION.md` y `BITACORA.md`: el guion de escenas y el registro de cada ronda (qué pidió Pablo, qué se corrigió, números).
- `hairline-kernel.js` + `altavoz.js`: la figura isométrica del altavoz de Anthropic (motor Hairline), armada con las palabras de la voz.
- `hoja_final.jpg`: 16 cuadros del reel final con subtítulos, para ver el ritmo de fondos y layouts de un vistazo.
- La música de este reel está en `assets/audio/musica_jeep94.mp3`.
