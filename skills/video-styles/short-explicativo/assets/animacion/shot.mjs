import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url'; import path from 'node:path';
const [html, out, sel = 'body'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_EXE });
const p = await b.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.resolve(html)); await p.locator(sel).screenshot({ path: out }); await b.close(); console.log('ok', out);
