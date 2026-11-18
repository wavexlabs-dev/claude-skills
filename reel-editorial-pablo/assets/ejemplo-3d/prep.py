# Corta la toma: tramos buenos, sin silencios. Saca cuadros a pablo/f_%05d.jpg, la voz a out/voz.wav y tl.js con los tiempos por palabra.
import json, subprocess, re, os
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
SRC = '../C0844.MP4'; K = 30000/1001/30            # los cuadros 29.97 se leen como 30: el tiempo nuevo se encoge por K
SEG = [(22.00, 36.30), (38.20, 53.95), (55.35, 70.30), (71.70, 82.30), (101.40, 105.10), (107.02, 116.15), (116.45, 127.95), (130.08, 134.60)]
PAD = 0.07; MINSIL = 0.30
# Luz (versión de la otra sesión, kindle-short/edit.md, que Pablo prefirió el 13 nov 2026): medios arriba sin tocar negros,
# piel hacia violeta y una "lámpara" morada simulada que entra por la izquierda (multiplica, así lo negro sigue negro).
LUZ = "curves=all='0/0 0.12/0.12 0.45/0.51 1/1',colorbalance=rm=-0.01:gm=-0.03:bm=0.07:rh=-0.01:gh=-0.02:bh=0.04,format=gbrp,geq=r='min(255,r(X,Y)*(1+0.08*pow(1-X/W,1.4)))':g='g(X,Y)*(1-0.04*pow(1-X/W,1.4))':b='min(255,b(X,Y)*(1+0.5*pow(1-X/W,1.4)))',format=yuvj420p"
out = subprocess.run(['ffmpeg', '-i', 'out/voz16k.wav', '-af', f'silencedetect=n=-34dB:d={MINSIL}', '-f', 'null', '-'], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
sil = list(zip(ss, se + [1e9] * (len(ss) - len(se))))
keep = []
for a, b in SEG:
    cur = a
    for s, e in sil:
        if e <= a or s >= b: continue
        s2, e2 = max(s, a) + PAD, min(e, b) - PAD
        if e2 - s2 < 0.12: continue
        if s2 > cur: keep.append((cur, s2))
        cur = e2
    if b > cur: keep.append((cur, b))
keep = [(round(a, 3), round(b, 3)) for a, b in keep if b - a > 0.08]
# mapa tiempo original -> nuevo
acc = 0; table = []
for a, b in keep: table.append((a, b, acc)); acc += b - a
DUR = acc * K
def R(t):
    for a, b, o in table:
        if t < a: return o * K
        if t <= b: return (o + t - a) * K
    return DUR
w = [x for s in json.load(open('out/voz16k.json'))['segments'] for x in s['words']]
words = [{'w': x['word'].strip(), 't': round(R(x['start']), 3), 'e': round(R(x['end']), 3), 'o': round(x['start'], 2)} for x in w if any(a - .45 <= x['start'] <= b for a, b in keep) and not (87.3 < x['start'] < 88.2)]
cuts = [round(o * K, 3) for a, b, o in table][1:]
segstart = [round(R(a + 0.02), 3) for a, b in SEG]
open('tl.js', 'w').write('window.TL=' + json.dumps({'dur': round(DUR, 3), 'words': words, 'cuts': cuts, 'seg': segstart}, ensure_ascii=False) + ';')
print('tramos', len(keep), 'dur', round(DUR, 2), 'seg', segstart)
if os.environ.get('SOLO_TL'): raise SystemExit
sel = '+'.join(f'between(t,{a},{b})' for a, b in keep)
if os.environ.get('V12'):      # versión 1.2x: cuadros reales a 30 fps en pablo12/
    K4 = bool(os.environ.get('K4')); PD = 'pablo12_4k' if K4 else 'pablo12'; SZ = '2160:3840' if K4 else '1080:1920'
    os.makedirs(PD, exist_ok=True)
    for f in os.listdir(PD): os.remove(PD + '/' + f)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', SRC, '-vf', f"select='{sel}',setpts=N/(30000/1001)/TB,setpts=PTS/1.2,fps=30,scale={SZ}:flags=lanczos,{LUZ}", '-fps_mode', 'passthrough', '-q:v', '2' if K4 else '4', PD + '/f_%05d.jpg'], check=True)
    print('cuadros12', len(os.listdir(PD))); raise SystemExit
if not os.environ.get('SOLO_AUDIO'):
  os.makedirs('pablo', exist_ok=True)
  for f in os.listdir('pablo'):
      if f.startswith('f_'): os.remove('pablo/' + f)
  subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', SRC, '-vf', f"select='{sel}',scale=1080:1920", '-fps_mode', 'passthrough', '-q:v', '4', 'pablo/f_%05d.jpg'], check=True)
fc = ';'.join(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={b-a-0.008:.3f}:d=0.008[a{i}]' for i, (a, b) in enumerate(keep))
fc += ';' + ''.join(f'[a{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=0:a=1,atempo={1/K:.6f}[o]'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'out/voz.wav'], check=True)
print('cuadros', len([f for f in os.listdir('pablo') if f.startswith('f_')]))
