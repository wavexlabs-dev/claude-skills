# Reel "Jeep 94" · guion y plan (17 nov 2026)

Formato: **reel vertical 9:16** (como los anteriores). Tomas horizontales en 4K: el recorte vertical a pantalla completa sale nítido y la cara cabe completa (medido con `layout.py`).
Fuentes: video de Muhammad Zulali (`Downloads/Claude reverse engineered my 32-year-old Jeep…mp4`) y https://www.anthropic.com/research/claude-electronics-design (9 nov 2026).
C0873 (GTA 6) es otro reel; C0868 es una prueba sin voz. No se usan aquí.

## 1. Cortes elegidos (mirando a cámara)
Comparé cada frase en las dos tomas (`work/mirada/*.jpg`). C0872 mira a la lente casi siempre; C0871 baja la mirada más seguido.

| # | Toma y tramo | Texto | Por qué esa toma |
|---|---|---|---|
| 1 | C0871 4.3–11.6 | Un tipo usó IA para hackear su Jeep de 1994, y en una de las pruebas Claude prendió la bomba de gasolina desde su laptop. | Es el mejor gancho: solo esta toma trae lo de la bomba |
| 2 | C0872 17.1–28.6 | Muhammad Zulali estaba teniendo problemas porque su Jeep no pasaba la prueba de emisiones, la famosa verificación. Cambió el sensor de oxígeno… volvió a hacer la prueba y le fue peor. | Mira a cámara |
| 3 | C0872 29.5–48.4 | Y como el Jeep era de 1994, ni siquiera tenía el puerto que usan los escáneres modernos. Así que agarró un Arduino de 3 dólares y lo usó para conectar la computadora del Jeep a su laptop. | Mira a cámara |
| 4 | C0872 49.3–61.0 | Él manejaba y Claude iba leyendo los datos… El escáner decía que el Jeep estaba agregando gasolina, pero… la estaba quitando. | Mira a cámara |
| 5 | C0872 62.1–68.0 | Quería cambiar el programa de la computadora, pero la placa era tan vieja que le faltaba un circuito para reprogramarla. | Mira a cámara |
| 6 | C0872 69.1–75.3 | Y ahí entró Codex. Encontró una forma de que el Jeep ejecutara un pedacito de código nuevo. | Primera versión ("nuevo"); la segunda dice "viejo" |
| 7 | C0872 82.3–98.3 | Volvió a llevarlo a la prueba y esta vez sí la pasó. Él puso los cables y manejó, Claude hizo casi todo el diagnóstico y Codex se encargó del código. | 83–88 mira a cámara; 89–98 baja la mirada → va con gráfico |
| 8 | C0871 109–119.5 | Si Claude pudo prender la bomba de gasolina de una Jeep del 94, ¿qué pasaría si le pidiéramos que diseñara un aparato desde cero? | C0872 repite la pregunta tres veces y cierra los ojos |
| 9 | C0872 127.0–141.3 | Anthropic ya hizo esta prueba… un altavoz para llamadas… eligió las piezas, diseñó la placa y la carcasa, escribió el código. Un equipo de ingenieros lo armó y funcionó. | Las dos bajan la mirada → va con gráfico |
| 10 | C0872 143.3–153.4 | Si te gustaría ver cómo usar Claude y Codex para controlar hardware… comenta "hardware" aquí abajo y sígueme. | Mira a cámara |

Duración estimada: ~112 s de voz → ~99 s sin silencios → **~82 s a 1.2x**. Más largo que la Kindle (66 s).

## 2. Por confirmar contigo
1. **"Cambió el sensor de oxígeno y le fue peor"** (tramo 2): en el video de Muhammad no lo dice. Él dice que **no quería** cambiar la pieza y volver a fallar; el sensor de O2 solo sale como parte del diagnóstico. Propongo cortar esa frase: "…no pasaba la verificación. Y como el Jeep era de 1994…".
2. **"Agregando gasolina"**: la transcripción dice "arreglando". Lo correcto es "agregando" (+22 % de combustible). Confírmalo de oído.
3. **Duración ~82 s.** Si lo quieres más corto, lo que menos pierde es el tramo 7 (roles), que se puede resumir en un gráfico.
4. **Imágenes del video de Muhammad**: usarlas da prueba real, pero son de él. Opción A: crédito en pantalla y le pides permiso. Opción B: no usarlas y hacerlo todo en código.

