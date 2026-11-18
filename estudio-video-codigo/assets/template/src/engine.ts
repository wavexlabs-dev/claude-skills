import gsap from "gsap";
import { color, fontsToLoad, video } from "./tokens";

export type Cue = { t: number; sfx: string; gain?: number };
export type SceneCtx = { dur: number; start: number };
export type SceneResult = { tl: gsap.core.Timeline; cues?: Cue[] };
export type SceneFn<P = any> = (root: HTMLElement, props: P, ctx: SceneCtx) => SceneResult;
export type Shot = { scene: string; dur: number; props?: Record<string, unknown>; overlap?: number };

export type VideoMeta = {
  fps: number;
  width: number;
  height: number;
  duration: number;
  totalFrames: number;
  cues: (Cue & { scene: string })[];
};

declare global {
  interface Window {
    __video: VideoMeta;
    __seek: (frame: number) => void;
    __ready: Promise<void>;
  }
}

// Una escena que necesita cargar algo antes del primer frame (un iframe, una imagen) registra aquí su promesa.
// El render espera a __ready, y al resolverse se vuelve a dibujar el frame actual.
const pending: Promise<unknown>[] = [];
export const whenReady = (p: Promise<unknown>) => pending.push(p);

// Todo el video es una timeline pausada. Nadie la reproduce: se salta a un frame.
export function mount(stage: HTMLElement, shots: Shot[], scenes: Record<string, SceneFn>) {
  stage.style.background = color.bg;
  stage.style.width = `${video.width}px`;
  stage.style.height = `${video.height}px`;
  const master = gsap.timeline({ paused: true });
  const cues: VideoMeta["cues"] = [];
  let cursor = 0;
  let end = 0;

  shots.forEach((shot, i) => {
    const fn = scenes[shot.scene];
    if (!fn) throw new Error(`Escena desconocida: ${shot.scene}`);
    const start = Math.max(0, cursor - (shot.overlap ?? 0));
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.dataset.scene = shot.scene;
    layer.style.zIndex = String(i + 1);
    stage.appendChild(layer);
    // El motor solo controla visibility; la opacidad de la capa es de la escena (pushIn/pushOut).
    gsap.set(layer, { visibility: "hidden" });

    const { tl, cues: sceneCues = [] } = fn(layer, shot.props ?? {}, { dur: shot.dur, start });
    master.set(layer, { visibility: "visible" }, start);
    master.add(tl, start);
    if (i < shots.length - 1) master.set(layer, { visibility: "hidden" }, start + shot.dur);

    for (const c of sceneCues) cues.push({ ...c, t: start + c.t, scene: shot.scene });
    cursor = start + shot.dur;
    end = Math.max(end, cursor);
  });

  master.progress(1, true).progress(0, true);
  cues.sort((a, b) => a.t - b.t);

  const totalFrames = Math.round(end * video.fps);
  window.__video = { ...video, duration: totalFrames / video.fps, totalFrames, cues };
  let current = 0;
  window.__seek = (frame) => {
    current = Math.min(frame, totalFrames - 1);
    master.seek(current / video.fps, false);
  };
  window.__ready = Promise.all([document.fonts.ready, ...fontsToLoad.map((f) => document.fonts.load(f)), ...pending]).then(() => {
    // Fuerza que las escenas vuelvan a dibujar el frame actual ya con todo cargado.
    master.seek((current + 1) / video.fps, false);
    window.__seek(current);
  });
  window.__seek(0);
  return window.__video;
}

// Aleatoriedad siempre con semilla: el mismo frame se ve igual en preview y en render.
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function el<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  tag: K,
  style: Partial<CSSStyleDeclaration> = {},
  text?: string,
) {
  const node = document.createElement(tag);
  Object.assign(node.style, style);
  if (text !== undefined) node.textContent = text;
  parent.appendChild(node);
  return node;
}
