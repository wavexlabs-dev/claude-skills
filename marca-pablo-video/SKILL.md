---
name: marca-pablo-video
description: Identidad de marca de Pablo Paredes para sus videos — paleta "Nocturno morado", tipografías Inter Tight y JetBrains Mono, piezas gráficas (píldora de capítulo, separadores, tarjeta de pantalla), encuadres de su set, niveles de mezcla, estilo de miniatura, la serie "Mi Muse y Yo", su mascota Cody y su voz en español de México. This skill should be used whenever Pablo asks for a reel, short, teaser, YouTube video, thumbnail, title or description for his channel, or anything with Cody — load it together with the process skill (video-largo-y-teaser, video-short, html-reel or estudio-video-codigo) so the result looks and sounds like his brand.
---

# Marca Pablo — video

Esta skill define cómo se ve y suena un video de Pablo. El proceso (corte, teaser, publicación) lo pone la skill
de proceso que corresponda: `video-largo-y-teaser` para episodios largos, `video-short` / `html-reel` para reels,
`estudio-video-codigo` para animación en código. Aplicar esta encima de cualquiera de ellas.

## Al empezar
1. Leer `references/identidad-visual.md` (color, tipo, piezas, zonas, miniatura).
2. Copiar al proyecto: `assets/plantillas/tokens.ts` (+ `mmy.ts`, `separators.ts`, `style.css`) al `src/` del motor y
   `assets/fuentes/*.woff2` a `assets/fonts/`. No inventar colores ni fuentes fuera de `tokens.ts`.
3. Encuadres y mezcla: `references/camara-y-sonido.md`.
4. Textos (títulos, rótulos, descripción, copys): `references/serie-y-voz.md`.
5. Shorts/Reels: seguir `references/flujo-shorts.md` (reglas acordadas: proxy 4K, música ElevenLabs, loudness, entrega).
6. Si sale Cody: `references/cody.md` y siempre mandar `assets/cody/cody_sheet_b.png` como referencia.

## Lo esencial (si solo se lee esto)
- Fondo `#0b0a12`, texto `#f4f2ff`, acento morado `#8a6bff` solo en la palabra clave, glow `#2a1470`.
- Inter Tight 600/800 para todo; JetBrains Mono solo para código/archivos. Sin serif, sin mezclar familias.
- Nada encima de la cara: gráficos en la columna x ≤ 600 px (16:9) con plano medio; zonas de Reels 230/420 px.
- Encuadre cerrado máximo 1.2×; sin zoom por toma.
- YouTube −15 LUFS, reels −12 LUFS, pico −1.5 dBTP.
- Español de México, cercano y directo; datos con fuente; recomendar una opción.
- Cualquier generación con IA: cotizar en dólares y pedir permiso.

## Recursos
- `assets/plantillas/`: `tokens.ts`, `mmy.ts` (glow, rich, pill), `separators.ts`, `style.css`, `music.json`,
  `thumb.html` + `render.mjs` + `cody.png` + `miniatura_base_ejemplo.png` (miniatura EP1).
- `assets/fuentes/`: Inter Tight 400/600/800, JetBrains Mono 400/500 (woff2).
- `assets/cody/`: hoja oficial B, turnaround B, vistas de la app y referencia.
- `assets/pablo/`: fotos de frente, perfil y 3/4, cuadro del set 16:9 y character sheet — solo para generar con su
  consentimiento; preferir siempre editar su toma real.
