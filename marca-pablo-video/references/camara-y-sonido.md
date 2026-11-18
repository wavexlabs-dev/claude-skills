# Cámara, encuadres y sonido

## Set y cámara
- Pablo sentado al escritorio, plano medio, cámara 4K 29.97 fps (Sony, clips `C08xx.MP4`), luz morada al fondo.
- Grabaciones de pantalla de la Mac en paralelo; sincronizar por audio.

## Encuadres (sobre el 4K 3840×2160)
| Nombre | Filtro ffmpeg | Uso |
|---|---|---|
| MEDIO | `scale=1920:1080` (cuadro completo) | por defecto; obligatorio bajo gráficos y con Cody |
| CERRADO | `crop=3200:1800:272:40,scale=1920:1080` (1.2×) | alternar en cortes de salto; nunca más de 1.2× |
| DESPLAZADO | `crop=3428:1928:0:120,scale=1920:1080` | cuando un gráfico necesita más columna libre |
| VERTICAL | `crop=1215:2160:1265:0,scale=1080:1920` | teaser/reels; internos a 1.05× para disimular saltos |

## Subtítulos del teaser / reels
Inter Tight 800, 76 px, 2–3 palabras, placa `rgba(11,10,18,0.8)`, arriba a ~290 px cuando Cody o las manos ocupan
abajo; debajo de la barbilla si el cuadro está limpio. Nada de titulares mientras habla.

## Mezcla
- **Episodio YouTube:** −15 LUFS integrados, pico −1.5 dBTP. Música base −21 dB, baja −4 dB bajo la voz, sube +5 dB en
  separadores con rampas.
- **Teaser/Reels:** ≈ −12 LUFS, −1.5 dBTP. Voz: `highpass=f=85`, `acompressor=threshold=-26dB:ratio=3.5:makeup=9`.
  Voz ≥ 10 dB sobre música. Sfx con golpe alineados por su pico al corte (hit, whoosh+boom, riser+hit).
- **Música** (`assets/plantillas/music.json`): progresiva sintetizada, 90 bpm, Dmaj9 / Bm9 / Gmaj9 / Asus — cálida y
  nocturna. Generarla con `npm run music` del motor de `estudio-video-codigo`.
- Claude no oye: medir y que Pablo escuche.

## Ritmo
- Alternar seguido entre la pantalla y la toma a cámara para dar dinamismo, salvo cuando la voz señala la pantalla ("aquí", "miren", "clic") o hay acción en la app.
