// Una sola fuente de verdad para formato, marca y movimiento.
// Las escenas leen de aquí; nunca escriben colores, eases ni fps a mano.
// Al empezar un video, reemplaza color/font con la marca capturada del producto.

// ?format=9x16 recompone todo en vertical. El lado corto mide 1080 en ambos formatos.
const format = typeof location !== "undefined" ? new URLSearchParams(location.search).get("format") : null;
export const V = format === "9x16";
export const video = { width: V ? 1080 : 1920, height: V ? 1920 : 1080, fps: 60 } as const;

export const color = {
  bg: "#111111",
  ink: "#f2f2f2",
  muted: "#9a9a9a",
  accent: "#ffcc33",
} as const;

export const font = {
  display: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"SF Mono", Menlo, Consolas, monospace',
} as const;

// Fuentes que el render espera antes del primer frame (formato de document.fonts.load).
export const fontsToLoad: string[] = [];

// Vocabulario de movimiento: llega lento para leerse, sale rápido.
export const ease = {
  out: "expo.out",
  in: "power3.in",
  inOut: "power2.inOut",
  soft: "power2.out",
  drift: "sine.inOut",
} as const;

// Tempo de la música: los cortes caen en múltiplos de beat (120 BPM = 0.5 s).
export const beat = 0.5;

// Márgenes seguros. En 9:16, arriba ~230 px y abajo ~420 px son de la interfaz de Reels/TikTok: sin texto ahí.
export const safe = V ? { top: 230, bottom: 420, x: 60 } : { top: 96, bottom: 96, x: 144 };
