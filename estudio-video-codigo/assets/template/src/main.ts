import { mount } from "./engine";
import { scenes } from "./scenes";
import { storyboard } from "./storyboard";
import { video } from "./tokens";

const stage = document.getElementById("stage")!;
const meta = mount(stage, storyboard, scenes);

if (new URLSearchParams(location.search).has("render")) {
  document.body.classList.add("render");
} else {
  preview();
}

// Preview: el mismo __seek que usa el render, manejado por un scrubber.
function preview() {
  const viewport = document.getElementById("viewport")!;
  const scrub = document.getElementById("scrub") as HTMLInputElement;
  const play = document.getElementById("play")!;
  const readout = document.getElementById("readout")!;
  const marks = document.getElementById("marks")!;
  const last = meta.totalFrames - 1;
  let frame = 0;
  let playing = false;
  let t0 = 0;
  let f0 = 0;

  scrub.max = String(last);
  for (const c of meta.cues) {
    const m = document.createElement("i");
    m.style.left = `${(c.t / meta.duration) * 100}%`;
    m.title = `${c.sfx} @ ${c.t.toFixed(2)}s`;
    marks.appendChild(m);
  }

  const fit = () => {
    const s = Math.min(viewport.clientWidth / video.width, viewport.clientHeight / video.height);
    stage.style.transform = `scale(${s})`;
  };

  const go = (f: number) => {
    frame = Math.max(0, Math.min(last, Math.round(f)));
    window.__seek(frame);
    scrub.value = String(frame);
    readout.textContent = `f ${frame} / ${last} · ${(frame / video.fps).toFixed(2)}s`;
  };

  const tick = (now: number) => {
    if (!playing) return;
    const f = f0 + ((now - t0) / 1000) * video.fps;
    go(f % meta.totalFrames);
    requestAnimationFrame(tick);
  };

  const toggle = () => {
    playing = !playing;
    play.textContent = playing ? "❚❚" : "▶";
    if (playing) {
      t0 = performance.now();
      f0 = frame;
      requestAnimationFrame(tick);
    }
  };

  play.addEventListener("click", toggle);
  scrub.addEventListener("input", () => go(+scrub.value));
  window.addEventListener("resize", fit);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); toggle(); }
    if (e.code === "ArrowRight") go(frame + (e.shiftKey ? 10 : 1));
    if (e.code === "ArrowLeft") go(frame - (e.shiftKey ? 10 : 1));
    if (e.code === "Home") go(0);
    if (e.code === "End") go(last);
  });

  fit();
  go(0);
}
