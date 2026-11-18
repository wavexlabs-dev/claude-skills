# Aprendizajes de las rondas (11 nov 2026)

Historia corta de cómo se llegó a esta versión. Sirve para no repetir el camino.

## Rondas
| Prueba | Qué era | Resultado |
|---|---|---|
| prueba-15s v1–v2 | Estilo "Berlin Walls": texturas, losetas, píldoras | Rechazada: saturada, texturas como transición "se ven mal" |
| v3–v4 | Paleta B2, pero con rayita + etiqueta y foto en tarjeta | Rechazada: "grita IA" |
| **v5** | Recorte B/N + círculo de color + Space Grotesk sobre Ink | **Aprobada.** Es la combinación base |
| v6–v7 | Lienzo flotante; palabra manuscrita | Lienzo aprobado; manuscrita rechazada |
| v8 / prueba-b v1–v2 | Abandoné la combinación v5 al probar cosas nuevas | Rechazada: "ya no los usaste" |
| prueba-b v3 | Tres layouts, cinco cambios en 16 s, círculo de 210 px | Rechazada: cara cortada, abuso de transiciones |
| **prueba-c v1** | Toma horizontal, mitad + burbuja medidas, un cambio | **Aprobada:** "más fluido", pero abuso de círculos |
| **prueba-c v2** | Sistema de fondos (Paper → azul → muro) | **Referencia del formato A** |
| explainer v1–v2 | 44 s sin cámara, con figura isométrica y sonido | Crítico: 6.5/10, 13 hallazgos |
| explainer v3 | Correcciones del crítico | "En general lo veo bien"; sonido robotizado; sin él se siente plano |
| **explainer v4** | Mezcla con el método de sonido | **Referencia del formato B.** Sin confirmar de oído |
| reel Dreaming v1 | Primera pieza larga de formato A (87 s) con sonido; toma vertical; layout TARJETA nuevo | Entregada; pendiente la opinión de Pablo |

## Lo que más costó aprender
1. **Leer primero las skills de video de Pablo.** Varias de sus correcciones ya eran reglas suyas con fecha (una familia por titular, nada sobre la cara, zonas de interfaz, cotizar antes de generar).
2. **Biblioteca, no reemplazo.** Lo aprobado se queda aunque se pruebe algo nuevo.
3. **Medir, no estimar:** la cara, la presencia de un sonido, el primer golpe de un archivo, los tramos quietos.
4. **Cada recurso necesita motivo.** Un cambio de layout, un fondo, un sonido: si la razón es "para variar", sobra.
5. **Lo que hace cualquier plantilla de IA, se quita.** Pablo lo detecta al instante.
6. **Revisar contra una lista fija antes de enviar.** Sin ella, cada ronda arreglaba lo último y rompía algo anterior.
7. **Decir lo que no se puede verificar.** Sobre todo el audio.

## Errores técnicos ya resueltos
- Un sonido quedó vacío (78 bytes) por recortar silencio con umbral fijo: usar umbral relativo al pico propio y comprobar que no quede vacío.
- Un golpe sonaba doble y 8 cuadros tarde: recortar al primer golpe.
- `loudnorm` movía la música: ganancia lineal + limitador.
- La portada se borraba a los 0.2 s: el titular del primer cuadro es fijo.
- `ffmpeg` de esta máquina no tiene `drawtext`: las hojas de contacto van sin marcas de tiempo (cada cuadro = 0.5 s).
- Render largo lanzado sin seguimiento: correrlo en segundo plano y esperar a `RENDER_DONE`.
- El script de render resuelve `playwright-core` desde su propia carpeta: copiarlo al proyecto.
- Con voz, `mezcla.py` dejó la mezcla en −15.7 LUFS (meta −14) y varios efectos en su ganancia mínima (−40 dB): se subió después con `volume` + `alimiter`. Falta que el script lo haga solo.
- Puede haber otra sesión editando el mismo material en otra carpeta: no tocarla; trabajar en una carpeta propia.

## Pendientes para la v0.2
- Una pieza completa de formato A con sonido, revisada de oído por Pablo.
- Cortar sobre el pulso de la música desde el guion.
- Probar F7 y subtítulos; decidir la posición del marco.
- Ampliar la biblioteca de sonidos por material.
- Plantilla limpia (sin contenido del ejemplo) cuando haya tres piezas hechas y se vea qué se repite.
- Actualizar `marca-pablo-video` para que mencione esta identidad en reels, si Pablo quiere.

## 12 nov 2026 · cierre del reel Dreaming
- Pablo aprobó la v6 ("quedó muy bien"). Lo valioso es que el pixel art aparece y luego se regresa al formato base. **No proponer rehacer un reel aprobado ni extender el recurso especial a todas las escenas** cuando pregunta por mejoras: la pregunta es qué herramientas sumar para los siguientes.
- Pidió ampliar la caja de herramientas (motion graphics, pixel art, Hairline, IA, código) y el stock de fondos, y cuidar la fluidez. Ver `recursos.md` y F12–F20 en `fondos.md`.
- El pixel art tomó cuatro versiones porque la vista y el color se decidieron después de renderizar: enseñar un cuadro fijo antes de animar.

## 13 nov 2026 · reel "Pablo's Time" (Kindle 3D), guion gráfico
- Primer guion gráfico: seis escenas gráficas con Pablo en burbuja. Rechazado: "demasiado gráfico… salgo todo el tiempo en un cuadrito chiquito". Ver "Alternar el tamaño de Pablo" en `camara.md`.
- Un render 3D con fondo transparente que toca el borde de su imagen se ve como una esquina cortada al componerlo: medir la caja del alfa y dejar margen antes de componer.
- Recurso nuevo: objeto real modelado en Blender (R11). Proyecto: "Kindle 3D" (`modelar.py`, `reel/escenas3d.py`).
- 13 nov 2026 (v3 "Pablo's Time"): dos cortes a media palabra que Pablo oyó ("se repite una palabra", "corte extraño antes de Gmail"). Los tiempos por palabra de whisper llegan hasta 0.2 s antes del sonido real. **Antes de entregar, volver a transcribir la voz ya cortada y leerla completa**; para un corte dentro de habla continua, mirar la envolvente a 40 ms y cortar solo en un hueco real (<−40 dB). Si la frase no tiene hueco, quitarla entera o pedirle que la regrabe.
- 13 nov 2026 (v4 "Pablo's Time"): recortar silencios dentro de un tramo puede pegar un falso arranque con su repetición ("De ahí… de ahí extrae"). whisper lo escondió como una sola palabra larga. Señal para detectarlo: una palabra con duración de más de 1 s en la transcripción original, o un silencio largo a media frase. Revisar esos puntos antes de cortar.

## 14 nov 2026 · balance de "Pablo's Time" (notas de Pablo al día siguiente)
- Le gustó el workflow del modelo 3D desde fotos y quiere reutilizarlo. Empaquetado en `assets/ejemplo-3d/`.
- No le gustó: (1) mucho espacio entre el titular y la Kindle, "se siente mal alineado"; (2) abuso de tomas animadas con él en cuadrito, aun después de corregirlo una vez; (3) solo se notó el fondo azul, sin naranja ni otros estilos. Reglas nuevas 11–13 en `SKILL.md`; detalle en `identidad.md`, `camara.md` y `fondos.md`.
- Él las llama notas de gusto y de diseño: no son errores de un caso, son criterio que hay que ir puliendo en cada reel.
