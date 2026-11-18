# Kindle básica 2014 (7a gen): 119 x 169 x 10.2 mm. Corre dentro de Blender. Crea la escena "Kindle" sin tocar las demás.
import bpy, bmesh, math, os
HERE = "/Users/pabloparedeslombardo/Documents/Personal Brand/Kindle 3D"
mm = 0.001
W, H, TH = 119*mm, 169*mm, 10.2*mm
SW, SH = 90.6*mm, 122.4*mm          # pantalla
SCY = 5.5*mm                         # la pantalla va más arriba que el centro
REC = 1.3*mm                         # hundido de la pantalla
NC = 8                               # segmentos por esquina

# --- escena limpia propia
if "Kindle" in bpy.data.scenes:
    sc = bpy.data.scenes["Kindle"]
    for o in list(sc.collection.all_objects): bpy.data.objects.remove(o, do_unlink=True)
else:
    sc = bpy.data.scenes.new("Kindle")
bpy.context.window.scene = sc
col = sc.collection

def loop(w, h, r, z, cy=0.0):
    r = max(r, 1e-5); pts = []
    for (sx, sy, a0) in [(1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)]:
        cx, cyy = sx*(w/2-r), sy*(h/2-r)
        for i in range(NC+1):
            a = math.radians(a0 + 90*i/NC)
            pts.append((cx + r*math.cos(a), cy + cyy + r*math.sin(a), z))
    return pts

def mat(name, color, rough, metal=0.0, spec=0.5):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value = spec
    return m

M_BODY = mat("Kindle_plastico", (0.012, 0.012, 0.014), 0.48)
M_BACK = mat("Kindle_espalda", (0.03, 0.03, 0.033), 0.72)
M_LOGO = mat("Kindle_logo", (0.004, 0.004, 0.005), 0.18)
M_LOGO_B = mat("Kindle_logo_espalda", (0.11, 0.11, 0.115), 0.3)
M_PORT = mat("Kindle_puerto", (0.002, 0.002, 0.002), 0.4, metal=0.6)

# --- cuerpo: aros de arriba (frente) hacia abajo (espalda)
L = [
    (loop(SW, SH, 0.4*mm, -REC, SCY), None),                    # piso de la pantalla
    (loop(SW+1.6*mm, SH+1.6*mm, 0.9*mm, 0, SCY), M_BODY),       # pared inclinada del hundido
    (loop(W-1.6*mm, H-1.6*mm, 8.4*mm, 0), M_BODY),              # cara frontal
    (loop(W-0.4*mm, H-0.4*mm, 9.0*mm, -0.45*mm), M_BODY),       # canto redondeado
    (loop(W, H, 9.2*mm, -1.2*mm), M_BODY),
    (loop(W, H, 9.2*mm, -4.6*mm), M_BODY),                      # pared lateral
    (loop(W, H, 9.2*mm, -TH), M_BODY),                          # prisma recto; el bisel lo corta un tronco de pirámide
]
bm = bmesh.new()
rings = [[bm.verts.new(p) for p in pts] for pts, _ in L]
n = len(rings[0])
for k in range(len(rings)-1):
    for i in range(n):
        f = bm.faces.new((rings[k][i], rings[k][(i+1) % n], rings[k+1][(i+1) % n], rings[k+1][i]))
        f.material_index = 0
f = bm.faces.new(rings[0]); f.material_index = 0                 # piso
f = bm.faces.new(list(reversed(rings[-1]))); f.material_index = 1  # panel trasero
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new("Kindle_cuerpo"); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new("Kindle_cuerpo", me); col.objects.link(body)
me.materials.append(M_BODY); me.materials.append(M_BACK)
for p in me.polygons: p.use_smooth = True
try:
    me.shade_auto_smooth  # noqa
except Exception: pass
mod = body.modifiers.new("Bisel", "BEVEL"); mod.width = 0.35*mm; mod.segments = 2; mod.limit_method = 'ANGLE'; mod.angle_limit = math.radians(24)
try:
    sm = body.modifiers.new("Suavizado", "NODES")
    body.modifiers.remove(sm)
except Exception: pass
# suavizado por ángulo
bpy.context.view_layer.objects.active = body; body.select_set(True)
try: bpy.ops.object.shade_auto_smooth(angle=math.radians(22))
except Exception as e: print("auto smooth", e)

# --- bisel de la espalda: cuatro planos que se encuentran en inglete, como en la foto
def ring4(bmx, w, h, z): return [bmx.verts.new((x*w/2, y*h/2, z)) for x, y in [(1, 1), (-1, 1), (-1, -1), (1, -1)]]
tb = bmesh.new(); INS = 11*mm; Z0 = -4.6*mm; k = (TH+Z0)/INS
A = ring4(tb, W+2*mm, H+2*mm, 5*mm); B = ring4(tb, W+2*mm, H+2*mm, Z0+1*mm*k); Cc = ring4(tb, W-2*INS, H-2*INS, -TH)
for r0, r1, mi in [(A, B, 0), (B, Cc, 0)]:
    for i in range(4): tb.faces.new((r0[i], r0[(i+1) % 4], r1[(i+1) % 4], r1[i])).material_index = mi
