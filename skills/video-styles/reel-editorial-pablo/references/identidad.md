# Identidad: Post-Digital Editorial B2

Elegida por Pablo el 11 nov 2026 a partir de su moodboard. Sustituye al "Nocturno morado" en este formato.

## Color
| Nombre | Hex | Uso |
|---|---|---|
| Ink | #0A0A0F | Fondo base, texto sobre claro |
| Blue | #1D2DFF | Fondo sólido, plano detrás de un recorte |
| Paper | #F5F4EF | Fondo claro, texto sobre oscuro, trazos |
| Orange | #FF7A1A | **El acento.** Una palabra del titular, un cuadrito, un trazo |
| Slate | #9AA3B2 | Líneas secundarias, pliegues de figuras |

- Un solo acento por escena. Si el fondo es naranja, no hay otro acento.
- El color lo pone el fondo; los recortes van en blanco y negro con contraste alto.
- **Pablo nunca en blanco y negro.**
- El color depende de la historia: no todo es azul o naranja siempre, pero no se sale de la paleta.

## Tipografía
- **Space Grotesk 700** para titulares. Altas y bajas (no todo mayúsculas), punto final, `letter-spacing:-.04em`, interlínea 0.95–1.04.
- **IBM Plex Mono 500/600** solo para contador, créditos y texto "de máquina" (un nombre de archivo, un prompt).
- Carga: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@500;600&display=swap`
- Sin internet: `assets/fuentes/` trae los mismos pesos en woff2. `@font-face{font-family:"Space Grotesk";font-weight:700;src:url(fuentes/space-grotesk-latin-700-normal.woff2)}` y así con cada uno, copiando la carpeta al proyecto.
- Tamaños en 1080×1920: titular 84–150 px según largo (2–3 líneas, nunca más de 4); apoyo 34–44 px; crédito y contador 22 px. **Nada por debajo de 22 px.**
- El titular vive arriba (y≈300) en el espacio libre, alineado a x=90. En escenas solo tipográficas puede ir al centro (y≈620–700).
- Énfasis: **una** palabra o cifra en naranja (`<em>`). Nunca cambiar de familia, peso o estilo dentro de un titular.
- Las palabras entran con la voz (cada `.w` sube 40 px en 0.24 s en el momento en que se dice). Sin voz: cascada de 0.11–0.13 s por palabra.
- Cifras: llegan completas en su golpe. Sin conteos que suben.

## Marco
- Arriba a la izquierda: "Pablo / Paredes_" en dos líneas, Space Grotesk 700 de 40 px.
- Arriba a la derecha: contador `01 / 03` en Plex Mono 22 px, `letter-spacing:.16em`.
- Tinta del marco: Ink sobre Paper y sobre naranja; Paper sobre todo lo demás.
- Nada más de marco: sin logos, sin barras, sin píldoras.
- Grano: ruido fractal al 14 % en `overlay`, con la semilla cambiando 12 veces por segundo.

## Zonas
- Seguro: y=280–1640, x=90–990. Reels tapa los 230 px de arriba y los 420 de abajo.
- Nota: el marco está hoy en y=96 (fuera de la zona). Decisión abierta de Pablo.

## Lo que Pablo rechazó (no repetir)
| Qué | Su razón |
|---|---|
| Rayita + etiqueta pequeña encima del titular | "Grita que fue hecho con IA" |
| Foto dentro de una tarjeta con pie de foto | Plantilla genérica |
| Perillas, controles o ventanas de interfaz falsas; stickers de robot | Lo mismo |
| Dos familias tipográficas seguidas; palabra manuscrita | "La IA tiende a hacer eso mucho" |
| Cualquier serif | Solo sans serif |
| Texturas como losetas o paneles sueltos; texturas cruzando como transición | "Se ven mal"; van como fondo completo oscurecido |
| Escenas con muchos elementos | "Saturas mucho": un fondo oscurecido, un héroe, un texto |
| Pablo en blanco y negro | No |
| Círculo de color en cada escena | Abuso: es un fondo entre diez |
| Cara cortada dentro de un círculo chico; cambio de layout cada 3 s | "Mi cara toda cortada", "abusaste de las transiciones" |
| Whoosh en cada corte | "Forzado, robotizado" |
| Video de puro motion sin él | "Se siente muy plano": el formato clave es con él a cámara |

Regla general detrás de casi todas: cuando algo se parece a lo que hace cualquier plantilla de IA, quitarlo.

## Composición: el titular y su elemento son un bloque (nota de Pablo, 14 nov 2026, reel "Pablo's Time")
Pablo: "dejaste mucho espacio entre el texto de arriba y los elementos… se siente mal alineado: el texto aparece arriba y el elemento demasiado abajo". Es nota de gusto y de diseño, y aplica siempre.
- **Colocar el elemento en relación con el titular, no en una coordenada fija.** Medir dónde termina la última línea del titular y poner el borde superior del elemento **90–140 px** debajo. En "Pablo's Time" el titular terminaba en y≈520 y la Kindle empezaba en y≈780–860: 260–340 px de hueco, el doble de lo aceptable.
- El hueco se mide con la **caja real del elemento** (lo que se ve), no con la caja de su imagen: un PNG con margen transparente engaña.
- Si el titular tiene dos líneas en una escena y tres en otra, el elemento se mueve con él. No dejar la misma posición para todos.
- Titular + elemento se centran como bloque dentro de la zona segura (y=280–1640). Si sobra espacio, sobra **abajo o repartido**, nunca en medio.
- Alinear a la misma columna: titular en x=90 → el elemento arranca en x=90 o se centra a propósito; nada "más o menos" corrido.
- Etiquetas chicas (fecha, contador de página) van pegadas a lo que nombran (≤24 px), no flotando en el hueco.
- Antes de animar, sacar un cuadro fijo por escena y **medir el hueco**; anotarlo en la tabla de escenas.
