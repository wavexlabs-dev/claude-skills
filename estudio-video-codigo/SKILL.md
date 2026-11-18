---
name: estudio-video-codigo
description: Produce videos animados terminados (producto, explainer, showreel, lanzamiento) escritos en código, de punta a punta, con un motor propio (escenas TypeScript + GSAP, render cuadro por cuadro con Playwright y FFmpeg), música progresiva y sfx sintetizados en código (gratis, sin cuentas ni API keys), voz con ElevenLabs (recomendada) o grabada por la persona, y un crítico nuevo que revisa cada render. Incluye la plantilla del motor lista para copiar, la técnica para mostrar un producto web real dibujado cuadro por cuadro, la mezcla y medición de audio, y las reglas aprendidas de videos anteriores. This skill should be used when someone wants a video made in code, a product or launch video from a website, a 16:9 + 9:16 animated promo, or to turn a site (including canvas or pixel-art sites) into a video, even if they only paste a URL or a launch post.
---

# Estudio de video en código

Dirigir, animar, musicalizar y revisar un video terminado, todo en código y en una sola línea de tiempo.
Un video sin bugs no está terminado: está terminado cuando aguanta al lado del mejor trabajo del género.

## Antes de empezar
- Herramientas: `node`, `npm`, `ffmpeg` y `ffprobe`. Nada más es obligatorio: música y sfx se sintetizan en código.
  Para voz se recomienda ElevenLabs (conector en Claude); la alternativa es que la persona grabe su voz.
  No ofrecer voces sintéticas del sistema (`say`, `espeak`): suenan mal y bajan el video.
  Nunca pedir ni manejar API keys en el chat.
- Crear el proyecto desde la plantilla: `bash <esta-skill>/scripts/nuevo-proyecto.sh <carpeta>`.
  Copia `assets/template/` (motor, render, mezcla, brief), instala dependencias y Chromium, y corre el typecheck.
  Probar el motor con `npm run render -- --no-audio` (dos escenas de ejemplo, ~5 s) antes del trabajo real.
- Leer `references/reglas.md` y copiar al `CLAUDE.md` del proyecto las reglas que apliquen.
- Llevar la lista de tareas visible y entregar con la herramienta de archivos, no solo con rutas.

## Proceso (◆ = parada de aprobación si la persona eligió "con paradas")

### 1. Intake
Revisar primero lo que la persona ya dio (mensaje, archivos, un post de lanzamiento). Preguntar solo lo que falte,
en rondas cortas con AskUserQuestion: modo (product / explainer / showreel / launch-story), duración y formatos,
sonido (voz + música + sfx / música + sfx / silencioso), música y sfx (en código, por defecto y gratis / ElevenLabs /
sus propios archivos), autonomía (con paradas / sin parar), marca y assets (capturar en vivo / archivos / todo en código),
y si hay voz: ElevenLabs (recomendada: proponer dos voces / una que nombre / su voz clonada) o la graba la persona.
Si quiere voz y no tiene ElevenLabs, recomendarlo y ofrecer conectarlo; si no, grabarla, o un video sin voz.
Lo abierto (URL, espectador, estado final, facts, estilo, firma) va en un solo mensaje con ejemplos.
Lo que deje en blanco se decide y se anota en brief.md con su razón.

### 2. Producto, facts y brief ◆
- Capturar el producto real: HTML, screenshots 2×, colores y fuentes de su CSS, logo como SVG. Nunca redibujar un logo.
  Si es una web animada, seguir `references/producto-en-vivo.md` desde aquí.
- `brief/facts.json`: cada afirmación con su frase de origen y su fuente. Ninguna cifra fuera de ahí; lo que el
  producto ya cita cuenta como fuente. Revisar afirmaciones del pedido contra el producto y decir si no cuadran.
- `brief/brief.md` con concepto (2–3 direcciones, la elegida, tres momentos firma) y restricciones
  (p. ej. proyecto editorial: sin logos ajenos ni nada que parezca oficial).
- Mostrar brief, concepto y un borrador del guion.

