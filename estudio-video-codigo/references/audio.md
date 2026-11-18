# Audio primero

La imagen se corta al audio, no al revés. La fuente del audio se elige en el intake:
- **Música y sfx en código (por defecto, gratis):** sintetizados en el proyecto. Ver `audio-en-codigo.md`.
- **Voz con ElevenLabs (recomendada):** ver `elevenlabs.md`. También puede hacer música y sfx si la persona lo prefiere.
  Si no tiene cuenta: su voz grabada, o un video sin voz. Nunca voces sintéticas del sistema (suenan mal).
- **Archivos de la persona:** su voz, una pista con licencia, sonidos de librería en `assets/tomas/`.
Se pueden mezclar: p. ej. música en código + voz grabada, o sfx en código + voz de ElevenLabs.

## Orden
1. Guion de voz ligado a facts.json. Generar una línea de prueba y medir: la voz real tarda más de lo calculado.
   Recortar el guion hasta que el habla deje aire (en 30 s, ~19–26 s de habla).
2. Música (`npm run music`) y sfx (`npm run sfx`) en código; voz con ElevenLabs o grabada. Tomas reales en `assets/tomas/` y `npm run sounds`.
3. Medir cada línea: inicio, fin y pausas internas → ubicar las palabras clave (el golpe cae en la palabra).
4. Escribir `brief/timing.json`: `voz` (línea, t, fin, palabras), `escenas`, `cues` (voz `vo1…` + sfx).
5. `npm run audio-preview` y `npx tsx render/stems.ts`. Metas: −14 a −15 LUFS, pico ≤ −1 dBTP, voz ≥ 9 dB sobre la
   música en cada línea, cada sfx 5–12 dB sobre la mediana del fondo.
6. Mandar `out/audio_preview.wav` a la persona: parada de aprobación. Claude no oye; pedirle que escuche.
7. En las escenas, cada cue se declara donde ocurre la acción; la voz se declara en la escena de subtítulos/diálogo.

## Mezcla (render/mix.ts)
- Cues cuyo nombre empieza con `vo` van al bus de voz; el resto son sfx.
- Música a volumen fijo `MUSIC_GAIN` (env, por defecto 0.15) con fade de salida. Subirla o bajarla por tramos
  se oye raro: si la voz queda baja, bajar el volumen fijo.
- Cadena final: amix → loudnorm I=−15 → limitador sobremuestreado (pico real ~−2 dBTP).
- `mixAudio(..., "voice" | "music")` exporta stems sin normalizar para medir.

## Medidas útiles (ffmpeg)
- Loudness y pico: `-af ebur128=peak=true`.
- Habla: `silenceremove`/`silencedetect=n=-40dB` · pausas: `silencedetect=n=-38dB:d=0.1`.
- Energía de la música: RMS cada 0.5 s (ver stems.ts).
- Sync: el ataque de cada sfx contra el frame del cambio visual (≤1 frame).
