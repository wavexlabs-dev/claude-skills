// Música progresiva sintetizada en código, desde brief/music.json → assets/music/bed.wav.
// Sin cuentas ni red: misma configuración, mismo archivo. Las capas entran por tramos siguiendo la historia:
// pad desde el inicio, arpegio, pulso (bombo + bajo), hat, subida de ruido y floración en el clímax.
//   npm run music
//   npm run music -- brief/otra.json assets/music/otra.wav
// Es código: si un video pide otra textura, agrega una capa aquí en vez de forzar los parámetros.
import { mkdirSync, readFileSync } from "node:fs";
import { SR, buffer, chord, env, hz, makeRng, pluckInto, reverb, svf, writeWav } from "./synth";

type Range = { desde: number; hasta: number; nivel?: number | [number, number] };
type Config = {
  duracion: number;
  bpm: number;
  acordes: string[];
  compases_por_acorde?: number;
  capas: Partial<Record<"pad" | "arpegio" | "bombo" | "bajo" | "hat", Range>>;
  subida?: { desde: number; hasta: number };
  floracion?: number;
  acorde_final?: string;
  reverb?: number;
  salida?: number;
  semilla?: number;
  pico?: number;
};

const [cfgPath = "brief/music.json", outPath = "assets/music/bed.wav"] = process.argv.slice(2);
const C: Config = JSON.parse(readFileSync(cfgPath, "utf8"));
const rnd = makeRng(C.semilla ?? 7);
const BEAT = 60 / C.bpm;
const BAR = BEAT * 4 * (C.compases_por_acorde ?? 2);
const chords = C.acordes.map(chord);
const finalChord = chord(C.acorde_final ?? C.acordes[0]);
const chordAt = (t: number) => (C.floracion !== undefined && t >= C.floracion ? finalChord : chords[Math.floor(t / BAR) % chords.length]);
const level = (r: Range, t: number, base: number) => {
  const n = r.nivel ?? base;
  if (typeof n === "number") return n;
  return n[0] + (n[1] - n[0]) * Math.min(1, Math.max(0, (t - r.desde) / (r.hasta - r.desde)));
};

// Aviso si una entrada no cae en el beat: el oído lo nota aunque la imagen no.
const offGrid: string[] = [];
const check = (name: string, t?: number) => {
  if (t === undefined) return;
  const d = Math.abs(t / BEAT - Math.round(t / BEAT)) * BEAT;
  if (d > 0.01 && t > 0) offGrid.push(`${name}=${t}s (beat más cercano ${(Math.round(t / BEAT) * BEAT).toFixed(3)}s)`);
};
for (const [k, r] of Object.entries(C.capas)) check(`${k}.desde`, r?.desde);
check("subida.desde", C.subida?.desde);
check("floracion", C.floracion);

const seconds = C.duracion;
const out = buffer(seconds);
const N = out.L.length;
const T = (i: number) => i / SR;
const rise = C.subida;
const bloom = C.floracion;

// Pad: sierras desafinadas; el filtro se abre durante el video, más en la subida, y se cierra tras la floración.
if (C.capas.pad) {
  const r = C.capas.pad;
  const padL = new Float32Array(N), padR = new Float32Array(N);
  const phases = new Map<string, number>();
  for (let i = 0; i < N; i++) {
    const t = T(i);
    if (t < r.desde || t > r.hasta) continue;
    let lvl = level(r, t, 1) * Math.min(1, (t - r.desde) / 0.4) * (t < r.desde + 3 ? 0.5 + 0.5 * ((t - r.desde) / 3) : 1);
    if (rise && t >= rise.desde && t < rise.hasta) lvl *= 1 + 0.8 * ((t - rise.desde) / (rise.hasta - rise.desde));
    if (bloom !== undefined && t >= bloom) lvl *= 1.9 * Math.max(0, 1 - (t - bloom) / Math.max(1, seconds - bloom));
    let l = 0, rr = 0;
    chordAt(t).forEach((m, k) => {
      for (const [d, side] of [[-0.07, -1], [0.07, 1]] as const) {
        const key = `${k}${side}`;
        const ph = ((phases.get(key) ?? k * 0.13 + (side + 1) * 0.31) + hz(m + d) / SR) % 1;
        phases.set(key, ph);
        const v = (ph * 2 - 1) * (k < 2 ? 0.9 : 0.55);
        if (side < 0) l += v; else rr += v;
      }
    });
    padL[i] = (l * lvl) / 9;
    padR[i] = (rr * lvl) / 9;
  }
  const cutoff = (i: number) => {
    const t = T(i);
    const open = 500 + 500 * Math.min(1, t / 15);
    if (rise && t >= rise.desde && (bloom === undefined || t < bloom)) return open + 2600 * Math.min(1, (t - rise.desde) / (rise.hasta - rise.desde)) ** 2;
    if (bloom !== undefined && t >= bloom) return 3600 - 2400 * Math.min(1, (t - bloom) / 3.6);
    return open;
  };
  const fl = svf(padL, cutoff, 0.9), fr = svf(padR, cutoff, 0.9);
  for (let i = 0; i < N; i++) { out.L[i] += fl[i] * 0.55; out.R[i] += fr[i] * 0.55; }
}

