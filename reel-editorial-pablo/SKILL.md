---
name: reel-editorial-pablo
description: Estilo de edición propio de Pablo Paredes para reels y TikToks (9:16), hecho en código — él hablando a cámara alternando con escenas de imagen en la identidad "Post-Digital Editorial B2" (Ink, azul, Paper, naranja; Space Grotesk; recortes en blanco y negro sobre fondos sólidos, muros oscuros y figuras isométricas), con layouts de cámara medidos (mitad y burbuja), un sistema de fondos, sonido donde solo suena lo que tiene cuerpo y revisión medida antes de entregar. This skill should be used whenever Pablo asks for a reel, TikTok, short or vertical clip for his personal brand in "el estilo editorial", "el estilo de los reels", "como la prueba C" or "como el explainer", when he drops a talking-head clip and wants scenes cut into it, when he wants an animated explainer of an article in this look, or when he asks to add or fix music and sound effects on one of these pieces.
---

# Reel editorial de Pablo (v0.4 · 17 nov 2026)

Produce reels 9:16 (1080×1920, 30 fps) en una identidad fija, renderizados cuadro por cuadro desde una página HTML. Hay dos formatos:

- **A · Cámara + escenas (el formato principal).** Pablo habla a cámara y su toma comparte la pantalla con escenas de imagen. Referencia: `assets/ejemplo-camara/` (ver `resultado.mp4`).
- **B · Explainer sin cámara.** Solo tipografía, recortes y figuras. Sirve como base de pruebas y para piezas sin toma; solo, se siente plano. Referencia: `assets/ejemplo-explainer/` (ver `resultado.mp4`).

Estado: primera versión. Al final hay una lista de lo que está probado y lo que no; decirlo en cada entrega.

## Antes de empezar

0. **Leer `references/preferencias.md` completo.** Junta todas las reglas que Pablo dio (cortes, 1.2x, tomas mirando a cámara, video de referencia, subtítulos, composición, sonido, proceso). No depende de la memoria de ningún chat.
1. Cargar también `marca-pablo-video` (Cody, voz, regla de costos). **En paleta, tipografía y piezas gráficas manda esta skill**, no el "Nocturno morado" de aquella.
2. Leer `references/identidad.md`, `references/fondos.md` y `references/recursos.md` completos. Son cortos y contienen los errores que Pablo ya rechazó.
3. Abrir los dos `resultado.mp4` de ejemplo (o sus `index.html`) antes de diseñar nada.
4. **Cualquier generación con IA (imágenes, música, efectos) se cotiza y se pide permiso antes.** Nunca generar sin un sí.
5. Esto es una **biblioteca**: un recurso nuevo se suma a los aprobados, no los reemplaza. No abandonar lo que ya funciona al probar algo.

## Flujo

### 1. Guion de escenas (mostrarlo antes de construir)
- Formato A: transcribir el tramo con marcas por palabra:
  `mlx_whisper <video> --model mlx-community/whisper-small-mlx --word-timestamps True --output-format json`
  Elegir 15–45 s. Revisar a mano los finales de palabra: whisper los recorta.
- Formato B: leer la fuente y escribir una **hoja de hechos**: cada frase y cifra que saldrá en pantalla junto a la frase de origen. Nada entra al video si no está en esa hoja. Modelo: `assets/ejemplo-explainer/GUION.md`.
- Escribir una tabla: tiempo · qué se dice · layout de cámara · fondo · elemento principal · titular · movimiento. Cada escena lleva **un fondo, un elemento principal y un bloque de texto**.
- El primer cuadro es la portada: titular completo, sostenido 0.2 s.
- **Proponer recursos para ejemplificar** (`references/recursos.md`): marcar los 1–3 momentos que más ganan con un ejemplo visual y ofrecer dos opciones para cada uno (pixel art, figura Hairline, motion graphic de datos, interfaz simulada, imagen o clip con IA cotizado…), con un cuadro fijo antes de animar. El recurso entra, ejemplifica y se regresa al formato base: ese contraste es lo valioso.
- **Estrenar al menos dos fondos** que el reel anterior no usó (F12–F20 en `references/fondos.md`).
- **Contar antes de construir**, en la misma tabla: segundos con Pablo grande (≥50 %, y la apertura es suya a pantalla completa), familias de fondo (≥5 en 60 s, con un naranja) y el hueco titular–elemento de cada escena gráfica (90–140 px).
- **Velocidad: siempre 1.2x** (regla general de Pablo, 17 nov 2026: "siento que hablo muy lento y ese 1.2 le da feeling"). No se pregunta. **~0.2 s entre frases** (a 0.12 s se sintió atropellado) y **ningún corte sobre una palabra**: medir la energía de cada corte. De varias tomas, la que mira a la lente. Orden: cerrar el corte y verificarlo transcribiendo la voz cortada → mandarle la voz a 1.2x para Adobe Podcast → montarla. Modelo de corte con varias tomas: `assets/ejemplo-jeep94/prep.py`.
- Si hay video de referencia: la persona entra **a pantalla completa** al presentarla, con el corte en la pausa antes del nombre (`references/camara.md`).
- **Subtítulos desde la V1:** grandes en el gancho y en píldora Ink en todo lo demás (`references/camara.md`, sección Subtítulos).
- Preguntar al inicio: resolución (1080 o 4K), si trae voz limpia aparte y cómo se entrega.
- Enseñar la tabla a Pablo y esperar su visto bueno si hay algo que generar o pagar.

