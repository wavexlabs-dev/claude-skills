# Reel "Jeep 94": corta las tomas elegidas (mirando a cámara), quita silencios, recorta a vertical y acelera 1.2x.
# Salidas: work/corte.mp4 (vertical 1080x1920, velocidad real), pablo/f_00001.jpg… (1.2x, 30 fps),
#          out/voz12.wav (voz cortada a 1.2x), tl.js (palabras con tiempos en la línea nueva).
# Uso: python3 prep.py            (SOLO_TL=1 solo recalcula tl.js)
import json, os, re, subprocess
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
SP = 1.2
# (toma, inicio, fin) en segundos de la toma original. Ver GUION.md, tabla 1.
SEG = [('C0871', 4.20, 8.10), ('C0871', 9.76, 13.10),
       ('C0872', 16.93, 24.10), ('C0872', 29.45, 31.84), ('C0872', 33.47, 36.40), ('C0872', 39.66, 42.70),
       ('C0872', 45.54, 48.74), ('C0872', 49.18, 51.48), ('C0872', 61.94, 68.58), ('C0872', 68.90, 75.70),
       ('C0872', 82.25, 89.70), ('C0872', 93.13, 98.46), ('C0871', 111.48, 118.30),
       ('C0872', 126.85, 128.78), ('C0872', 130.82, 141.85), ('C0872', 146.40, 154.05)]
# Cortes revisados: cada fin cae en silencio real (< -40 dB) y cada inicio deja ~0.1 s de aire antes de la voz.
PAD, MINSIL = 0.12, 0.30
CROP = "crop=iw*0.3164:ih:iw*0.3418:0"           # recorte vertical medido con layout.py (cara completa)

def silencios(f):
    o = subprocess.run(['ffmpeg', '-i', f'work/{f}.wav', '-af', f'silencedetect=n=-34dB:d={MINSIL}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', o)]; e = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    return list(zip(s, e + [1e9] * (len(s) - len(e))))
SIL = {f: silencios(f) for f in {s[0] for s in SEG}}
keep = []                                         # (toma, a, b) sin silencios internos
for f, a, b in SEG:
    cur = a
    for s, e in SIL[f]:
        if e <= a or s >= b: continue
        s2, e2 = max(s, a) + PAD, min(e, b) - PAD
        if e2 - s2 < 0.12: continue
        if s2 > cur: keep.append((f, cur, s2))
        cur = e2
    if b > cur: keep.append((f, cur, b))
keep = [(f, round(a, 3), round(b, 3)) for f, a, b in keep if b - a > 0.08]
acc, tab = 0.0, []
for f, a, b in keep: tab.append((f, a, b, acc)); acc += b - a
DUR = acc / SP
def R(f, t):                                      # tiempo de la toma -> tiempo del reel (ya a 1.2x)
    for g, a, b, o in tab:
        if g == f and a - 0.05 <= t <= b: return (o + max(0, t - a)) / SP
    return None
words = []
for f in sorted(SIL):
    for x in [w for s in json.load(open(f'work/{f}.json'))['segments'] for w in s['words']]:
        t = R(f, x['start'])
        if t is not None: words.append({'w': x['word'].strip(), 't': round(t, 3), 'e': round(R(f, x['end']) or t + .2, 3), 'src': f, 'o': round(x['start'], 2)})
words.sort(key=lambda w: w['t'])
def R0(f, a, b):                                  # inicio de una frase en el reel (su primer tramo conservado)
    for g, x, y, o in tab:
        if g == f and y > a and x < b: return (o + max(0, a - x)) / SP
seg0 = [round(R0(f, a, b), 3) for f, a, b in SEG]
open('tl.js', 'w').write('window.TL=' + json.dumps({'dur': round(DUR, 3), 'seg': seg0, 'cuts': [round(o / SP, 3) for *_, o in tab][1:], 'words': words}, ensure_ascii=False) + ';')
if os.path.exists('work/tl_v1.js'):
    old = json.loads(open('work/tl_v1.js').read()[10:-1]); ov = {(w['src'], w['o']): w['t'] for w in old['words']}
    pares = sorted({(w['t'], ov[(w['src'], w['o'])]) for w in words if (w['src'], w['o']) in ov})
    pares = [(0.0, 0.0)] + pares + [(round(DUR, 3), round(old['dur'], 3))]
    open('mapa.js', 'w').write('window.MAPA=' + json.dumps(pares) + ';')
print('tramos', len(keep), '· duración a 1.2x', round(DUR, 2), 's · inicio de cada frase', seg0)
if os.environ.get('SOLO_TL'): raise SystemExit
os.makedirs('out', exist_ok=True); os.makedirs('pablo', exist_ok=True)
srcs = sorted({f for f, *_ in keep}); idx = {f: i for i, f in enumerate(srcs)}
v = ';'.join(f'[{idx[f]}:v]trim={a}:{b},setpts=PTS-STARTPTS,{CROP},scale=1080:1920:flags=lanczos,fps=30000/1001[v{i}]' for i, (f, a, b) in enumerate(keep))
au = ';'.join(f'[{idx[f]}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b - a - 0.025:.3f}:d=0.025[a{i}]' for i, (f, a, b) in enumerate(keep))
cat = ''.join(f'[v{i}][a{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=1:a=1[vo][ao]'
cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + sum([['-i', f'{f}.MP4'] for f in srcs], []) + ['-filter_complex', f'{v};{au};{cat}', '-map', '[vo]', '-map', '[ao]', '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-c:a', 'pcm_s16le', 'work/corte.mov']
subprocess.run(cmd, check=True)
for x in os.listdir('pablo'): os.remove('pablo/' + x)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'work/corte.mov', '-vf', f'setpts=PTS/{SP},fps=30', '-q:v', '3', 'pablo/f_%05d.jpg'], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'work/corte.mov', '-vn', '-af', f'atempo={SP}', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s24le', 'out/voz12-para-limpiar.wav'], check=True)
print('cuadros', len(os.listdir('pablo')))
