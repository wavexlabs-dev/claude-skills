---
name: short-explicativo
description: Formato general de los Shorts/Reels de Pablo Paredes — Pablo cuenta a cámara una historia o noticia de IA y tecnología (un proyecto, un estudio, algo que construyó) y cada afirmación se respalda en pantalla con su fuente real (artículo, documento, captura, su propia grabación) o con una recreación animada rotulada. Incluye el formato y su estructura, el guion, la marca (Nocturno morado, Inter Tight), el motor de edición (video-short), los tipos de visual (recibos, números, tarjetas, páginas, animaciones en código), la biblioteca de música aprobada, la entrega y el render 4K en Higgsfield. This skill should be used whenever Pablo asks for a Short, Reel or vertical video that is not an episode of «¿Es real o es hype?» — explaining an AI story, a research paper, a news item or something he built — or drops a talking-head clip with sources to turn into a Short, like the Maya, Dreaming (memoria de agentes) and Kindle Shorts.
---

# Short explicativo

Shorts 1080x1920 donde Pablo explica a cámara una historia de IA o tecnología y **todo lo que dice se ve**: el
artículo, el documento, la captura, el proyecto real. Ejemplos aprobados: Maya (IA encuentra ruinas mayas),
Dreaming (la memoria de los agentes de Anthropic) y Kindle (su periódico personal en una Kindle vieja).
Todo vive en esta skill: no hace falta cargar `video-short` ni `marca-pablo-video`. Para «¿Es real o es hype?»
usa la skill `es-real-o-es-hype`.

## Cómo trabajar con Pablo
- Español de México, directo. Recomienda una opción; no hagas cuestionarios largos.
- Pregunta solo lo que cambia por video: tema, fuentes, si lo quiere a 1.2x, qué música de la biblioteca.
- Enséñale borradores pronto. Manda la **copia 1080 ligera** (<30 MB) con `SendUserFile`; el master por AirDrop.
- Tú no puedes oír: música, voz y ruidos los juzga él.
- Generación con IA (imágenes, video, música) o renta de GPU: cotiza y pide permiso antes. Imágenes y video IA
  con Sume; toda recreación IA lleva en pantalla «Recreación hecha con IA».
- Respalda en `borradores/` antes de cada render final.

## Flujo de un Short
1. **Brief y fuentes** — el tema y sus fuentes (ligas, PDFs, capturas, demos). Las fuentes mandan los visuales.
   Si no hay, búscalas y que Pablo las confirme. [references/formato.md](references/formato.md),
   [references/guion.md](references/guion.md).
2. **Visuales** — recibos, números, tarjetas, páginas y animaciones: [references/visuales.md](references/visuales.md).
3. **Preparar y cortar** — proxy, 1.2x si la quiere, cortes: [references/produccion.md](references/produccion.md).
4. **Escenas** — `edit.md`; ejemplos completos en `assets/ejemplos/`.
5. **Borrador** — `render.py --draft`, `scripts/ajustar_subtitulos.py`, `scripts/tira_cortes.sh`; revisa cada
   corte ([references/errores.md](references/errores.md)).
6. **Voz** — Adobe Podcast. **Final** — `render.py`, `scripts/entrega.sh`, QA, `scripts/copia_ligera.sh`.
7. **4K** si lo pide: [references/render-4k.md](references/render-4k.md).

Marca: [references/marca.md](references/marca.md). Audio: [references/audio.md](references/audio.md).
Motor (comandos, sintaxis de `edit.md`): [motor/reference.md](motor/reference.md) y
[motor/proceso-video-short.md](motor/proceso-video-short.md). Primera vez: `motor/scripts/setup.sh`.

## Lo esencial
- Gancho a cámara en el primer segundo con lo más fuerte de la historia (un número, una frase).
- Alterna cámara (a-roll / punch) con pruebas en split; cada prueba dura lo que dura la frase que la sostiene.
- Recibos reales con la línea clave marcada; nunca inventes una captura.
- Cierre a cámara con pregunta o «link en comentarios».
- Fondo `#0b0a12`, texto `#f4f2ff`, morado `#8a6bff` solo en la palabra clave; Inter Tight 600/800.
- Entrega −13 LUFS, pico ≤ −1.5 dBTP.
