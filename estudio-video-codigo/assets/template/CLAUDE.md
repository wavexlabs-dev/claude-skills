# Video en código

Escenas TypeScript que crean DOM y lo animan con GSAP sobre una timeline maestra pausada.
Preview en el navegador y render cuadro por cuadro (Playwright → FFmpeg).

## Comandos
- `npm run dev` — preview con scrubber (espacio = play, ←/→ = 1 frame, shift = 10). `?format=9x16` para el vertical.
- `npm run render` — 16:9 1080p60 a `out/video_16x9.mp4` con audio. `-- --format 9x16` para el vertical.
  `-- --to 120 --no-audio` para una prueba rápida; `-- --scale 2` para 4K.
- `npm run frames -- --format 16x9 --at 2.8,15.6 --name zona` — frames sueltos + contact sheet en `out/frames/`.
- `npm run measure` — duración, frames, LUFS, pico y congelados de los dos renders.
- `npm run music` — música progresiva sintetizada desde `brief/music.json` → `assets/music/bed.wav` (sin cuentas ni red).
- `npm run sfx [-- tap2]` — efectos sintetizados desde `assets/sfx.json` → `assets/sfx/*.wav`.
- `npm run sounds [-- vo1=2]` — prepara tomas reales de `assets/tomas/` (voz grabada, librería, ElevenLabs) según
  `assets/sounds.json`; reemplazan al sonido sintetizado del mismo nombre.
- `npm run audio-preview` — mezcla solo de audio desde `brief/timing.json`.
- `npx tsx render/stems.ts [out/cues_16x9.json]` — voz sobre música por línea y presencia de cada sfx.
- `npm run site-copy` — copia local del producto web con reloj controlado (`brief/site.json`).
- `npm run typecheck` — antes de cada render.

## Cómo está armado
- `src/tokens.ts` — formato (`V` = 9:16), marca, fuentes, eases, beat y márgenes. Única fuente de verdad.
- `src/storyboard.ts` — el video en datos: `{ scene, dur, overlap?, props }`. El orden es el z-order.
- `src/scenes/*.ts` — una escena por archivo: `(root, props, { dur }) => { tl, cues }`. Regístrala en `src/scenes/index.ts`.
- `src/scenes/live-site.ts` — un producto web real dibujado frame a frame (ver la skill, referencia producto-en-vivo).
- `src/engine.ts` — timeline maestra, `__seek(frame)`, `__video`, `__ready`; `whenReady(promesa)` para cargas.
- `render/mix.ts` — música a volumen fijo (`MUSIC_GAIN`) + voz (cues `vo*`) + sfx, normalizado a ~−14 LUFS.
- `render/synth.ts`, `render/music.ts`, `render/sfx.ts` — síntesis en código. Es código: una textura nueva es una capa
  o un tipo nuevo, no un parámetro forzado.
- `brief/` — brief.md, facts.json (única fuente de texto), timing.json, music.json, ledger.md, site.json.

## Reglas del motor (no negociables)
- Cada valor es función del tiempo de la timeline. Nada de `setTimeout`, `Date.now()`, animaciones CSS ni `<video>` reproduciéndose solo.
- Aleatoriedad solo con `rng(seed)`. Las escenas no pintan fondo: el fondo vive en el stage.
- Colores, eases y duraciones salen de `tokens.ts`. Fuentes locales; nada de red durante el render.
- Todo sonido es un cue declarado en la escena, en el tiempo de la acción que lo causa.
- Después de cada cambio visual: frames de la zona tocada y mirarlos antes de decir que quedó.

## Reglas aprendidas
Cada corrección de dirección se agrega aquí como regla corta y general, con fecha. Léelas antes de tocar una escena.
Las reglas heredadas de videos anteriores están en la skill (references/reglas.md).