## 3. Hoja de hechos (lo único que sale escrito)
| Dato | Fuente |
|---|---|
| Jeep Cherokee XJ 1994, falla la prueba de emisiones de California por NOx alto a 25 mph | Muhammad, min 0:30 |
| Sin puerto OBD2; Claude descubrió el protocolo SCI y usaron un Arduino Nano de 3 dólares como traductor | Muhammad |
| El escáner decía +22 % de combustible; Claude confirmó que la computadora quitaba combustible | Muhammad |
| Claude encendió la bomba de gasolina por su cuenta (~10 s) | Muhammad |
| La computadora era de diciembre de 1993, cuatro meses antes de que fueran reprogramables | Muhammad |
| Codex mandó un programa diminuto que la computadora corre ~90 veces por segundo, guardado en la EEPROM | Muhammad |
| Pasó la prueba. "Claude hizo casi todo el diagnóstico, Codex casi todo el trabajo de memoria, yo los cables y el manejo" | Muhammad, final |
| Claude diseñó un altavoz USB-C para llamadas (además de un hub de voz y una mascota virtual): esquemas, placa, carcasa imprimible y firmware | Anthropic, 9 nov 2026 |
| Diode Computers armó y probó los tres; funcionaron sin corregir los circuitos. Son prototipos sin certificar | Anthropic |

## 4. Escenas (aplicando las reglas v0.3)
Recurso especial que **no** usamos en la Kindle: motion graphic de datos y figura isométrica (Hairline). Nada de 3D esta vez.

| # | Voz | Pablo | Fondo (familia) | Elemento |
|---|---|---|---|---|
| 1 | Gancho, bomba de gasolina | **Completa** | toma | Subtítulos 2–3 palabras |
| 2 | No pasaba la verificación | **Completa** | toma | Titular bajo la barbilla: "Jeep 1994. No pasa la verificación." |
| 3 | Sin puerto · Arduino de 3 dólares | Burbuja | **Naranja** | Figura isométrica: Jeep → Arduino → laptop, la señal viaja por el cable. Precio "$3" en grande |
| 4 | Claude lee los datos · el escáner mentía | **Tarjeta** | **Ink + medidor** | Motion graphic: "+22 %" en un medidor que se voltea a "−" en naranja |
| 5 | La placa era tan vieja | **Completa** | toma | Titular: "Diciembre de 1993." |
| 6 | Entra Codex | Burbuja | **Azul** | Terminal simulada: un programa de 8 líneas que se escribe y "corre 90 veces por segundo" |
| 7a | Esta vez sí pasó | **Completa** | toma | Titular "PASÓ." con sello |
| 7b | Roles (mira abajo) | sin cámara | **Paper** | Infografía de tres columnas: Muhammad = cables y manejo · Claude = diagnóstico · Codex = código |
| 8 | ¿Y si diseñara un aparato desde cero? | **Completa** | toma | Titular con la pregunta |
| 9 | Anthropic: el altavoz | Burbuja | **Foto de la fuente a sangre** (figura del artículo, en grises) | El altavoz y la placa; crédito "Anthropic, nov 2026" |
| 10 | Comenta "hardware" | **Completa** | toma | Titular: palabra "hardware" en naranja |

Cuenta previa: Pablo grande ≈ 55 % · familias de fondo: toma, naranja, oscuro, azul, claro, foto = 6, con naranja · nunca dos burbujas seguidas · hueco titular–elemento 90–140 px en cada escena gráfica.

Sonido: solo objetos que se ven (clic del cable en el Arduino, teclas en la terminal, golpe del sello "PASÓ" como acento único).
Revisión antes de enseñarte: verificador + crítico a ciegas (ya automático).