tb.faces.new(list(reversed(A))); tb.faces.new(Cc).material_index = 1
bmesh.ops.recalc_face_normals(tb, faces=tb.faces)
tm = bpy.data.meshes.new("tronco"); tb.to_mesh(tm); tb.free(); tm.materials.append(M_BODY); tm.materials.append(M_BACK)
to = bpy.data.objects.new("tronco", tm); col.objects.link(to); to.hide_render = True; to.display_type = 'WIRE'
bi = body.modifiers.new("Espalda", "BOOLEAN"); bi.object = to; bi.operation = 'INTERSECT'
body.modifiers.move(len(body.modifiers)-1, 0); to.hide_viewport = True

# --- puerto microUSB (hueco) en el canto inferior
cut = bpy.data.meshes.new("corte"); cb = bmesh.new(); bmesh.ops.create_cube(cb, size=1); cb.to_mesh(cut); cb.free()
co = bpy.data.objects.new("corte", cut); col.objects.link(co)
co.scale = (7.4*mm, 5*mm, 2.2*mm); co.location = (0, -H/2, -2.9*mm); co.display_type = 'WIRE'; co.hide_render = True
bo = body.modifiers.new("Puerto", "BOOLEAN"); bo.object = co; bo.operation = 'DIFFERENCE'
body.modifiers.move(len(body.modifiers)-1, 0)
co.hide_viewport = True

def box(name, sx, sy, sz, loc, m, bevel=0.0):
    me = bpy.data.meshes.new(name); b = bmesh.new(); bmesh.ops.create_cube(b, size=1); b.to_mesh(me); b.free()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.scale = (sx, sy, sz); o.location = loc; me.materials.append(m)
    if bevel:
        md = o.modifiers.new("Bisel", "BEVEL"); md.width = bevel; md.segments = 3
    return o
port = box("Kindle_puerto", 7.0*mm, 3*mm, 1.8*mm, (0, -H/2+2.2*mm, -2.9*mm), M_PORT)
btn = box("Kindle_boton", 9*mm, 1.2*mm, 2.2*mm, (17*mm, -H/2+0.25*mm, -2.9*mm), M_BODY, bevel=0.9*mm)

# --- pantalla (pieza aparte, con su imagen)
pm = bpy.data.meshes.new("Kindle_pantalla"); pb = bmesh.new()
vs = [pb.verts.new((x*SW/2, SCY + y*SH/2, -REC + 0.05*mm)) for x, y in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]
pf = pb.faces.new(vs); uv = pb.loops.layers.uv.new("UV")
for lp, c in zip(pf.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]): lp[uv].uv = c
pb.to_mesh(pm); pb.free()
scr = bpy.data.objects.new("Kindle_pantalla", pm); col.objects.link(scr)
ms = bpy.data.materials.get("Kindle_pantalla") or bpy.data.materials.new("Kindle_pantalla"); ms.use_nodes = True
nt = ms.node_tree; bsdf = nt.nodes.get("Principled BSDF"); bsdf.inputs["Roughness"].default_value = 0.85
tex = nt.nodes.get("Imagen") or nt.nodes.new("ShaderNodeTexImage"); tex.name = "Imagen"
tex.image = bpy.data.images.load(os.path.join(HERE, "pantalla.png"), check_existing=True)
nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
pm.materials.append(ms)

# --- textos
def text(name, body_txt, font, size, loc, rot, m, extrude=0.03*mm, align='CENTER'):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = body_txt; cu.size = size; cu.align_x = align; cu.align_y = 'CENTER'; cu.extrude = extrude
    cu.font = bpy.data.fonts.load(font, check_existing=True)
    o = bpy.data.objects.new(name, cu); col.objects.link(o); o.location = loc; o.rotation_euler = rot; cu.materials.append(m); return o
AR = "/System/Library/Fonts/Supplemental/Arial.ttf"; ARB = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
yb = SCY - SH/2                                                     # borde inferior de la pantalla
text("Kindle_logo_frente", "kindle", AR, 8.6*mm, (0, (yb - H/2)/2 + 1.5*mm, 0.01*mm), (0, 0, 0), M_LOGO)
zb = -TH - 0.01*mm; flip = (0, math.pi, 0)                          # espalda: girado para leerse desde atrás
text("Kindle_logo_amazon", "amazon", ARB, 19*mm, (0, 32*mm, zb), flip, M_LOGO_B)
text("Kindle_legal", "FC  CE 0700  EAC  R-NZ\nMODEL NO. WP63GW   MADE IN CHINA", AR, 2.2*mm, (0, -52*mm, zb), flip, M_LOGO_B, extrude=0.01*mm)
# sonrisa de amazon: arco con punta
cu = bpy.data.curves.new("Kindle_sonrisa", 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.8*mm; cu.bevel_resolution = 2
sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
for bp, (x, y) in zip(sp.bezier_points, [(-25*mm, 22*mm), (0, 16.5*mm), (25*mm, 20.5*mm)]):
    bp.co = (-x, y, zb + 0.3*mm); bp.handle_left_type = bp.handle_right_type = 'AUTO'
so = bpy.data.objects.new("Kindle_sonrisa", cu); col.objects.link(so); cu.materials.append(M_LOGO_B); so.scale = (1, 1, 0.15)
so.location = (0, 0, zb*0.85)

# --- padre para animar
root = bpy.data.objects.new("Kindle", None); col.objects.link(root); root.empty_display_size = 0.02
for o in list(col.objects):
    if o is not root and o.parent is None: o.parent = root
result = {"objetos": [o.name for o in col.objects]}

# --- guardar y exportar
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "kindle.blend"), copy=True)
