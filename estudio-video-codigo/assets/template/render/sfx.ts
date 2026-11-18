// Efectos de sonido sintetizados en código, desde assets/sfx.json → assets/sfx/<out>.wav.
// Sin cuentas ni red. Cada entrada: { "out": "tap2", "tipo": "tap", "tono": 1.1, "dur": 1, "semilla": 3, "pan": 0, "pico": -3 }
//   tipo: tick · click · tap · pop · thud · impact · whoosh · swish · breath · paper · pluck · chime · coin · riser
//   tono: multiplica la altura (1 = original) · dur: multiplica la duración · semilla: otra variante del ruido
//   pico: dBFS (cada tipo trae uno razonable) · pan: −1 izquierda … 1 derecha
// Para que un sonido repetido no canse, define variantes (misma "tipo", otro "tono"/"semilla") y altérnalas en los cues.
//   npm run sfx              → todos
//   npm run sfx -- tap2 pop  → solo esos
// Una toma real (grabada, de librería o de ElevenLabs) con el mismo nombre, preparada con `npm run sounds`, la reemplaza.
import { mkdirSync, readFileSync } from "node:fs";
import { SR, Stereo, buffer, hz, makeRng, svf, writeWav } from "./synth";

type Spec = { out: string; tipo: string; tono?: number; dur?: number; semilla?: number; pan?: number; pico?: number };
type Gen = (p: { tono: number; dur: number; rnd: () => number }) => { sec: number; fn: (t: number, i: number) => number; tail?: (b: Stereo) => void };

// Ruido filtrado con envolvente de subida y bajada (whoosh, aire, papel).
const shapedNoise = (rnd: () => number, sec: number, lo: number, hi: number, q: number, peakAt: number, curve = 1.5) => {
  const n = new Float32Array(Math.round(sec * SR)).map(() => rnd());
  const f = svf(n, (i) => lo + (hi - lo) * Math.sin((Math.PI * i) / n.length), q, "bp");
  return (t: number, i: number) => (f[i] ?? 0) * (t < peakAt ? t / peakAt : Math.max(0, 1 - (t - peakAt) / (sec - peakAt))) ** curve;
};
const modes = (t: number, list: [number, number, number][]) => list.reduce((s, [f, a, d]) => s + Math.sin(2 * Math.PI * f * t) * a * Math.exp(-t * d), 0);