### 2. Toma real (solo formato A)
- `scripts/toma.sh <video> <inicio> <duración>` extrae cuadros a `pablo/` y la voz a `out/voz.wav`.
- Medir la cara en `out/medir_*.jpg` y pasarla a `scripts/layout.py`. Imprime los recortes de cada layout y avisa cuál corta la cabeza. Detalle y reglas en `references/camara.md`.
- Enseñar un cuadro fijo de cada layout antes de animar.

### 3. Material
- Primero material real de la fuente (fotos, diagramas, capturas), pasado a blanco y negro y recortado. Dar crédito en pantalla y avisar a Pablo que confirme el permiso de uso.
- Si hay que generar un objeto: pedirlo sobre verde croma y recortarlo con `scripts/key.py entrada.png salida.png`.
- Texturas de muro: `assets/texturas/`. Sonidos ya medidos: `assets/sonidos/`.
- Figura isométrica de una línea (Hairline): solo cuando hay que mostrar un mecanismo que una imagen fija no explica. Máximo una por pieza. Ver `references/fondos.md` (F10) y `draw7` en el ejemplo del explainer.

### 4. Página
- Copiar el ejemplo más cercano a la carpeta del proyecto y editarlo. La página declara `const FPS=30, DUR=…` y expone `window.render(t)`.
- **Todo es función pura del tiempo `t`.** Sin animaciones CSS, sin `setTimeout`, sin estado entre cuadros.
- **La página expone `window.ESTADO(t)`** → `{id, camara, fondo, titular, elemento}` para que el verificador pueda medirla (contrato en `scripts/verificar.mjs`; modelo al final de `assets/ejemplo-3d/index.html`). Sin eso no hay verificación automática.
- Nombrar los tiempos con las palabras de la voz (`T.archivo=2.15`) en lugar de números sueltos.
- Todo lo importante dentro de y=280–1640.

### 5. Render
- En el proyecto: `npm i playwright-core`, copiar `scripts/render.mjs` ahí.
- `node render.mjs 0 3.5 9.48` saca cuadros sueltos a `out/`. **Mirarlos antes del render largo**, sobre todo los cuadros de cada cambio.
- `node render.mjs` saca todos los cuadros a `frames/`. Tarda minutos: correrlo en segundo plano.

### 6. Sonido
- Leer `references/sonido.md`. Regla: **solo suena lo que tiene cuerpo**. Un corte, un cambio de fondo o de layout no suena.
- Escribir `mezcla.json` (modelo: `assets/ejemplo-explainer/mezcla.json`) y correr `python3 scripts/mezcla.py mezcla.json`. Calibra cada efecto contra la música, mantiene la voz 10 dB arriba y lista avisos. Atender todos los avisos.
- Unir: `scripts/armar.sh out/mix.wav out/reel-v1.mp4`.

### 7. Revisión antes de enviar (obligatoria desde la V1; Pablo la autorizó el 16 nov 2026)
**Pablo no ve ninguna versión, ni la primera, antes de estos dos pasos.**
- **Verificador:** `python3 scripts/verificar.py --html index.html --voz out/voz.wav --video out/reel-v1.mp4`. Mide apertura, tiempo con Pablo grande, fondos, hueco titular–elemento, renders recortados, voz y volumen, y termina en PASA o NO PASA. Si no pasa, corregir y volver a correrlo. Solo se entrega con un NO PASA si se le dice a Pablo cuál regla y por qué.
- **Crítico a ciegas, siempre:** abrir un subagente `general-purpose` con el encargo de `references/revision.md`. Pablo dio autorización permanente para abrir este subagente en cada versión; no hace falta volver a preguntar. Verificar cada hallazgo antes de corregirlo.
- En la entrega, pegar el resultado del verificador y los hallazgos confirmados del crítico.
- `python3 scripts/revisar.py out/reel-v1.mp4`, y **mirar todas las hojas de contacto** con la lista de `references/revision.md`.
- En piezas de más de 20 s o primeras versiones: crítico a ciegas (prompt en `references/revision.md`). Verificar cada hallazgo antes de corregirlo.

### 8. Entrega
- Enviar el video. Decir qué se midió, qué encontró el crítico y **qué falta oír**: Claude no oye; el timbre lo juzga Pablo.
- Anotar la ronda en una `BITACORA.md` del proyecto: hallazgo, corrección, números de antes y después.

