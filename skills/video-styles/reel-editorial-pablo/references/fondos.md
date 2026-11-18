# Sistema de fondos

El fondo cambia con la idea. El cambio de fondo **es** el movimiento de la pieza.

## Catálogo
| # | Fondo | Cómo es | Para qué idea | Texto | Estado |
|---|---|---|---|---|---|
| F1 | Paper sólido | #F5F4EF plano con grano | Definiciones, la frase que abre, datos, cierre | Ink; clave en naranja | Aprobado |
| F2 | Azul sólido | #1D2DFF plano | El objeto; lo que hace o guarda la máquina | Paper | Aprobado |
| F3 | Muro oscuro | Textura de muro en grises, `brightness(.26–.3) contrast(1.1) grayscale(1)`, a sangre | Detalle, problema, límites, lo "sucio" del mundo real | Paper; clave en naranja | Aprobado |
| F4 | Ink + círculo | Ink con un círculo pleno naranja o azul detrás del recorte | Una imagen-héroe, un paisaje | Paper | Aprobado. **Una vez por reel como mucho** |
| F5 | Ink + plano | Ink o muro con un rectángulo de color detrás del recorte, desfasado | Objetos, documentos, pantallas | Paper | Aprobado |
| F6 | Ink + retícula | Líneas finas Paper al 9 % cada 90 px sobre Ink | Sistemas, "cómo funciona", piezas que se separan | Paper | Usado en el explainer |
| F7 | Barra sobre foto | Foto en blanco y negro con una barra naranja encima | Personas, lo oculto | Paper | **Sin probar** |
| F8 | Naranja sólido | #FF7A1A plano | Un golpe: una frase o una cifra, 2–3 s | Ink | Usado en el explainer |
| F9 | Lienzo flotante | Paper con losetas a distintas profundidades y una cámara que viaja | Muchos casos y uno elegido | Ink | Aprobado ("se queda sin duda") |
| F10 | Ink + figura isométrica | Figura de una sola línea (motor Hairline) sobre Ink plano | Un mecanismo: algo que encaja, gira, se separa | Paper | Usado en el explainer |
| F11 | Pixel art a pantalla completa | Lienzo 135x240 x8 dibujado por código, en la paleta B2, con cámara que sigue al personaje; tapa la toma y lleva subtítulos | Contar una historia con un personaje al que le pasa algo | Subtítulos Paper, palabra dicha en naranja | Aprobado (reel Dreaming v6, a color y visto desde arriba) |

### Fondos nuevos por probar (ampliar el stock)
Pablo, 12 nov 2026: "debes ampliar tu stock de backgrounds; siento que usaste el mismo background en este video que en el pasado". **Cada reel nuevo estrena al menos dos fondos que el anterior no usó** (ver el historial en `recursos.md`) y se enseñan en cuadro fijo antes de animar. Al aprobarse o rechazarse, mover a la tabla de arriba o anotar el rechazo.

| # | Fondo | Cómo es | Para qué idea | Estado |
|---|---|---|---|---|
| F12 | Paper milimétrico | Paper con retícula Ink al 8 % cada 60 px y una línea guía azul | Planes, procesos, notas, "cómo se organiza" | Sin probar |
| F13 | Trama de medios tonos | Puntos grandes azules sobre Ink (o Ink sobre Paper) que crecen de un lado a otro y derivan | Datos, escala, lo que crece | Sin probar |
| F14 | Pantalla partida | Dos sólidos de la paleta 60/40, corte horizontal o diagonal; cada mitad lleva una cosa | Antes/después, humano/máquina, dos opciones | Sin probar |
| F15 | Palabra gigante | Una palabra enorme en Space Grotesk, a sangre, casi del tono del fondo (8–12 % de contraste), que deriva | Un concepto con nombre ("Dreaming", "memoria") | Sin probar |
| F16 | Código a sangre | Líneas Plex Mono en Slate al 25 % sobre Ink que se escriben y suben despacio | Lo que hace el modelo por dentro, archivos, logs | Sin probar |
| F17 | Foto de la fuente a sangre | Foto o captura real, en grises, oscurecida al 30 % | Citar el lugar, la empresa o el documento | Sin probar |
| F18 | Ruido nocturno | Ink con grano animado y una mancha azul muy tenue que respira | Sueño, espera, lo que pasa "mientras tanto" | Sin probar |
| F19 | Slate claro sólido | #9AA3B2 plano con grano | Pausa neutra entre dos fondos intensos | Sin probar |
| F20 | Muro nuevo | Otra textura de muro (cemento, papel pegado, metal). Generarla con IA **previa cotización** o fotografiarla | Lo mismo que F3 sin repetir la misma pared | Sin probar |

Texturas disponibles en `assets/texturas/`: `tex_spray.jpg`, `tex_stencil.jpg`, `tex_torn.jpg`.

