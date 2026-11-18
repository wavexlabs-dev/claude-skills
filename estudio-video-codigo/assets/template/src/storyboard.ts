import type { Shot } from "./engine";

// El video en datos: cada toma es { scene, dur, overlap?, props }.
// overlap: segundos que la toma entra antes de que termine la anterior (cámara continua, sin cuadros vacíos).
// Para una capa que dura todo el video (HUD, subtítulos), usa dur = total y overlap = total.
// Todo texto en pantalla viene de brief/facts.json; los tiempos, de brief/timing.json (la voz manda).
export const storyboard: Shot[] = [
  { scene: "title", dur: 2.5, props: { text: "Prueba del motor" } },
  { scene: "title", dur: 2.5, overlap: 0.15, props: { text: "Funciona." } },
];
