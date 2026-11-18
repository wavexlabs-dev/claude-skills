// Renderiza el thumbnail (1920×1080 → 1280×720 PNG/JPG) con Playwright del proyecto de video.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const variants = [["guia", "Guía completa"], ["probe", "Lo probé todo"], ["mx", "Ya en México"]];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [id, pill] of variants) {
  await page.goto("file://" + resolve("thumb.html") + "?pill=" + encodeURIComponent(pill));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.locator("#t").screenshot({ path: `full_${id}.png` });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `full_${id}.png`, "-vf", "scale=1280:720:flags=lanczos", `MiMuseYYo_EP1_thumb_${id}.png`]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `full_${id}.png`, "-vf", "scale=1280:720:flags=lanczos", "-q:v", "2", `MiMuseYYo_EP1_thumb_${id}.jpg`]);
}
await browser.close();
console.log("listo");
