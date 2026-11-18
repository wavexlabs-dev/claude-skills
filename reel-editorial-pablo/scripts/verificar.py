"""Verificador automático: mide las reglas del reel y dice PASA o NO PASA. Se corre ANTES de enseñarle nada a Pablo.
Uso (desde la carpeta del proyecto):
    python3 verificar.py [--html index.html] [--voz out/voz.wav] [--video out/reel.mp4]
Necesita: verificar.mjs en la misma carpeta que este script, playwright-core en el proyecto, ffmpeg, Pillow.
La página debe exponer window.ESTADO(t) (contrato en verificar.mjs). Sale con código 1 si algo no pasa.
"""
import argparse, json, os, re, subprocess, sys, shutil
from urllib.parse import unquote, urlparse
ap = argparse.ArgumentParser(); ap.add_argument('--html', default='index.html'); ap.add_argument('--voz'); ap.add_argument('--video')
ap.add_argument('--hueco', default='90-140'); a = ap.parse_args()
HMIN, HMAX = map(int, a.hueco.split('-')); AQUI = os.path.dirname(os.path.abspath(__file__))
filas = []; fallos = 0
def fila(ok, regla, medido, nota=''):
    global fallos
    est = 'PASA' if ok is True else 'AVISO' if ok is None else 'NO PASA'; fallos += ok is False
    filas.append((est, regla, medido, nota))
# el .mjs se copia al proyecto para que encuentre playwright-core
mjs = os.path.join(os.getcwd(), '_verificar.mjs'); shutil.copy(os.path.join(AQUI, 'verificar.mjs'), mjs)
r = subprocess.run(['node', mjs, a.html, 'out/verificar_dom.json'], capture_output=True, text=True); os.remove(mjs)
if r.returncode: sys.exit('No pude leer la página:\n' + r.stderr)
D = json.load(open('out/verificar_dom.json')); S = D['seg']; DUR = D['dur']
dur = lambda s: s['t1'] - s['t0']; grande = lambda s: s['camara'] in ('completa', 'tarjeta')
# 1. apertura
fila(S[0]['camara'] == 'completa' and dur(S[0]) >= 6, 'Abre Pablo a pantalla completa (≥6 s)', f"{S[0]['camara']}, {dur(S[0]):.1f} s")
# 2. tiempo con Pablo grande
pg = 100 * sum(dur(s) for s in S if grande(s)) / DUR
fila(pg >= 50, 'Pablo grande ≥50 % del tiempo', f'{pg:.0f} %')
# 3. tramo más largo sin verlo grande, y burbujas seguidas
mx = cur = 0; ini = 0; peor = (0, 0)
for s in S:
    if grande(s): cur = 0
    else:
        if cur == 0: ini = s['t0']
        cur += dur(s)
        if cur > mx: mx = cur; peor = (ini, s['t1'])
fila(mx <= 8, 'Tramo más largo sin Pablo grande ≤8 s', f'{mx:.1f} s', f'de {peor[0]:.1f} a {peor[1]:.1f} s' if mx > 8 else '')
bb = [f"{x['id']}→{y['id']}" for x, y in zip(S, S[1:]) if x['camara'] == 'burbuja' and y['camara'] == 'burbuja']
fila(not bb, 'Nunca dos escenas con burbuja seguidas', 'ninguna' if not bb else ', '.join(bb))
# 4. fondos
G = [s for s in S if s['fondo'] != 'toma']; fam = sorted({s['fondo'] for s in G}); pide = 5 if DUR >= 45 else 3
fila(len(fam) >= pide, f'Familias de fondo ≥{pide}', f"{len(fam)}: {', '.join(fam)}")
fila('naranja' in fam, 'Hay un fondo naranja', 'sí' if 'naranja' in fam else 'no')
rep = [f"{x['id']}→{y['id']} ({x['fondo']})" for x, y in zip(G, G[1:]) if x['fondo'] == y['fondo'] and x['id'] != y['id']]
fila(not rep, 'Ningún fondo repetido en escenas gráficas seguidas', 'ninguno' if not rep else ', '.join(rep))
# 5. hueco titular–elemento y renders recortados
try:
    from PIL import Image
except ImportError: Image = None
for s in S:
    c = s.get('cajas')
    if not c: continue
    # un video a pantalla completa (el elemento ocupa casi todo el cuadro) es fondo, no elemento: no aplica el hueco
    if c['elemento'].get('h', 0) >= 1700 and c['elemento'].get('w', 0) >= 1000: continue
    top = c['elemento']['y']; borde = ''
    if c['src'] and Image and c['src'].lower().split('?')[0].endswith('.png'):
        p = unquote(urlparse(c['src']).path)
        if os.name == 'nt' and re.match(r'^/[A-Za-z]:', p): p = p[1:]
        if os.path.exists(p):
            im = Image.open(p)
            if im.mode in ('RGBA', 'LA'):
                x0, y0, x1, y1 = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox(); W, H = im.size
                top = c['elemento']['y'] + y0 / H * c['elemento']['h']
                toca = [n for n, v in (('izq', x0 <= 0), ('arriba', y0 <= 0), ('der', x1 >= W), ('abajo', y1 >= H)) if v]
                if toca: borde = 'el render toca el borde: ' + ', '.join(toca)
    hueco = top - (c['titular']['y'] + c['titular']['h'])
    fila(HMIN <= hueco <= HMAX, f"Hueco titular–elemento en {s['id']} ({HMIN}–{HMAX} px)", f'{hueco:.0f} px', f"“{c['texto'][:34]}” a los {s['medido']:.1f} s")
    if borde: fila(None, f"Render de {s['id']}", borde, 'si el borde cae dentro del cuadro se ve cortado')
