# Módulos
- `px6.js`: pixel art visto desde arriba, a color (reel Dreaming v6). Expone `PX.init(R)` y `PX.draw(t)`, puros en `t`; dibuja en un canvas `#pxc` de 136x240 ampliado x8 con `image-rendering:pixelated`. Cambiar `PATH` (recorrido), `world()` (mapa) y `CR` (personaje).
- `subs.js`: subtítulos de 2-3 palabras para escenas a pantalla completa (Space Grotesk 78, palabra dicha en naranja, y=300).
- `../../scripts/range.mjs`: vuelve a renderizar solo un rango: `HTML=index.html node range.mjs <inicio> <fin>`.
Proyecto completo de referencia: "Anthropic Dreaming/reel-editorial" (`index6.html`).
