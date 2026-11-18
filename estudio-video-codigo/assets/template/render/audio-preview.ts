// Mezcla solo de audio desde brief/timing.json, para la parada de aprobación antes de construir la imagen.
//   npm run audio-preview   → out/audio_preview.wav
import { mkdirSync, readFileSync } from "node:fs";
import { mixAudio } from "./mix";
const timing = JSON.parse(readFileSync("brief/timing.json", "utf8"));
mkdirSync("out", { recursive: true });
console.log(mixAudio(timing.cues, timing.duracion ?? 30, 0, timing.musica ?? "assets/music/bed.wav", "out/audio_preview.wav"));
