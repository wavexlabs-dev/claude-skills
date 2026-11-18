// Copia local del producto web para dibujarlo dentro del video, cuadro por cuadro.
// Inyecta un reloj controlado (performance.now y requestAnimationFrame) y movimiento reducido: el sitio queda
// como función del tiempo y del scroll, sin estado entre frames. Fuentes locales, nada de red.
// Configuración en brief/site.json:
//   { "source": "assets/capture/site.html", "fonts": [["Familia", "/assets/fonts/Archivo.ttf"]],
//     "patches": [{ "name": "__hideX", "find": "texto exacto del código", "replace": "if (!window.__hideX) texto…" }] }
// Cada parche es una compuerta que la escena liveSite prende entre dos tiempos (props.gates).
//   npm run site-copy   → site/index.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Config = { source: string; fonts?: [string, string][]; patches?: { name: string; find: string; replace: string }[] };
const cfg: Config = JSON.parse(readFileSync("brief/site.json", "utf8"));
const src = readFileSync(cfg.source, "utf8");

const faces = (cfg.fonts ?? []).map(([fam, url]) => `@font-face{font-family:'${fam}';src:url(${url})}`).join("\n");
const prelude = `<style>
${faces}
</style>
<script>
(() => {
  let now = 0;
  const queue = [];
  performance.now = () => now;
  window.requestAnimationFrame = (cb) => queue.push(cb);
  window.cancelAnimationFrame = () => {};
  const mm = window.matchMedia.bind(window);
  window.matchMedia = (q) => q.includes("prefers-reduced-motion")
    ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
    : mm(q);
  window.__setNow = (ms) => { now = ms; };
  window.__frame = (ms) => { now = ms; queue.splice(0).forEach((cb) => cb(ms)); };
})();
</script>`;

// Los reemplazos van como función: en una cadena de reemplazo, "$'" y "$&" son patrones (un 'US$' rompió un sitio).
let out = src
  .replace(/<link rel="(icon|apple-touch-icon|preconnect)"[^>]*>\n?/g, () => "")
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, () => "")
  .replace(/<head>/, () => `<head>\n${prelude}`);
for (const p of cfg.patches ?? []) {
  if (!out.includes(p.find)) throw new Error(`Parche ${p.name}: no se encontró el texto a reemplazar`);
  out = out.replace(p.find, () => p.replace);
  if (!out.includes(`window.${p.name}`)) throw new Error(`Parche ${p.name}: el reemplazo debe leer window.${p.name}`);
}
if (/fonts\.googleapis|https?:\/\/[^"']*\.(css|js)(["'?])/.test(out)) throw new Error("La copia del sitio todavía carga CSS o JS de la red");
// Valida que cada <script> siga siendo JavaScript válido después de los parches.
for (const [i, m] of [...out.matchAll(/<script>([\s\S]*?)<\/script>/g)].entries()) {
  try { new Function(m[1]); } catch (e) { throw new Error(`El script ${i} de la copia quedó inválido: ${(e as Error).message}`); }
}
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", out);
console.log("site/index.html listo");
