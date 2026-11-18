# Clip 3:4 del modelo girando sobre negro: malla -> volumen -> terminada.
#   /Applications/Blender.app/Contents/MacOS/Blender -b ../kindle.blend --python clip.py
import bpy, bmesh, math, os
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "clip"); os.makedirs(OUT, exist_ok=True)
P = os.path.dirname(HERE)
sc = bpy.data.scenes["Kindle"]; col = sc.collection; root = bpy.data.objects["Kindle"]; R = math.radians
for o in col.all_objects:
    if o.type in ('LIGHT', 'CAMERA'): o.hide_render = True
def mat(name, color, rough=0.6, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1); b.inputs["Roughness"].default_value = rough
    if emit:
        k = "Emission Color" if "Emission Color" in b.inputs else "Emission"; b.inputs[k].default_value = (*color, 1); b.inputs["Emission Strength"].default_value = emit
    return m
def light(name, loc, energy, size, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new(name, d); col.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
light("C_a", (0.25, 0.15, 0.5), 5, 0.4); light("C_b", (-0.32, -0.15, 0.36), 1.8, 0.6, (0.8, 0.86, 1)); light("C_c", (-0.28, 0.3, 0.02), 6, 0.3); light("C_d", (0.3, -0.25, 0.1), 2.5, 0.5)
cd = bpy.data.cameras.new("C_cam"); cd.lens = 110; cd.clip_start = 0.01
cam = bpy.data.objects.new("C_cam", cd); col.objects.link(cam); cam.location = (0, 0, 0.74); sc.camera = cam
w = bpy.data.worlds.new("C_negro"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0, 0, 0, 1); sc.world = w
tex = bpy.data.materials["Kindle_pantalla"].node_tree.nodes["Imagen"]
tex.image = bpy.data.images.load(os.path.join(P, "reel/assets/repo/pablos-time-2026-09-29.png"), check_existing=True)
# copias de malla (aristas limpias), hijas del mismo padre
ORIG = [o for o in col.all_objects if o.type in ('MESH', 'FONT', 'CURVE') and not o.hide_render]
dg = bpy.context.evaluated_depsgraph_get(); WIRE = []; M_W = mat("C_malla", (0.75, 0.85, 1.0), 0.5, emit=1.6)
for o in [o for o in ORIG if o.type == 'MESH']:
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6); bmesh.ops.dissolve_limit(bm, angle_limit=R(2), verts=bm.verts, edges=bm.edges)
    bm.to_mesh(me); bm.free(); me.materials.clear(); me.materials.append(M_W)
    n = bpy.data.objects.new("C_" + o.name, me); col.objects.link(n); n.parent = o.parent; n.matrix_local = o.matrix_local.copy()
    m = n.modifiers.new("C_alambre", 'WIREFRAME'); m.thickness = 0.0005; m.use_replace = True; WIRE.append(n)
M_CLAY = mat("C_arcilla", (0.085, 0.088, 0.1), 0.62); vl = sc.view_layers[0]
r = sc.render; r.engine = 'BLENDER_EEVEE'; r.resolution_x = 1080; r.resolution_y = 1440; r.film_transparent = False
r.image_settings.file_format = 'JPEG'; r.image_settings.quality = 96
N = 270; T1, T2 = 72, 150                      # 9 s: malla 0-2.4, volumen 2.4-5, terminada 5-9
ease = lambda p: p * p * (3 - 2 * p)
A, B = int(os.environ.get("A", 0)), int(os.environ.get("B", N - 1))
for f in range(A, B + 1):
    p = f / (N - 1); ang = 30 + 360 * (p * 0.86 + 0.14 * ease(p))          # una vuelta completa, frena al final
    root.rotation_euler = (R(-16), R(ang), R(-5))
    fase = 0 if f < T1 else 1 if f < T2 else 2
    for o in ORIG: o.hide_render = fase == 0
    for o in WIRE: o.hide_render = fase != 0
    vl.material_override = M_CLAY if fase == 1 else None
    r.filepath = os.path.join(OUT, f"c_{f:04d}.jpg"); bpy.ops.render.render(write_still=True, scene=sc.name)
print("CLIP_OK")
