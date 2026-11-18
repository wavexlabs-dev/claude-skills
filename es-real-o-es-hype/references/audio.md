# Audio

## Capas
| Capa | Dónde | Nivel |
|---|---|---|
| Voz | `clean.mp4` (limpia en Adobe Podcast, Enhance v2 ~61%) | −14 LUFS en la mezcla del motor |
| Música | `Music:` en `edit.md` (`assets/audio/musica_base.mp3` o una nueva) | `Music level: -12` (≈ −17 dB bajo la voz). A −18 no se oye |
| Audio del reel | solo en el hook, en `mezcla_final.sh` | −1 dB, fade 0.5 s al final |
| Jingle | `assets/audio/jingle.wav`, solo en la tarjeta del título, justo después de su frase | normalizado a −14 LUFS, 1.86 s de sonido |

El motor (`build.py`) mezcla voz y música; el jingle y el audio del reel se agregan después con `mezcla_final.sh`.

## Jingle de la serie (la voz de «¿Es real o es hype?»)
Archivo listo: `assets/audio/jingle.wav` (toma B, normalizada a −14 LUFS; original en el flow de ElevenLabs).
Para regenerarlo o hacer una variante, ElevenLabs Music `eleven_music_v2_5`, flow `X17PRTqAtdUFtx4oDgSk`
(cuenta de Pablo), nodo «Jingle Es real o hype», con estos parámetros exactos:

- `duration_seconds`: 4 · `lyrics_type`: `custom` · `lyrics`: `¿Es real o es hype?`
- `prompt`:
  > Short TV game show intro jingle, retro quiz show sting like a classic trivia show opener. Bright brass stabs,
  > fast upbeat swing, punchy drums. A female singer with a Mexican Spanish accent sings the hook fast and
  > theatrical, catchy sung melody, ending on a big brass hit. Very short, 4 seconds.

Genera 3 tomas (A, B, C) y que Pablo elija de oído; en EP1 eligió la B («La B sin duda»). Solo la primera ~1.9 s
tiene sonido: recorta a 2.05 s con fade de 0.2 s y normaliza
(`atrim=0:2.05,afade=t=out:st=1.85:d=0.2,loudnorm=I=-14:TP=-2`).

Lo que no funcionó: voces habladas de TTS (Renata, Anita, Jade, Dany, Chente). Pablo: «demasiado lento y no
cantadas». De las habladas, la que más le gustó fue Renata, porque tiene acento mexicano. Siempre acento mexicano.
El widget de ElevenLabs le falla: baja siempre los archivos y mándaselos con `SendUserFile`.

## Música
`assets/audio/musica_base.mp3` es la cama del EP1 (la toma B del Short de Kindle, alargada con crossfade a ~88 s).
Su prompt (ElevenLabs Music v2.5, instrumental):
> Instrumental background bed for a spoken maker/tech story about turning an old e-reader into a personal morning
> newspaper. Calm, warm and curious morning mood: soft felt piano and gentle analog synth pads, light plucked
> arpeggio, warm sub bass, relaxed lo-fi drum groove at 88 BPM with soft brushed snare. Quiet intro, gentle lift
> around the middle as it starts working, steady and unobtrusive so a voice sits on top, clean resolved ending. No vocals.

Para una cama propia de la serie: mismo modelo, `instrumental: true`, duración del Short; `estimate_only` primero,
cotiza en USD, 2 tomas, que elija de oído.

## Entrega
Dos pasadas de `loudnorm` a −13 LUFS / TP −2, luego `alimiter=limit=0.83` a 192 kHz → −13.3 LUFS, pico −1.8 dBFS.
En zsh escribe `${VAR}` antes de `:` (`$OFF:linear` se rompe).

## Ruidos
- Cada corte del motor lleva fades de 12 ms: los cortes no hacen clic.
- Los clics cortos de EP1 venían de la toma (boca o el micrófono en la mano), a media palabra. Adobe los baja 50–75%.
- `adeclick` de ffmpeg casi no los toca. Si molestan: bajar solo agudos (>3 kHz) −20 dB por 8 ms en cada clic.
- Arma un audio A/B (voz original / Adobe / final, 3 s por momento) para que Pablo identifique el ruido de oído.
- Zumbido de fondo del set: tonos en 221 Hz y 1465 Hz a −54 dB; Adobe lo quita.