# 5b. el titular completo debe quedarse al menos 1.5 s
for s in S:
    if not s.get('titular'): continue
    if s.get('completo') is None: fila(False, f"Titular de {s['id']} completo ≥1.5 s", 'nunca se completa'); continue
    q = s['t1'] - s['completo']
    fila(q >= 1.5, f"Titular de {s['id']} completo ≥1.5 s", f'{q:.1f} s', f"se completa a los {s['completo']:.1f} s y la escena acaba a los {s['t1']:.1f} s" if q < 1.5 else '')
# 6. voz cortada: volver a transcribir y buscar repeticiones
if a.voz:
    os.makedirs('out/verificar_voz', exist_ok=True); base = os.path.splitext(os.path.basename(a.voz))[0]; js = f'out/verificar_voz/{base}.json'
    if shutil.which('mlx_whisper'): cmd = ['mlx_whisper', a.voz, '--model', 'mlx-community/whisper-small-mlx', '--language', 'es', '--word-timestamps', 'True', '--output-format', 'json', '--output-dir', 'out/verificar_voz']
    else: cmd = ['whisper', a.voz, '--model', 'small', '--language', 'es', '--word_timestamps', 'True', '--output_format', 'json', '--output_dir', 'out/verificar_voz']
    r = subprocess.run(cmd, capture_output=True, text=True)
    if not os.path.exists(js): fila(None, 'Voz cortada', 'no se pudo transcribir', r.stderr[-120:])
    else:
        w = [x for g in json.load(open(js))['segments'] for x in g.get('words', [])]
        n = lambda x: re.sub(r'[^\wáéíóúñü]', '', x['word'].lower())
        rep = []
        for i in range(len(w) - 3):
            par = (n(w[i]), n(w[i + 1]))
            for j in range(i + 2, min(i + 6, len(w) - 1)):
                if par == (n(w[j]), n(w[j + 1])) and all(par): rep.append(f"“{par[0]} {par[1]}” a los {w[i]['start']:.1f} y {w[j]['start']:.1f} s")
        unas = [f"“{n(x)} {n(x)}” a los {x['start']:.1f} s" for x, y in zip(w, w[1:]) if n(x) == n(y) and len(n(x)) > 2]
        fila(not rep and not unas, 'Voz sin palabras repetidas seguidas', 'ninguna' if not rep + unas else '; '.join(dict.fromkeys(rep + unas)))
        # whisper limpia los titubeos: un "de ahí… de ahí extrae" sale como un solo "extrae" que dura de más.
        # Por eso se marcan las palabras demasiado largas para sus letras (≥0.55 s y ≥0.11 s por letra).
        largas = [f"“{n(x)}” {x['end'] - x['start']:.2f} s a los {x['start']:.1f} s" for x in w if x['end'] - x['start'] >= 0.55 and (x['end'] - x['start']) / max(len(n(x)), 1) >= 0.11]
        fila(None if largas else True, 'Palabras que duran de más (posible repetición escondida)', 'ninguna' if not largas else '; '.join(largas), 'oír esos puntos: whisper borra las repeticiones' if largas else '')
        open('out/verificar_voz/texto.txt', 'w', encoding='utf-8').write(' '.join(x['word'].strip() for x in w) + '\n')
        fila(None, 'Texto de la voz para leerlo completo', 'out/verificar_voz/texto.txt')
# 7. volumen
if a.video:
    r = subprocess.run(['ffmpeg', '-i', a.video, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); P = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
    fila(abs(I + 14) <= 1 and P <= -2, 'Volumen −14 ± 1 LUFS y pico ≤ −2 dBFS', f'{I:.1f} LUFS, {P:.1f} dBFS')
ancho = max(len(f[1]) for f in filas)
txt = '\n'.join(f"{e:8} {r.ljust(ancho)}  {m}" + (f'   [{n}]' if n else '') for e, r, m, n in filas)
txt += f"\n\nRESULTADO: {'NO PASA' if fallos else 'PASA'} ({fallos} regla(s) sin cumplir de {sum(f[0] != 'AVISO' for f in filas)})"
open('out/verificar.txt', 'w', encoding='utf-8').write(txt + '\n'); print(txt); sys.exit(1 if fallos else 0)
