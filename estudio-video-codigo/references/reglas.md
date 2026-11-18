# Reglas aprendidas

Cada una salió de un error real o de una corrección de dirección. Leerlas antes de construir o editar escenas,
y copiar al `CLAUDE.md` del proyecto las que apliquen. Agregar las nuevas con fecha.

## Dirección y composición
- El titular a cuadro completo no pasa del 90 % del ancho.
- Una escena que sale debe estar casi fuera antes de que la siguiente cruce su zona; nada se encima a medio fade.
- Entre escenas no hay cuadros vacíos: la siguiente entra con overlap mientras la anterior sale.
- Las escenas se conectan con cámara continua (`pushOut`/`pushIn` de fx.ts), no con fades sueltos.
- Un elemento que hereda la siguiente escena aparece solo cuando el texto ya salió; nunca encima.
- Un gesto tipográfico (tracking, color) se empuja hasta que sea inequívoco; a medias parece bug.
- En videos para móvil, la interacción se muestra con toques (anillo), nunca con puntero de escritorio.
- Una cifra en pantalla aparece cuando la voz la dice, no al llegar a la escena. Un golpe "×N" muestra antes su base real,
  y la cifra final llega completa en el frame del golpe (un conteo intermedio pone cifras falsas junto a su etiqueta).
- Un solo número por golpe: si el producto ya dibuja la misma cifra, se oculta hasta que el golpe regrese a ella.
- El cierre invita a actuar: URL grande, botón del producto al doble, y la UI de progreso llena; no un "reinicio".
- No alternar familias tipográficas (serif itálica + sans) dentro de un mismo título o rótulo: se lee como plantilla de IA.
  Una sola familia; el énfasis, si hace falta, es de color y en una sola palabra que sea el punto (2026-11-07).
- Menos highlights: un título de capítulo no lleva palabra resaltada; solo se resalta lo que el espectador debe retener (2026-11-07).
- Sobre metraje de una persona a cámara, ningún gráfico toca la zona de la cara (incluido el plano cerrado): definir una
  columna lateral libre medida sobre el cuadro real y forzar plano medio mientras haya gráfico (2026-11-08).
- Un dibujo figurativo se valida por sus rasgos distintivos: si se puede confundir con otra cosa (pulpo → medusa), le
  faltan rasgos, no tamaño (2026-11-08).
- En grabaciones de pantalla, difuminar solo la línea exacta del dato sensible (folio, tarjeta, contraseña) y preguntar al
  dueño qué considera sensible antes de tapar más: un difuminado amplio esconde justo lo que el video enseña (2026-11-08).
- La regla "ningún hold quieto" no aplica a metraje real con movimiento propio (pantalla grabada, cámara): un acercamiento
  por toma en tomas cortas reinicia en cada corte y se siente como un zoom que va y viene sin foco (2026-11-08).
- En tutoriales que alternan pantalla y cámara, el corte a cámara solo cae donde la voz no señala la pantalla ("aquí",
  "miren", "le doy clic") y la app está quieta ±1 s; si no, el espectador oye la acción y no la ve (2026-11-08).
- La etiqueta honesta ("Escena imaginada", "Concepto") va pegada al sujeto que califica, no en una esquina.

## Movimiento y tiempo
- Ningún hold queda quieto: si un tramo pasa 0.5 s sin cambio, agrega drift o push-in. Verificar con freezedetect.
- Las derivas lentas de cámara van a velocidad constante: con ease, al frenar bajan de 1 px por frame y congelan.
- Cambios de color entre tonos lejanos son rápidos (≤0.2 s); interpolados lento pasan por tonos lodosos.
- Cortes duros y golpes caen en su frame: `tl.set`, no tweens con `steps(1)` (llegan 1–2 frames tarde).
- Una sacudida se aplica a lo que golpea, no a la capa que oscurece el fondo (deja ver tiras de fondo en los bordes).

