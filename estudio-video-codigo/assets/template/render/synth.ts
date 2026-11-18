// Herramientas de síntesis de audio en código: deterministas, sin red, sin cuentas.
// Las usan render/music.ts (música progresiva) y render/sfx.ts (efectos).
import { writeFileSync } from "node:fs";

export const SR = 48000;
export type Stereo = { L: Float32Array; R: Float32Array };
export const buffer = (sec: number): Stereo => ({ L: new Float32Array(Math.ceil(sec * SR)), R: new Float32Array(Math.ceil(sec * SR)) });

// Ruido con semilla: el mismo archivo de configuración da siempre el mismo sonido.
export function makeRng(seed = 7) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
}
export const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
export const env = (t: number, len: number, a: number, r: number) =>
  t < 0 || t > len + r ? 0 : t < a ? t / a : t < len ? 1 : 1 - (t - len) / r;

// Escribe WAV 16 bit estéreo normalizado a un pico objetivo en dBFS.
export function writeWav(path: string, { L, R }: Stereo, peakDb = -1) {
  let peak = 0;
  for (let i = 0; i < L.length; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0 ? 10 ** (peakDb / 20) / peak : 1;
  const data = Buffer.alloc(L.length * 4);
  for (let i = 0; i < L.length; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), i * 4 + 2);
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0); head.writeUInt32LE(36 + data.length, 4); head.write("WAVE", 8);
  head.write("fmt ", 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20); head.writeUInt16LE(2, 22);
  head.writeUInt32LE(SR, 24); head.writeUInt32LE(SR * 4, 28); head.writeUInt16LE(4, 32); head.writeUInt16LE(16, 34);
  head.write("data", 36); head.writeUInt32LE(data.length, 40);
  writeFileSync(path, Buffer.concat([head, data]));
}

// Filtro de estado variable (lowpass / bandpass / highpass); el corte puede variar por muestra.
export function svf(x: Float32Array, cutoff: (i: number) => number, q = 0.7, mode: "lp" | "bp" | "hp" = "lp") {
  let low = 0, band = 0;
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(cutoff(i), SR / 6)) / SR);
    low += f * band;
    const high = x[i] - low - (1 / q) * band;
    band += f * high;
    out[i] = mode === "lp" ? low : mode === "bp" ? band : high;
  }
  return out;
}

// Reverb ligera (combs + allpass) para dar aire sin ensuciar.
export function reverb(s: Stereo, mix = 0.25) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356];
  const aps = [225, 556, 441];
  for (const [ch, off] of [[s.L, 0], [s.R, 23]] as const) {
    const wet = new Float32Array(ch.length);
    for (const c of combs) {
      const d = new Float32Array(c + off);
      let p = 0, lp = 0;
      for (let i = 0; i < ch.length; i++) {
        const y = d[p];
        lp = y * 0.6 + lp * 0.4;
        d[p] = ch[i] * 0.015 + lp * 0.86;
        wet[i] += y;
        p = (p + 1) % d.length;
      }
    }
    for (const a of aps) {
      const d = new Float32Array(a + off);
      let p = 0;
      for (let i = 0; i < ch.length; i++) {
        const y = d[p];
        const v = wet[i] + y * 0.5;
        d[p] = v;
        wet[i] = y - v * 0.5;
        p = (p + 1) % d.length;
      }
    }
    for (let i = 0; i < ch.length; i++) ch[i] = ch[i] * (1 - mix) + wet[i] * mix;
  }
}

// Cuerda pulsada (Karplus-Strong) sumada en un buffer, con paneo −1…1.
export function pluckInto(out: Stereo, t0: number, f: number, amp: number, pan: number, rnd: () => number, decay = 0.996, sec = 1.2) {
  const period = Math.max(2, Math.round(SR / f));
  const d = new Float32Array(period).map(() => rnd() * 0.5);
  const start = Math.round(t0 * SR);
  const len = Math.round(sec * SR);
  let prev = 0;
  for (let k = 0; k < len && start + k < out.L.length; k++) {
    if (start + k < 0) continue;
    const idx = k % period;
    const v = d[idx];
    d[idx] = (v + prev) * 0.5 * decay;
    prev = v;
    out.L[start + k] += v * amp * (1 - pan);
    out.R[start + k] += v * amp * (1 + pan);
  }
}

// Acordes por nombre: "Dmaj9", "Bm9", "Gmaj9", "Asus", "F#m7", "Ebadd9", "C", "Am".
// Voicing abierto: raíz grave (entre G2 y F#3), quinta, octava, tercera, quinta alta, séptima y novena.
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const QUALITY: Record<string, { third: number; seventh?: number; ninth?: boolean }> = {
  "": { third: 4 }, maj: { third: 4 }, m: { third: 3 }, min: { third: 3 },
  maj7: { third: 4, seventh: 11 }, maj9: { third: 4, seventh: 11, ninth: true },
  m7: { third: 3, seventh: 10 }, m9: { third: 3, seventh: 10, ninth: true },
  "7": { third: 4, seventh: 10 }, "9": { third: 4, seventh: 10, ninth: true },
  sus: { third: 5 }, sus4: { third: 5 }, sus2: { third: 2 },
  add9: { third: 4, ninth: true }, madd9: { third: 3, ninth: true },
  "6": { third: 4, seventh: 9 }, m6: { third: 3, seventh: 9 },
};
export function chord(name: string): number[] {
  const m = /^([A-G])([#b]?)(.*)$/.exec(name.trim());
  if (!m || !(m[3] in QUALITY)) throw new Error(`Acorde no reconocido: "${name}". Usa p. ej. Dmaj9, Bm9, Asus, F#m7, Ebadd9.`);
  let root = PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + 48;
  if (root > 54) root -= 12;
  const q = QUALITY[m[3]];
  const notes = [root, root + 7, root + 12, root + 12 + q.third, root + 19];
  notes.push(q.seventh !== undefined ? root + 12 + q.seventh : root + 24);
  notes.push(q.ninth ? root + 26 : root + 24 + q.third);
  return notes;
}
