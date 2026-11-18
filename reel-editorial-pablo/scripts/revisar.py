"""Revisión medida de un video terminado, antes de enviarlo.
Uso:  python3 revisar.py out/reel-v1.mp4
Escribe en out/revision/: hojas de contacto (un cuadro cada 0.5 s, para mirarlas), espectrograma del audio y medidas.txt.
Comprueba: tramos congelados >= 0.5 s, volumen integrado y pico, duración y tamaño."""
import subprocess, sys, os, re, json
v = sys.argv[1]; d = os.path.join(os.path.dirname(v) or '.', 'revision'); os.makedirs(d, exist_ok=True)
run = lambda c: subprocess.run(c, capture_output=True, text=True)
info = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', v]).stdout)
dur = float(info['format']['duration']); vs = next(s for s in info['streams'] if s['codec_type'] == 'video'); has_a = any(s['codec_type'] == 'audio' for s in info['streams'])
out = [f"{v}: {vs['width']}x{vs['height']} a {vs['r_frame_rate']} fps, {dur:.2f} s, audio: {'sí' if has_a else 'NO'}"]
if (vs['width'], vs['height']) != (1080, 1920): out.append('AVISO: no es 1080x1920')
fz = run(['ffmpeg', '-i', v, '-vf', 'freezedetect=n=0.002:d=0.5', '-an', '-f', 'null', '-']).stderr
st = re.findall(r'freeze_start: ([\d.]+)', fz); du = re.findall(r'freeze_duration: ([\d.]+)', fz)
out.append(f'Tramos congelados >= 0.5 s: {len(st)}' + ''.join(f'\n  - desde {a} s, dura {b} s' for a, b in zip(st, du)))
if has_a:
    r = run(['ffmpeg', '-i', v, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); P = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
    out.append(f'Volumen: {I:.1f} LUFS (meta −14 ± 1), pico {P:.1f} dBFS (meta <= −2)' + ('  AVISO' if abs(I + 14) > 1 or P > -2 else ''))
    run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-lavfi', 'showspectrumpic=s=1800x700:legend=0:scale=log:fscale=log', os.path.join(d, 'espectro.png')])
    out.append('Espectrograma: revision/espectro.png (buscar: voz en la música, tonos sintéticos, bloques idénticos repetidos)')
# hojas de contacto: 2 cuadros por segundo, 6 columnas, 24 por hoja
run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-vf', 'fps=2,scale=270:-2,tile=6x4', os.path.join(d, 'hoja_%02d.jpg')])
hojas = sorted(f for f in os.listdir(d) if f.startswith('hoja_'))
out.append(f'Hojas de contacto: {len(hojas)} en revision/ (cada cuadro = 0.5 s; cada hoja = 12 s). MIRARLAS todas con la lista de references/revision.md')
open(os.path.join(d, 'medidas.txt'), 'w').write('\n'.join(out) + '\n'); print('\n'.join(out))
