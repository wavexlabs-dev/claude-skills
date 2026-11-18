// Render cuadro por cuadro de una página que expone window.render(t), con FPS y DUR como constantes globales.
// Uso (desde la carpeta del proyecto, con `npm i playwright-core` hecho ahí):
//   node render.mjs                 -> todos los cuadros a frames/f_0000.jpg…
//   node render.mjs 0 3.5 9.48      -> solo esos tiempos, a out/t_3.50.jpg (para revisar antes del render largo)
//   node render.mjs --html otra.html 2.0
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'url'; import fs from 'fs';
const args = process.argv.slice(2); let html = 'index.html';
const hi = args.indexOf('--html'); if (hi >= 0) { html = args[hi + 1]; args.splice(hi, 2); }
const only = args.map(Number);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('requestfailed', r => errs.push('no cargó: ' + r.url()));
await p.goto(pathToFileURL(html).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const { FPS, DUR } = await p.evaluate(() => ({ FPS: typeof FPS !== 'undefined' ? FPS : 30, DUR: typeof DUR !== 'undefined' ? DUR : null }));
if (!DUR) { console.error('La página debe declarar `const DUR=…` (segundos)'); process.exit(1); }
fs.mkdirSync('frames', { recursive: true }); fs.mkdirSync('out', { recursive: true });
if (only.length) {
  for (const t of only) { await p.evaluate(t => window.render(t), t); await p.screenshot({ path: `out/t_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 85 }); }
  console.log('cuadros sueltos en out/:', only.join(', '));
} else {
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { await p.evaluate(t => window.render(t), i / FPS); await p.screenshot({ path: `frames/f_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 93 }); }
  console.log('RENDER_DONE', n, 'cuadros a', FPS, 'fps');
}
if (errs.length) console.error('ERRORES DE PÁGINA:\n' + [...new Set(errs)].join('\n'));
await b.close();
