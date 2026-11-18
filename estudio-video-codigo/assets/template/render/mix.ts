import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

export type Cue = { t: number; sfx: string; gain?: number; scene?: string };

// Las cues cuyo nombre empieza con "vo" son voz: van a su propio bus (para medirla contra la música).
const isVoice = (c: Cue) => /^vo\d/.test(c.sfx);

// La música va a volumen fijo todo el video: subirla y bajarla por tramos se oye raro (nota de Pablo, 2026-10-29).
export const MUSIC_GAIN = Number(process.env.MUSIC_GAIN ?? 0.15);

// Mezcla offline: música a volumen fijo + voz + sfx, cada uno en su tiempo exacto, a ~−14 LUFS.
// stem: "voice" | "music" exporta solo ese bus, sin normalizar, para medir la relación voz/música.
export function mixAudio(cues: Cue[], seconds: number, offset: number, music: string, out: string, stem?: "voice" | "music") {
  const inputs: string[] = [];
  const filters: string[] = [];
  const sfx: string[] = [];
  const voice: string[] = [];
  const input = (file: string, pre: string[] = []) => {
    const idx = inputs.filter((x) => x === "-i").length;
    inputs.push(...pre, "-i", file);
    return idx;
  };

  cues.forEach((c, i) => {
    const file = `assets/sfx/${c.sfx}.wav`;
    if (!existsSync(file)) throw new Error(`Falta ${file} (cue "${c.sfx}"${c.scene ? ` en la escena ${c.scene}` : ""})`);
    const idx = input(file);
    const ms = Math.max(0, Math.round((c.t - offset) * 1000));
    filters.push(`[${idx}:a]adelay=${ms}:all=1,volume=${c.gain ?? 1}[c${i}]`);
    (isVoice(c) ? voice : sfx).push(`[c${i}]`);
  });

  const bus: string[] = [...sfx];
  if (voice.length) {
    filters.push(`${voice.join("")}amix=inputs=${voice.length}:normalize=0:duration=longest,apad,atrim=0:${seconds}[vo]`);
    bus.push("[vo]");
  }
  // Si falta la música indicada, se prueba la misma ruta con otra extensión (bed.wav sintetizada ↔ bed.mp3 de afuera).
  if (!existsSync(music)) music = ["wav", "mp3", "m4a", "flac"].map((e) => music.replace(/\.\w+$/, `.${e}`)).find(existsSync) ?? music;
  if (existsSync(music)) {
    const idx = input(music, ["-ss", String(offset), "-t", String(seconds)]);
    filters.push(`[${idx}:a]volume=${MUSIC_GAIN},afade=t=out:st=${Math.max(0, seconds - 0.6)}:d=0.6[m]`);
    bus.push("[m]");
  }
  if (stem) {
    // Las demás pistas entran en silencio (no con anullsink: corta el grafo antes de tiempo).
    const only = stem === "voice" ? "[vo]" : "[m]";
    bus.forEach((b, i) => filters.push(`${b}volume=${b === only ? 1 : 0}[z${i}]`));
    filters.push(`${bus.map((_, i) => `[z${i}]`).join("")}amix=inputs=${bus.length}:normalize=0:duration=longest,apad,atrim=0:${seconds}[out]`);
    if (process.env.MIX_DEBUG) console.log(filters.join("\n"));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-ac", "2", out], { stdio: "inherit" });
    return out;
  }
  if (!bus.length) {
    input("anullsrc=r=48000:cl=stereo", ["-f", "lavfi", "-t", String(seconds)]);
    bus.push("[0:a]");
  }
  filters.push(
    `${bus.join("")}amix=inputs=${bus.length}:normalize=0:duration=longest,` +
      `apad,atrim=0:${seconds},loudnorm=I=-15:TP=-1.5:LRA=11,aresample=192000,alimiter=limit=0.76:attack=1:level=false,aresample=48000[out]`,
  );
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-ac", "2", out], { stdio: "inherit" });
  return out;
}
