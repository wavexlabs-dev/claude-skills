# Renders de la Kindle 3D (fondo transparente) para los cuadros fijos del reel. Corre dentro de Blender, escena "Kindle".
import bpy, math, os
from mathutils import Vector
P = "/Users/pabloparedeslombardo/Documents/Personal Brand/Kindle 3D"
MULT = globals().get("MULT", 1); OUT = P + "/reel/assets/k3d" + ("4k" if MULT > 1 else ""); os.makedirs(OUT, exist_ok=True)
sc = bpy.data.scenes["Kindle"]; bpy.context.window.scene = sc; col = sc.collection
root = bpy.data.objects["Kindle"]; mm = 0.001; H = 0.169
ms = bpy.data.materials["Kindle_pantalla"]; nt = ms.node_tree; tex = nt.nodes["Imagen"]; bsdf = nt.nodes["Principled BSDF"]
if not any(l.to_socket.name.startswith("Emission") and l.to_socket.name != "Emission Strength" for l in nt.links):
    em = "Emission Color" if "Emission Color" in bsdf.inputs else "Emission"
    nt.links.new(tex.outputs["Color"], bsdf.inputs[em])

# --- cable microUSB (solo para la escena de la espalda)
for n in ["Cable_clavija", "Cable_funda", "Cable"]:
    if n in bpy.data.objects: bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
def mat(name, color, rough, metal=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]; b.inputs["Base Color"].default_value = (*color, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal; return m
import bmesh
def box(name, s, loc, m, bevel):
    me = bpy.data.meshes.new(name); b = bmesh.new(); bmesh.ops.create_cube(b, size=1); b.to_mesh(me); b.free()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.scale = s; o.location = loc; me.materials.append(m); o.parent = root
    md = o.modifiers.new("Bisel", "BEVEL"); md.width = bevel; md.segments = 3; return o
yb = -H/2; z = -2.9*mm
plug = box("Cable_clavija", (6.6*mm, 7*mm, 1.7*mm), (0, yb - 1.5*mm, z), mat("Cable_metal", (0.75, 0.75, 0.78), 0.25, 1.0), 0.3*mm)
boot = box("Cable_funda", (10.5*mm, 20*mm, 6.5*mm), (0, yb - 15*mm, z), mat("Cable_goma", (0.9, 0.9, 0.88), 0.5), 1.6*mm)
cu = bpy.data.curves.new("Cable", 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.7*mm; cu.bevel_resolution = 4
sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
for bp, co in zip(sp.bezier_points, [(0, yb - 24*mm, z), (0.012, yb - 0.09, z + 0.004), (0.07, yb - 0.30, z - 0.02)]):
    bp.co = co; bp.handle_left_type = bp.handle_right_type = 'AUTO'
cab = bpy.data.objects.new("Cable", cu); col.objects.link(cab); cu.materials.append(bpy.data.materials["Cable_goma"]); cab.parent = root
CABLE = [plug, boot, cab]

# --- cámara y luces propias de los cuadros
for n in ["Cam_reel"] + [o.name for o in col.objects if o.name.startswith("LuzR_")]:
    if n in bpy.data.objects: bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
cd = bpy.data.cameras.new("Cam_reel"); cd.lens = 110; cd.clip_start = 0.01
cam = bpy.data.objects.new("Cam_reel", cd); col.objects.link(cam); cam.location = (0, 0, 0.66); cam.rotation_euler = (0, 0, 0)
def light(name, loc, energy, size, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new(name, d); col.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
key = light("LuzR_principal", (0.22, 0.12, 0.5), 5, 0.4)
fill = light("LuzR_relleno", (-0.3, -0.15, 0.35), 1.6, 0.6, (0.8, 0.86, 1))
rim = light("LuzR_canto", (-0.25, 0.3, -0.05), 6, 0.3)
for o in col.objects:
    if o.type == 'LIGHT' and not o.name.startswith("LuzR_"): o.hide_render = True
r = sc.render; r.engine = 'BLENDER_EEVEE'; r.film_transparent = True; r.resolution_x = 1600 * MULT; r.resolution_y = 2000 * MULT
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'; sc.camera = cam
R = math.radians
SHOTS = {
    # nombre: (imagen de pantalla, rotación del padre, cable, (principal, relleno, canto, color canto), emisión de pantalla)
    "heroe":    ("reel/assets/repo/pablos-time-2026-09-29.png", (R(-24), R(26), R(-8)), False, (5, 1.6, 6, (1, 1, 1)), 0.0),
    "libro":    ("reel/assets/libro.png",                        (R(-24), R(26), R(-8)), False, (5, 1.6, 6, (1, 1, 1)), 0.0),
    "espalda":  (None,                                            (R(-50), R(180), R(-14)), True, (4, 2.0, 5, (1, 1, 1)), 0.0),
    "portada":  ("reel/assets/repo/pablos-time-2026-09-29.png", (R(-14), R(16), R(4)), False, (2.6, 1.2, 4, (1, 1, 1)), 0.0),
    "pagina":   ("reel/assets/repo/02-editorial-demo.png",      (R(-14), R(-18), R(-4)), False, (2.6, 1.2, 4, (1, 1, 1)), 0.0),
    "noche":    ("reel/assets/repo/pablos-time-2026-09-29.png", (R(-20), R(-22), R(6)), False, (0.9, 0.9, 0.7, (1, 0.7, 0.4)), 0.5),
    "dormida":  ("reel/assets/dormida.png",                      (R(-20), R(-22), R(6)), False, (0.25, 0.5, 2.5, (0.5, 0.6, 1)), 0.0),
}
out = {}
for name, (img, rot, cable, (ek, ef, er, cr), emis) in SHOTS.items():
    if img:
        p = os.path.join(P, img)
        if not os.path.exists(p): continue
        tex.image = bpy.data.images.load(p, check_existing=True)
    root.rotation_euler = rot
    for o in CABLE: o.hide_render = not cable
    key.data.energy, fill.data.energy, rim.data.energy, rim.data.color = ek, ef, er, cr
    bsdf.inputs["Emission Strength"].default_value = emis
    r.filepath = os.path.join(OUT, name + ".png"); bpy.ops.render.render(write_still=True, scene=sc.name); out[name] = r.filepath
# dejar la escena como estaba
root.rotation_euler = (0, 0, 0); bsdf.inputs["Emission Strength"].default_value = 0
for o in CABLE: o.hide_render = True; o.hide_viewport = True
tex.image = bpy.data.images.load(P + "/pantalla.png", check_existing=True)
result = out
