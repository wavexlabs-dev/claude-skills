# Formato del episodio

Duración objetivo: 60–90 s a 1.2x. EP1 duró 90.8 s. Plantilla completa: `assets/ejemplo-ep1/edit.md`.

| # | Bloque | Layout | Qué se ve | Qué se oye | EP1 |
|---|---|---|---|---|---|
| 1 | **Hook** | b-roll (`apertura.mp4`) | Pablo viendo el reel en el celular, zoom 1.3 a pantalla completa; el reel como tarjeta redondeada abajo a la izquierda. Termina en su cara de duda. | Solo el audio original del reel (−1 dB, fade en el último medio segundo) | 0–6.8 s |
| 2 | **Planteamiento** | a-roll | Pablo a cámara | «Lo que menos me gusta de la IA es el hype…» | 6.8–13.6 |
| 3 | **Prueba de que es viral/falso** | split | El reel arriba (zoom a la parte clave), Pablo abajo | «muchos videos… son falsos» | 13.6–17.2 |
| 4 | **Título de la serie** | b-roll + `graphic: titulo.html` | Pantalla completa morada: píldora «NUEVA SERIE · EP N», «¿Es real / o es **hype**?», «Lo que ves de IA en internet, a prueba». Sin Pablo a cámara. | Su voz: «…esta nueva serie llamada ¿Es real o es hype?» y **después** el jingle (1.9 s) | 17.2–22.9 |
| 5 | **Análisis** | punch / split con el reel | Qué afirma el video y qué es en realidad | «Analizando este video…» | 22.9–35.8 |
| 6 | **Tutorial / demostración** | split con su grabación de pantalla | Cómo replicarlo, paso a paso, con zooms a lo que se lee | «Te voy a enseñar…» | 35.8–76.9 |
| 7 | **Veredicto** | split + `graphic: veredicto.html` | «VEREDICTO», sello HYPE (o REAL), ✕ lo falso, ✓ lo que sí es | Su conclusión | 76.9–83.4 |
| 8 | **Regreso al viral** | split con el reel | El video original otra vez | Remate | 83.4–89.6 |
| 9 | **Cierre** | a-roll | «Espero que te haya servido» y su mano tapando la cámara | — | 89.6–90.8 |

## Reglas del formato
- **El hook crea expectativa**: nada de texto, píldora ni jingle en los primeros segundos. Pablo prefiere que la
  presentación de la serie llegue cuando él la dice.
- **La frase de la serie la dice Pablo** con su voz; el título la acompaña palabra por palabra y el jingle remata.
  Si hace falta espacio para el jingle, inserta ~2 s de su toma en silencio (va tapada por el título).
- **El título no lleva subtítulos encima**: los límites de la escena van en los silencios reales.
- **Pruebas reales**: grabación de pantalla propia del proceso (en EP1, la extensión Swarm Rebuild sobre su
  Ads Manager). Si la grabación muestra datos sensibles (pagos, cuentas), pregúntale si los tapa.
- **Ritmo**: alterna cámara y pantalla; cada pantalla dura lo que dura la frase que la explica (acelera la
  grabación con `setpts` si hace falta, p. ej. 1.4x en el swarm del EP1).
- **Marca de la serie**: el jingle (`assets/audio/jingle.wav`) solo suena en la tarjeta del título.
- **EP siguientes**: cambia «NUEVA SERIE · EP 1» por «¿ES REAL O ES HYPE? · EP N» (o lo que Pablo prefiera; pregúntale
  en el EP2) y el sello del veredicto a REAL cuando aplique.
