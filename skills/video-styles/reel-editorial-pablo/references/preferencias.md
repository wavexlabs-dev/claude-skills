# Preferencias de Pablo (todas las reglas que dio, en un solo lugar)

Este archivo junta todo lo que Pablo pidió o corrigió en las sesiones del 11 al 17 nov 2026. Leerlo **completo antes de empezar cualquier reel**. Cada regla lleva su fecha y, cuando la hay, su frase. El detalle de cómo aplicarla está en el archivo indicado.

## Formato y cámara
- **Su formato clave es él a cámara, alternando con escenas de imagen.** Un video de puro motion sin él lo siente plano. Los explainers sin cámara sirven de prueba, no como formato final (11 nov).
- **Abre él a pantalla completa** y se le ve grande (completa o tarjeta) **≥50 % del tiempo**. Nunca dos gráficos con burbuja seguidos (13–14 nov: "abusaste de las tomas animadas donde yo salía en el cuadro chiquito"). Si un cambio baja el porcentaje, subir otra escena de burbuja a tarjeta.
- Su cara rota entre pantalla completa, mitad inferior y burbuja/tarjeta, cada pocos segundos, siempre con motivo. Nunca cortarle la cara: medirla sobre el cuadro real. Ver `camara.md`.
- **Tomas mirando a la lente.** Entre varias tomas de una frase, elegir la que mira a cámara aunque otra suene mejor. Si ninguna mira, cubrir ese tramo con gráfico o burbuja (17 nov). Ver `camara.md`.
- Él siempre a color; los recortes, en blanco y negro.
- No poner imágenes de adorno detrás de sus tomas.

## Corte y voz
- **Todo a 1.2x**, sin preguntar (17 nov: "siento que hablo muy lento y ese 1.2 le da un poquito de feeling").
- **Unos 0.2 s entre frases**, ya a 1.2x. A ~0.12 s se sintió "muy acelerado y mal cortado". Con pausas de 0.3–0.6 s, "siento que dejas huecos" (11 y 17 nov).
- **Nunca cortar una palabra.** Medir la energía de cada corte: los últimos 30 ms deben quedar bajo −40 dB y los siguientes 80 ms sin voz. Si hay duda, transcribir cada lado del corte por separado. Dejar ~0.12 s de aire antes de cada frase. Ver `camara.md` y `revision.md`.
- Quitar repeticiones y falsos arranques (`scripts/piezas.py`) y verificar transcribiendo la voz ya cortada.
- **Voz limpia:** cerrar el corte, mandarle la voz cortada a 1.2x para que la limpie en Adobe Podcast sin cambiarle la duración y montarla encima. Si el corte cambia después, avisarle que el audio anterior ya no sirve. Al recibirla:
  - Comprobar la sincronía por correlación contra la voz cortada; en "Jeep 94" el desfase fue 0 ms.
  - Nivelar con highpass 70 Hz, ganancia hasta ~−17 LUFS y limitador.
  - Volver a mezclar.

## Video de referencia (la persona de la historia)
- **Al presentar a la persona, su video va a pantalla completa** mientras Pablo narra: ella hablando 2–3 s y luego la imagen de lo que cuenta. "Si estoy dándote un video de referencia, por momentos lo puedes poner en full screen si vale la pena" (17 nov).
- **El corte al video va en la pausa antes del nombre**, no después de unos cuadros de él diciéndolo ("ese frame mío es innecesario").
- Opcional, a ofrecer con hoja de cuadros: insertos donde su voz se pausa y la persona habla con su audio, subtitulado en español. Probado en la V5 de "Jeep 94", pero Pablo se quedó con la versión sin ellos. Ver `camara.md`.
- Dar crédito en pantalla ("VIDEO: NOMBRE") y confirmar el permiso de uso.

## Subtítulos
- **Subtítulos en todo el reel, desde la V1** (17 nov: comparó con y sin y eligió con). El gancho lleva subtítulos grandes; el resto va en una píldora Ink abajo, de 2–3 palabras, con la palabra dicha en naranja. Corregir nombres y errores de transcripción. Ver `camara.md`.

## Composición e identidad
- Identidad "Post-Digital Editorial B2": Ink, Blue, Paper, Orange y Slate; Space Grotesk 700 en titulares, con punto final y la palabra clave en naranja; IBM Plex Mono para datos y marco. Ver `identidad.md`.
- **Un fondo, un elemento principal y un bloque de texto por escena.** Nada de texturas apiladas ni etiquetas y píldoras repartidas (11 nov: "no se logra saber a qué prestarle atención").
- **Rechazado por verse "hecho con IA":**
  - manuscrita, serif, o dos estilos de fuente en un titular;
  - "rayita + etiqueta mono sobre el titular";
  - fotos en tarjeta con pie;
  - perillas de UI y stickers.
- **Titular y elemento juntos**, a 90–140 px; el elemento se coloca respecto del final del titular, no en una coordenada fija (14 nov).
- **Variedad de fondos que se note:** al menos cinco familias por minuto, con un golpe naranja. El círculo, máximo una vez por reel. Estrenar fondos que el reel anterior no usó. Ver `fondos.md`.
- Cortes directos; nada de transiciones decorativas.

## Recursos especiales
- En cada reel, proponer 1–3 momentos con un recurso especial (pixel art, Hairline, motion graphic, IA cotizada). Para cada uno, dos opciones con un cuadro fijo antes de animar. El recurso entra, ejemplifica y se **regresa al formato base**: "eso es lo valioso, no al revés" (12 nov). Ver `recursos.md`.
- Es una biblioteca: lo nuevo se suma a lo aprobado. No rehacer lo que ya aprobó ni ofrecer versiones nuevas de un video aprobado cuando pregunta qué mejorar.

## Sonido
- Nada de whooshes ni sonidos de transición, que le suenan "robotizados". Solo suena un objeto que se ve y se mueve; los cortes los marca la música. Un acento por pieza. Ver `sonido.md`.
- Claude no oye: decir siempre qué falta oír y dejar que él juzgue el timbre.

## Proceso
- **Antes de enseñar cualquier versión, desde la V1:**
  - correr `scripts/verificar.py`;
  - abrir un subagente crítico a ciegas (`revision.md`). Tiene autorización permanente para ese fin, solo para ese fin (16 nov).
  - Entregar con NO PASA solo si se dice qué regla no pasa y por qué.
- Leer también `reglas-heredadas.md` antes de diseñar: junta lo que aplica de las skills hermanas (`estudio-video-codigo`, `video-largo-y-teaser`, `html-reel`, `marca-pablo-video`).

  Él notó que "vamos para atrás" cuando se repitieron errores ya documentados (11 nov).
- Cotizar y pedir permiso antes de cualquier generación con IA.
- Entregar en la carpeta local del proyecto (no en Drive) y decirle dónde quedó. Para el archivo de subir, ofrecer un export a ~10 Mbps; el de 3 Mbps es solo para enviarlo por el chat.
- Cada corrección nueva de Pablo se escribe en esta skill (aquí y en el archivo de detalle), no solo en la conversación.
