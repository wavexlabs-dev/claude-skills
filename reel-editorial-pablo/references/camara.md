# La toma de Pablo: layouts, medición y cambios

## Grabación
- **La toma horizontal (16:9, 4K) funciona mejor que la vertical** para este formato: en MITAD da plano medio con manos. Lo único que no permite es pantalla completa.
- Extraer a 2880 px de ancho (`scripts/toma.sh`); con menos, la burbuja pierde nitidez.
- Preferir tramos de una sola toma sin cortes. Si hay un corte, esconderlo bajo un cambio de layout.

## Layouts
| Layout | Caja en pantalla | Qué se ve | Cuándo |
|---|---|---|---|
| **MITAD** (`split`) | x0 y960, 1080×960, borde duro | Plano medio; la imagen ocupa la mitad de arriba | Abrir, definir, demostrar con él presente |
| **BURBUJA** (`bubble`) | x721 y1072, 268×375, esquinas de 30 px, filete Paper de 2 px al 55 % y sombra | Cabeza y hombros; la imagen ocupa toda la pantalla | Cuando la imagen es la protagonista y él acompaña |
| **COMPLETA** (`full`) | 1080×1920 | Solo él | Gancho o llamado final. **Solo si `layout.py` dice OK**; con toma horizontal casi nunca |

- La burbuja es un rectángulo redondeado abajo a la derecha, **no un círculo chico**: el círculo le cortó la cara.
- Ningún gráfico ni texto toca la zona de la cara. Texto sobre la toma, solo arriba de la cabeza o bajo la barbilla.

## Toma vertical en primer plano (probado el 11 nov 2026, reel "Dreaming"; sin aprobar por Pablo todavía)
Si Pablo graba en vertical y cerca (la cabeza ocupa ~45 % del alto del cuadro), la MITAD no sirve: a ancho completo la cara mide ~800 px de alto y queda bajo la interfaz de Reels. Usar:
| Layout | Caja | Recorte (fracciones del cuadro 9:16) |
|---|---|---|
| **COMPLETA** | 1080×1920 | todo. Titular solo bajo la barbilla (y≈1190–1500) con un degradado Ink detrás |
| **TARJETA** (`card`) | x470 y860, 520×780, esquinas de 30 px | cx 0, cy .04, cw 1, ch .844. Titular arriba (y=300), el elemento en la columna izquierda (x70–440) |
| **BURBUJA** | igual que siempre | la que imprime `layout.py --aspecto 9:16` |
`ffprobe` reporta 3840×2160 en estas tomas (van giradas por metadatos): mirar un cuadro antes de asumir que es horizontal. Con ancho completo el recorte no depende de dónde esté la cabeza en horizontal, así que aguanta que se mueva entre tomas.

Varias tomas con frases repetidas: cortar con una lista de tramos (modelo: `src/cut.sh` del proyecto "Anthropic Dreaming/reel-editorial") y poner cada corte bajo un cambio de layout.

## Voz externa y cortes sin huecos (reel "Dreaming" v2, 11 nov 2026)
Pablo puede entregar la voz aparte: limpia de ruido, acelerada 1.2x y ya cortada. Pidió además **cortes rápidos, sin silencios entre frases** ("siento que dejas huecos"). Pero sin pasarse: en "Jeep 94" (18 nov 2026) dijo que se sentía "muy acelerado y mal cortado" con ~0.12 s entre frases. La medida buena es **~0.2 s de aire entre frases ya a 1.2x** (PAD 0.12 en el recorte de silencios) y ninguna palabra cortada (ver `revision.md`, "Cortes que se comen palabras").
1. Extraer toda la toma original a la misma velocidad como cuadros (`setpts=PTS/1.2,fps=30`) y su audio con `atempo=1.2`.
2. Partir la voz nueva en frases con `silencedetect=n=-38dB:d=0.15` y alinear cada frase con el audio original por correlación de envolventes (5 ms). Correlación ≥0.8 = bien; los trozos de menos de 0.6 s se alinean aparte con una ventana acotada.
3. Línea de tiempo nueva: cada frase con 0.06 s de aire a cada lado (≈0.12 s entre frases). La página elige el cuadro original de cada cuadro nuevo con una tabla (`TL.frames`).
4. Para no reescribir los tiempos de las escenas: una función `R(t)` por tramos lleva los tiempos viejos a los nuevos.
Modelo: `v2/alinear.py`, `v2/build.py` e `index2.html` en "Anthropic Dreaming/reel-editorial". La voz entregada venía a −25 LUFS: subirla (+8 dB con limitador) **antes** de `mezcla.py`, o el script baja la música hasta casi desaparecerla.

