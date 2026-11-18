# Reel "Pablo's Time" · guion y propuesta (13 nov 2026)

Toma: `C0844.MP4` (vertical 4K, 136.6 s en bruto). Fuente: repositorio `wavexlabs-dev/kindle-newspaper`.
Transcripción con marcas por palabra: `out/voz16k.json`.

## 1. Guion limpio (tomas buenas, tiempos de la toma original)

| # | Tramo | Texto |
|---|---|---|
| 1 | 22.06–36.12 | Convertí esta vieja Kindle en un periódico mañanero llamado The Pablo's Time, que me muestra todas las noticias de IA y tecnología todas las mañanas, sin tener que agarrar el teléfono y terminar haciendo un scroll infinito. Y aquí te cuento cómo lo hice. |
| 2 | 38.30–53.70 | Lo primero fue conectar la Kindle a mi Mac a través de un cable USB y pedirle a Codex que analizara cuál era el modelo, y a ver si encontrábamos una forma de hacerle jailbreak. En este punto mi gran avance era que la Kindle todavía prendía. |
| 3 | 55.44–70.08 | Quería que cada edición tuviera una portada única con el estilo de New Yorker. Así que le pedí al modelo de GPT Images 2 que, basado en el contenido de ese día, generara una nueva portada y la desplegara al principio de todas las ediciones. |
| 4 | 71.78–82.06 | Se veía bien, pero no podía lograr pasar a la segunda página, así que le tuve que instalar el sistema de KOReader y ya pude por fin abrir la edición como si fuera un periódico. |
| 5 | 86.28–88.9 + 101.26–115.96 | Para alimentar el periódico utilicé todos los newsletters a los que ya estaba suscrito en Gmail. De ahí extrae los que no he leído y genera un resumen, para que solamente me muestre 4 o 5 puntos que considera que son los más relevantes para mí. |
| 6 | 116.54–129.76 | La última prueba fue dejar la Kindle en reposo y despertar el siguiente día para ver si se había generado una edición. Y así fue. Se despertó sola, descargó la edición por wifi y la abrió. Sin wifi y sin cables. |
| 7 | 130.16–134.34 | Si quieres hacerla tuya, te dejo el link del repositorio de GitHub en los comentarios. |

Se descartan: los dos primeros intentos del gancho (2.46–21.60) y las repeticiones de 84.04–86.2 y 93.36–94.6.
Duración estimada: ~88 s de voz; ~80 s con silencios recortados; ~67 s si la voz va a 1.2x.

## 2. Por confirmar con Pablo antes de construir

1. **"Sin wifi y sin cables" (128.2 s)**: justo antes dice que la descargó por wifi. Probable intención: "sin teléfono y sin cables" o "sin cables". Opciones: cortar la frase, o dejar solo "y la abrió".
2. **"4 o 5 puntos"**: el README dice "hasta cuatro correos". En pantalla pondría "4" o ningún número.
3. **"GPT Images 2"**: el README nombra el modelo `gpt-image-2.5-flare`. En pantalla pondría solo "portada generada con IA" o el nombre exacto del README.
4. **El repositorio es privado** (lo dice su README). El cierre promete el link en comentarios: hay que hacerlo público o cambiar el cierre.
5. El README (29 sep) marca "despertar a las 08:00" como pendiente; el video cuenta que la prueba de la noche funcionó. Si ya funcionó, conviene actualizar el README antes de publicar.
6. Voz: ¿mandará la voz limpia a 1.2x como en Dreaming? Resolución: ¿1080 o 4K? Entrega: copia <30 MB por chat + original a Drive.

## 3. Hoja de hechos (lo único que puede salir escrito en pantalla)

| Dato | Origen |
|---|---|
| Kindle Basic 2014, 7.ª generación | README, "Equipo en el que se probó" |
| Pantalla 600 × 800, escala de grises | README |
| Jailbreak + KOReader | README; guion tramos 2 y 4 |
| Newsletters sin leer de Gmail, solo remitentes elegidos; no los marca como leídos | README, primer párrafo |
| Hasta cuatro correos recomendados por mañana | README |
| Portada distinta por edición, estilo ilustración editorial, hecha a partir de las noticias del día | README y docs/PORTADA.md |
| 06:00 se prepara la edición · 08:00 el Kindle la busca (CDMX) | README y captura del panel |
| El Kindle descarga por wifi; las claves se quedan en el servidor | README, "Cómo funciona" |
| Flujo: Gmail → seleccionar y resumir → portada → páginas 600×800 → almacenamiento → HTTPS → Kindle | diagrama del README |
| Portada real "Antes de dejarlo volar", 29 sep 2026 | assets/covers |

## 4. Propuesta de escenas

Motivo del reel: **la Kindle en 3D** (`../kindle.blend`). Entra en cuatro momentos y entre ellos se regresa al formato base (Pablo en tarjeta + titular).

