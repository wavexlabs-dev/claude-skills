# Método de sonido

Nace de la nota de Pablo (11 nov 2026): los efectos se sentían forzados y robotizados, "whoosh, whoosh, cuando a veces ni es necesario". Implementación: `scripts/mezcla.py`. **Pablo todavía no confirma de oído la mezcla hecha con este método.**

## La regla
**Solo suena lo que tiene cuerpo.** Un efecto necesita un objeto que se vea, con material y peso, haciendo algo. Un corte, un cambio de fondo, un cambio de layout o un texto que entra no son objetos: no suenan.

Prueba para cada efecto: "¿qué objeto es, de qué está hecho y qué le pasa?". Si la respuesta es "es la transición", se borra. Por eso `mezcla.json` exige una `nota` por cue.

## Tres capas
| Capa | Qué es | Cuánto | Nivel |
|---|---|---|---|
| **Cama** | Música. Marca el pulso y lleva los cambios de escena | Toda la pieza, a volumen fijo | Referencia |
| **Objetos** | Papel, teclas, placas, plástico, un clic | Uno por acción física | +6 dB sobre la música en 1.5–8 kHz; cosas chicas +3 |
| **Acento** | Un golpe que subraya la frase clave | Uno por pieza (dos si pasa de 30 s) | +10 dB en esa banda |

Excepción declarada: el acento puede caer sobre una palabra del titular aunque el texto no sea un objeto. Es el único.

## Con Pablo a cámara
- **En sus tomas no hay efectos.** Su voz y la música abajo.
- Los objetos suenan solo en las escenas de imagen y **nunca sobre la palabra clave**: el golpe va en la pausa o en la sílaba fuerte.
- **La voz manda:** ≥10 dB sobre la música donde habla (`mezcla.py` baja la música si no se cumple). Los efectos van 3 dB por debajo de su meta sin voz.
- Densidad: un efecto cada 4 s o más espaciado; siempre algún respiro de 5 s.
- Sin probar aún: comprimir la voz, bajar la música solo bajo las frases.

## Por qué suena robotizado, y la corrección
| Causa | Corrección |
|---|---|
| El mismo sonido en cada corte | Quitar. Los cortes no suenan |
| Una muestra repetida en bucle (tecleo) | `"sonido":"teclas"`: separa las teclas y las vuelve a tocar con ritmo, tono y fuerza irregulares, con pausas |
| Dos golpes iguales seguidos | `"tono"` según el tamaño: lo más grande suena más grave (0.86), lo chico más agudo (1.1) |
| Sonido sintético genérico (un barrido que sube) | Sustituir por el material que se ve |
| Niveles a ojo | Calibración automática por banda |
| Cada efecto en su propio espacio | Sala corta compartida (ya en el script) |
| Un efecto en cada cosa que pasa | Tope de densidad y respiros a propósito |

## Evaluar el audio sin oírlo
Claude no oye. Puede medir y ver:
1. **Espectrograma** de la música y de cada efecto (`revisar.py` lo saca del video; para un archivo: `ffmpeg -i x.mp3 -lavfi showspectrumpic=s=1200x500 x.png`). Buscar: voz en la música (curvas que suben y bajan entre 200 y 3,000 Hz), tonos sintéticos puros, bloques idénticos repetidos, ruido antes del golpe.
2. **Presencia por banda** (1.5–8 kHz, en la ventana del golpe). Comparar volumen total engaña: la música llena los graves.
3. **Sincronía:** el primer golpe real del archivo (umbral relativo a su propio pico) a un cuadro o menos de la acción. Los sonidos generados suelen traer el golpe 0.3–0.8 s tarde; `mezcla.py` los recorta.
4. **Archivos vacíos o dobles:** >50 ms, pico real, un solo golpe si la acción es una.
5. **Repetición, densidad, acentos:** avisos automáticos del script.
6. **Volumen final:** −14 LUFS, pico ≤ −2 dBFS, ganancia lineal + limitador (nunca `loudnorm` dinámico: mueve la música).

Lo que no cubre: si el timbre es agradable, si el sonido "se siente" del objeto, si la música aburre. **Cada entrega dice qué se midió y qué falta oír.**

## Biblioteca (`assets/sonidos/`)
Ya recortados a su primer golpe y normalizados. Generados con ElevenLabs para el explainer.
| Archivo | Material y gesto | Usado para |
|---|---|---|
| `paper` | Hoja de papel que se desliza | Una hoja que entra; con `tono` 0.78, papel que se barre |
| `typing` | Teclado mecánico (fuente para `teclas`) | Texto que se escribe |
| `plates` | Placas rígidas que se deslizan | Capas que se separan |
| `thud` | Golpe sordo | Una barra o bloque que asienta |
| `knock` | Golpe corto de plástico | Dos piezas que chocan |
| `click` | Clic de encaje | Una pieza que entra en su lugar |
| `impact` | Impacto grave | El acento |

Faltan: metal, vidrio, tela, cinta, cierre de cámara. Agregar cada sonido nuevo aquí, medido.

## Generar sonido nuevo (ElevenLabs, con permiso)
- Cotizar antes. Referencia: música de 45 s ≈ 16 centavos de dólar; cada efecto ≈ 0.3.
- Música: `eleven_music_v2_5`, pedir instrumental, duración y BPM. Revisar en el espectrograma que no traiga voz. Para ajustar el final a la pieza, `"tempo"` entre 0.95 y 1.05.
- Efectos: `eleven_text_to_sound_v2`, 1–2 s, describir material y gesto ("a single sheet of paper sliding on a wooden desk, close, dry"), no la emoción.
- Lo que llega no es lo que se pidió: el tecleo de 3.5 s llegó de 1 s; algunos llegan casi mudos. Medir siempre.

## Pendiente
- Que Pablo oiga la mezcla v4 del explainer y una con voz.
- Elegir la música antes de fijar tiempos y cortar sobre el pulso (a 100 BPM, cada 0.6 s).
- Decidir si un modelo que procese audio sirve como segundo juez.
