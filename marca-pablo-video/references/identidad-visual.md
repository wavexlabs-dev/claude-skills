# Identidad visual — "Nocturno morado"

Tomado del set real: fondo negro, luz morada detrás y playera blanca. `assets/plantillas/tokens.ts` es la fuente
de verdad en código; copiarlo tal cual al `src/` del motor de `estudio-video-codigo`.

## Color
| Token | Valor | Uso |
|---|---|---|
| bg | `#0b0a12` | fondo de todo (el set mide #0d0c14) |
| glow | `#2a1470` | resplandor radial detrás de tarjetas y títulos |
| ink | `#f4f2ff` | texto principal (blanco con un toque lila) |
| muted | `#8c87a6` | texto secundario, fuentes, etiquetas |
| accent | `#8a6bff` | la palabra clave, número de capítulo, cursor |
| accentSoft | `rgba(138,107,255,0.18)` | fondos de resaltado |
| line | `rgba(244,242,255,0.14)` | bordes de tarjeta y píldora |
| card | `#15131f` | tarjetas (píldora: `rgba(21,19,31,0.86)`) |

Morado con mesura: solo la palabra que es el punto del rótulo. Títulos de capítulo, todo blanco.

## Tipografía (archivos en `assets/fuentes/`)
- **Inter Tight** 400 / 600 / 800 para todo. Titulares 800 con tracking −0.025 a −0.035 em; rótulos 600.
- **JetBrains Mono** 400 / 500 solo para nombres de archivo, código y el número de la píldora.
- Nunca serif, nunca itálica decorativa, nunca mezclar familias en un mismo título.

## Piezas (código en `assets/plantillas/mmy.ts`, `separators.ts`, `style.css`)
- **Píldora de capítulo** "07 · Objetivos": alto 52, radio 26, número en cápsula morada mono 18 px; se queda todo el capítulo arriba a la izquierda.
- **Separador de capítulo**: número grande + título en blanco sobre bg con glow; sin fundido a negro; música sube +5 dB.
- **Tarjeta de pantalla**: grabación completa dentro de tarjeta `card` con borde `line`, burbuja circular de cámara de Pablo.
- **Rótulos**: en la columna libre x ≤ 600 px (16:9), nunca sobre la cara; datos con fuente en `facts.json`.
- Movimiento: `expo.out` para entrar, `power3.in` para salir, `sine.inOut` para derivas; beat 0.5 s.

## Zonas seguras
- 16:9: 72 px arriba/abajo, 96 px a los lados. Gráficos a cámara: columna izquierda x ≤ 600 px.
- 9:16 (Reels/Shorts): 230 px arriba, 420 px abajo, 60 px a los lados.

## Miniatura (`assets/plantillas/thumb.html` + `render.mjs`)
- 1280×720 (se diseña en 1920×1080). Base: foto real de Pablo en el set con Cody (`miniatura_base_ejemplo.png`), lado derecho.
- Arriba izquierda: título 800 de 184 px en blanco con sombra suave ("Muse de Meta"). Debajo: ícono de app 150 px con
  marco blanco + píldora blanca `#f4f2ff` con texto negro 800 (≤ 3 palabras: "Ya en México", "Guía completa").
- Parámetros por URL: `?pill=…&base=…&icon=0&fit=1`. Hacer 2 variantes de píldora y comparar en tamaño chico (≈ 320 px).
- La miniatura y el título de YouTube se complementan: no repetir las mismas palabras.
