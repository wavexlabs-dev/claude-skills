# Tipos de visual

Sintaxis exacta en `motor/reference.md`. Todos van en el panel de arriba del split (1080x880) o a pantalla completa.

| Tipo | Sintaxis en `edit.md` | Cuándo | Ejemplo |
|---|---|---|---|
| **Número** | `number: 1200 km² ; de selva revisados` | Un dato duro | Maya s16 |
| **Tarjeta** | `card: Título ; renglón ; renglón` | Explicar un concepto o una lista | Maya «LiDAR»; Dreaming: la misma tarjeta crece un renglón por escena (s13–s16) |
| **Recibo** | `receipt: broll/x.png mark x,y,w,h` | Captura de un documento con la línea clave marcada | INAH (Maya), notas de memoria (Dreaming), fuentes de Gmail (Kindle) |
| **Página** | `page: broll/article.png 0>420` | Artículo con scroll | Dreaming s03, Maya s26 |
| **Video** | `broll/x.mp4 @a-b zoom x,y,w>x,y,w hold` | Grabación de pantalla, video de la fuente, animación | Maya lidar3d, Kindle portadas |
| **Gráfico** | `graphic: broll/proceso.html` | Animación HyperFrames propia | Kindle «proceso» (`assets/plantillas/proceso.html`) |

## Conseguir los recibos
- Captura a 2x del artículo o documento (Playwright o el navegador), recorta a lo que importa, guarda en `broll/`.
- `mark x,y,w,h` en fracciones de la imagen: encierra solo la línea clave.
- Videos y figuras de la fuente: bájalos (en Dreaming, 16 figuras del artículo) y úsalos tal cual.

## Animaciones en código (recreaciones)
`assets/animacion/render.mjs` renderiza una página HTML cuadro por cuadro a MP4 (1080x880 por defecto):
la página expone `window.__ready` y `window.__frame(t)`; el script la sirve en local, la recorre a 30 fps con
Chromium (Playwright, WebGL por swiftshader) y la pasa a ffmpeg.
```
cd anim && npm i playwright three
CHROME_EXE=<chrome> PAGE=cueva.html node render.mjs fail 9 ../broll/cueva_fail.mp4
node render.mjs fail 9 out --stills 1,4,8     # cuadros sueltos para revisar
```
Ejemplos en `assets/animacion/ejemplos/`: `cueva.html` (Dreaming: el agente intentando cruzar la cueva, modos
fail/win), `kindle.html` (Kindle 3D con three.js; necesita su `kindle.glb` y las portadas del proyecto),
`equipo.html`. `shot.mjs` toma un PNG transparente de un elemento (para rótulos como `etiqueta_ia.html`).

## Imágenes y video con IA
Con Sume, solo si no hay material real y Pablo lo aprueba (cotiza antes). Para él mismo, usa sus fotos de
referencia de `marca-pablo-video/assets/pablo/` solo con su consentimiento; prefiere siempre su toma real.
Rótulo obligatorio: «Recreación hecha con IA».
