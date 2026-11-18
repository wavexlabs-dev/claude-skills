# Revisa un corte pedazo por pedazo: transcribe por separado cada trozo de voz entre silencios (>=0.24 s bajo -40 dB).
# Si dos trozos seguidos empiezan igual, es un falso arranque repetido. Uso: python3 piezas.py  (lee SEG de ../prep.py)
import wave, numpy as np, subprocess, os, re, json
src = open('../prep.py').read()
SEG = [(f, float(a), float(b)) for f, a, b in re.findall(r"\('(C\d+)',\s*([\d.]+),\s*([\d.]+)\)", src[src.index('SEG = ['):src.index('PAD,')])]
X = {}
def load(f):
    if f not in X:
        w = wave.open(f + '.wav'); X[f] = (w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768)
    return X[f]
def piezas(f, a, b):
    sr, x = load(f); e = []; t = a
    while t < b:
        s = x[int(t * sr):int((t + .04) * sr)]; e.append(20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9)); t += .04
    P = []; cur = None; sil = 0; end = a
    for k, v in enumerate(e):
        ti = a + k * .04
        if v > -40:
            if cur is None: cur = ti
            sil = 0; end = ti + .04
        else:
            sil += 1
            if cur is not None and sil >= 6: P.append((cur, end)); cur = None
    if cur is not None: P.append((cur, end))
    return [p for p in P if p[1] - p[0] >= 0.2]
out = []
for f, a, b in SEG:
    for p0, p1 in piezas(f, a, b):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{max(a, p0 - .04):.2f}', '-to', f'{min(b, p1 + .04):.2f}', '-i', f + '.wav', 'g.wav'])
        subprocess.run(['mlx_whisper', 'g.wav', '--model', 'mlx-community/whisper-large-v3-turbo', '--language', 'es', '--output-format', 'txt', '--output-dir', '.', '--condition-on-previous-text', 'False'], capture_output=True)
        t = open('g.txt').read().strip().replace('\n', ' '); out.append((f, p0, p1, t)); print(f'{f} {p0:6.2f}-{p1:6.2f} | {t}', flush=True)
os.remove('g.wav'); os.remove('g.txt'); json.dump(out, open('piezas.json', 'w'), ensure_ascii=False)
