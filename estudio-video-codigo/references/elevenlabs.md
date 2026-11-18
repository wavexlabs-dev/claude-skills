# Voz (recomendada), música y sfx con ElevenLabs

La voz del video se recomienda con ElevenLabs (cuenta + conector en Claude): es la que suena natural. Si la persona no
lo tiene, ofrecer conectarlo; la alternativa es que grabe su voz. Música y sfx con ElevenLabs son opcionales: por
defecto se hacen en código (`audio-en-codigo.md`). Nunca pedir ni manejar API keys en el chat.
Las tomas se guardan en `assets/tomas/` y pasan por `npm run sounds` igual que cualquier otra.

Todo pasa por un *flow*: se agregan nodos, se estima el costo, se generan tomas y se descargan.
Las herramientas del conector son diferidas: cargar con ToolSearch
`select:<prefijo>creative_create_flow,<prefijo>creative_add_flow_node,<prefijo>creative_run_flow_nodes,<prefijo>creative_get_generations,<prefijo>creative_list_voices,<prefijo>creative_get_model_schema`.

## Gasto: siempre con permiso
- Antes de generar, `creative_run_flow_nodes` con `estimate_only: true` y mostrar el total a la persona.
  Si supera lo anticipado, parar y preguntar.
- Costos observados (2026-10): sfx ~2–8 créditos por toma; voz v4 ~60–90 por línea corta; voz v3 ~115 por línea;
  música 30 s ~465 por toma (el estimado puede mostrar más). La música es casi todo el gasto: proponer una sola toma.

## Parámetros (validar con creative_get_model_schema si falla)
- **sfx** `eleven_text_to_sound_v2`: `{ duration_seconds (≥0.5), prompt_influence: 0.6–0.7 }`.
  Prompt: "Foley: <objeto> <acción>, one single …, close mic, quiet room, no music". "one hit only" para golpes.
- **música** `eleven_music_v2_5`: `{ duration_seconds, instrumental: true }`. Sin nombres de artistas ni marcas.
- **voz** `eleven_v4` (o `eleven_v3`): `voice_id` + `{ language_code: "es" }`. Escribir números con letras
  ("cuatro mil quinientos ochenta y cinco") y siglas como se dicen ("S uno") para que no las lea mal.
  Una línea por nodo: así se coloca cada una en su tiempo y se re-genera solo la que falle.

## Voces
- `creative_list_voices` con `languages`, `accent` (p. ej. mexican) y `use_cases`. Audicionar dos voces contrastantes
  con la misma línea y que la persona elija de oído. Si nombra una voz, buscarla por nombre y probarla.
- Medir la prueba: duración real del habla (umbral −40 dB) y pausas internas (`silencedetect=n=-38dB:d=0.1`).
  Con eso se recorta el guion y se ubican las palabras clave para los golpes.

## Descarga
`creative_get_generations` (máx. 4 ids por llamada) devuelve `full_res_url` firmada que vence en ~2 h.
Guardar cada toma como `assets/tomas/<nombre>_<toma>.mp3` con `scripts/descargar-eleven.sh`.
Las generaciones tardan: si salen `pending`, volver a pedirlas después de hacer otra cosa.

## Elegir tomas por medición
- Golpes: contar eventos (`silencedetect=n=-35dB:d=0.04`); preferir un solo evento y ataque rápido.
- Texturas: la de nivel más útil. Música: energía (dB RMS) cada 0.5 s para ver si sigue el arco pedido.
- Registrar la elección en `assets/sounds.json` y correr `npm run sounds`. La persona puede forzar otra toma
  después de escuchar: `npm run sounds -- tap=2` (no cuesta créditos).
- Claude no oye: el juicio final del audio es de la persona. Decirlo y mandar la mezcla para que la escuche.
