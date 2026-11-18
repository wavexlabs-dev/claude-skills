# Recursos para ejemplificar (la caja de herramientas)

El formato base es Pablo a cámara + escenas tipográficas. **Lo valioso es el contraste**: en uno o dos momentos del reel entra un recurso especial que ejemplifica la idea (pixel art, una figura, un motion graphic, una imagen generada) y después se **regresa** al formato base. No convertir todo el reel al recurso especial ni proponer rehacer con él las escenas base: Pablo lo dijo el 12 nov 2026 ("que aparezca el pixel art y después regrese al otro formato, eso es lo valioso, no al revés").

## Qué hacer en cada reel nuevo
1. Al escribir el guion de escenas, marcar los 1–3 momentos que más ganan con un ejemplo visual: una historia con personaje, un mecanismo, un antes/después, una cifra, una comparación.
2. Para cada uno, **proponer a Pablo dos opciones de recurso** de la tabla, con costo (gratis en código, o cotización si lleva IA) y un cuadro fijo o boceto antes de animar.
3. Preferir un recurso que **no se usó en el reel anterior** (ver "Historial"). Si ninguno encaja, proponer uno nuevo y sumarlo a la tabla.
4. Tras el recurso especial, volver al formato base con un puente (ver "Fluidez").

## Catálogo
| # | Recurso | Sirve para | Costo | Modelo | Estado |
|---|---|---|---|---|---|
| R1 | Pixel art a pantalla completa (F11) | Una historia con personaje al que le pasa algo; algo que ocurre en un videojuego o un mundo | Código, gratis | `assets/modulos/px6.js` + `subs.js` | Aprobado (reel Dreaming v6) |
| R2 | Figura isométrica de una línea, Hairline (F10) | Un mecanismo: piezas que encajan, giran, se separan | Código, gratis | `draw7` en `assets/ejemplo-explainer/` | Usado en el explainer |
| R3 | Lienzo flotante (F9) | Muchos casos y uno elegido | Código, gratis | `assets/ejemplo-camara/` | Aprobado |
| R4 | Documento que se escribe / palabra que se corrige | Notas, prompts, archivos, "lo que guarda la máquina" | Código, gratis | nota del reel Dreaming (`index6.html`) | Usado |
| R5 | Motion graphic de datos | Una cifra, una comparación, un antes/después, una línea de tiempo | Código, gratis | — | **Sin probar** |
| R6 | Interfaz simulada (chat, terminal, editor) dibujada en código | Mostrar cómo se usa una herramienta sin grabar pantalla | Código, gratis | — | **Sin probar** |
| R7 | Imagen generada con IA, recortada sobre croma | Un objeto o escena que no existe en la fuente | **Cotizar y pedir permiso** | `scripts/key.py` | Usado para objetos |
| R8 | Clip de video generado con IA (2–4 s) | Una metáfora física que el código no da (algo que se rompe, se derrama, despierta) | **Cotizar y pedir permiso** | — | **Sin probar** |
| R9 | Material real de la fuente animado (figura, captura, foto) | Citar la fuente; dar prueba | Gratis; avisar del permiso de uso | figura del reel Dreaming | Usado |
| R10 | Captura real de pantalla o grabación de Pablo en tarjeta | Demostrar algo que él hizo | Gratis | — | **Sin probar** |
| R11 | Objeto real modelado en 3D (Blender), renderizado con fondo transparente y pantalla intercambiable | El producto u objeto del que trata el video; girarlo, voltearlo, cambiarle la pantalla | Código, gratis | `assets/ejemplo-3d/` (modelo, poses, giro, pantalla por homografía, 4K) | Usado en el reel "Pablo's Time" v7; a Pablo le gustó el workflow. Cuidar el hueco con el titular |

Ideas por explorar cuando encajen: animación cuadro a cuadro estilo recorte (collage), mapa o recorrido, partículas/ruido para ideas abstractas (sueño, memoria), un segundo personaje (Cody).

## Reglas del recurso especial
- **Puede salirse de la paleta B2** cuando representa algo con look propio (un videojuego se ve como videojuego). El marco, los subtítulos y las escenas base sí siguen la identidad.
- **Se parece a lo que representa**: la vista, la forma y el color del referente real (Pokémon se ve desde arriba). Enseñar un cuadro fijo y esperar el visto bueno antes de animar; así se evita rehacer versiones.
- El personaje puede ser el protagonista real de la historia. Dibujarlo propio y avisar del permiso de uso.
- A pantalla completa lleva subtítulos de 2–3 palabras; la toma se tapa y regresa al terminar.
- Sigue contando la regla de sonido: solo suena lo que tiene cuerpo dentro de la escena.

## Fluidez
- La entrada y la salida del recurso especial coinciden con un cambio de idea en la voz, nunca a mitad de frase.
- Puente entre escenas, en este orden de preferencia: (1) un elemento que continúa (el objeto de una escena pasa a la siguiente, el color que sale queda como forma); (2) cortina de 0.36 s; (3) corte directo sobre una palabra.
- La voz y los subtítulos/titulares no se interrumpen en el cambio; los silencios entre frases se recortan a ~0.12 s (`references/camara.md`).
- Alternar ritmos: escena base corta (2–4 s) → recurso especial más largo (5–9 s) → base.

## Historial (para no repetir)
| Reel | Recursos especiales | Fondos, en orden |
|---|---|---|
| Prueba C (15 s) | R3 | F1 → F2 → F3/F5 |
| Explainer (44 s) | R2 | Ink+foto → F8 → F2 → F6 → F3 → F1 → F10 → F3 → F1 |
| Dreaming v6 (67 s) | R1, R4, R9 | toma → F1 → F11 → F3 → F8 → Ink → F2 → F11 → toma → F1 → F4 → F3 → F2 → F3 → F1 → toma |

Añadir una fila por cada reel entregado.
| Pablo's Time v7 (66 s) | R11, R5 (infografía de sobres), R6 (terminal) | toma → F16 → toma → F1 → F1 → toma → F2 → F12 → F12 → toma → F18 → toma |
