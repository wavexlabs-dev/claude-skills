# Reglas heredadas de otras skills

Antes, esta skill pedía cargar `marca-pablo-video` y leer reglas de `estudio-video-codigo`, `video-largo-y-teaser` y `html-reel`. Aquí está lo que aplica a este estilo, para que la skill funcione sola. Si algo de aquí choca con `preferencias.md` o `identidad.md`, mandan esas dos: este estilo usa la identidad B2, no el "Nocturno morado".

## De la marca de Pablo (`marca-pablo-video`)
- Español de México, cercano y directo. Recomendar una opción, sin cuestionarios largos.
- Datos en pantalla solo con fuente verificable.
- **Toda generación con IA (imagen, video, música, sfx, voz) se cotiza en dólares y se pide permiso antes.**
- Zonas de interfaz de Reels: arriba ~230 px y abajo ~420 px. Lo que importa va dentro de y 280–1640.
- Cody (su mascota) aparece solo si Pablo lo pide. Referencia: `assets/ejemplo-camara/assets/cody.png`.
- Fotos de Pablo: preferir siempre su toma real; generar a Pablo solo con su consentimiento.

## Composición (`estudio-video-codigo`, `video-largo-y-teaser`)
- Ningún gráfico sobre la cara: medir en el cuadro real dónde está la cabeza y dejar libre esa zona.
- Bajo un mismo gráfico, un solo encuadre; sin zoom por toma en cortes cortos (va y viene sin foco).
- Un titular a cuadro completo no pasa del 90 % del ancho.
- Entre escenas no hay cuadros vacíos, y nada se encima a medio fade.
- Una cifra aparece cuando la voz la dice, no al llegar a la escena.
- Un gesto tipográfico (color, tracking) se empuja hasta que sea inequívoco; a medias parece bug.
- Un dibujo figurativo se valida por sus rasgos distintivos: si se puede confundir con otra cosa, le faltan rasgos.
- La etiqueta honesta ("Recreación hecha con IA", "Concepto") va pegada al sujeto que califica.
- Ningún tramo quieto de 0.5 s, salvo metraje real con movimiento propio. Las derivas lentas van a velocidad constante.
- Cambios de color entre tonos lejanos, rápidos (≤0.2 s).
- Privacidad: Pablo decide qué es sensible. Preferir congelar un cuadro limpio a difuminar.

## Layouts de cámara (`html-reel`)
- Burbuja 268 × 375 en x 721, y 1072, esquinas de 30 px, borde de 2 px al 55 % de blanco.
- Mitad: corte duro en y 960.
- La cara crece conforme crece la petición: la burbuja para la prueba, pantalla completa para el cierre y la llamada a la acción. Los cortes de toma se esconden bajo un cambio de layout.
- El primer cuadro es la portada: titular completo sobre su mejor imagen, sostenido 0.2 s.
- Subtítulos nunca sobre la cara ni sobre controles de una ventana.

## Corte y técnico (`video-largo-y-teaser`, `estudio-video-codigo`)
- Revisar los finales de palabra en cada corte: whisper los recorta. Ver `preferencias.md` para el método medido.
- Concat: todas las piezas con el mismo SAR, pix_fmt y color, o el video se corta en silencio.
- Renders largos en segundo plano; no matar un render a medias.
- `rm` con globs relativos lo bloquea la sesión: usar carpetas nuevas en vez de borrar.
- En ffmpeg, no mandar una rama de `asplit` a `anullsink`.

## Audio (`estudio-video-codigo`)
- Claude no oye: medir (LUFS, voz sobre música por tramo, silencios) y mandar a escuchar.
- La voz va ≥10 dB sobre la música (`scripts/mezcla.py` lo calibra).
- Los sfx generados se miden antes de usarse: un "tick" puede traer varios golpes. Se conserva el primer impacto.
- Dos sfx a menos de 0.3 s se empastan. Si se repite un sonido, alternar dos tomas.

## Crítico nuevo (`estudio-video-codigo`)
Quien construye no juzga su propio trabajo. Después de cada render completo se lanza un subagente nuevo, `general-purpose`, que no vio el build (prompt en `revision.md`). Pablo dio autorización permanente para eso.
- Verificar cada hallazgo en el cuadro antes de corregir: los críticos a veces leen mal la causa.
- Lo que cambie el guion, la voz o una decisión de Pablo se le pregunta; no se corrige solo.
- Corregir primero lo más grande, volver a renderizar, medir y lanzar un crítico nuevo. Registrar la ronda en la `BITACORA.md` del proyecto.
