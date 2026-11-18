// Mide la mezcla: voz sobre música en cada línea (meta ≥ 9 dB) y presencia de cada sfx sobre la mediana del fondo (±1 s).
//   npx tsx render/stems.ts [out/cues_16x9.json]   (por defecto usa brief/timing.json)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mixAudio, type Cue } from "./mix";

const src = process.argv[2] ?? "brief/timing.json";
const json = JSON.parse(readFileSync(src, "utf8"));
const cues: Cue[] = Array.isArray(json) ? json : json.cues;
const seconds = json.duracion ?? 30;
const music = json.musica ?? "assets/music/bed.wav";
mixAudio(cues, seconds, 0, music, "out/stem_voz.wav", "voice");
mixAudio(cues, seconds, 0, music, "out/stem_musica.wav", "music");
mixAudio(cues, seconds, 0, music, "out/stem_mezcla.wav");

const SR = 8000;
const dec = (f: string) => { const b = execFileSync("ffmpeg", ["-v", "error", "-i", f, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 28 }); return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4); };
const rms = (x: Float32Array, a: number, b: number) => { let s = 0, n = 0; for (let i = Math.floor(a * SR); i < Math.min(x.length, Math.floor(b * SR)); i++) { s += x[i] * x[i]; n++; } return 10 * Math.log10(s / Math.max(1, n) + 1e-12); };
const voz = dec("out/stem_voz.wav"), mus = dec("out/stem_musica.wav"), mix = dec("out/stem_mezcla.wav");
const dur = (f: string) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

console.log("Voz sobre música (meta ≥ 9 dB):");
for (const c of cues.filter((c) => /^vo\d/.test(c.sfx))) {
  const d = dur(`assets/sfx/${c.sfx}.wav`);
  const diff = rms(voz, c.t + 0.1, c.t + d - 0.1) - rms(mus, c.t + 0.1, c.t + d - 0.1);
  console.log(`  ${c.sfx.padEnd(6)} ${c.t.toFixed(2).padStart(6)} s  ${diff.toFixed(1).padStart(5)} dB${diff < 9 ? "  ← bajo" : ""}`);
}
console.log("Presencia de sfx sobre la mediana del fondo (±1 s):");
const W = 0.05, n = Math.floor(SR * W), db: number[] = [];
for (let i = 0; i + n <= mix.length; i += n) { let s = 0; for (let j = i; j < i + n; j++) s += mix[j] * mix[j]; db.push(10 * Math.log10(s / n + 1e-12)); }
for (const c of cues.filter((c) => !/^vo\d/.test(c.sfx))) {
  const k = Math.round(c.t / W), peak = Math.max(...db.slice(k, k + 4)), bg = db.slice(Math.max(0, k - 20), k + 20).sort((a, b) => a - b);
  console.log(`  ${c.sfx.padEnd(10)} ${c.t.toFixed(2).padStart(6)} s  ${(peak - bg[Math.floor(bg.length / 2)]).toFixed(1).padStart(5)} dB`);
}
