# Bitácora · reel "Jeep 94"

## V1 (17 nov 2026)
- Tomas: C0872 base (mira a cámara), C0871 para el gancho de la bomba y la pregunta final. Comparación de mirada en `work/mirada/`.
- Cortado a 1.2x (regla general de Pablo desde hoy). Se quitó "cambió el sensor de oxígeno… le fue peor" (no está en el video de Muhammad).
- Siete falsos arranques repetidos quitados; solo `piezas.py` (trozo por trozo) los encontró todos. Final: 69.34 s.
- Página con elementos pegados al titular (118 px) y tiempos anclados a palabras (`mapa.js`).
- Verificador: 32/33. La que no pasa: 9.9 s sin Pablo grande en la parte de Anthropic, porque baja la mirada en las dos tomas.
- Crítico a ciegas, ronda 1: 4/10. Confirmados y corregidos: subtítulos desfasados, créditos invisibles, gancho distinto de la voz, clip de la prueba con cuadros ajenos, burbuja tapando el altavoz, cortes oscuro→oscuro, terminal ilegible, titulares tardíos a pantalla completa.
- Mezcla provisional con la voz sin limpiar: −15.0 LUFS, pico −2.5 dBFS. Música del explainer otra vez.
- Mirada: baja la vista brevemente en ~2.6 s y ~52 s; aceptado.

## V2 y V3 corta (17–18 nov 2026)
- V2: escena del altavoz con figura isométrica (motor Hairline, `altavoz.js`) que se arma con Piezas · Placa · Carcasa · Código. Pablo: "quedó mal alineado, el final debe quedar en medio de todas las palabras… todo centrado del texto al elemento" → V2b: figura centrada, una sola palabra a la vez debajo, siguiendo el borde de la figura.
- V3 corta (61.5 s): Pablo pidió quitar la parte del escáner ("no se entiende y no suma"). Queda "Él manejaba y Claude iba leyendo los datos." y entra "Muhammad quería cambiar el programa…".
- Crítico ronda 2: 5/10. Corregido: última palabra cortada, "no tiene puerto" → "no tenía el puerto de escáner", "Claude hizo" → "Claude diseñó", gancho con sujeto, titular del altavoz centrado, tres tramos casi quietos, corte oscuro→oscuro (la prueba pasa a naranja con puntos), columnas de roles, créditos completos.
- Bug encontrado: el pegado del elemento al titular se medía antes de cargar la tipografía; ahora se mide en cada cuadro.
- Verificador final: 30/31 (sigue el tramo de Anthropic sin Pablo en grande). Mezcla provisional con voz sin limpiar.
- La versión larga (`jeep-v2b.mp4`) NO tiene las correcciones de la ronda 2.

## V4 corta (18 nov 2026) — cortes revisados
- Pablo: "hay palabras que las cortas antes de que terminen, y se siente muy acelerado y mal cortado".
- Medido: 7 finales de tramo caían sobre voz (el "cuatro" de 1994, "verificación", "dólares", "laptop", "datos", "nuevo", "funcionó") y los inicios dejaban solo 0.04–0.06 s antes de la voz, así que cada unión quedaba sin aire.
- Arreglo en `prep.py`: cada fin se movió al silencio real (< −40 dB) o al hueco entre palabras cuando sigue un intento repetido (comprobado transcribiendo cada lado por separado); cada inicio retrocede hasta ~0.12 s de silencio; PAD 0.07 → 0.12 (≈0.2 s entre frases a 1.2x); fundido de salida 8 → 25 ms.
- Duración 61.5 → 64.9 s. El audio para limpiar de la V3 ya no coincide: usar `out/jeep-v4-voz-para-limpiar.wav`.
- Pablo: al presentar a Muhammad debe salir él a pantalla completa. Nueva escena s1b (desde "Zulali", v1 6.98; tarjeta desde "no pasó", 9.2): Muhammad junto al Jeep (su video 45.7–48.1 s) → tarjeta FAIL de la prueba (54.95–57.0 s), B/N, titular "Muhammad Zulali no pasó la verificación.". La escena 1 ahora dura 6.6 s.

## V5 corta — insertos de Muhammad con su voz (17 nov 2026)
- Pablo pidió partes del video original con Muhammad hablando, subtituladas en español, mientras explica el problema.
- `insertos.py`: dos insertos que pausan la voz de Pablo en un silencio entre frases (línea final):
  - 27.76 s, tras "…para poderla reprogramar": "And I missed that by four months" (464.00–465.85) sobre la etiqueta 12/20/93 de la computadora → "Y me faltaron / cuatro meses."
  - 45.68 s, tras "…de una Jeep del 94": "The fuel pump was on for about 10 seconds and I started to freak out…" (255.10–259.10) sobre el manómetro.
- Su voz se iguala en loudness a la de Pablo; +0.10 s de aire al final. Total +6.05 s → 70.9 s.
- index.html: escena `sM` y `ubica(tf)` (línea final con insertos → tiempo de Pablo). `mezcla.json` usa `out/voz12_g_ins.wav`; impact 58.14 → 64.19.
- Cuando llegue la voz limpia: `python3 insertos.py --voz <voz limpia con ganancia> out/voz12_g_ins.wav` y volver a mezclar. La voz que Pablo limpia NO cambia (sigue siendo jeep-v4-voz-para-limpiar.wav).

## FINAL — V4 con subtítulos y voz limpia (17 nov 2026)
- Pablo prefirió la V4 (sin los insertos de la V5; respaldo en work/index_v5_insertos.html y work/mezcla_v5.json).
- Subtítulos en todo el reel (píldora Ink, `SUBG`/`subG()`); "RIT" → "Jeep".
- Voz limpia de Adobe Podcast: audio/voz-limpia-v4.wav (sincronía 0 ms) → out/voz_limpia_g.wav (highpass 70, +10 dB, limitador; -17.0 LUFS). Mezcla -14.9 LUFS, pico -2.6 dBFS.
- **Entrega final: out/jeep-final-subtitulos.mp4** (64.8 s). Alternativa sin subtítulos: out/jeep-final-sin-subtitulos.mp4.
