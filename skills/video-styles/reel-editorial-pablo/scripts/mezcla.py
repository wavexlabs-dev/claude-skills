"""Mezcla de sonido con el método "solo suena lo que tiene cuerpo" (ver references/sonido.md).
Uso:  python3 mezcla.py mezcla.json        (desde la carpeta del proyecto; necesita ffmpeg y numpy)

mezcla.json:
{
  "dur": 44, "lufs": -14, "salida": "out/mix.wav",
  "musica": {"archivo": "audio/music.mp3", "tempo": 0.955, "db": -9},
  "voz": "out/voz.wav",                                  // opcional; si existe, la música baja hasta quedar >= 10 dB bajo la voz
  "cues": [
    {"t": 5.45, "sonido": "impact", "tipo": "acento", "nota": "\"circuito.\" cae"},
    {"t": 8.20, "sonido": "teclas", "dur": 3.0, "tipo": "chico", "nota": "se escribe el pedido"},
    {"t": 26.06, "sonido": "thud", "nota": "la barra de 25 % asienta"},
    {"t": 27.46, "sonido": "thud", "tono": 0.86, "nota": "la barra de 69 % asienta (más grande = más grave)"}
  ]
}
"sonido": nombre de la biblioteca de la skill (assets/sonidos), o ruta a un archivo propio (se recorta a su primer golpe).
"teclas": tecleo reconstruido tecla por tecla con ritmo, tono y fuerza irregulares (nunca un bucle).
"tipo": acento (+10 dB en 1.5–8 kHz sobre la música), chico (+3), o nada (+6). Con voz, todo baja 3 dB.
"nota" es obligatoria: qué objeto es y qué le pasa. Si la respuesta es "la transición", el cue se borra."""
import json, os, re, subprocess, sys, wave, random, tempfile
import numpy as np
SR = 48000
LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'sonidos')
cfg = json.loads(re.sub(r'^\s*//.*$|\s+//\s.*$', '', open(sys.argv[1]).read(), flags=re.M))
DUR = float(cfg['dur']); random.seed(cfg.get('semilla', 7))
db = lambda g: 10 ** (g / 20)
TMP = tempfile.mkdtemp()

def load(path, af=None):
    tmp = os.path.join(TMP, f'l{random.random()}.wav')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', path] + (['-af', af] if af else []) + ['-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', tmp]
    subprocess.run(cmd, check=True)
    w = wave.open(tmp); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float32) / 32768; w.close(); os.remove(tmp)
    return a
def save(path, a):
    a = np.clip(a, -1, 1); w = wave.open(path, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a * 32767).astype(np.int16).tobytes()); w.close()
def pitch(a, ratio):                       # tono y duración juntos, como un objeto más grande (<1) o más chico (>1)
    n = int(len(a) / ratio); idx = np.clip((np.arange(n) * ratio).astype(int), 0, len(a) - 1); return a[idx]
def trim(a, largo=None, rel=.2):           # arranca en el primer golpe real (umbral relativo a su propio pico) y normaliza
    env = np.abs(a).max(axis=1); pk = env.max()
    assert pk > 1e-3, 'archivo sin señal'
    i0 = max(0, int(np.argmax(env > pk * rel)) - int(.006 * SR)); b = a[i0:i0 + int(largo * SR)] if largo else a[i0:]
    b = b.copy(); f = min(int(.25 * SR), int(len(b) * .4)); b[-f:] *= np.linspace(1, 0, f)[:, None]
    assert len(b) > .05 * SR, 'el sonido quedó vacío tras recortar'
    return b * (.9 / np.abs(b).max())
def band_rms(a, lo=1500, hi=8000):         # energía solo donde se oyen los objetos; la música vive más abajo
    m = a.mean(axis=1)
    if len(m) < 64: return -90.
    F = np.fft.rfft(m); f = np.fft.rfftfreq(len(m), 1 / SR); F[(f < lo) | (f > hi)] = 0
    return 20 * np.log10(np.sqrt((np.fft.irfft(F, len(m)) ** 2).mean()) + 1e-9)
