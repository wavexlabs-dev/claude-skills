# Marca (Nocturno morado)

Viene de `marca-pablo-video`; aquí está lo que usan los Shorts.

## Color
| Token | Valor | Uso |
|---|---|---|
| Fondo | `#0b0a12` | fondos, cajas de subtítulo (`#0b0a12CC`) |
| Texto | `#f4f2ff` | todo el texto |
| Acento | `#8a6bff` | **solo** la palabra clave («hype», el sello, ✕/✓) |
| Glow | `#1b1433` → `#0b0a12` | gradiente radial de las tarjetas |
| Panel | `#15131f` + borde `#f4f2ff24` | renglones del veredicto |

## Tipografía
Inter Tight 800 para títulos y subtítulos, 600 para textos secundarios (`assets/fuentes/`). JetBrains Mono solo
para código o archivos. Nunca serif ni dos familias en un título. En las plantillas HyperFrames las familias se
llaman `Ftitle` (800) y `Fbody` (600).

## Subtítulos
`assets/plantillas/style.json`: Inter Tight 800, 68 px, máx. 3 palabras/20 caracteres, caja `#0b0a12CC` con
radio 12, palabra de énfasis en morado. Lista de énfasis por Short en `## Emphasis` (p. ej. «hype»,
«Swarm Rebuild»). Corrige en `## Caption fixes` los errores del reconocedor (nombres propios sobre todo).

## Encuadre y fondo
- Clips Sony verticales 4K con rotación −90 → proxy 1080x1920. Cara en `Framing: 0.5, 0.40`.
- Split: panel de arriba 1080x880, Pablo abajo con `speaker_pad_image: broll/pad_estrellas.jpg` (estrellas de su
  propio fondo) y `speaker_feather: 90`. Fondo negro o blur se veían mal.
- Punch máximo 1.1.
- Si una toma no trae su luz violeta: curvas suaves (medios 0.45→0.51), colorbalance hacia azul. Más fuerte se ve «HDR».