## Medir la cara (obligatorio)
1. Abrir `out/medir_*.jpg` (inicio, medio, final) y, si se mueve, el cuadro donde más se acerca.
2. Anotar en fracciones del cuadro fuente: centro horizontal de la cabeza, borde superior del pelo, barbilla, ancho de la cabeza.
3. `python3 scripts/layout.py --aspecto 16:9 --cx 0.51 --arriba 0.11 --abajo 0.72 --ancho 0.22`
4. Pegar el objeto `L` en la página. Los layouts marcados "CORTA O APRIETA" no se usan con esa toma.
5. Renderizar un cuadro fijo por layout y **mirarlo**: cabeza completa, aire arriba ≥4 %, la cabeza ocupa ≤68 % del ancho de la caja.

Valores de la prueba C (C0821, 16:9): `split` cx .1936, cw .6328, ch 1 · `bubble` cx .3355, cy .006, cw .3490, ch .8685. La cabeza ocupa 35 % del ancho en mitad y 63 % en burbuja.

## Cómo se dibuja
En `assets/ejemplo-camara/index.html`: `#pwrap` es la caja con `overflow:hidden`; `#pablo` es el cuadro `pablo/f_NNNN.jpg` del tiempo `t`, dimensionado como `caja / recorte` y desplazado `-cx`, `-cy`. El layout en cada instante es la interpolación de dos entradas de `L` con `easeInOut`. Los campos `sh, sx, sy, ss` son el alto visible y el encuadre del escenario de imagen en ese layout: al pasar a burbuja, el escenario crece de la mitad superior a toda la pantalla.

## Cambios de layout
- **Máximo 2–3 en 15 s.** La prueba que gustó tiene uno solo.
- Cada cambio necesita motivo: una idea nueva (un "o sea", un "entonces"), o un corte de la toma que hay que esconder.
- Duración 0.35–0.4 s. Ocurre **mientras** cambia el fondo o entra la imagen, no aparte.
- "La cara crece conforme crece la petición": burbuja para la prueba, mitad para la demostración, completa para el llamado.
- El cambio de layout no lleva sonido.
- Sin zoom dentro de la toma en cortes cortos; encuadre máximo 1.2× sobre el recorte medido.

## Subtítulos
**Decidido (17 nov 2026, reel "Jeep 94"):** comparó la versión final con y sin subtítulos y eligió **con subtítulos en todo el reel**. Van desde la V1.

- Gancho: sus subtítulos propios grandes (78 px, blancos, la palabra dicha en naranja) bajo el titular de portada.
- Desde que termina el gancho hasta el final: **píldora Ink** centrada abajo (top≈1716, Space Grotesk 64 px peso 700, padding 12/26, radio 16), texto Paper y la última palabra dicha en naranja. Bloques de 2–3 palabras (≤14 caracteres o hasta la puntuación) de la voz final transcrita con tiempos por palabra. Se lee igual sobre Paper, naranja, azul o la toma.
- Conviven con los titulares (no se quitan): el titular resume, el subtítulo sigue la voz. Revisar que la píldora no choque con créditos, tarjetas o listas; los créditos de un video a pantalla completa suben a y≈1580.
- Corregir nombres y errores de transcripción (Claude, Muhammad, Anthropic; "RIT" → "Jeep") y la mayúscula después de punto.
- Plantilla: `SUBG` / `subG()` en `assets/ejemplo-jeep94/index.html`.