## Reglas que no se rompen

1. Un fondo, un elemento principal, un bloque de texto por escena.
2. Solo sans serif. Una familia por titular; el énfasis es una palabra en naranja. Nunca manuscrita ni serif.
3. Pablo siempre a color. Los recortes, siempre en blanco y negro.
4. La cara nunca se corta: medirla, no estimarla.
5. Máximo 2–3 cambios de layout en 15 s, cada uno con motivo (un cambio de idea o un corte de la toma).
6. Cada idea nueva cambia de fondo; nunca el mismo dos veces seguidas; el círculo, una vez por reel como mucho.
7. Cortes directos o una cortina de 0.36 s. Sin paneles de textura, sin zooms decorativos.
8. Nada de "rayita + etiqueta sobre el titular", fotos en tarjeta con pie, perillas de interfaz ni stickers: se lee como plantilla de IA.
9. Los cortes no suenan. Un acento sonoro por pieza.
10. Ningún tramo quieto de 0.5 s o más.
11. El titular y su elemento son un bloque: 90–140 px entre ellos, nunca un hueco en medio.
12. Abre Pablo a pantalla completa; se le ve grande al menos la mitad del tiempo; nunca dos gráficos con burbuja seguidos.
13. Variedad de fondo que se note: al menos cinco familias visuales por minuto, con un golpe naranja.

## Recursos

| Archivo | Para qué |
|---|---|
| `references/preferencias.md` | **Todas las reglas de Pablo en un solo lugar (leer primero)** |
| `references/identidad.md` | Paleta, tipografía, marco, tamaños, lo que Pablo rechazó |
| `references/fondos.md` | Catálogo F1–F11, fondos nuevos por probar F12–F20 y sus reglas |
| `references/recursos.md` | Caja de herramientas para ejemplificar (pixel art, Hairline, motion graphics, IA), fluidez e historial por reel |
| `references/camara.md` | Layouts de la toma, medición de la cara, cambios |
| `references/sonido.md` | Método de sonido, capas, niveles, evaluación sin oír |
| `references/revision.md` | Lista de revisión y prompt del crítico |
| `references/aprendizajes.md` | Qué falló en cada ronda y por qué; pendientes |
| `scripts/toma.sh` · `layout.py` · `key.py` | Preparar toma, recortes de cámara, recortes de croma |
| `scripts/render.mjs` · `armar.sh` | Render cuadro por cuadro y unión con audio |
| `scripts/mezcla.py` · `revisar.py` | Mezcla calibrada y revisión medida |
| `scripts/piezas.py` | Encuentra falsos arranques repetidos en la voz, trozo por trozo (correr antes de mandar la voz a limpiar) |
| `scripts/verificar.py` · `verificar.mjs` | Verificador automático PASA / NO PASA de las reglas medibles |
| `assets/ejemplo-camara/` · `assets/ejemplo-explainer/` | Páginas completas que funcionan, con su resultado |
| `assets/ejemplo-3d/` | Objeto real modelado en Blender desde fotos y usado en el reel; cortes, 1.2x, 4K y luz (leer su LEEME) |
| `assets/modulos/` · `scripts/range.mjs` | Pixel art y subtítulos reutilizables; render por rangos |
| `assets/texturas/` · `assets/sonidos/` | Muros y biblioteca de sonidos por material |

## Qué está probado y qué no (v0.4)

**Probado y aprobado por Pablo:** identidad B2; layouts mitad y burbuja con toma horizontal; fondos F1–F5 y F9; movimiento de la prueba C; explainer de 44 s con F6, F8 y F10; reel Dreaming v6 (67 s, toma vertical en tarjeta, voz externa a 1.2x, pixel art F11 con subtítulos) — "quedó muy bien". **Reel "Jeep 94"** (64.8 s, final del 17 nov 2026): corte multitoma con `prep.py` a 1.2x y ~0.2 s entre frases; video de referencia a pantalla completa; subtítulos en píldora en todo el reel; voz limpia de Adobe Podcast montada encima. Proyecto en `Documents/Personal Brand/Jeep 94/`, con su `BITACORA.md`.

**Hecho pero sin aprobar todavía:** el método de sonido (Pablo no ha confirmado la mezcla v4); la mezcla con voz (el script corre con su voz real, nadie la ha oído).

**Sin probar:** F7 (barra sobre foto); fondos F12–F20; recursos R5, R6, R8 y R10; cortar sobre el pulso de la música; pantalla completa con toma vertical en esta identidad; una pieza larga de formato A con sonido.

**Decisiones abiertas de Pablo:** el marco "Pablo / Paredes_" está en y=96, bajo la interfaz de Reels (¿bajarlo a y≥280?); llamado a la acción de cierre; si usar un modelo que oiga como segundo juez de audio.
