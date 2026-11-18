// Frames sueltos para revisar sin renderizar todo: PNG por tiempo + contact sheet.
//   npm run frames -- --format 16x9 --at 0,1.5,3.2,6.9
//   npm run frames -- --format 9x16 --every 0.5
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { parseArgs } from "node:util";
import { chromium } from "playwright";
import { createServer } from "vite";
import type { VideoMeta } from "../src/engine";

const { values: args } = parseArgs({
  options: {
    format: { type: "string", default: "16x9" },
    at: { type: "string" },
    every: { type: "string" },
    cols: { type: "string", default: "4" },
    name: { type: "string" },
  },
});

const dir = `out/frames/${args.name ?? args.format}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const server = await createServer({ logLevel: "error", server: { port: 5198 } });
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: args.format === "9x16" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
  await page.goto(`${server.resolvedUrls!.local[0]}?render&format=${args.format}`);
  await page.evaluate(() => window.__ready);
  const meta = await page.evaluate(() => window.__video as VideoMeta);
  const times = args.at
    ? args.at.split(",").map(Number)
    : Array.from({ length: Math.floor(meta.duration / Number(args.every ?? 1)) + 1 }, (_, i) => i * Number(args.every ?? 1));
  for (const [i, t] of times.entries()) {
    const f = Math.min(meta.totalFrames - 1, Math.round(t * meta.fps));
    await page.evaluate((n) => window.__seek(n), f);
    await page.screenshot({ path: `${dir}/${String(i).padStart(3, "0")}.png` });
  }
  const cols = Number(args.cols);
  const w = args.format === "9x16" ? 270 : 480;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", "1", "-i", `${dir}/%03d.png`,
    "-vf", `scale=${w}:-1,tile=${cols}x${Math.ceil(times.length / cols)}:padding=4:color=0x333333`,
    "-frames:v", "1", `${dir}/sheet.png`,
  ]);
  console.log(`${times.length} frames → ${dir}/sheet.png  (t = ${times.join(", ")})`);
} finally {
  await browser.close();
  await server.close();
}
