# Insertos de Muhammad con su propia voz (subtitulada en español) dentro del reel "Jeep 94".
# Pausan la voz de Pablo en un hueco entre frases; la imagen viene de su video (recorte vertical sin sus subtítulos quemados).
# Salidas: assets/clips/<id>/c_###.jpg, ins.js (window.INS), y con --voz ENTRA SALE arma la voz con los insertos.
# Uso: python3 insertos.py                         -> cuadros + ins.js
#      python3 insertos.py --voz out/voz12_g.wav out/voz12_g_ins.wav
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
SRC = os.path.expanduser('~/Downloads/Claude reverse engineered my 32-year-old Jeep. Then it started controlling it.  Edited with Fable 5.2.mp4')
COLA = 0.10                                      # aire después de su voz, antes de que Pablo siga
# tp: punto de la voz de Pablo (línea final, en silencio) donde se abre el hueco
# a, b: su voz (segundos del video de Muhammad); v: desde dónde corre la imagen; crop: recorte vertical 9:16 arriba de sus subtítulos
INS = [
  dict(id='m_circ', tp=27.76, a=464.00, b=465.85, v=456.4, crop='340:604:790:291',
       subs=[["Y me faltaron", 464.12, 464.92], ["cuatro meses.", 464.92, 465.85]]),
  dict(id='m_bomba', tp=45.68, a=255.10, b=259.10, v=255.1, crop='500:889:710:0',
       subs=[["La bomba estuvo prendida", 255.2, 255.92], ["como 10 segundos", 255.92, 256.6],
             ["y me empecé a asustar", 256.6, 257.6], ["y le pedí que parara.", 258.1, 259.1]]),
]
for I in INS: I['d'] = round(I['b'] - I['a'] + COLA, 3)

if '--voz' in sys.argv:
    i = sys.argv.index('--voz'); ent, sal = sys.argv[i + 1], sys.argv[i + 2]
    # nivel: su voz se iguala a la de Pablo (loudness integrada)
    def lufs(args):
        o = subprocess.run(['ffmpeg', '-hide_banner'] + args + ['-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        return float(o.rsplit('I:', 1)[1].split('LUFS')[0])
    lp = lufs(['-i', ent])
    parts, cur, n = [], 0.0, 0
    fc, ins = [], ['-i', ent]
    for k, I in enumerate(INS):
        lm = lufs(['-ss', str(I['a']), '-t', str(I['b'] - I['a']), '-i', SRC])
        ins += ['-ss', str(I['a']), '-t', str(I['b'] - I['a']), '-i', SRC]
        fc.append(f"[0:a]atrim={cur}:{I['tp']},asetpts=PTS-STARTPTS[p{k}]")
        fc.append(f"[{k+1}:a]aformat=sample_rates=48000:channel_layouts=mono,volume={lp - lm:.2f}dB,afade=t=in:d=0.02,afade=t=out:st={I['b'] - I['a'] - 0.04:.3f}:d=0.04,apad=pad_dur={COLA}[m{k}]")
        parts += [f'[p{k}]', f'[m{k}]']; cur = I['tp']
    fc.append(f"[0:a]atrim={cur},asetpts=PTS-STARTPTS[pz]"); parts.append('[pz]')
    fc.append(''.join(parts) + f'concat=n={len(parts)}:v=0:a=1[o]')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + ins + ['-filter_complex', ';'.join(fc), '-map', '[o]', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s24le', sal], check=True)
    print('voz con insertos:', sal, '· Pablo', round(lp, 1), 'LUFS')
    raise SystemExit

out = []
for I in INS:
    d = f"assets/clips/{I['id']}"; os.makedirs(d, exist_ok=True)
    for x in os.listdir(d): os.remove(f'{d}/{x}')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(I['v']), '-t', str(I['d'] + 0.2), '-i', SRC,
                    '-vf', f"crop={I['crop']},scale=1080:1920:flags=lanczos,fps=30", '-q:v', '3', f'{d}/c_%03d.jpg'], check=True)
    out.append(dict(id=I['id'], tp=I['tp'], d=I['d'], n=len(os.listdir(d)),
                    subs=[[s, round(a - I['a'], 3), round(e - I['a'], 3)] for s, a, e in I['subs']]))
open('ins.js', 'w').write('window.INS=' + json.dumps(out, ensure_ascii=False) + ';')
print('ins.js', [(o['id'], o['tp'], o['d'], o['n']) for o in out], '· se suman', round(sum(o['d'] for o in out), 2), 's')