| # | Voz | Cámara | Fondo | Elemento principal | Recurso |
|---|---|---|---|---|---|
| 1 | Gancho | Pantalla completa | toma | Titular "Convertí mi Kindle en un periódico" | base |
| 1b | "…llamado The Pablo's Time" | Tarjeta | Ink | **Kindle 3D gira y la pantalla refresca (parpadeo de tinta) de libro viejo a la portada real** | 3D |
| 1c | "sin agarrar el teléfono… scroll infinito" | Tarjeta | F14 pantalla partida (estreno) | Teléfono con feed que corre vs Kindle quieta | código (o IA, opción B) |
| 2 | Cable USB, Codex, jailbreak | Tarjeta | F16 código a sangre (estreno) | Kindle 3D de espaldas; entra el cable al puerto; líneas de terminal | 3D + código |
| 2b | "todavía prendía" | Pantalla completa | toma | Remate a cámara, sin gráfico | base |
| 3 | Portada estilo New Yorker | Burbuja | Paper | **Portadas que cambian en la Kindle 3D**, una por día, con la fecha corriendo | 3D + portadas reales |
| 4 | No pasaba de página → KOReader | Tarjeta | F2 azul | Kindle 3D de frente: intenta pasar y rebota; luego pasa 1→2→3 | 3D |
| 5 | Gmail → resumen → 4 puntos | Burbuja | F12 Paper milimétrico (estreno) | **Infografía del proceso**: sobres de newsletters → se filtran → 4 quedan → entran a la página de la Kindle | motion graphic |
| 6 | Dejarla en reposo; "se despertó sola" | sin cámara, subtítulos | F18 ruido nocturno (estreno) | Kindle 3D en la oscuridad; reloj 06:00 → 08:00; la pantalla se enciende sola con la portada | 3D |
| 7 | Cierre y repositorio | Pantalla completa | toma | Titular "Link en comentarios" | base |

### Opciones por recurso (elegir una en cada fila)
| Momento | Opción A (recomendada) | Opción B |
|---|---|---|
| Portadas (3) | Portadas reales de tu panel sobre la Kindle 3D. Gratis; necesito 4–6 PNG del archivo del panel | Generar 3–5 portadas nuevas con IA en el mismo estilo. Se cotiza antes |
| Proceso (5) | Infografía plana en código, los sobres viajan hasta la Kindle. Gratis | Figura isométrica Hairline con la Kindle como destino. Gratis, más lenta de leer |
| Despertar (6) | Kindle 3D sobre negro con luz de amanecer que entra. Gratis | Fondo generado con IA: buró al amanecer, con la Kindle 3D encima. Se cotiza antes |
| Scroll (1c) | Teléfono dibujado en código. Gratis | Clip de IA de 3 s de una mano haciendo scroll. Se cotiza antes |

Fondos que se estrenan: F12, F14, F16, F18. No se repite la secuencia de Dreaming (sin muro F3 ni "papel + tarjeta").
Sonido con cuerpo disponible: clic del cable USB, parpadeo/clic de página, teclas en la terminal.

## 5. Plan corregido (13 nov 2026) — sustituye a la tabla de la sección 4
Corrección de Pablo: abrir con él a pantalla completa mostrando la Kindle real; pasar al 3D después del primer párrafo; alternar escenas donde él sale grande. Guion gráfico: `out/guion_grafico.jpg` (`guion_grafico.html`).

| # | Voz | Pablo | Imagen |
|---|---|---|---|
| 1 | Todo el párrafo 1 (gancho) | **Completa**, con la Kindle real en la mano | Subtítulos de 2–3 palabras |
| 2 | Cable USB, Codex, jailbreak | Burbuja | Kindle 3D de espaldas + cable, sobre código |
| 3 | "mi gran avance era que todavía prendía" | **Completa** | Titular bajo la barbilla |
| 4 | "Quería una portada única estilo New Yorker" | **Tarjeta** | Paper, Kindle chica a la izquierda |
| 5 | "le pedí al modelo… una nueva portada" | sin cámara | Kindle 3D grande, portadas que cambian |
| 6 | "no podía pasar a la segunda página" | **Completa** | Titular |
| 7 | KOReader, "como un periódico" | Burbuja | Kindle 3D pasando páginas, azul |
| 8 | "utilicé los newsletters… de Gmail" | **Tarjeta** | Paper milimétrico, sobres |
| 9 | "extrae los no leídos… 4 puntos" | Burbuja | Infografía: 4 sobres bajan a la Kindle |
| 10 | "La última prueba fue dejarla en reposo" | **Completa** | Titular |
| 11 | "despertar el siguiente día" | — | **Escena con IA (por cotizar)**: Pablo dormido, Kindle en el buró, amanece |
| 12 | "Se despertó sola, descargó… y la abrió" | sin cámara | Kindle 3D de noche, 08:00 |
| 13 | Cierre | **Completa** | Titular |

Ideas de IA con Pablo (ninguna generada; cotizar antes): A) dormido al amanecer con la Kindle en el buró (escena 11); B) leyendo la Kindle con café y el teléfono boca abajo (para el cierre o el gancho); C) de noche en la cama con el teléfono, luz azul (contraste del "scroll infinito"). Saldo disponible al 13 nov: 9.21 créditos.
