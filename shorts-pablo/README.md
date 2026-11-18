# Shorts de Pablo: proceso completo

Cómo se hicieron los Shorts de Dreaming, Kindle y «¿Es real o es hype?» EP1 (nov 2026), para repetirlo en
cualquier computadora con Claude Code.

## Las piezas
- **`video-short`** (skill de proceso): transcribe, corta, arma escenas en HyperFrames, subtítulos, música y QA.
- **`marca-pablo-video`** (skill de marca): Nocturno morado, Inter Tight, encuadres, voz. Su archivo
  `references/flujo-shorts.md` tiene **todas las reglas acordadas** y lo aprendido en cada Short. Léelo primero.
- **`memoria/`**: las notas que Claude guarda entre sesiones (preferencias de Pablo, cámara, Sume, etc.).
- **`flujos/`**: scripts para la mezcla final, la copia ligera y el render 4K en Higgsfield.
- **`ejemplos/real-o-hype-ep1/`**: el `edit.md` final, `style.json`, gráficos (título, veredicto, píldora),
  jingle de la serie y música. Sin las grabaciones (son pesadas y privadas).

## El proceso, paso a paso
1. **Proxy**: los clips Sony vienen 4K verticales (rotación −90). Proxy 1080x1920 lanczos x264 crf 12–14.
2. **Velocidad**: a 1.2x (`setpts=PTS/1.2`, `atempo=1.2`) si Pablo lo pide, y transcribir ya acelerado.
3. **Fuente en orden de historia** (`src.mov`): hook en silencio + tomas buenas, concatenadas con fades.
4. **`edit.md`**: cortes por palabras, escenas (a-roll, punch, split, b-roll, graphic), correcciones de subtítulos.
5. **Borrador** con `render.py --draft`; mandar la copia 1080 ligera y esperar notas.
6. **Revisar cada corte cuadro a cuadro** antes de mandar (ver «Subtítulos y cortes» en flujo-shorts.md).
7. **Voz**: exportar `work/clean.mp4` a WAV → Pablo la limpia en Adobe Podcast → se reemplaza el audio.
8. **Final**: respaldar borradores, `render.py` final, `flujos/mezcla_final.sh` (jingle + audio del reel +
   −13 LUFS), QA, `flujos/copia_ligera.sh`. Master >30 MB va por AirDrop.
9. **4K** (opcional): `flujos/render_4k_higgsfield.md`.

## Reglas que no se negocian
- Cualquier generación con IA o renta de GPU: cotizar y pedir permiso antes.
- Imágenes hechas con IA se rotulan en pantalla.
- Pablo juzga por oído y por el archivo completo: mandarle siempre el archivo, no describirlo.
