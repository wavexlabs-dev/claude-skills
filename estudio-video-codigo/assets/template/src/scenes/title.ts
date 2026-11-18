import gsap from "gsap";
import { el, type SceneFn } from "../engine";
import { masked, pushIn, pushOut } from "../fx";
import { color, ease, font, V } from "../tokens";

// Escena de ejemplo: una línea de texto que entra enmascarada, respira y sale a cámara.
// Copia este archivo como punto de partida para cada escena nueva.
type Props = { text: string; sfx?: string };

export const title: SceneFn<Props> = (root, props, { dur }) => {
  const tl = gsap.timeline();
  const wrap = el(root, "div", { position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center" });
  const line = el(wrap, "div", { font: `500 ${V ? 120 : 140}px/1.02 ${font.display}`, color: color.ink, letterSpacing: "-0.04em", textAlign: "center", maxWidth: "90%" });
  const word = masked(line, props.text);
  // Entra desde el primer frame (sin cuadros vacíos entre escenas).
  pushIn(tl, root, 0, 0.9);
  tl.from(word, { yPercent: 112, duration: 0.7, ease: ease.out }, 0);
  // Ningún hold queda quieto: drift mientras se lee, a velocidad constante (con ease frena bajo 1 px por frame y congela).
  tl.to(line, { scale: 1.12, duration: dur - 0.3, ease: "none" }, 0.3);
  // Sale a cámara y se desvanece pronto (fadeFrom bajo): debe estar casi fuera antes de que entre la siguiente.
  pushOut(tl, root, dur - 0.45, { to: 1.4, dur: 0.45, fadeFrom: 0.1 });
  return { tl, cues: props.sfx ? [{ t: 0.1, sfx: props.sfx, gain: 0.8 }] : [] };
};
