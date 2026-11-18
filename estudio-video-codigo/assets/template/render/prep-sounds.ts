// Prepara tomas reales (assets/tomas/<nombre>_<toma>.wav|mp3|m4a|aiff|flac) para el motor: tu voz grabada, la voz de
// borrador, sonidos de una librería o tomas de ElevenLabs. Recorta el silencio inicial para que el sonido arranque en el
// frame del cue, conserva solo lo útil y normaliza a un pico objetivo. Escribe assets/sfx/<out>.wav (reemplaza al sintetizado).
// Configuración en assets/sounds.json: [{ "out": "vo1", "take": 2, "peak": -2 }, { "out": "tap", "src": "tap", "take": 1, "peak": -4, "max": 0.25 }]
//   out: nombre del cue (assets/sfx/<out>.wav) · src: prefijo del archivo de tomas (por defecto = out)
//   peak: pico objetivo en dBFS · max: segundos a conservar (golpes: solo el primer impacto)
//   npm run sounds              → usa las tomas elegidas
//   npm run sounds -- vo1=1     → fuerza otra toma después de escucharlas
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SR = 48000;
type Sound = { out: string; src?: string; take: number; peak: number; max?: number };
const SOUNDS: Sound[] = JSON.parse(readFileSync("assets/sounds.json", "utf8"));
const forced = Object.fromEntries(process.argv.slice(2).map((a) => a.split("=")).map(([k, v]) => [k, Number(v)]));

const decode = (file: string, ss = 0, t = 0) => {
  const buf = execFileSync("ffmpeg", ["-v", "error", "-ss", String(ss), ...(t ? ["-t", String(t)] : []), "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
};
function measure(file: string, ss = 0, t = 0) {
  const x = decode(file, ss, t);
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  return { peakDb: 20 * Math.log10(peak || 1e-9), onset: x.findIndex((v) => Math.abs(v) > peak * 0.1) / SR, len: x.length / SR };
}

mkdirSync("assets/sfx", { recursive: true });
const report: Record<string, unknown> = {};
for (const s of SOUNDS) {
  const take = forced[s.out] ?? s.take;
  const base = `assets/tomas/${s.src ?? s.out}_${take}`;
  const file = ["wav", "mp3", "m4a", "aiff", "flac"].map((e) => `${base}.${e}`).find(existsSync);
  if (!file) throw new Error(`Falta la toma ${base}.(wav|mp3|m4a|aiff|flac) para "${s.out}"`);
  const m = measure(file);
  const start = Math.max(0, m.onset - 0.004);
  const keep = Math.min(m.len - start, s.max ?? Infinity);
  const gain = s.peak - measure(file, start, keep).peakDb;
  const fade = Math.min(0.08, keep * 0.3);
  execFileSync("ffmpeg", [
    "-y", "-v", "error", "-ss", start.toFixed(4), "-t", keep.toFixed(4), "-i", file,
    "-af", `volume=${gain.toFixed(2)}dB,afade=t=out:st=${(keep - fade).toFixed(3)}:d=${fade.toFixed(3)}`,
    "-ar", String(SR), "-ac", "2", `assets/sfx/${s.out}.wav`,
  ]);
  report[s.out] = { toma: take, recorte_s: +start.toFixed(3), dur_s: +keep.toFixed(2), ganancia_dB: +gain.toFixed(1) };
}
writeFileSync("assets/sounds.eleccion.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