## Alternar el tamaño de Pablo (corrección del 13 nov 2026, reel "Pablo's Time")
Pablo, al ver un guion gráfico donde salía en burbuja en todas las escenas: "lo sentí demasiado gráfico y salgo yo todo el tiempo en un cuadrito chiquito; tienes que alternar entre las escenas donde salgo yo más grande".
- **El gancho y todo el primer párrafo van con él a pantalla completa**, sobre todo si muestra el objeto real en la mano. El recurso especial (3D, pixel art) entra después de esa primera explicación.
- **Alternar COMPLETA / TARJETA / gráfico con burbuja o sin él.** Nunca dos escenas gráficas con burbuja seguidas; cerca de la mitad del tiempo él debe verse grande (completa o tarjeta).
- Patrón que aprobó como dirección: frase de planteamiento a cámara (completa) → gráfico que la ejemplifica → remate a cámara.
- La burbuja es para cuando el gráfico es el protagonista, no el layout por defecto.

## Igualar la luz entre tomas (13 nov 2026, reel "Pablo's Time")
Si Pablo dice que una toma "se siente más oscura", **medir antes de subir el brillo**: comparar contra una toma aprobada el RGB medio de la cara y del fondo. En su set lo que suele faltar es la luz morada que entra por la izquierda, no exposición.

**Corrección que Pablo prefirió** (viene de otra sesión, `Kindle 3D/kindle-short/edit.md`; "quedó mejor que la tuya"):
`curves=all='0/0 0.12/0.12 0.45/0.51 1/1',colorbalance=rm=-0.01:gm=-0.03:bm=0.07:rh=-0.01:gh=-0.02:bh=0.04,format=gbrp,geq=r='min(255,r(X,Y)*(1+0.08*pow(1-X/W,1.4)))':g='g(X,Y)*(1-0.04*pow(1-X/W,1.4))':b='min(255,b(X,Y)*(1+0.5*pow(1-X/W,1.4)))'`
- Negros en negro (0→0), sombras intactas (0.12→0.12), medios un poco arriba (0.45→0.51; con 0.55 da look HDR).
- Piel hacia violeta con `colorbalance` suave.
- "Lámpara" morada simulada con `geq`: multiplica azul (+50 %) y rojo (+8 %) con un degradado fuerte a la izquierda. Al multiplicar, solo pinta lo que ya tenía luz (mano, mejilla) y el fondo sigue negro.

**Lo que no hay que hacer** (mi primer intento, v5): teñir sombras y levantar negros con `colorbalance` + `curves` por canal. Deja el fondo morado parejo, lava el negro del set y no tiene dirección. Referencia de toma con luz completa: "Anthropic Dreaming/reel-editorial/raw12/". Enseñar siempre un antes/después en cuadros fijos.

### Regla medible (refuerzo del 14 nov 2026)
Pablo volvió a marcarlo después de ver el reel terminado: "abusaste de las tomas animadas donde yo salía en el cuadro chiquito… siempre complementar con tomas mías y sobre todo aperturar con tomas mías, y ya después pasar a las divididas o con elementos gráficos".
- **Apertura: los primeros 8–13 s son de él a pantalla completa.** Ningún gráfico antes de que termine su primera idea.
- **Al menos la mitad del tiempo total él se ve grande** (completa o tarjeta). Contarlo en la tabla de escenas antes de construir. "Pablo's Time" v7 quedó en ~47 % (31 s de 66), justo por debajo, y con tramos gráficos de hasta 9 s seguidos sin volver a él.
- **Máximo una escena gráfica con burbuja seguida**; después de cada una, volver a una toma suya (completa o tarjeta) aunque sea de 2–3 s.
- Un gráfico largo se parte: gráfico → remate suyo a cámara → segunda parte del gráfico.
- La burbuja no cuenta como "toma suya".

