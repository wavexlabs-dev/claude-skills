# Audio en código (el camino por defecto)

Música progresiva y sfx sintetizados en el propio proyecto: gratis, sin cuentas, sin red y deterministas
(misma configuración, mismo archivo). Así se hicieron las primeras versiones de los videos. Para música y sfx,
ElevenLabs u otras fuentes son opcionales; para la voz sí se recomienda ElevenLabs (ver abajo).

## Música progresiva — `brief/music.json` → `npm run music` → `assets/music/bed.wav`
La música sigue la historia: cada capa entra en un momento del storyboard y la energía crece hasta el clímax.
- `bpm` y `acordes` por nombre (`Dmaj9`, `Bm9`, `F#m7`, `Asus`, `Ebadd9`…), `compases_por_acorde`.
  Mayor con 7.ª/9.ª suena cálido y optimista; menor (`m7`, `m9`) más tenso o reflexivo.
- `capas`: `pad` (colchón, desde el inicio), `arpegio` (movimiento, cuando el producto aparece), `bombo` + `bajo`
  (pulso, cuando la historia acelera), `hat` (urgencia, el tramo antes del clímax). `nivel` puede ser `[inicio, fin]`
  para que una capa crezca. Una capa que no se nombra no suena.
- `subida` (ruido que crece hacia el golpe) y `floracion` (sub + acorde rasgueado en el clímax o la firma),
  `acorde_final` para resolver, `salida` en segundos.
- Los tiempos se toman de `timing.json` (escenas y palabras clave) y caen en el beat (múltiplos de 60/bpm); el
  script avisa si una entrada queda fuera. Ajustar el `bpm` para que los golpes principales caigan en beats.
- Verificar la curva midiendo (dB RMS cada 3 s, ver `audio.md`): debe subir por tramos y llegar al máximo en el clímax.
- Es código: si el video pide otra textura (piano, cuerdas, percusión de juego), agregar una capa en
  `render/music.ts` en lugar de forzar parámetros.

## Efectos — `assets/sfx.json` → `npm run sfx` → `assets/sfx/<out>.wav`
Tipos: `tick` (paso, cuenta), `click` (botón, interruptor), `tap` (toque de madera o dedo), `pop` (aparición),
`thud` (algo que aterriza), `impact` (el golpe grande, una vez), `whoosh` (cambio de escena), `swish` (algo que sale),
`breath` (pausa, respiro), `paper` (tarjeta que se desliza), `pluck` (un dato con altura), `chime` (logro, firma),
`coin` (premio, en juegos), `riser` (tensión antes de un golpe).
- Cada entrada acepta `tono` (altura), `dur`, `semilla` (otra variante), `pan` y `pico` (dBFS).
- Variantes para lo que se repite: el mismo `tipo` con otro `tono`/`semilla` (`tap`, `tap2`) y alternarlas en los cues.
  Un sonido idéntico repetido muchas veces es lo que más se oye "computarizado".
- Elegir el tipo por el objeto en pantalla (qué es y de qué está hecho), no por el evento de interfaz.
- Medir presencia con `npx tsx render/stems.ts` (5–12 dB sobre la mediana del fondo). Si queda baja, subir su
  `pico` o su `gain` en el cue.

## Voz
La voz no se sintetiza en código: las voces del sistema (`say`, `espeak`) suenan robóticas y bajan todo el video.
Recomendar ElevenLabs (`elevenlabs.md`). Sin cuenta: la persona graba cada línea (teléfono o micrófono, cuarto
silencioso) como `assets/tomas/vo1_1.wav` (o .m4a/.mp3) y `npm run sounds` recorta y normaliza; o el video va sin voz
y la tipografía carga la historia.

## Mezclar fuentes
Cualquier toma real en `assets/tomas/<nombre>_<toma>.*` declarada en `assets/sounds.json` reemplaza al sintetizado
del mismo nombre al correr `npm run sounds` (después de `npm run sfx`). Una pista de música propia o con licencia va
en `assets/music/` y se nombra en `timing.json` (`"musica"`) y en el render (`--music`).