def find(name):
    for p in (name, os.path.join('audio', name), os.path.join(LIB, name + '.wav'), os.path.join(LIB, name)):
        if os.path.isfile(p): return p
    sys.exit(f'no encuentro el sonido "{name}" (ni como ruta ni en la biblioteca {os.path.normpath(LIB)})')
def teclas(dur, fuente='typing'):
    src = load(find(fuente))[:SR]; env = np.abs(src).max(axis=1); thr = env.max() * .35
    on = [i for i in range(1, len(env)) if env[i] > thr and env[i - 1] <= thr]; keys = []; last = -9999
    for i in on:
        if i - last > int(.045 * SR): keys.append(i); last = i
    assert len(keys) >= 3, 'la fuente de tecleo no tiene teclas separables'
    grains = [src[max(0, i - 96): i + int(.085 * SR)].copy() for i in keys]
    for g in grains: g[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))[:, None]
    out = np.zeros((int((dur + .15) * SR), 2), np.float32); t = 0.; prev = -1; n = 0
    while t < dur - .05:
        k = random.choice([j for j in range(len(grains)) if j != prev]); prev = k
        g = pitch(grains[k], random.uniform(.93, 1.08)) * db(random.uniform(-4, 0))
        i0 = int(t * SR); m = min(len(g), len(out) - i0); out[i0:i0 + m] += g[:m]; n += 1
        t += random.uniform(.075, .16) + (random.uniform(.12, .3) if random.random() < .16 else 0)   # pausas de quien piensa
    return out * (.9 / np.abs(out).max()), n
