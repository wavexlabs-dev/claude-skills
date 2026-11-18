// Render cuadro por cuadro: Chromium sin interfaz salta a cada frame con __seek,
// toma el screenshot y lo manda por pipe a ffmpeg. Los frames se reparten entre workers.
//
//   npm run render                          → 1080p60 16:9, out/video_16x9.mp4
//   npm run render -- --format 9x16         → 1080×1920, out/video_9x16.mp4
//   npm run render -- --scale 2             → 4K (3840×2160)
//   npm run render -- --workers 6 --out out/v2.mp4 --music assets/music/otra.wav
//   npm run render -- --to 120 --no-audio   → solo los primeros 120 frames, sin audio
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Browser } from "playwright";
import { createServer } from "vite";
import type { VideoMeta } from "../src/engine";
import { mixAudio } from "./mix";

const { values: args } = parseArgs({
  options: {
    scale: { type: "string", default: "1" },
    workers: { type: "string", default: String(Math.max(1, Math.min(6, Math.floor(cpus().length / 2)))) },
    format: { type: "string", default: "16x9" },
    out: { type: "string" },
    music: { type: "string", default: "assets/music/bed.wav" },
    from: { type: "string" },
    to: { type: "string" },
    "no-audio": { type: "boolean", default: false },
    crf: { type: "string", default: "14" },
  },
});

const scale = Number(args.scale);
const outFile = args.out ?? `out/video_${args.format}.mp4`;
const tmp = "out/.tmp";
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const server = await createServer({ logLevel: "error", server: { port: 5199 } });
await server.listen();
const url = `${server.resolvedUrls!.local[0]}?render&format=${args.format}`;
const browser = await chromium.launch();

try {
  const meta = await readMeta(browser);
  const from = Number(args.from ?? 0);
  const to = Math.min(Number(args.to ?? meta.totalFrames), meta.totalFrames);
  const frames = to - from;
  const workers = Math.min(Number(args.workers), frames);
  console.log(`${meta.width * scale}×${meta.height * scale} @ ${meta.fps}fps · frames ${from}–${to - 1} · ${workers} workers`);

  const started = Date.now();
  const per = Math.ceil(frames / workers);
  const segments = await Promise.all(
    Array.from({ length: workers }, (_, i) => {
      const a = from + i * per;
      const b = Math.min(to, a + per);
      return renderSegment(browser, meta, a, b, join(tmp, `seg_${String(i).padStart(3, "0")}.mp4`));
    }),
  );

  const list = join(tmp, "segments.txt");
  writeFileSync(list, segments.map((s) => `file '${s.replace(`${tmp}/`, "")}'`).join("\n"));
  const silent = join(tmp, "video.mp4");
  ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", silent]);
  console.log(`video listo en ${((Date.now() - started) / 1000).toFixed(1)}s`);

  mkdirSync("out", { recursive: true });
  const cuesInRange = meta.cues.filter((c) => c.t * meta.fps >= from && c.t * meta.fps < to);
  writeFileSync(`out/cues_${args.format}.json`, JSON.stringify({ fps: meta.fps, from, to, cues: cuesInRange }, null, 2));

  if (args["no-audio"]) {
    ffmpeg(["-i", silent, "-c", "copy", outFile]);
  } else {
    const seconds = frames / meta.fps;
    const offset = from / meta.fps;
    const mix = mixAudio(cuesInRange, seconds, offset, args.music!, join(tmp, "mix.wav"));
    ffmpeg(["-i", silent, "-i", mix, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", outFile]);
  }
  console.log(`→ ${outFile}`);
} finally {
  await browser.close();
  await server.close();
}

async function readMeta(browser: Browser) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.evaluate(() => window.__ready);
  const meta = await page.evaluate(() => window.__video as VideoMeta);
  await page.close();
  return meta;
}

async function renderSegment(browser: Browser, meta: VideoMeta, a: number, b: number, file: string) {
  const ctx = await browser.newContext({ viewport: { width: meta.width, height: meta.height }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.goto(url);
  await page.evaluate(() => window.__ready);

  const enc = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(meta.fps), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", args.crf!, "-pix_fmt", "yuv420p",
    "-r", String(meta.fps), "-movflags", "+faststart", file,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise<void>((ok, fail) => enc.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg salió con ${code}`)))));

  for (let f = a; f < b; f++) {
    await page.evaluate((n) => window.__seek(n), f);
    const png = await page.screenshot({ type: "png", scale: "device", caret: "hide" });
    if (!enc.stdin.write(png)) await new Promise((r) => enc.stdin.once("drain", r));
  }
  enc.stdin.end();
  await done;
  await ctx.close();
  return file;
}

function ffmpeg(a: string[]) {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });
}
