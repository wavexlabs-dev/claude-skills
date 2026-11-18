# Video styles

Una skill por formato de video de Pablo. Cada una es **autocontenida**: trae el formato, el guion, la marca, el
motor de edición (`motor/`, copia de video-short), las plantillas, los audios aprobados, los scripts y los
errores aprendidos. Para hacer un video de ese tipo basta con cargar su skill.

| Skill | Formato | Base |
|---|---|---|
| `es-real-o-es-hype/` | Serie «¿Es real o es hype?»: Pablo pone a prueba un video viral de IA y da un veredicto | EP1 (Swarm Rebuild) |
| `short-explicativo/` | Short general: Pablo cuenta a cámara una historia de IA/tecnología y cada dato se ve con su fuente | Maya, Dreaming, Kindle |
| `reel-editorial-pablo/` | Reel editorial: Pablo a cámara alternando con escenas de imagen en la identidad B2 (Ink, azul, Paper, naranja; Space Grotesk), hecho en código y renderizado cuadro por cuadro | Jeep 94, Dreaming v6 |

## Instalar
```bash
cp -R skills/video-styles/* ~/.claude/skills/
```
Primera vez, por cada una: `bash ~/.claude/skills/<skill>/motor/scripts/setup.sh` (pide ffmpeg, node y python). En `reel-editorial-pablo` el motor es su página HTML: `bash ~/.claude/skills/reel-editorial-pablo/scripts/setup.sh`.

## Agregar un formato nuevo
Copia la estructura de una existente:
```
<nombre>/
  SKILL.md            frontmatter (name, description con cuándo usarla) + flujo y lo esencial
  references/         formato, guion, marca, produccion, audio, errores, render-4k
  assets/             fuentes, plantillas, audio aprobado (archivos finales), ejemplos de edit.md
  motor/              copia de video-short (o el motor que use ese formato)
  scripts/            ajustar_subtitulos.py, tira_cortes.sh, entrega/mezcla, copia_ligera.sh, caja_*.sh
```
Los audios y diseños aprobados van como archivos; no se guardan prompts para regenerarlos.