## GSAP y DOM
- Nunca centrar con `transform: translate(-50%)` en un elemento que GSAP anima: centrar con flex.
- En `fromTo`, toda propiedad del `from` también va en el `to`.
- Un `fromTo` que empieza después del inicio de la escena lleva `immediateRender: false`.
- El motor solo prende y apaga capas con `visibility`; la opacidad de la capa es de la escena.
- La máscara de un texto chico dentro de uno grande necesita su propio font-size.
- Texto que se escribe letra por letra: cada carácter en su propio span con `visibility`; con dos spans (visible/oculto)
  el salto de línea cambia mientras se escribe.
- Sin transformaciones (scale) en HUD ni en textos que cambian: Chromium deja restos de píxeles al repintar.
  Las etiquetas que cambian van en cajas de ancho fijo con fondo opaco y margen arriba.
- Una capa con un elemento gigante (golpe a cuadro completo) va debajo del HUD y con `overflow: hidden`.
- Un elemento con transform crea su propio contexto: un hijo con `z-index: -1` no pasa detrás de su fondo.
  Lo que debe ir detrás (chispas) va en un contenedor hermano anterior.

## Render
- Un producto web DOM (no canvas) se muestra en un iframe visible con su estado fijado por frame (`eval` de sus funciones);
  scroll entero + resto fraccional como translateY del iframe, o las derivas lentas saltan de 2 en 2 px (2026-11-14).
- Un anillo de toque o pulso calculado sobre el sitio dura menos que el tramo hasta el siguiente scroll y no se dibuja
  sobre un diálogo abierto: si no, viaja con la página y sale del teléfono (2026-11-14).
- Toda promesa registrada con `whenReady` rechaza ante un error; si no, el render se cuelga en vez de fallar.
- Al parchar código con `String.replace`, el reemplazo va como función (`() => "..."`): `$'` y `$&` son patrones.
- Un iframe auxiliar va fuera de cuadro (left −30000px, visibility hidden), no con opacity 0: su texto se cuela.

## Audio
- Los sfx sintetizados pueden sonar "de computadora" para foley de interfaz: si la persona los rechaza, pasar a pocas
  tomas reales (ElevenLabs, 1 toma cada una, ~2–8 créditos) y derivar variantes de altura con ffmpeg (2026-11-14).
- El audio en código es el camino por defecto: música progresiva y sfx sintetizados no piden cuenta ni gastan créditos.
  Para voz se recomienda ElevenLabs o la voz grabada de la persona; nunca voces sintéticas del sistema: suenan mal (2026-11-07).
- La voz real dura más de lo calculado por palabras: generar una línea de prueba y medir antes de fijar guion y tiempos.
- La música va a volumen fijo todo el video (`MUSIC_GAIN`). Nada de ducking ni curvas por tramos: se oye raro.
- La voz va ≥9 dB sobre la música en cada línea, ajustando solo el volumen fijo; se mide con stems.
- La música generada puede ignorar la estructura del prompt: medir su energía por tramos antes de confiar en ella.
- Los sfx generados se miden antes de usarse: un "tick" puede traer varios golpes y un "click" puede ser casi inaudible.
  Se conserva solo el primer impacto.
- La presencia de un sfx se mide contra la mediana del fondo (±1 s), no contra el instante anterior.
- Los sfx van solo en acciones reales y cambios de escena; el texto que entra no suena. Un video de 30 s lleva ~20 cues.
- Los sfx son foley ligado al objeto en pantalla (en un juego, sonidos del juego); nada de sonidos genéricos de UI.
  Un sonido distinto por tipo de acción; si se repite, alternar dos tomas. Dos sfx a menos de 0.3 s se empastan.
- En ffmpeg, no mandar una rama de `asplit` a `anullsink`: corta el grafo antes de tiempo.

## Formatos
- El 9:16 se recompone, no se recorta. Las zonas de interfaz (arriba ~230 px, abajo ~420 px) llevan fondo del mundo
  (cielo, subsuelo con textura), nunca franjas negras ni color plano muestreado (cambia con la escena y da destellos).
- Las etiquetas del HUD pueden acortarse en 9:16, pero la cronología no puede depender solo de ellas.
