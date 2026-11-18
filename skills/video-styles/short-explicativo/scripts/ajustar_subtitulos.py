#!/usr/bin/env python3
"""Corrige el error más común del reconocedor: marca el inicio de una frase 0.1-0.4 s ANTES de que Pablo hable
cuando hay silencio previo. Mueve el `start` de cada palabra que cae dentro de un silencio real al final de ese
silencio. Correr después de cut.py y antes de render.py (cut.py vuelve a escribir el transcript).

Uso: ajustar_subtitulos.py <proyecto>   (lee work/clean.mp4 y work/transcript_clean.json)
Imprime las palabras movidas y sugiere los límites de escena (usa el final del silencio, no el transcript).
"""
import json, re, subprocess, sys, os
p = sys.argv[1]
clean, tj = os.path.join(p, "work/clean.mp4"), os.path.join(p, "work/transcript_clean.json")
log = subprocess.run(["ffmpeg", "-v", "info", "-i", clean, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
sil, s = [], None
for line in log.splitlines():
    m = re.search(r"silence_start: ([\d.]+)", line)
    if m: s = float(m.group(1))
    m = re.search(r"silence_end: ([\d.]+)", line)
    if m and s is not None: sil.append((s, float(m.group(1)))); s = None
w = json.load(open(tj)); n = 0
for x in w:
    for a, e in sil:
        if a - 0.05 <= x["start"] < e and e - x["start"] > 0.08:
            print(f"{x['text']:14} {x['start']:6.2f} -> {e:6.2f}")
            x["start"] = round(e, 2); x["end"] = max(x["end"], round(e + 0.12, 2)); n += 1; break
json.dump(w, open(tj, "w"), indent=1)
print(f"{n} palabras ajustadas; silencios (inicio-fin) para poner cortes de escena:")
print(" ".join(f"{a:.2f}-{e:.2f}" for a, e in sil))
