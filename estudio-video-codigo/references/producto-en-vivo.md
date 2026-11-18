# Producto en vivo: el sitio real dibujado cuadro por cuadro

Cuando el producto es una web animada (canvas, juego, visualización), no se graba la pantalla ni se redibuja:
se carga una copia local en un iframe con el reloj reemplazado, y el video le pide cada cuadro.

## 1. Capturar
- Descargar el HTML (`curl -sL <url> -o assets/capture/site.html`). Si carga JS o CSS externos, bajarlos también
  y apuntar las rutas a la copia. Revisar el código: dónde vive el loop (`requestAnimationFrame`), de qué depende
  la cámara (scroll, hash, estado) y si respeta `prefers-reduced-motion` (con movimiento reducido suele dejar de
  arrastrar estado entre frames).
- Screenshots de referencia de cada escena del sitio (Playwright, `deviceScaleFactor: 2`) y un contact sheet.

## 2. Copia con reloj controlado
`brief/site.json` + `npm run site-copy` → `site/index.html`. El prelude inyecta:
- `performance.now()` y `requestAnimationFrame` controlados: `window.__frame(ms)` corre un cuadro a esa hora,
  `window.__setNow(ms)` fija la hora sin dibujar (para clics que guardan su timestamp).
- `matchMedia('(prefers-reduced-motion)')` → `true`.
- Fuentes locales en lugar de Google Fonts.

**Compuertas** (`patches`): envolver en `if (!window.__nombre)` el dibujo de algo que el video debe revelar
en su momento (un letrero que adelanta la cifra, un adorno que estorba la firma). La escena las prende con
`gates: [{ name, from, to }]`. El script valida que cada `<script>` siga siendo JS válido.

## 3. Tamaño exacto del canvas
El sitio suele calcular el tamaño de su canvas a partir de la ventana. Leer esa fórmula y elegir `frame.vw/vh`
del iframe para obtener un canvas que, multiplicado por una escala **entera**, llene el ancho del video
(p. ej. 480×199 ×4 = 1920 en 16:9; 270×199 ×4 = 1080 en 9:16). Poner `expect` en props: si el tamaño no
coincide, el render falla con un mensaje claro.

## 4. Cámara
- Si la cámara depende del scroll: medir el scroll de inicio de cada escena navegando por hash (con movimiento
  reducido el sitio salta sin animar) y describir la ruta en `scroll: [t0, t1, y0, y1, ease]`.
- Escenas con varias páginas: la cámara se queda en la página 0 (avanzar el scroll entra a otra página y cambia la escena).
- Derivas lentas a velocidad constante; cortes duros entre escenas lejanas, entrando caminando a la nueva.

## 5. Estado determinista
- Dibujar cada frame en **dos pasos** (t − 1 frame y t): reproduce el estado de un render en orden aunque los
  workers salten a la mitad.
- Clics del sitio (cambiar un año, tocar una campana) con `clicks: [{ at, selector, text }]`: se fija la hora del
  guion antes del clic para que el sitio registre el mismo timestamp en cualquier worker.
- Lo que el sitio actualiza por frame en vez de por tiempo (partículas, confeti) puede variar entre workers:
  revisarlo en frames de varios puntos.

## 6. Capas encima
HUD, diálogos y golpes se reconstruyen como escenas propias con la marca del sitio (colores y fuentes de su CSS),
porque deben animarse al ritmo de la voz. Orden de capas: mundo → golpes → HUD → diálogo → firma.
En 9:16, extender cielo arriba (repitiendo filas reales del canvas) y un subsuelo con textura abajo.

Referencia completa de una implementación con niveles, monedas y campana: el proyecto "El ascenso de Anthropic"
(escena `world.ts` con su mapa de niveles); la plantilla trae la versión genérica `src/scenes/live-site.ts`.
