// Lee de la página lo que el verificador necesita medir. Lo llama verificar.py; no se usa solo.
// Contrato: la página expone window.render(t), const DUR y window.ESTADO(t) -> {id, camara, fondo, titular, elemento}
//   camara: 'completa' | 'tarjeta' | 'burbuja' | 'ninguna'      fondo: 'toma' | 'oscuro' | 'claro' | 'azul' | 'naranja' | 'textura' | 'patron' | 'mundo'
//   titular / elemento: selectores CSS de la escena (o null si no tiene).
import { chromium } from 'playwright-core'; import { pathToFileURL } from 'url'; import fs from 'fs';
const html = process.argv[2] || 'index.html', out = process.argv[3] || 'out/verificar_dom.json';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(html).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const info = await p.evaluate(() => ({ dur: typeof DUR !== 'undefined' ? DUR : null, ok: typeof window.ESTADO === 'function' }));
if (!info.dur || !info.ok) { console.error('La página debe declarar DUR y window.ESTADO(t). Ver scripts/verificar.mjs.'); process.exit(2); }
const seg = []; const paso = 0.1;
for (let t = 0; t < info.dur; t += paso) { const e = await p.evaluate(t => window.ESTADO(t), t); const u = seg[seg.length - 1];
  if (u && u.id === e.id && u.camara === e.camara) u.t1 = t + paso; else seg.push({ ...e, t0: t, t1: t + paso }); }
seg[seg.length - 1].t1 = info.dur;
for (const s of seg) { if (!s.titular) continue;                     // ¿cuánto tiempo queda el titular completo en pantalla?
  s.completo = null;
  for (let t = s.t0; t < s.t1 - 1e-6; t += paso) { await p.evaluate(t => window.render(t), t);
    const ok = await p.evaluate(a => { const T = document.querySelector(a); if (!T || !T.innerText.trim()) return false;
      const vis = e => { for (let x = e; x && x.nodeType === 1; x = x.parentElement) if (+getComputedStyle(x).opacity < .95) return false; return true; };
      const hojas = [...T.querySelectorAll('*')].filter(e => !e.children.length && e.textContent.trim()); return (hojas.length ? hojas : [T]).every(vis); }, s.titular);
    if (ok) { s.completo = t; break; } } }
for (const s of seg) { if (!s.titular || !s.elemento) continue;
  const t = s.t0 + 0.7 * (s.t1 - s.t0); await p.evaluate(t => window.render(t), t);
  await p.evaluate(() => Promise.all([...document.images].filter(i => i.src).map(i => i.decode().catch(() => 0))));
  s.medido = t; s.cajas = await p.evaluate(([a, c]) => {
    const R = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const T = document.querySelector(a), E = document.querySelector(c); if (!T || !E) return null;
    let el = R(E), src = null, nat = null;
    if (E.tagName === 'IMG') { src = E.currentSrc || E.src; nat = [E.naturalWidth, E.naturalHeight]; }
    else if (el.w < 2 || el.h < 2) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;                 // contenedor sin tamaño: unión de sus hijos visibles
      for (const k of E.querySelectorAll('*')) { const r = k.getBoundingClientRect(); if (r.width < 2 || getComputedStyle(k).opacity < .3) continue; x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
      el = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }
    return { titular: R(T), elemento: el, src, nat, texto: T.innerText.replace(/\s+/g, ' ').trim() }; }, [s.titular, s.elemento]); }
fs.mkdirSync('out', { recursive: true }); fs.writeFileSync(out, JSON.stringify({ dur: info.dur, seg }, null, 1)); await b.close(); console.log('ok', out);
