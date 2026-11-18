import gsap from "gsap";
import { el, whenReady, type Cue, type SceneFn } from "../engine";

// Producto en vivo: el sitio real (copia local hecha con `npm run site-copy`) dibujado cuadro por cuadro.
// La copia trae un reloj controlado (__frame, __setNow) y movimiento reducido, así que su canvas es función
// del tiempo y del scroll. En cada frame: scroll + hora, un cuadro, y se copia el canvas sin suavizar el píxel.
// Ver references/producto-en-vivo.md para medir el scroll de cada escena del sitio y elegir el tamaño del iframe.

type Seg = [t0: number, t1: number, y0: number, y1: number, ease: string];
type Props = {
  src: string; // ruta servida por Vite, p. ej. "/site/index.html"
  canvas: string; // selector del canvas del sitio, p. ej. "#world"
  frame: { vw: number; vh: number }; // tamaño del iframe: el sitio dimensiona su canvas con él
  rect: { x: number; y: number; scale: number }; // dónde y a qué escala entera va el canvas en el video
  expect?: { w: number; h: number }; // tamaño de canvas esperado (falla temprano si el iframe no lo produce)
  scroll: Seg[]; // ruta de scroll en el tiempo (px del documento del sitio)
  gates?: { name: string; from: number; to: number }[]; // compuertas de la copia: window[name] = true entre from y to
  clicks?: { at: number; selector: string; text?: string }[]; // clics del sitio con hora fija (estado determinista)
  sfx?: Cue[];
};

export const liveSite: SceneFn<Props> = (root, props, { dur }) => {
  const tl = gsap.timeline();
  const view = el(root, "canvas", { position: "absolute", left: `${props.rect.x}px`, top: `${props.rect.y}px`, imageRendering: "pixelated", transformOrigin: "50% 50%" });
  const ctx = view.getContext("2d")!;
  // Fuera de cuadro y oculto (con opacity 0 su texto se cuela en la captura).
  const frame = el(root, "iframe", {
    position: "absolute", left: "-30000px", top: "0px", width: `${props.frame.vw}px`, height: `${props.frame.vh}px`,
    border: "0", visibility: "hidden", pointerEvents: "none",
  });
  frame.src = props.src;

  let win: any = null;
  let site: HTMLCanvasElement | null = null;
  const done = new Set<number>();

  whenReady(
    new Promise<void>((resolve, reject) => {
      // Un error al preparar el sitio rechaza __ready: el render falla con su mensaje en vez de colgarse.
      const prepare = async () => {
        win = frame.contentWindow;
        if (typeof win.__frame !== "function") throw new Error("La copia del sitio no trae el reloj controlado: corre `npm run site-copy`");
        await win.document.fonts.ready;
        win.__frame(0);
        site = win.document.querySelector(props.canvas) as HTMLCanvasElement | null;
        if (!site) throw new Error(`No se encontró ${props.canvas} en el sitio`);
        if (props.expect && (site.width !== props.expect.w || site.height !== props.expect.h)) {
          throw new Error(`El canvas mide ${site.width}×${site.height}, se esperaba ${props.expect.w}×${props.expect.h}: ajusta frame.vw/vh`);
        }
        view.width = site.width;
        view.height = site.height;
        view.style.width = `${site.width * props.rect.scale}px`;
        view.style.height = `${site.height * props.rect.scale}px`;
        ctx.imageSmoothingEnabled = false;
      };
      frame.addEventListener("load", () => prepare().then(resolve, reject));
    }),
  );

  const eases = new Map<string, (p: number) => number>();
  const easeOf = (name: string) => {
    if (!eases.has(name)) eases.set(name, gsap.parseEase(name) as (p: number) => number);
    return eases.get(name)!;
  };
  const yAt = (t: number) => {
    const seg = props.scroll.find(([a, b]) => t >= a && t < b) ?? props.scroll[props.scroll.length - 1];
    const [a, b, y0, y1, e] = seg;
    const p = Math.min(1, Math.max(0, (t - a) / (b - a)));
    return y0 + (y1 - y0) * easeOf(e)(p);
  };
  const step = (t: number) => {
    win.scrollTo(0, Math.round(yAt(t)));
    win.__frame(t * 1000);
  };
  const applyState = (t: number) => {
    (props.clicks ?? []).forEach((c, i) => {
      if (t < c.at || done.has(i)) return;
      const el = [...win.document.querySelectorAll(c.selector)].find((n: Element) => !c.text || n.textContent?.trim() === c.text) as HTMLElement | undefined;
      if (!el) return;
      // El sitio registra la hora del clic: se fija la hora exacta del guion antes de hacer clic.
      win.__setNow(c.at * 1000);
      el.click();
      done.add(i);
    });
  };
  const draw = (t: number) => {
    if (!site || !win) return;
    // Dos pasos: el cuadro anterior deja al sitio en el mismo estado que si el render corriera en orden.
    for (const g of props.gates ?? []) win[g.name] = false;
    step(Math.max(0, t - 1 / 60));
    applyState(t);
    for (const g of props.gates ?? []) win[g.name] = t >= g.from && t < g.to;
    step(t);
    ctx.drawImage(site, 0, 0);
  };

  const clock = { t: 0 };
  tl.fromTo(clock, { t: 0 }, { t: dur, duration: dur, ease: "none", onUpdate: () => draw(clock.t) }, 0);
  return { tl, cues: props.sfx ?? [] };
};