def lufs(f):
    r = subprocess.run(['ffmpeg', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
fit = lambda a: np.pad(a, ((0, max(0, int(DUR * SR) - len(a))), (0, 0)))[:int(DUR * SR)]

avisos = []
# 1) voz (si hay) y música: la música va a ganancia fija; contra ella se calibra cada efecto
voz = fit(load(cfg['voz'])) if cfg.get('voz') else None
mus = np.zeros((int(DUR * SR), 2), np.float32); mdb = None
if cfg.get('musica'):
    m = cfg['musica']; mdb = float(m.get('db', -9))
    af = f"atempo={m.get('tempo', 1)},atrim=0:{DUR},afade=t=in:d=0.3,afade=t=out:st={DUR-0.6}:d=0.6"
    raw = fit(load(m['archivo'], af))
    if voz is not None:                    # la voz manda: >= 10 dB sobre la música, medido solo donde hay voz
        fr = int(.05 * SR); nf = len(voz) // fr
        e = 20 * np.log10(np.sqrt((voz[:nf * fr].mean(axis=1).reshape(nf, fr) ** 2).mean(axis=1)) + 1e-9)
        act = np.repeat(e > e.max() - 30, fr); v = 20 * np.log10(np.sqrt((voz[:nf * fr].mean(axis=1)[act] ** 2).mean()) + 1e-9)
        mm = 20 * np.log10(np.sqrt((raw[:nf * fr].mean(axis=1)[act] ** 2).mean()) + 1e-9)
        if v - (mm + mdb) < 10: nuevo = v - 10 - mm; avisos.append(f'música bajada de {mdb:+.1f} a {nuevo:+.1f} dB para dejar la voz 10 dB arriba'); mdb = nuevo
        print(f'VOZ {v:.1f} dB  ·  música bajo la voz {mm + mdb:.1f} dB  ·  diferencia {v - mm - mdb:.1f} dB')
    mus = raw * db(mdb)
elif cfg.get('cues'): avisos.append('sin música: los efectos se calibran contra silencio y quedarán a ganancia −12 dB fija')

# 2) efectos, cada uno calibrado a su meta de presencia
META = {'acento': 10, 'chico': 3}; baja = 3 if voz is not None else 0
bus = np.zeros((int(DUR * SR), 2), np.float32); rows = []; prev = None
cues = sorted(cfg.get('cues', []), key=lambda c: c['t'])
for c in cues:
    assert c.get('nota'), f'el cue en {c["t"]} no dice qué objeto suena'
    if re.search(r'transici|corte|cortina|cambio de (fondo|escena|layout)|whoosh', c['nota'], re.I): avisos.append(f'{c["t"]:.2f} s: "{c["nota"]}" suena a transición, no a objeto: revisar si se borra')
    if c['sonido'] == 'teclas': a, n = teclas(float(c.get('dur', 3)), c.get('fuente', 'typing')); c['nota'] += f' ({n} teclas, ritmo irregular)'
    else:
        a = load(find(c['sonido'])); a = a if c.get('crudo') else trim(a, c.get('largo'))
        if c.get('tono'): a = pitch(a, float(c['tono']))
    firma = (c['sonido'], c.get('tono', 1))
    if firma == prev and c['sonido'] != 'teclas': avisos.append(f'{c["t"]:.2f} s: "{c["sonido"]}" se repite idéntico al anterior: cambiar "tono" según el tamaño del objeto')
    prev = firma
    tgt = META.get(c.get('tipo'), 6) - baja; i0 = int(c['t'] * SR); L = min(int(.35 * SR), len(a)); i1 = min(i0 + L, len(bus))
    if i0 >= len(bus): avisos.append(f'{c["t"]:.2f} s cae fuera de la duración'); continue
    if cfg.get('musica'): p0 = band_rms(a[:i1 - i0]) - band_rms(mus[i0:i1]); gain = float(np.clip(tgt - p0, -40, 6)); got = p0 + gain
    else: gain, got = -12., float('nan')
    if abs(got - tgt) > .5: avisos.append(f'{c["t"]:.2f} s: quedó en {got:+.1f} dB y su meta es {tgt:+d}: la ganancia llegó a su tope; revisar la música en ese punto o cambiar el sonido')
    n = min(len(a), len(bus) - i0); bus[i0:i0 + n] += a[:n] * db(gain); rows.append((c['t'], tgt, got, gain, c['nota']))
# sala corta compartida: todos los objetos viven en el mismo espacio
if rows:
    save(os.path.join(TMP, 'dry.wav'), bus)
    bus = fit(load(os.path.join(TMP, 'dry.wav'), 'aecho=0.9:0.55:23|47|71:0.16|0.10|0.06,highpass=f=70'))

print('PRESENCIA en 1.5–8 kHz (efecto contra música en la ventana de su golpe)')
for t, tgt, got, gain, nota in rows: print(f'  {t:6.2f} s  meta {tgt:+3d}  logrado {got:+5.1f}  ganancia {gain:+6.1f} dB  {nota}')
# 3) densidad y respiros
if rows:
    ts = [r[0] for r in rows]; cada = DUR / len(ts); tope = 4 if voz is not None else 3
    gaps = sorted([b_ - a_ for a_, b_ in zip([0] + ts, ts + [DUR])], reverse=True)
    print(f'DENSIDAD: {len(ts)} sonidos en {DUR:g} s = uno cada {cada:.1f} s (tope: uno cada {tope} s)  ·  respiro mayor {gaps[0]:.1f} s')
    if cada < tope: avisos.append(f'demasiados efectos: uno cada {cada:.1f} s; quitar hasta llegar a uno cada {tope} s')
    if gaps[0] < 5 and DUR >= 15: avisos.append('no hay ningún respiro de 5 s sin efectos')
    if sum(1 for c in cues if c.get('tipo') == 'acento') > (2 if DUR > 30 else 1): avisos.append('más acentos de los permitidos (uno por pieza; dos si pasa de 30 s)')

# 4) suma, ganancia lineal a la meta y limitador (sin normalización dinámica, que mueve la música)
pre = os.path.join(TMP, 'pre.wav'); save(pre, bus + mus + (voz if voz is not None else 0))
I, P = lufs(pre); gain = float(cfg.get('lufs', -14)) - I; out = cfg.get('salida', 'out/mix.wav'); os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.7:attack=2:release=40:level=disabled', '-ar', str(SR), out], check=True)
I2, P2 = lufs(out); print(f'MEZCLA: {I2:.1f} LUFS, pico {P2:.1f} dBFS  ->  {out}')
if P2 > -2: avisos.append(f'pico {P2:.1f} dBFS por encima de −2')
print('AVISOS:' + ('\n  - ' + '\n  - '.join(avisos) if avisos else ' ninguno'))
print('FALTA OÍR: timbre de cada efecto, si se siente del objeto, si la música aburre. Eso lo juzga Pablo.')
