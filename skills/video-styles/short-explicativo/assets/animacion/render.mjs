// node render.mjs <mode fail|win> <seconds> <out.mp4> [--stills t1,t2,...]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [mode = 'fail', secs = '9', out = `../broll/cueva_${mode}.mp4`, flag, list] = process.argv.slice(2);
const dur = Number(secs), FPS = 30, root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.woff2':'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
await new Promise(ok => srv.listen(0, ok));
const url = `http://127.0.0.1:${srv.address().port}/cueva.html?mode=${mode}&dur=${dur}`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_EXE, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 880 }, deviceScaleFactor: Number(process.env.DSF || 1) });
page.on('pageerror', e => console.error('pageerror', e.message));
await page.goto(url); await page.waitForFunction(() => window.__ready); await page.evaluate(() => document.fonts.ready);
const stage = page.locator('#stage');

if (flag === '--stills') {
  for (const t of list.split(',').map(Number)) { await page.evaluate(t => window.__frame(t), t); await stage.screenshot({ path: `${out}_${t}.png` }); }
} else {
  const ff = spawn('ffmpeg', ['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','-',
    '-c:v','libx264','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart', out], { stdio: ['pipe','inherit','inherit'] });
  const n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) { await page.evaluate(t => window.__frame(t), i / FPS); ff.stdin.write(await stage.screenshot({ type: 'png' })); }
  ff.stdin.end(); await new Promise(ok => ff.on('close', ok));
}
await browser.close(); srv.close(); console.log('ok', out);
