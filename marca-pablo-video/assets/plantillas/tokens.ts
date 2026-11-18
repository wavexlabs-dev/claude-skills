// Una sola fuente de verdad para formato, marca y movimiento.
// Mi Muse y Yo — "Nocturno morado": negro, morado y blanco tomados del set (luz de fondo y playera).

const format = typeof location !== "undefined" ? new URLSearchParams(location.search).get("format") : null;
export const V = format === "9x16";
// 30 fps: cámara y pantalla vienen a 29.97; cada capa gráfica es corta y se ubica por su tiempo, así no acumula deriva.
export const video = { width: V ? 1080 : 1920, height: V ? 1920 : 1080, fps: 30 } as const;

export const color = {
  bg: "#0b0a12", // fondo del set (muestreado: #0d0c14)
  glow: "#2a1470", // resplandor morado detrás de las tarjetas
  ink: "#f4f2ff", // blanco ligeramente lila, como la playera bajo la luz
  muted: "#8c87a6",
  accent: "#8a6bff", // la luz morada del set, saturada para que lea en pantalla
  accentSoft: "rgba(138,107,255,0.18)",
  line: "rgba(244,242,255,0.14)",
  card: "#15131f",
} as const;

export const font = {
  display: '"Inter Tight", "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", Menlo, monospace',
} as const;

export const fontsToLoad: string[] = [
  '400 20px "Inter Tight"',
  '600 20px "Inter Tight"',
  '800 20px "Inter Tight"',
  '400 20px "JetBrains Mono"',
  '500 20px "JetBrains Mono"',
];

export const ease = {
  out: "expo.out",
  in: "power3.in",
  inOut: "power2.inOut",
  soft: "power2.out",
  drift: "sine.inOut",
} as const;

export const beat = 0.5;

export const safe = V ? { top: 230, bottom: 420, x: 60 } : { top: 72, bottom: 72, x: 96 };
