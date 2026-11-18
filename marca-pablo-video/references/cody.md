# Cody — ficha de diseño

Fuente: las 4 vistas que generó Muse en la app (refs/cody_*.png, tomadas de las grabaciones de pantalla).

## Tamaño y proporción
- Mide unos **60 cm**: le llega a Pablo un poco arriba de la rodilla, como un niño de 2 años.
- Mide **2.2 cabezas** de alto. La cabeza y el torso son una sola pieza, sin cuello.
- Silueta de **frijol o pera**: angosta arriba, ancha y panzona abajo, con la parte de atrás redondeada.
- Mide de ancho como el 60 % de lo que mide de alto.

## Cuerpo
- Brazos cortos y gordos, como aletas. Salen de los costados a media altura, cuelgan pegados al cuerpo, llegan a la cadera y acaban en punta redonda, **sin dedos**.
- Patas cortas y anchas, separadas, como dos cilindros con pie redondeado. **Sin dedos.**
- No tiene cola, orejas ni cuello.

## Material
- Pelo afelpado **crema o hueso** (#E8DCC8 a #EFE6D6), corto y denso, como fieltro de lana o peluche de mohair.
- El pelo es más largo en el borde de la capucha y en los costados.
- Se ve como figura 3D de peluche: luz suave de estudio, sin brillos plásticos.

## Cara
- Hay una abertura ovalada al frente, como una capucha, a 2/3 de la altura.
- La cara es lisa, color **piel rosada clara** (#F3D9C8), con mejillas un poco más rosadas.
- Ojos: dos puntos negros chiquitos y separados.
- Boca: una sonrisa pequeña en "u", de línea fina.

## Accesorio (alterna)
- **Lentes de sol negros tipo wayfarer**: armazón negro brillante y micas oscuras. Tapan los ojos y descansan sobre la cara.
- **Alterna con y sin lentes** según la toma (decisión de Pablo, 2026-11-08): con lentes cuando está en modo cool o presumido; sin lentes cuando se le tienen que ver los ojos (curiosidad, travesura).

## Referencia oficial
- `sheet/cody_sheet_b.png` (character sheet B, aprobada por Pablo).
- Sin lentes, la cara es expresiva: ojos de punto que pueden achicarse, sonrisa traviesa abierta con dientes y cejitas cuando hace falta.

## Personalidad para animar
- Es tranquilo y cool, un poco travieso.
- Se mueve como pingüino de peluche: pasos cortos, se balancea de lado y el pelo rebota un poco.
- No habla en cuadro. Se expresa con el cuerpo: inclina la cabeza y mueve las aletas.

## Lo que NO es
- No es un fantasma (tiene patas y pelo, no es una sábana).
- No es un yeti alto ni con colmillos.
- No es un muñeco de nieve.
- No tiene dedos, orejas ni nariz.

## Cómo meterlo en tomas reales (resumen; proceso completo en la skill `video-largo-y-teaser`, `personaje-ia.md`)
- Referencias a mandar siempre: `assets/cody/cody_sheet_b.png` (+ `cody_turnaround_b.png` si hay giro).
- Cuadro clave: GPT Image 2.6 sobre el cuadro real; Cody del lado libre (derecha de Pablo en 16:9, abajo en 9:16).
- Video: Seedance 2.5 (Higgsfield `video_edit` o Sume `seedance-2.5`), 1080p, 4 s. Clip completo con la voz original.
- Escala: llega arriba de la rodilla de Pablo; sentado en el escritorio, la cabeza le queda a la altura del pecho.
- Lentes: con lentes = cool/presumido; sin lentes = curiosidad/travesura.
- Tomas hechas en EP1: intro, México, lentes, celular, ticket, despedida.
