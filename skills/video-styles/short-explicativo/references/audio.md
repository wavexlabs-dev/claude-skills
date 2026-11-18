# Audio

| Capa | Dónde | Nivel |
|---|---|---|
| Voz | `clean.mp4`, limpia en Adobe Podcast (Enhance v2 ~61%) | −14 LUFS en la mezcla del motor |
| Música | `Music:` en `edit.md` | `Music level: -12` cuando habla sin parar (≈ −17 dB bajo la voz). A −18 casi no se oye |
| SFX | `Sound effects: subtle` u `off` | sutiles; Pablo no quiere efectos llamativos |

## Biblioteca de música aprobada (archivos finales, no se regeneran)
| Archivo | Ambiente | Duración | Usado en |
|---|---|---|---|
| `assets/audio/musica_maya.mp3` | (sin descripción guardada: escúchala) | 112 s | Maya |
| `assets/audio/musica_memoria.mp3` | nocturna, curiosa, synth y arpegio 8-bit suave | 69 s | Dreaming |
| `assets/audio/musica_kindle.mp3` | mañana cálida, piano y synth, lo-fi suave | 71 s | Kindle (y EP1 de «¿Es real o es hype?») |
Elige la que mejor va con el tema y díselo a Pablo. Si el Short dura más que la pista, alárgala con crossfade de
la misma pista. Solo se genera música nueva si Pablo lo pide (ElevenLabs Music, cotizar antes, 2 tomas).

## Voz limpia
Exporta la voz de `work/clean.mp4` a WAV, Pablo la pasa por Adobe Podcast y regresa un WAV de la misma duración;
respalda `clean.mp4` y reemplaza el audio (`-map 0:v -map 1:a -c:v copy`, sin `-shortest`).

## Entrega
`scripts/entrega.sh`: loudnorm de dos pasadas a −13 LUFS / TP −2 + `alimiter=0.83` a 192 kHz → ~−13.3 LUFS,
pico −1.8. En zsh escribe `${VAR}` antes de `:`.

## Ruidos
Los cortes del motor llevan fades de 12 ms. Los clics cortos suelen venir de la toma (boca, micrófono en la mano);
Adobe los baja. Si molestan, baja solo agudos (>3 kHz) −20 dB por 8 ms en cada clic. Mándale un A/B para que
identifique el ruido de oído.