// Arpegio pulsado en corcheas; su nivel crece de nivel[0] a nivel[1] a lo largo del tramo.
if (C.capas.arpegio) {
  const r = C.capas.arpegio;
  for (let t = r.desde; t < r.hasta - 0.001; t += BEAT / 2) {
    const step = Math.round((t - r.desde) / (BEAT / 2));
    const c = chordAt(t);
    const note = c[[3, 4, 5, 4, 6, 4, 5, 3][step % 8]] + 12;
    pluckInto(out, t, hz(note), level(r, t, 0.14), step % 2 ? 0.35 : -0.35, rnd);
  }
}

// Bombo suave en cada beat.
if (C.capas.bombo) {
  const r = C.capas.bombo;
  for (let t = r.desde; t < r.hasta - 0.01; t += BEAT) {
    const s = Math.round(t * SR), g = level(r, t, 0.42);
    for (let k = 0; k < 0.35 * SR && s + k < N; k++) {
      const tt = k / SR;
      const v = Math.sin(2 * Math.PI * (45 + 75 * Math.exp(-tt * 30)) * tt) * Math.exp(-tt * 9) * g;
      out.L[s + k] += v; out.R[s + k] += v;
    }
  }
}

// Hat en contratiempos.
if (C.capas.hat) {
  const r = C.capas.hat;
  for (let t = r.desde; t < r.hasta - 0.01; t += BEAT) {
    const h = Math.round((t + BEAT / 2) * SR), g = level(r, t, 0.06);
    const hat = new Float32Array(Math.round(0.06 * SR)).map((_, k) => rnd() * Math.exp(-(k / SR) * 70));
    const hh = svf(hat, () => 7000, 0.8, "hp");
    for (let k = 0; k < hh.length && h + k < N; k++) { out.L[h + k] += hh[k] * g * 0.85; out.R[h + k] += hh[k] * g * 1.15; }
  }
}

// Bajo en los tiempos 1 y 3.
if (C.capas.bajo) {
  const r = C.capas.bajo;
  for (let t = r.desde; t < r.hasta - 0.01; t += BEAT * 2) {
    const root = chordAt(t)[0] - 12, s = Math.round(t * SR), g = level(r, t, 0.22);
    for (let k = 0; k < BEAT * 1.8 * SR && s + k < N; k++) {
      const tt = k / SR;
      const v = Math.sin(2 * Math.PI * hz(root) * tt) * env(tt, BEAT * 1.5, 0.01, 0.3) * g;
      out.L[s + k] += v; out.R[s + k] += v;
    }
  }
}

// Subida de ruido hacia el clímax.
if (rise) {
  const rs = Math.round(rise.desde * SR), re = Math.min(N, Math.round(rise.hasta * SR));
  const noise = new Float32Array(re - rs).map(() => rnd());
  const rb = svf(noise, (i) => 300 + 5000 * (i / noise.length) ** 2, 2.5, "bp");
  for (let k = 0; k < rb.length; k++) {
    const g = (k / rb.length) ** 2 * 0.22;
    out.L[rs + k] += rb[k] * g; out.R[rs + k] += rb[k] * g * 0.9;
  }
}

// Floración: sub que cae y un acorde rasgueado de seis notas.
if (bloom !== undefined) {
  const bs = Math.round(bloom * SR);
  for (let k = 0; bs + k < N; k++) {
    const tt = k / SR;
    const sub = Math.sin(2 * Math.PI * (38 + 30 * Math.exp(-tt * 6)) * tt) * Math.exp(-tt * 1.6) * 0.5;
    out.L[bs + k] += sub; out.R[bs + k] += sub;
  }
  finalChord.slice(1, 7).map((m) => m + 12).forEach((m, j) => pluckInto(out, bloom + j * 0.03, hz(m), 0.16, j % 2 ? 0.4 : -0.4, rnd, 0.998));
}

reverb(out, C.reverb ?? 0.28);
const fade = C.salida ?? 1.2;
for (let i = 0; i < N; i++) {
  const t = T(i);
  const g = t > seconds - fade ? Math.max(0, (seconds - t) / fade) : 1;
  out.L[i] *= g; out.R[i] *= g;
}

mkdirSync(outPath.replace(/\/[^/]+$/, ""), { recursive: true });
writeWav(outPath, out, C.pico ?? -1);
console.log(`música: ${outPath} (${seconds} s, ${C.bpm} bpm, ${C.acordes.join(" · ")})`);
if (offGrid.length) console.log(`aviso: fuera del beat → ${offGrid.join(", ")}`);
