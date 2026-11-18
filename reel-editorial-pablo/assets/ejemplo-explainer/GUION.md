# Explainer: "Una IA diseñó estos tres aparatos"

Fuente: https://www.anthropic.com/research/claude-electronics-design (Anthropic × Diode Computers, 9 nov 2026).
Formato: 9:16, 1080×1920, 30 fps, 44 s, sin cámara y sin voz. La tipografía carga la historia.
Estructura: explicación ("encontré esto"): gancho → golpe → cómo empezó → qué hizo → cómo se corrige → dato → detalle → límites → fuente.

## Hoja de hechos (todo lo que aparece en pantalla sale de aquí)

| En pantalla | Frase de origen en el artículo |
|---|---|
| "Una IA diseñó estos tres aparatos." | "asking Claude Fable 5.2 to design three electronic devices: a speakerphone, a voice-assistant hub, and a handheld virtual pet" |
| "Funcionaron sin corregir el circuito." | "build prototypes that worked without any fixes to their circuitry" |
| "Todo empezó con una frase." + el pedido | "a puck that plugs into a computer over USB-C and includes microphones and a speaker, supporting Bluetooth with a PCB antenna" |
| "Hizo el esquema, la placa, la carcasa y el firmware." | "draw clean visual schematics, choose where to place the components on a printed circuit board… design a 3D-printable enclosure, code the firmware" |
| "Si algo no salía, lo borraba y empezaba de nuevo." | "I should just rip these traces and start fresh… delete and reroute copper connections dozens of times" |
| "casi triplicó su nota" · 25 % → 69 % | "Fable 5.2 scored 69% on the benchmark, compared with 25% for Fable 5" (PCB Gym, prueba interna de Diode). 69/25 = 2.76 |
| "Notó que la placa solo entra inclinada 25°." | "the board would fit if it was tilted by about 25 degrees during installation" |
| "Siguen siendo prototipos: sin certificar y armados por humanos." | "still prototypes: they haven't been through… certification"; "engineers at Diode had to physically build and test the prototypes" |

Notas de honestidad:
- El pedido está traducido al español; el original está en inglés.
- "Armados por humanos": el artículo dice que ingenieros de Diode los construyeron y probaron bajo dirección de Claude.
- Anthropic declara una relación comercial con Diode (nota al pie del artículo). No aparece en el video; conviene mencionarlo en la descripción.
- Las imágenes son de Anthropic / Diode; llevan crédito en pantalla. Confirmar uso antes de publicar.

## Escenas

| # | Tiempo | Fondo | Elemento principal | Titular | Movimiento |
|---|---|---|---|---|---|
| 1 | 0–4.6 | Ink | Foto real de los tres aparatos, en B/N, a todo el ancho | Una IA diseñó estos tres **aparatos.** | Portada completa 0.2 s; la foto se descubre de izquierda a derecha y empuja lento |
| 2 | 4.6–7.6 | Naranja sólido | Solo tipografía | Funcionaron sin corregir el circuito. | Cortina; el bloque crece 3.5 % |
| 3 | 7.6–13.4 | Azul sólido | Hoja de papel recortada | Todo empezó con una **frase.** | El pedido se escribe letra por letra con cursor naranja |
| 4 | 13.4–19.8 | Ink + retícula | Las 4 capas reales de la placa, recortadas | Hizo el esquema, la **placa,** la carcasa y el firmware. | Las capas se separan en 3D y giran lento |
| 5 | 19.8–26.0 | Muro oscuro (spray) | Ruteo real antes/después sobre plano azul | Si algo no salía, lo borraba y empezaba **de nuevo.** | Barrido naranja cambia "antes" por "después" |
| 6 | 26.0–31.2 | Paper sólido | Dos barras: 25 % y 69 % | En diseño de placas, casi triplicó su nota. | Cada barra crece y su cifra llega completa |
| 7 | 31.2–36.4 | Ink + plano azul | Corte real de la carcasa, en líneas Paper | Notó que la placa solo entra **inclinada 25°.** | El dibujo se inclina; aparece un cuadrito naranja |
| 8 | 36.4–40.6 | Muro oscuro (descascarado) | Solo tipografía | Siguen siendo **prototipos:** sin certificar y armados por humanos. | El muro retrocede lento |
| 9 | 40.6–44.0 | Paper sólido | Solo tipografía + fuente en mono | El artículo completo está en **anthropic.com** | Deriva lenta |

## Reglas aplicadas
- Nueve fondos en secuencia, ninguno repetido de forma consecutiva; el círculo no aparece.
- Un fondo, un elemento principal, un bloque de texto por escena; el titular siempre en la misma zona.
- Una familia tipográfica; mono solo para contador, créditos y el texto del pedido.
- Recortes en blanco y negro; el color lo pone el fondo; un acento por escena.
- El cambio de fondo es una cortina (alterna: sube / entra por la derecha), 0.36 s. Sin paneles ni zooms.
- Primer cuadro = portada con el titular completo.
- Todo dentro de y=280–1640.
- Cifras completas en su golpe, sin conteos intermedios.


## v2: figura isométrica y sonido (11 nov 2026)

### Escena 7 con figura isométrica de una sola línea
Se sustituyó el dibujo estático del artículo por una figura animada: una carcasa redonda y la placa.
1. La placa baja recta y el interruptor (único trazo naranja) choca con la pared trasera.
2. La placa sube, se inclina 25° y entra con el borde cercano primero.
3. Gira hasta quedar plana y el interruptor entra en su ranura.

Hecho con la geometría del motor Hairline (`hairline-kernel.js`, copia sin cambios): cámara 2:1, sólidos redondeados con silueta y un pliegue, placas opacas pintadas de atrás hacia adelante, un solo resaltado, sin texto dentro del dibujo. La diferencia con una figura Hairline normal es que aquí la pose sale del tiempo del video y no del puntero, así que no usa sus resortes ni su ciclo de cuadros.

### Sonido (ElevenLabs)
- Música: `eleven_music_v2_5`, 45 s, 100 BPM, instrumental. Costo: 16 centavos de dólar.
- Efectos: 9 con `eleven_text_to_sound_v2`, 0.3 centavos cada uno.
- Total: unos 19 centavos de dólar.
- Mezcla (`mix.py`): música a volumen fijo (−7 dB), cada efecto recortado a su primer golpe; salida a −13.5 LUFS, pico −1.5 dBFS.

| Tiempo | Efecto | Acción en pantalla |
|---|---|---|
| 4.55, 7.55, 13.35, 19.75, 25.95, 31.15, 36.35, 40.55 | whoosh | cada cortina de cambio de fondo |
| 4.88 | impacto | "Funcionaron sin corregir el circuito." |
| 7.92 | papel | entra la hoja |
| 8.70 | tecleo (3.4 s) | se escribe el pedido |
| 14.35 | placas deslizándose | se separan las cuatro capas |
| 22.70 | barrido | cambia "antes" por "después" |
| 27.50 y 28.92 | golpe sordo | llega cada barra (25 % y 69 %) |
| 32.80 | golpe de plástico | el interruptor choca con la pared |
| 33.25 | placas (bajo) | la placa se inclina |
| 35.62 | clic | la placa asienta |

18 cues en 44 s. Ningún texto que entra suena; solo acciones y cambios de escena.

## Pendiente
- Voz (no se pidió).
- Escuchar la mezcla: Claude no oye. Revisar sobre todo que la música no traiga voces (el modelo marcó "Instrumental: False") y que el tecleo repetido no suene mecánico.
- Crítico externo a ciegas.