## Reglas
1. **Cada idea nueva cambia de fondo.** Nunca el mismo fondo en dos escenas seguidas.
2. **Máximo tres fondos distintos en 15 s.** En 45 s caben ocho o nueve.
3. **El círculo (F4) aparece como mucho una vez por reel.**
4. **Un acento por escena.** Sobre azul, un cuadrito naranja de ~44 px; sobre naranja, ninguno.
5. **El fondo anterior deja rastro.** El color que sale se queda como forma: el azul sólido se encoge a un plano detrás del recorte. Da continuidad sin transición decorativa.
6. **El cambio es una cortina** de 0.34–0.36 s (`easeInOut` cúbico) que sube desde la unión con la toma o entra de lado; alternar la dirección. O un plano que se encoge. Sin paneles de textura cruzando, sin zooms.
7. **El recorte siempre en blanco y negro.**
8. **El marco cambia de tinta** con el fondo.
9. **Las texturas son fondo completo y oscurecido**, nunca losetas sueltas. Pueden retroceder lento (escala 1.08 → 1.03) para que la escena no quede quieta.
12. **La variedad tiene que notarse** (Pablo, 14 nov 2026: "no usaste fondos naranjas ni con otro estilo, solo el azul"). En "Pablo's Time" estrené cuatro fondos, pero tres se leían como los de siempre: Paper milimétrico ≈ Paper, código a sangre y ruido nocturno ≈ Ink. Contar **familias visuales**, no números de catálogo: (a) oscuro liso, (b) claro liso, (c) azul, (d) naranja, (e) textura o foto a sangre, (f) patrón o tipografía gigante que se vea a primera vista, (g) mundo propio (pixel art, 3D con escenario). Un reel de 60 s usa **al menos cinco familias, incluido un golpe naranja (F8)** y una de (e), (f) o (g). Un estreno que a tamaño de miniatura se confunde con otro fondo no cuenta como estreno.
11. **No repetir la secuencia del reel anterior.** Antes de elegir fondos, leer el historial de `recursos.md`; el muro F3 y "papel + tarjeta" ya se usaron mucho.
10. Alternar claro y oscuro a lo largo de la pieza; evitar que toda una mitad sea oscura.

## Movimiento dentro de la escena
- El elemento principal entra en 0.5 s (sube 70 px, rota 2–3°) y luego **deriva a velocidad constante** (≈2 px/s, 0.1°/s). Esa deriva evita los tramos congelados.
- Acentos chicos entran con rebote corto (`back`, 0.2 s).
- En tramos sin cara, cambiar el encuadre cada 2–4 s: otra pieza, un detalle, una línea que se escribe.
- Recursos aprobados: barrido que convierte una vista en otra (antes → después); líneas de un documento que se escriben con cada frase; capas reales que se separan en 3D; una palabra que se cambia por otra.

## F10 · figura isométrica
- Usar la geometría de `hairline-kernel.js` **sin modificar** (global `HL`: `Cam, fit, proj, facing, circ, rrect, ringAt, run, hull, poly, open`). La pose se calcula desde `t`; no usa sus resortes ni su puntero.
- Trazos: pieza principal en Paper de 5 px con relleno `#16161d`; contenedor en Slate de 2.5 px; un solo trazo naranja; pliegues en Slate al 45 %.
- Fondo plano siempre (las placas se rellenan con el color del suelo). No va sobre muro.
- Las dos piezas deben distinguirse por grosor y tono; el choque o el encaje lleva una marca visible (un destello naranja en el borde).
- No chocar mientras el titular todavía se está leyendo: la acción empieza ≥2 s después de que entra la escena.
- Modelo: `draw7`, `pose7` y `T7` en `assets/ejemplo-explainer/index.html`. Si Pablo quiere una figura interactiva aparte, eso es la skill `hairline-create`.

## Secuencias que funcionaron
- **Prueba C (15 s, con cámara):** F1 Paper con titular → cortina azul F2 con hoja + Cody + cuadrito → F3 muro, el azul queda como plano detrás de la hoja (F5) mientras la toma pasa a burbuja.
- **Explainer (44 s):** Ink con foto → F8 → F2 → F6 → F3 → F1 → F10 → F3 → F1.

## F11 · pixel art (reel "Dreaming" v3)
Pablo lo pidió cuando una imagen fija de la fuente se sentía estática: "que cobre vida el personaje". Personaje y mundo propios (no copiar el juego de origen). Modelo: `v2/px.js` e `index3.html` en "Anthropic Dreaming/reel-editorial". Claves: el personaje a escala 1.75 con cámara que lo sigue (a escala 1 se ve chico y la pantalla vacía); una sacudida corta al caer; un objeto del mundo que cuenta la idea (el letrero con la flecha equivocada = la nota mal apuntada).

Correcciones de Pablo al pixel art (12 nov 2026, v4–v6 del reel "Dreaming"):
- **La vista del pixel art debe ser la del juego del que se habla.** La vista lateral "parece otro videojuego"; Pokémon se ve desde arriba, en casillas. Modelo: `v2/px6.js`.
- **El pixel art no tiene que llevar la paleta B2**: "puede ser más colorido, como un videojuego normal; no todo tiene que llevar la identidad y colores que definimos". El marco, los subtítulos y el resto del reel sí siguen la identidad.
- El personaje puede ser el protagonista real de la historia (aquí, el cangrejito de Claude): "le daría más sentido a toda la escena". Dibujarlo propio; avisar del permiso de uso.
- Primer intento en grises de la marca salió ilegible: en un mapa por casillas, camino, pasto y pared necesitan tonos claramente distintos.
