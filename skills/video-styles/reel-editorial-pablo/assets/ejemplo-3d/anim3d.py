# Giro de la Kindle (frente -> espalda) + entrada del cable, y esquinas de la pantalla de cada pose fija.
# Uso dentro de Blender: definir A, B (rango de cuadros) antes de ejecutar; A=B=-1 solo exporta esquinas.
import bpy, math, os, json
from bpy_extras.object_utils import world_to_camera_view
P = "/Users/pabloparedeslombardo/Documents/Personal Brand/Kindle 3D"; MULT = globals().get("MULT", 1); OUT = P + "/reel/assets/k3d" + ("4k" if MULT > 1 else ""); os.makedirs(OUT, exist_ok=True)
sc = bpy.data.scenes["Kindle"]; bpy.context.window.scene = sc
root = bpy.data.objects["Kindle"]; cam = bpy.data.objects["Cam_reel"]; scr = bpy.data.objects["Kindle_pantalla"]
CABLE = [bpy.data.objects[n] for n in ["Cable_clavija", "Cable_funda", "Cable"]]
key, fill, rim = [bpy.data.objects[n] for n in ["LuzR_principal", "LuzR_relleno", "LuzR_canto"]]
tex = bpy.data.materials["Kindle_pantalla"].node_tree.nodes["Imagen"]
R = math.radians; r = sc.render; sc.camera = cam
ease = lambda p: p * p * (3 - 2 * p)
lerp = lambda a, b, p: a + (b - a) * p
def corners(W, H):
    bpy.context.view_layer.update(); vs = [scr.matrix_world @ v.co for v in scr.data.vertices]   # BL, BR, TR, TL
    px = [world_to_camera_view(sc, cam, v) for v in vs]; px = [(round(p.x * W, 1), round((1 - p.y) * H, 1)) for p in px]
    return [px[3], px[2], px[1], px[0]]                                                          # TL, TR, BR, BL
# --- esquinas de las poses fijas (imágenes de 1600x2000)
r.resolution_x, r.resolution_y = 1600, 2000
POSES = {"portada": (R(-14), R(16), R(4)), "pagina": (R(-14), R(-18), R(-4)), "noche": (R(-20), R(-22), R(6)), "heroe": (R(-24), R(26), R(-8))}
cj = {}
for n, rot in POSES.items(): root.rotation_euler = rot; cj[n] = corners(1600, 2000)
open(P + "/reel/esquinas.js", "w").write("window.ESQ=" + json.dumps(cj) + ";")
# --- giro + cable (1200x1500)
done = []
if A >= 0:
    r.resolution_x, r.resolution_y = 1200 * MULT, 1500 * MULT; r.film_transparent = True
    tex.image = bpy.data.images.load(P + "/pantalla.png", check_existing=True)
    key.data.energy, fill.data.energy, rim.data.energy, rim.data.color = 4, 2.0, 5, (1, 1, 1)
    F0, F1 = (R(-24), R(26), R(-8)), (R(-50), R(180), R(-14)); NT, NC = 40, 18
    for o in CABLE: o.hide_viewport = False
    for f in range(A, B + 1):
        p = ease(min(1, f / (NT - 1)))
        root.rotation_euler = tuple(lerp(a, b, p) for a, b in zip(F0, F1))
        c = (f - NT) / (NC - 1) if f >= NT else -1
        for o in CABLE:
            o.hide_render = c < 0; o.delta_location = (0, -0.07 * (1 - ease(max(0, min(1, c)))) ** 1.0, 0)
        r.filepath = os.path.join(OUT, f"giro_{f:03d}.png"); bpy.ops.render.render(write_still=True, scene=sc.name); done.append(f)
    for o in CABLE: o.hide_render = True; o.hide_viewport = True; o.delta_location = (0, 0, 0)
root.rotation_euler = (0, 0, 0)
result = {"esquinas": cj, "cuadros": len(done)}