### 3. Storyboard, style frames y voz ◆
- `brief/storyboard.md`: tiempo, en pantalla, propósito, voz, sonido, qué sale y qué hereda. Debe leerse sin sonido.
- Tres style frames renderizados en código (los dos formatos) con los componentes reales de la marca.
  Mirarlos y corregir colisiones antes de mostrarlos.
- Una línea de prueba de voz (dos voces de ElevenLabs con la misma línea, o una grabación de la persona). Medir la
  duración real y recortar el guion.
- Si se usa un servicio de pago: avisar el costo antes de cada generación y pedir permiso si supera lo anticipado.

### 4. Audio primero ◆
Seguir `references/audio.md`: música progresiva (`npm run music`) y sfx (`npm run sfx`) en código salvo que se haya
elegido otra fuente (`references/audio-en-codigo.md`); voz por líneas con ElevenLabs (`references/elevenlabs.md`) o grabada; elegir tomas midiendo; ubicar las palabras
clave; escribir `brief/timing.json`; `npm run audio-preview` y `npx tsx render/stems.ts`; mandar la mezcla para que
la persona la escuche. Claude no oye: el juicio del audio es de la persona.

### 5. Construir
- Tokens de marca en `src/tokens.ts`, posiciones compartidas en un `layout.ts`, una escena por archivo, el video en
  `src/storyboard.ts` con tiempos tomados de `timing.json`. Capas largas (HUD, diálogo) con `dur = total` y `overlap = total`.
- Después de cada cambio: `npm run typecheck` y `npm run frames` de la zona tocada, en los dos formatos; mirarlos
  a resolución completa (zoom con ffmpeg `crop` + `scale=…:flags=neighbor` para detalles).
- `npm run render` y `-- --format 9x16`, luego `npm run measure`. Sin congelados ≥0.5 s.

### 6. Crítico nuevo, hasta "ship"
Lanzar un subagente nuevo por render completo con el prompt de `references/critico.md`. Verificar cada hallazgo en
el frame, corregir lo más grande primero, re-renderizar, medir y lanzar otro crítico. Lo que cambie guion, voz o una
decisión de la persona se le pregunta. Registrar cada ronda en `brief/ledger.md` con números de antes y después.

### 7. Entrega ◆
MP4 por formato, versión solo música, contact sheets, brief, facts, timing, ledger y una nota con lo que todavía
debe revisar un humano (sobre todo el audio). Agregar al `CLAUDE.md` del proyecto, y a `references/reglas.md` de la
skill si es general, cada corrección de dirección nueva como regla corta con fecha.

## Quality bar
- Duración, tamaño y fps exactos; frame uno terminado; ningún tramo quieto ≥0.5 s (freezedetect).
- Cortes y golpes a ≤1 frame de su sonido; cifras que llegan con la voz y completas en su golpe.
- Texto legible, sin colisiones, dentro de márgenes; en 9:16 nada importante en las zonas de interfaz.
- −14 a −15 LUFS, pico ≤ −1 dBTP, voz ≥9 dB sobre la música en cada línea.
- Se entiende sin sonido. Toda palabra rastreable a facts.json; nada inventado; lo imaginado, etiquetado.

## Recursos
- `assets/template/` — el motor completo (ver su `CLAUDE.md` para comandos y estructura).
- `scripts/nuevo-proyecto.sh` — crea un proyecto desde la plantilla. `scripts/descargar-eleven.sh` — baja tomas del
  conector de ElevenLabs (opcional).
- `references/reglas.md` — reglas aprendidas (dirección, movimiento, GSAP/DOM, render, audio, formatos).
- `references/audio.md` — orden de trabajo del audio, mezcla y mediciones.
- `references/audio-en-codigo.md` — música progresiva y sfx sintetizados (el camino por defecto).
- `references/elevenlabs.md` — voz (recomendada) y, si se quiere, música y sfx: parámetros, costos, voces y descarga.
- `references/producto-en-vivo.md` — mostrar una web real (canvas) cuadro por cuadro con reloj controlado.
- `references/critico.md` — prompt del crítico nuevo y qué hacer con su reporte.
