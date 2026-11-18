# Revisión antes de enviar

En las primeras rondas, cada corrección rompió algo ya aprobado. Esta lista se revisa completa en cada entrega, mirando las hojas de contacto de `scripts/revisar.py`.

## Lista
**Composición**
- [ ] Cada escena: un fondo, un elemento principal, un bloque de texto.
- [ ] Ningún fondo repetido en escenas seguidas; círculo una vez como mucho.
- [ ] Un acento naranja por escena.
- [ ] Recortes en blanco y negro; Pablo a color.
- [ ] Nada importante fuera de y=280–1640 ni de x=90–990. Créditos y notas incluidos.
- [ ] Nada de la lista de rechazados de `identidad.md`.

**Texto**
- [ ] Una sola familia por titular; solo sans serif; nada menor a 22 px.
- [ ] El titular describe lo que la imagen muestra (no otra cosa).
- [ ] Cada frase y cifra está en la hoja de hechos; salvedades a tamaño legible (≥30 px).
- [ ] Texto traducido sin comillas de cita; cifras aproximadas dichas como aproximadas.
- [ ] Ritmo de lectura ≤3 palabras por segundo, y el texto completo queda ≥1.5 s.
- [ ] Ortografía y acentos.

**Cámara** (formato A)
- [ ] Cara completa en todos los cuadros de todos los layouts, también durante el cambio.
- [ ] 2–3 cambios de layout como máximo en 15 s, cada uno con motivo.
- [ ] Ningún gráfico sobre la cara; labios en sincronía (revisar una "p" o "b").

**Movimiento**
- [ ] Primer cuadro = portada con el titular completo.
- [ ] 0 tramos congelados de 0.5 s o más.
- [ ] Mirar todos los cuadros de cada cambio de escena: sin cuadros vacíos, sin texto a medias, sin parpadeos.
- [ ] La acción clave no ocurre mientras el titular todavía se lee.

**Sonido**
- [ ] `mezcla.py` sin avisos. Cada cue tiene objeto.
- [ ] −14 ± 1 LUFS, pico ≤ −2 dBFS, medidos en el mp4 final.
- [ ] La música llega hasta el final; el cierre no queda mudo.
- [ ] Espectrograma mirado.

**Entrega**
- [ ] 1080×1920, 30 fps, con audio.
- [ ] Dicho: qué se midió, qué no se pudo verificar, qué falta oír, permisos de imágenes por confirmar, costo gastado.

## Crítico a ciegas
Un subagente nuevo (`general-purpose`) que no vio la construcción. Darle solo el video y la fuente (la transcripción o el artículo). Su opinión es información: **verificar cada hallazgo** contra los cuadros o los archivos antes de corregir, y anotar en la bitácora cuáles se confirmaron.

Prompt base:

```
Eres un editor exigente de video vertical para redes. No participaste en hacer este video. Revísalo como
lo vería alguien en su teléfono, sin contexto.

Video: <ruta absoluta>. Fuente de los hechos: <ruta o URL>.

Método, en este orden:
1. Extrae un cuadro cada 0.2 s y todos los cuadros de ±0.3 s alrededor de cada cambio de escena. Míralos.
2. Mide el audio: volumen integrado y pico (ebur128), tramos mudos, y el espectrograma. No puedes oír:
   dilo y limita tus juicios de audio a lo que mides.
3. Comprueba cada frase y cifra en pantalla contra la fuente.

Reglas de la pieza que debes verificar: un fondo, un elemento y un bloque de texto por escena; solo sans
serif, una familia por titular; todo dentro de y=280–1640; la cara de la persona nunca cortada; ningún
tramo quieto >= 0.5 s; primer cuadro con el titular completo; texto legible al ritmo en que aparece;
solo suenan objetos que se ven, nunca los cortes.
Además: el titular y su elemento son un bloque (90–140 px entre la última línea del titular y el borde visible
del elemento; mide ese hueco en cada escena gráfica); la persona abre a pantalla completa y se le ve grande
(completa o tarjeta) al menos la mitad del tiempo, nunca dos escenas seguidas en recuadro chico (mide el
porcentaje); al menos cinco familias de fondo distintas a simple vista por minuto, con un fondo naranja, y
nunca el mismo fondo en dos escenas seguidas; cada titular completo ≥1.5 s; lo que dice la pantalla coincide
con lo que dice la voz (transcribe y compara).

Entrega:
- Calificación 1–10 en: fondo y atmósfera, cámara y movimiento, revelación de cada escena, tipografía,
  pulido. Cuenta la más baja.
- Hallazgos numerados, del más grave al más leve, cada uno con el segundo exacto, el cuadro que lo
  prueba y una corrección concreta. Separa hechos medidos de opiniones.
- Veredicto: "listo", "una pasada más" o "rehacer".
No suavices. No felicites.
```

