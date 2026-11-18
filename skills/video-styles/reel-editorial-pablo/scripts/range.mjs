import { chromium } from 'playwright-core'; import { pathToFileURL } from 'url';
const [a,b]=process.argv.slice(2).map(Number);
const br=await chromium.launch({channel:'chrome'}); const p=await br.newPage({viewport:{width:1080,height:1920}});
await p.goto(pathToFileURL(process.env.HTML||'index.html').href); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
for(let i=Math.round(a*30);i<Math.round(b*30);i++){ await p.evaluate(t=>window.render(t),i/30); await p.screenshot({path:`frames/f_${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93}); }
console.log('RANGE_DONE',a,b); await br.close();
