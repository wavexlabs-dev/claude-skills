# Errores que ya cometimos (no repetir)

Pablo los marcó en EP1. Revisa esta lista antes de mandar cualquier borrador.

| Error | Qué pasó | Cómo evitarlo |
|---|---|---|
| Texto o jingle en el hook | La píldora y el jingle al inicio arruinaban la expectativa | Hook limpio: solo él viendo el reel + audio del reel |
| Toma estirada en la apertura | Su video escalado y movido hacia abajo, la tarjeta le tapaba la cara | Pantalla completa, zoom 1.3, tarjeta chica abajo a la izquierda; revisa el cuadro 0 |
| Cuadros sueltos en un corte | 3 cuadros de la toma de relleno antes de «Analizando»; 3 cuadros tras la mano en «Vamos» | `tira_cortes.sh` y mirar cada tira |
| Subtítulo encima del título | «analizando este» apareció sobre «¿Es real o es hype?» | `ajustar_subtitulos.py` y límites de escena en el silencio real |
| Cortes a media palabra | Siete cambios de escena caían a la mitad de «pantalla», «animar», etc. | Pon los cambios dentro de un silencio (`silencedetect -40dB`) |
| Audio del reel quitado | La apertura salió muda y el hook perdía fuerza | Sumar el audio original del reel en el hook |
| Mencionar algo que no se ve | Decía «Ads Manager» pero la pantalla era otra plataforma | La grabación de pantalla tiene que ser de lo que dice |
| Zoom que corta lo importante | El zoom de Google cortaba «Swarm Rebuild» | Verifica cada zoom en un cuadro: que se lea completo |
| Jingle sobre su voz | Se repetirían las mismas palabras | Jingle después de su frase, con hueco si hace falta |
| Disco lleno | El render falló a media revisión | `df -h` antes; borrar intermedios regenerables |
| Variables en zsh | `$OFF:linear` → zsh lo leyó como modificador; listas sin separar en `for` | `${VAR}`; arma listas en Python o bash |
| Renderizar donde no pidió | Se lanzó el 4K en la Mac cuando él quería probar Higgsfield | Hacer el render donde Pablo dijo; preguntar si cambia el plan |
