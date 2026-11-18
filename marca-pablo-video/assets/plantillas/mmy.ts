// Piezas compartidas de Mi Muse y Yo (gramática visual del storyboard).
import { el, whenReady } from "./engine";
import { color, font } from "./tokens";

// Imagen de referencia (cuadro real de cámara o pantalla). En el video final la pone ffmpeg; aquí sirve para style frames.
export function image(parent: HTMLElement, src: string, style: Partial<CSSStyleDeclaration> = {}) {
  const img = el(parent, "img", { position: "absolute", display: "block", ...style }) as HTMLImageElement;
  img.src = src;
  whenReady(img.decode());
  return img;
}

// Resplandor morado del set, detrás de tarjetas y títulos.
export function glow(parent: HTMLElement, x = "50%", y = "55%", size = 1400, alpha = 0.55) {
  return el(parent, "div", {
    position: "absolute", left: "0", top: "0", width: "100%", height: "100%",
    background: `radial-gradient(${size}px ${size * 0.62}px at ${x} ${y}, ${color.glow}${Math.round(alpha * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
  });
}

// Texto con *palabras* en morado (mismo sans, mismo peso). Úsalo solo cuando la palabra es el punto del rótulo.
export function rich(parent: HTMLElement, text: string, style: Partial<CSSStyleDeclaration> = {}) {
  const box = el(parent, "div", style);
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const spans: HTMLElement[] = [];
  for (const p of parts) {
    const em = p.startsWith("*");
    const s = el(box, "span", em
      ? { color: color.accent }
      : {}, em ? p.slice(1, -1) : p);
    spans.push(s);
  }
  return { box, spans };
}

// Píldora de capítulo: "07 · Objetivos".
export function pill(parent: HTMLElement, num: string, label: string, style: Partial<CSSStyleDeclaration> = {}) {
  const p = el(parent, "div", {
    position: "absolute", display: "flex", alignItems: "center", gap: "14px", height: "52px", padding: "0 24px 0 10px",
    borderRadius: "26px", background: "rgba(21,19,31,0.86)", border: `1px solid ${color.line}`,
    font: `600 24px/1 ${font.display}`, color: color.ink, letterSpacing: "-0.01em", ...style,
  });
  el(p, "span", {
    display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "34px", borderRadius: "17px",
    background: color.accent, color: color.bg, font: `500 18px/1 ${font.mono}`,
  }, num);
  el(p, "span", {}, label);
  return p;
}
