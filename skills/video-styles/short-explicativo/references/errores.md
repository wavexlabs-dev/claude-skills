# Errores que ya cometimos (no repetir)

Pablo los marcó en los Shorts de Maya, Dreaming, Kindle y «¿Es real o es hype?». Revisa esta lista antes de mandar cualquier borrador.

| Error | Qué pasó | Cómo evitarlo |
|---|---|---|
| Cuadros sueltos en un corte | 3 cuadros de la toma de relleno antes de «Analizando»; 3 cuadros tras la mano en «Vamos» | `tira_cortes.sh` y mirar cada tira |
| Subtítulo encima del título | «analizando este» apareció sobre «¿Es real o es hype?» | `ajustar_subtitulos.py` y límites de escena en el silencio real |
| Cortes a media palabra | Siete cambios de escena caían a la mitad de «pantalla», «animar», etc. | Pon los cambios dentro de un silencio (`silencedetect -40dB`) |
| Mencionar algo que no se ve | Decía «Ads Manager» pero la pantalla era otra plataforma | La grabación de pantalla tiene que ser de lo que dice |
| Zoom que corta lo importante | El zoom de Google cortaba «Swarm Rebuild» | Verifica cada zoom en un cuadro: que se lea completo |
| Disco lleno | El render falló a media revisión | `df -h` antes; borrar intermedios regenerables |
| Variables en zsh | `$OFF:linear` → zsh lo leyó como modificador; listas sin separar en `for` | `${VAR}`; arma listas en Python o bash |
| Renderizar donde no pidió | Se lanzó el 4K en la Mac cuando él quería probar Higgsfield | Hacer el render donde Pablo dijo; preguntar si cambia el plan |
| Recorte horizontal de un clip vertical | Un «recorte vertical» de 1216x2160 hizo zoom a una esquina | Los clips Sony vienen con rotación −90; ffmpeg ya los rota |
| Proxy borroso | El proxy con `h264_videotoolbox` se veía más suave que el original | libx264 lanczos crf 12–14 |
| Música inaudible | A `Music level: -18` casi no se oía | `-12` cuando habla sin parar |
| Fondo del split | Negro o el blur del primer cuadro (mancha morada de la mano) se veían mal | `speaker_pad_image: broll/pad_estrellas.jpg` + `speaker_feather: 90` |
| Corrección de color exagerada | Medios a 0.55 se veía «HDR» | 0.45→0.51 y balance suave |
| Toma sin audio | C0836 se grabó con la pista a −83 dB | Revisa el nivel antes de editar y pide regrabar |
