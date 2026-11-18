"""Calcula los recortes de la toma para cada layout a partir de la cara medida.
Uso:  python3 layout.py --aspecto 16:9 --cx 0.51 --arriba 0.11 --abajo 0.72 --ancho 0.22
  cx      centro horizontal de la cabeza (fracción del ancho del cuadro fuente)
  arriba  borde superior del pelo; abajo: barbilla (fracciones del alto). Medir en el cuadro donde más se acerca o se mueve.
  ancho   ancho de la cabeza (fracción del ancho)
Imprime el objeto L listo para pegar en la página y avisa si un layout corta la cabeza."""
import argparse
ap = argparse.ArgumentParser()
ap.add_argument('--aspecto', default='16:9'); ap.add_argument('--cx', type=float, required=True)
ap.add_argument('--arriba', type=float, required=True); ap.add_argument('--abajo', type=float, required=True)
ap.add_argument('--ancho', type=float, required=True)
a = ap.parse_args()
aw, ah = map(float, a.aspecto.split(':')); AR = aw / ah
cy_head = (a.arriba + a.abajo) / 2; alto = a.abajo - a.arriba
clamp = lambda x, lo, hi: max(lo, min(hi, x))

def crop(box_w, box_h, head_frac=None):
    """recorte (fracciones del fuente) que llena la caja; head_frac = cuánto del ancho de la caja ocupa la cabeza"""
    bar = box_w / box_h
    if head_frac:
        cw = a.ancho / head_frac; ch = cw * AR / bar
        if ch > 1: ch = 1; cw = bar / AR
        if cw > 1: cw = 1; ch = AR / bar
    elif bar / AR <= 1: ch = 1; cw = bar / AR          # se usa todo el alto
    else: cw = 1; ch = AR / bar                        # se usa todo el ancho
    cx = clamp(a.cx - cw / 2, 0, 1 - cw)
    cy = clamp(cy_head - ch * 0.46, 0, 1 - ch)         # la cabeza un poco arriba del centro
    return cx, cy, cw, ch

def report(name, box, c, extra):
    cx, cy, cw, ch = c
    aire_arriba = (a.arriba - cy) / ch; aire_abajo = (cy + ch - a.abajo) / ch
    ocupa = a.ancho / cw
    ok = aire_arriba >= 0.04 and aire_abajo >= 0.04 and ocupa <= 0.68 and a.cx - a.ancho / 2 >= cx and a.cx + a.ancho / 2 <= cx + cw
    print(f"  {name:7s}: {{x:{box[0]},y:{box[1]},w:{box[2]},h:{box[3]},r:{box[4]}, cx:{cx:.4f},cy:{cy:.4f},cw:{cw:.4f},ch:{ch:.4f}, {extra}}},")
    return f"  // {name}: la cabeza ocupa {ocupa*100:.0f} % del ancho; aire arriba {aire_arriba*100:.0f} %, abajo {aire_abajo*100:.0f} %  {'OK' if ok else '<< CORTA O APRIETA LA CABEZA: no usar este layout con esta toma'}"

print('const L={')
notes = [report('split', (0, 960, 1080, 960, 0), crop(1080, 960), 'sh:960,sx:140,sy:-690,ss:.74'),
         report('bubble', (721, 1072, 268, 375, 30), crop(268, 375, .63), 'sh:1920,sx:0,sy:0,ss:1'),
         report('full', (0, 0, 1080, 1920, 0), crop(1080, 1920), 'sh:0,sx:0,sy:0,ss:1')]
print('};'); print('\n'.join(notes))
print("// sh,sx,sy,ss = alto visible y encuadre del escenario de imagen en ese layout; ajustar a la composición.")
print("// Margen de seguridad: si se mueve mucho, medir en el cuadro más extremo. Con toma horizontal, 'full' casi siempre corta la frente.")