Parar al llegar a 8, o tras dos rondas con la misma calificación. Referencia: el explainer v2 sacó 6.5 con 13 hallazgos; la v3 y la v4 no han pasado segunda ronda.

Más detalle de este método en `reglas-heredadas.md` (sección Crítico nuevo).

## Comprobaciones añadidas (14 nov 2026)
Antes de entregar, además de lo anterior:
1. **Hueco titular–elemento** de cada escena gráfica: 90–140 px (ver `identidad.md`, "Composición"). Medirlo en un cuadro fijo.
2. **Tiempo con Pablo grande**: ≥50 % del total; apertura completa suya; nunca dos gráficos con burbuja seguidos (`camara.md`).
3. **Familias de fondo**: ≥5 en 60 s, con un naranja (`fondos.md`, regla 12).
4. **Voz cortada**: volver a transcribirla ya cortada y leerla entera; revisar palabras de más de 1 s y silencios largos a media frase en la transcripción original (ahí se esconden falsos arranques repetidos).
5. **Renders con fondo transparente**: que la caja del alfa no toque el borde de la imagen.
6. **Luz de la toma** contra una toma aprobada (`camara.md`, "Igualar la luz").

## Verificador automático (16 nov 2026)
`scripts/verificar.py` convierte en mediciones las comprobaciones 1–5 de arriba y el volumen. Probado contra "Pablo's Time" v7: reprobó 11 de 17 reglas, las mismas que Pablo había señalado a mano (hueco de 236–463 px en seis escenas, 47 % de tiempo grande, 3 familias de fondo sin naranja, fondo claro repetido).
Límites que hay que conocer:
- **La voz:** whisper borra los titubeos. Un "de ahí… de ahí extrae" se transcribe como un solo "extrae" largo. El verificador marca las palabras que duran de más para sus letras; es una sospecha, no una prueba. Esos puntos los confirma Pablo de oído.
- El hueco se mide al 70 % de cada escena, sin contar rotaciones; si el elemento entra tarde, medir a mano.
- No juzga gusto: que algo pase no significa que se vea bien. Para eso está el crítico, y al final Pablo.
- Las familias de fondo las declara la página: declarar la que **se ve** (un papel milimétrico es "claro", no "patron").

### Primera corrida real del crítico (16 nov 2026, "Pablo's Time" v7)
Calificación 5/10, veredicto "una pasada más", 12 hallazgos. Confirmados contra el código y los cuadros: cuatro titulares sobre cámara completos solo 0.4–0.7 s; primer cuadro sin titular; la escena del cable con cuatro cosas a la vez (titular, terminal, Kindle, burbuja) y terminal ilegible; pantalla "solo pasan 4" contra voz "4 o 5 puntos"; subtítulos del gancho a 3.9 palabras por segundo; sin cola de audio al final; Kindle fuera de la zona segura en dos escenas. Coincidió con el verificador en hueco, tiempo grande y fondos.
Lecciones: (1) darle una fuente que exista: copiar el README o la hoja de hechos a la carpeta del proyecto, no a una carpeta temporal; (2) el crítico ve lo que el verificador no mide (saturación, legibilidad, coherencia pantalla–voz) y el verificador mide con más exactitud lo que declara la página; se necesitan los dos; (3) de sus hallazgos salió una regla nueva para el verificador: titular completo ≥1.5 s.

