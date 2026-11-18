import type gsap from "gsap";
import { el } from "./engine";

// Palabra dentro de una máscara: el span interior es lo que se anima (yPercent).
export function masked(parent: HTMLElement, text: string, style: Partial<CSSStyleDeclaration> = {}) {
  const mask = el(parent, "span", { display: "inline-block", overflow: "hidden", padding: "0.06em 0.02em 0.14em", margin: "-0.06em -0.02em -0.14em", verticalAlign: "bottom" });
  return el(mask, "span", { display: "inline-block", ...style }, text);
}

// Inserta un SVG crudo (de assets/) y lo devuelve listo para animar.
export function svgFrom(parent: HTMLElement, raw: string, style: Partial<CSSStyleDeclaration> = {}) {
  const wrap = el(parent, "div", style);
  wrap.innerHTML = raw;
  const svg = wrap.querySelector("svg")!;
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.overflow = "visible";
  return { wrap, svg };
}

// Prepara los trazos de un SVG para dibujarse con stroke-dashoffset 1 → 0.
export function drawable(svg: SVGSVGElement) {
  const strokes: SVGGeometryElement[] = [];
  const fills: SVGGeometryElement[] = [];
  svg.querySelectorAll<SVGGeometryElement>("path, rect, circle, line, polyline, polygon").forEach((p) => {
    const cs = p.style;
    const hasStroke = cs.stroke && cs.stroke !== "none";
    const hasFill = cs.fill && cs.fill !== "none" && cs.fill !== "rgba(0, 0, 0, 0)";
    if (hasStroke) {
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1 1";
      p.style.strokeDashoffset = "1";
      strokes.push(p);
    }
    if (hasFill) fills.push(p);
  });
  return { strokes, fills };
}

export const px = (n: number) => `${n}px`;

// Cámara continua: la escena que sale pasa de largo a la cámara (crece y se desvanece)
// y la que entra llega desde el fondo. Se anima la capa completa (root).
// fadeFrom: fracción de la salida en la que empieza a desvanecerse (más bajo = deja paso antes a la siguiente).
export function pushOut(tl: gsap.core.Timeline, root: HTMLElement, at: number, opts: { origin?: string; to?: number; dur?: number; fadeFrom?: number } = {}) {
  const d = opts.dur ?? 0.5;
  const f = opts.fadeFrom ?? 0.5;
  tl.to(root, { scale: opts.to ?? 1.4, duration: d, ease: "power3.in", transformOrigin: opts.origin ?? "50% 50%" }, at);
  tl.to(root, { opacity: 0, duration: d * (1 - f), ease: f < 0.5 ? "power2.out" : "power1.in" }, at + d * f);
}
export function pushIn(tl: gsap.core.Timeline, root: HTMLElement, at = 0, from = 0.84) {
  tl.fromTo(root, { scale: from, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "expo.out", transformOrigin: "50% 50%" }, at);
}