## Elegir la toma donde mira a cámara (17 nov 2026, reel "Jeep 94")
Pablo: "elegir las tomas en donde salga viendo hacia la cámara, no hacia abajo". Graba varias tomas de cada frase y a veces baja la mirada para leer.
- Por cada frase, armar una tira de 8 cuadros de cada toma y elegir la que mira a la lente; anotarlo en la tabla de cortes.
- Si en ninguna toma mira a cámara, ese tramo no va a pantalla completa ni en tarjeta: cubrirlo con una escena gráfica o burbuja.
- La mirada se juzga en el recorte vertical, no en el cuadro horizontal entero.

## Video de referencia a pantalla completa (18 nov 2026, reel "Jeep 94")

Cuando Pablo trae un video de referencia (la persona de la historia, su demo), **el momento en que la presenta** ("Muhammad Zulali estaba teniendo problemas…") va con **su video a pantalla completa**, sin Pablo en cuadro: la persona sale hablando 2–3 s y luego la imagen de lo que Pablo narra (en "Jeep 94": Muhammad junto al Jeep → la tarjeta FAIL de la prueba). Pidió que este tipo de cambio de cámara se considere siempre: "si estoy dándote un video de referencia, por momentos lo puedes poner en full screen si vale la pena".

- Cortar al video **en la pausa antes del nombre**: Pablo dice el nombre ya sobre el video de la persona. Unos cuadros de él a cámara diciendo el nombre y luego el corte se sienten de más (Pablo, 17 nov 2026: "ese frame mío es innecesario"). La apertura debe seguir cumpliendo ≥6 s.
- Recorte vertical sin los subtítulos quemados del original (bajar la altura del recorte) y con la persona centrada; mismo tratamiento B/N del resto de clips, degradado abajo y un titular `.hb` que nombra a la persona y el problema.
- Revisar los últimos cuadros de cada trozo: se cuela el plano siguiente del original. Limitar el clip al último cuadro bueno y sostenerlo con un zoom lento.
- Crédito "VIDEO: NOMBRE" bajo el titular. El verificador no aplica el hueco titular–elemento a un video que llena el cuadro.
- Una o dos escenas así por reel; el resto de clips de referencia siguen en burbuja o tarjeta.

### Insertos con la voz de la persona, subtitulados (17 nov 2026)

Además de la presentación, Pablo aprobó **pausar su voz** para que la persona hable con su propio audio, subtitulado en español, cuando dice algo que Pablo solo puede contar: la prueba ("me faltaron cuatro meses" sobre la etiqueta 12/20/93) o la emoción ("me empecé a asustar" sobre el manómetro de la bomba).

- Leer la transcripción completa del video de referencia y buscar frases cortas (1.5–4 s) que sigan justo a lo que Pablo acaba de decir. Ofrecerlas con una hoja de cuadros antes de montarlas.
- Abrir el hueco en un silencio entre frases de Pablo; su voz NO se acelera (1.0x), se iguala en loudness a la de Pablo y deja ~0.1 s de aire antes de que Pablo siga.
- La imagen va a pantalla completa, con el plano que prueba lo que dice (no hace falta que sea la persona hablando). Hay que recortar encima de los subtítulos quemados y dejar el detalle clave (la fecha, la aguja) por encima del subtítulo propio.
- Plantilla: `assets/ejemplo-jeep94/insertos.py` + escena `sM` + `ubica(tf)` (`index_v5_insertos.html`). La voz que Pablo limpia no cambia: los insertos se aplican después sobre la voz limpia.
- Cuidar la regla de Pablo grande: un inserto junto a un tramo largo sin él lo alarga.
