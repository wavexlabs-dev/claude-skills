# Skills de Claude de Pablo

Skills de Claude Code para contenido y video, más el proceso de los Shorts.

| Carpeta | Para qué |
|---|---|
| `skills/video-styles/` | **Una skill por formato de video** (autocontenidas): `es-real-o-es-hype` (la serie) y `short-explicativo` (Short general con fuentes). Ver su README |
| `video-short/` | Proceso de Shorts/Reels: corte, escenas en HyperFrames, subtítulos, música, QA |
| `marca-pablo-video/` | Marca: Nocturno morado, Inter Tight, encuadres, voz. **`references/flujo-shorts.md` = reglas acordadas** |
| `shorts-pablo/` | Proceso documentado, memoria de Claude, scripts (mezcla, copia ligera, 4K en Higgsfield) y el EP1 de ejemplo |
| `reel-editorial-pablo/`, `html-reel/`, `estudio-video-codigo/`, `content-creator/`, … | Otras skills de contenido |

## Instalar en otra computadora

```bash
git clone https://github.com/wavexlabs-dev/claude-skills.git ~/claude-skills
```

```bash
mkdir -p ~/.claude/skills && cp -R ~/claude-skills/skills/video-styles/* ~/claude-skills/video-short ~/claude-skills/marca-pablo-video ~/.claude/skills/
```

Dependencias de `video-short` (Mac con Homebrew):

```bash
brew install ffmpeg node python@3.13
```

```bash
bash ~/.claude/skills/short-explicativo/motor/scripts/setup.sh
```

### La memoria
Claude guarda la memoria por carpeta de proyecto, en
`~/.claude/projects/<ruta-del-proyecto-con-guiones>/memory/`. En la computadora nueva abre Claude Code en la
carpeta donde vas a trabajar, pídele una vez algo y luego copia las notas a esa carpeta de memoria:

```bash
cp ~/claude-skills/shorts-pablo/memoria/*.md ~/.claude/projects/<tu-proyecto>/memory/
```

También puedes decirle a Claude: «lee `~/claude-skills/shorts-pablo/` antes de empezar».

### Conectores que usa el proceso
ElevenLabs (música y jingle), Sume (imágenes/video IA), Higgsfield (GPU para 4K). Se conectan en la app de
Claude; las llaves **no** van en este repo.