const GEN: Record<string, { gen: Gen; pico: number }> = {
  // Tic seco y agudo: un paso, una cuenta, un segundero.
  tick: { pico: -3, gen: ({ tono, rnd }) => ({ sec: 0.06, fn: (t) => (Math.sin(2 * Math.PI * 3100 * tono * t) * 0.7 + rnd() * 0.3) * Math.exp(-t * 140) }) },
  // Clic de mecanismo con doble contacto (botón, interruptor).
  click: { pico: -1, gen: ({ tono, rnd }) => ({ sec: 0.09, fn: (t) => {
    const a = t < 0.012 ? rnd() * Math.exp(-t * 600) : 0;
    const b = t > 0.045 && t < 0.06 ? rnd() * Math.exp(-(t - 0.045) * 700) * 0.6 : 0;
    return a + b + Math.sin(2 * Math.PI * 1900 * tono * t) * Math.exp(-t * 220) * 0.4;
  } }) },
  // Toque de madera o dedo sobre superficie: modos resonantes cortos.
  tap: { pico: -3, gen: ({ tono, rnd }) => ({ sec: 0.18, fn: (t) =>
    modes(t, [[780 * tono, 0.8, 55], [1930 * tono, 0.45, 80], [3400 * tono, 0.2, 120]]) + (t < 0.004 ? rnd() * 0.6 : 0) }) },
  // Burbuja que aparece: tono que sube rápido.
  pop: { pico: -5, gen: ({ tono }) => ({ sec: 0.25, fn: (t) => Math.sin(2 * Math.PI * (520 + 420 * Math.min(1, t * 14)) * tono * t) * Math.min(1, t * 400) * Math.exp(-t * 22) }) },
  // Golpe grave y sordo: algo que aterriza.
  thud: { pico: -2, gen: ({ tono, dur, rnd }) => {
    const n = new Float32Array(Math.round(0.4 * dur * SR)).map(() => rnd());
    const body = svf(n, () => 350 * tono, 0.8);
    return { sec: 0.4 * dur, fn: (t, i) => Math.sin(2 * Math.PI * (55 + 90 * Math.exp(-t * 25)) * tono * t) * Math.exp(-t * 10 / dur) + body[i] * Math.exp(-t * 30) * 1.4 };
  } },
  // Impacto grande: thud + crujido + cola grave. Para el clímax, una vez.
  impact: { pico: -1, gen: ({ tono, dur, rnd }) => {
    const sec = 1.4 * dur;
    const n = new Float32Array(Math.round(sec * SR)).map(() => rnd());
    const crack = svf(n, () => 2500 * tono, 0.9, "bp");
    return { sec, fn: (t, i) =>
      Math.sin(2 * Math.PI * (40 + 110 * Math.exp(-t * 18)) * tono * t) * Math.exp(-t * 3.2 / dur) +
      crack[i] * Math.exp(-t * 45) * 1.6 + n[i] * Math.exp(-t * 8) * 0.08 };
  } },
  // Paso de aire de un cambio de escena.
  whoosh: { pico: -10, gen: ({ tono, dur, rnd }) => { const sec = 0.55 * dur; return { sec, fn: shapedNoise(rnd, sec, 350 * tono, 2600 * tono, 1.2, sec * 0.55) }; } },
  // Barrido corto que baja: algo que sale de cuadro.
  swish: { pico: -10, gen: ({ tono, dur, rnd }) => {
    const sec = 0.32 * dur;
    const n = new Float32Array(Math.round(sec * SR)).map(() => rnd());
    const f = svf(n, (i) => (4200 - 3400 * (i / n.length)) * tono, 1.6, "bp");
    return { sec, fn: (t, i) => f[i] * Math.min(1, t / 0.03) * Math.max(0, 1 - t / sec) ** 1.2 };
  } },
  // Respiración / soplo suave: un respiro, una pausa.
  breath: { pico: -6, gen: ({ tono, dur, rnd }) => { const sec = 1.0 * dur; return { sec, fn: shapedNoise(rnd, sec, 250 * tono, 1100 * tono, 0.9, sec * 0.55) }; } },
  // Papel o tarjeta que se desliza: ruido con granos irregulares.
  paper: { pico: -6, gen: ({ tono, dur, rnd }) => {
    const sec = 0.45 * dur;
    const n = new Float32Array(Math.round(sec * SR)).map(() => rnd());
    const f = svf(n, () => 3800 * tono, 0.7, "bp");
    let g = 0;
    return { sec, fn: (t, i) => { if (i % 240 === 0) g = 0.4 + 0.6 * Math.abs(rnd()); return f[i] * g * Math.sin((Math.PI * t) / sec); } };
  } },
  // Cuerda pulsada: una nota con altura (un dato que aparece, un acierto).
  pluck: { pico: -6, gen: ({ tono, dur, rnd }) => {
    const sec = 0.9 * dur;
    const period = Math.max(2, Math.round(SR / (hz(74) * tono)));
    const d = new Float32Array(period).map(() => rnd() * 0.6);
    let prev = 0;
    return { sec, fn: (_t, k) => { const idx = k % period; const v = d[idx]; d[idx] = (v + prev) * 0.5 * 0.997; prev = v; return v; } };
  } },
  // Campana pequeña: parciales inarmónicos y cola larga (un logro, la firma).
  chime: { pico: -8, gen: ({ tono, dur }) => ({ sec: 2.2 * dur, fn: (t) =>
    Math.min(1, t * 800) * modes(t, [[1046 * tono, 0.6, 1.6 / dur], [2093 * 1.003 * tono, 0.3, 2.4 / dur], [2735 * tono, 0.22, 3.2 / dur], [3730 * tono, 0.12, 5 / dur]]) }) },
  // Moneda / premio: dos notas brillantes seguidas.
  coin: { pico: -6, gen: ({ tono }) => ({ sec: 0.42, fn: (t) => {
    const f = (t < 0.07 ? 1568 : 2093) * tono;
    const sq = Math.sign(Math.sin(2 * Math.PI * f * t)) * 0.35 + Math.sin(2 * Math.PI * f * t) * 0.65;
    return sq * Math.min(1, t * 900) * (t < 0.07 ? 1 : Math.exp(-(t - 0.07) * 9));
  } }) },
  // Subida corta de tensión antes de un golpe (dur ≈ segundos que dura).
  riser: { pico: -10, gen: ({ tono, dur, rnd }) => {
    const sec = 1.5 * dur;
    const n = new Float32Array(Math.round(sec * SR)).map(() => rnd());
    const f = svf(n, (i) => (300 + 5200 * (i / n.length) ** 2) * tono, 2.5, "bp");
    return { sec, fn: (t, i) => f[i] * (t / sec) ** 2 * (t > sec - 0.02 ? (sec - t) / 0.02 : 1) };
  } },
};

const SPECS: Spec[] = JSON.parse(readFileSync("assets/sfx.json", "utf8"));
const only = process.argv.slice(2);
mkdirSync("assets/sfx", { recursive: true });
for (const s of SPECS) {
  if (only.length && !only.includes(s.out)) continue;
  const g = GEN[s.tipo];
  if (!g) throw new Error(`Tipo de sfx desconocido "${s.tipo}" en "${s.out}". Tipos: ${Object.keys(GEN).join(", ")}`);
  const rnd = makeRng(s.semilla ?? 11);
  const { sec, fn } = g.gen({ tono: s.tono ?? 1, dur: s.dur ?? 1, rnd });
  const b = buffer(sec);
  const pan = s.pan ?? 0;
  for (let i = 0; i < b.L.length; i++) {
    const v = fn(i / SR, i);
    b.L[i] = v * (1 - pan * 0.6);
    b.R[i] = v * (1 + pan * 0.6);
  }
  writeWav(`assets/sfx/${s.out}.wav`, b, s.pico ?? g.pico);
  console.log(`sfx: assets/sfx/${s.out}.wav (${s.tipo}, ${sec.toFixed(2)} s)`);
}
