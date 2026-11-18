# Audio

## Capas
| Capa | Dónde | Nivel |
|---|---|---|
| Voz | `clean.mp4` (limpia en Adobe Podcast, Enhance v2 ~61%) | −14 LUFS en la mezcla del motor |
| Música | `Music:` en `edit.md` (`assets/audio/musica_base.mp3` o una nueva) | `Music level: -12` (≈ −17 dB bajo la voz). A −18 no se oye |
| Audio del reel | solo en el hook, en `mezcla_final.sh` | −1 dB, fade 0.5 s al final |
| Jingle | `assets/audio/jingle.wav`, solo en la tarjeta del título, justo después de su frase | normalizado a −14 LUFS, 1.86 s de sonido |

El motor (`build.py`) mezcla voz y música; el jingle y el audio del reel se agregan después con `mezcla_final.sh`.

## Jingle de la serie
ElevenLabs Music v2.5 (flow `X17PRTqAtdUFtx4oDgSk`, nodo del jingle). Prompt: sting de concurso retro, metales,
voz femenina con acento mexicano cantando «¿Es real o es hype?», 4 s, letra personalizada. Pablo eligió la toma B.
Pablo rechazó las voces habladas (TTS): «demasiado lento y no cantadas». Si hace falta otro, cotiza y genera 3 tomas.
El widget de ElevenLabs le falla: baja siempre los archivos y mándaselos.

## Música nueva
ElevenLabs Music v2.5 instrumental del largo del Short; `estimate_only` primero, cotiza en USD, 2 tomas, que elija de oído.

## Entrega
Dos pasadas de `loudnorm` a −13 LUFS / TP −2, luego `alimiter=limit=0.83` a 192 kHz → −13.3 LUFS, pico −1.8 dBFS.
En zsh escribe `${VAR}` antes de `:` (`$OFF:linear` se rompe).

## Ruidos
- Cada corte del motor lleva fades de 12 ms: los cortes no hacen clic.
- Los clics cortos de EP1 venían de la toma (boca o el micrófono en la mano), a media palabra. Adobe los baja 50–75%.
- `adeclick` de ffmpeg casi no los toca. Si molestan: bajar solo agudos (>3 kHz) −20 dB por 8 ms en cada clic.
- Arma un audio A/B (voz original / Adobe / final, 3 s por momento) para que Pablo identifique el ruido de oído.
- Zumbido de fondo del set: tonos en 221 Hz y 1465 Hz a −54 dB; Adobe lo quita.
