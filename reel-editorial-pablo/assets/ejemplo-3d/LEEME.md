# Ejemplo: objeto real en 3D dentro de un reel ("Pablo's Time", nov 2026)
Reel de 66 s (1.2x) donde el objeto del que se habla, una Kindle, se modeló en Blender a partir de 4 fotos y se usó en cinco escenas. Proyecto completo: `Documents/Personal Brand/Kindle 3D/`.

## Flujo
1. **Fotos → modelo** (`modelar.py`): identificar el modelo exacto en las fotos, usar sus medidas reales y escribir la forma como aros unidos (bmesh) + booleanos. La pantalla va como pieza aparte con su imagen. Un objeto vacío padre para animar todo. Se ejecuta dentro de Blender (MCP) o con `Blender -b archivo.blend --python`.
2. **Poses con fondo transparente** (`escenas3d.py`): una cámara fija y se rota el padre. `MULT=2` duplica la resolución para 4K. Dejar margen: la caja del alfa no debe tocar el borde.
3. **Giro real** (`anim3d.py`): solo los cuadros donde el objeto de verdad gira (58 cuadros). También exporta `esquinas.js`: las cuatro esquinas de la pantalla en cada pose fija.
4. **Pantalla intercambiable en la página** (`index.html`, funciones `homog` y `pantalla`): sobre la pose fija se coloca la imagen de la pantalla con una homografía (`matrix3d`) y un parpadeo de tinta al cambiar. Así cambian portadas y páginas sin volver a renderizar en Blender.
5. **Toma** (`prep.py`): lista de tramos buenos, recorte de silencios, `V12=1` para 1.2x, `K4=1` para 4K, y la corrección de luz `LUZ`.
6. **4K**: `render4k.mjs` (deviceScaleFactor 2). Blender por MCP agota la espera con renders grandes pero sigue trabajando: lanzar y esperar los archivos.
7. **Clip del proceso** (`clip_giro.py`): giro sobre negro que pasa de malla a volumen y a terminado; sirve para contar el workflow.

## Lo que Pablo corrigió en este reel (leer antes de reutilizar `index.html`)
- Hueco excesivo entre titular y Kindle (260–340 px). **No copiar las posiciones de este ejemplo**: colocar el elemento 90–140 px bajo el titular.
- Demasiadas escenas gráficas con él en burbuja; se le ve grande ~47 % del tiempo y hay tramos gráficos de hasta 9 s seguidos.
- Poca variedad de fondo que se note: sin naranja, casi todo oscuro, claro o azul.
- Cortes a media palabra y un "de ahí" repetido que se detectaron tarde.
- La primera corrección de luz teñía todo el fondo; la buena está en `prep.py`.