### Lo que enseñó el reel "Jeep 94" sobre la voz (17 nov 2026)
Pablo graba repitiendo frases a media oración ("ni siquiera tenía… / ni siquiera tenía el puerto"). El recorte de silencios las deja pegadas. En este reel hubo **tres**: "ni siquiera tenía", "y lo usó para conectar la", "le pidió a Claude que diseñara un a…".
- **El modelo grande (`whisper-large-v3-turbo`) las esconde**: las funde en una palabra larga. El modelo chico (`whisper-small`) del verificador sí las mostró como "palabras repetidas seguidas". Usar los dos: el chico para encontrar, el grande para leer el texto.
- Para confirmar una sospecha: transcribir por separado cada pedazo de voz entre silencios. Si los dos pedazos empiezan igual, es repetición.
- Cortar en el silencio que separa los intentos y quedarse con el **segundo** (casi siempre es el bueno).
- El chequeo se hace **antes** de mandarle la voz a limpiar.

**Método que sí las encuentra todas: `scripts/piezas.py`** (17 nov 2026). Transcribe con el modelo grande **cada trozo de voz entre silencios por separado** (≥0.24 s bajo −40 dB) y los lista en orden. Un falso arranque se ve a simple vista: dos o tres trozos seguidos que empiezan igual ("así que Mo… / Así que Muhammad agarró una… / Así que Muhammad agarró un Arduino"). En el reel "Jeep 94" encontró **siete** repeticiones; la transcripción completa (grande o chica) solo mostró tres. Se corre sobre los tramos de `prep.py` **antes de mandar la voz a limpiar**, y se conserva el último intento.
Los tiempos de escena no se parchan a mano tras cada recorte: la página ancla sus tiempos a las palabras (`mapa.js`, generado por `prep.py`; modelo en `assets/ejemplo-jeep94/`).

### Segunda corrida del crítico (17 nov 2026, "Jeep 94" V1): encontró errores que el verificador no ve
Calificación 4/10. Confirmados en el código: (1) **subtítulos desfasados y con palabras perdidas** tras los recortes, porque usaban la línea de tiempo vieja; ahora salen de transcribir la voz final (`subs.js`); (2) **créditos invisibles**: la etiqueta vivía dentro del recuadro con `overflow:hidden`; (3) **titular del gancho distinto de la voz** ("Claude hackeó" contra "un tipo usó IA para hackear"); (4) un clip de terceros que empezaba y terminaba con cuadros de otra escena; (5) la burbuja tapando justo el objeto del que se habla; (6) tres cortes de oscuro a oscuro que se leen como el mismo fondo.
Reglas que salen de aquí: subtítulos siempre desde la transcripción de la voz final; los créditos se comprueban en un cuadro renderizado; el titular dice lo que dice la voz; los clips de terceros se revisan cuadro por cuadro de principio a fin; contar familias de fondo **por cómo se ven**, y evitar cortes oscuro→oscuro (la toma de Pablo cuenta como oscuro).


## Cortes que se comen palabras (18 nov 2026, "Jeep 94")

Pablo: "hay palabras que las cortas antes de que terminen, y se siente muy acelerado y mal cortado". Los finales de tramo elegidos a ojo con la transcripción caen sobre la última sílaba: whisper marca el fin de la palabra antes de que termine el sonido (el "cuatro" de 1994, la "s" final).

Antes de mandar la voz a limpiar, medir **cada tramo que queda** en la toma original:
- **Fin**: energía de los últimos 30 ms y de los 80 ms siguientes. Si los dos pasan de −36 dB, el corte cae sobre voz. Mover el fin al primer punto bajo −40 dB; si después viene un intento repetido sin silencio de por medio, cortar en el valle entre palabras y confirmarlo transcribiendo **cada lado por separado** (el de antes debe terminar la frase completa, el de después empezar limpio).
- **Inicio**: dejar ~0.10–0.12 s de silencio antes de la voz (los inicios pegados a la primera consonante suenan mordidos).
- Fundido de salida de 25 ms en cada tramo (8 ms deja clic en las colas).
- Aire entre frases: PAD 0.12 al quitar silencios ≥0.30 s → ~0.2 s a 1.2x.
