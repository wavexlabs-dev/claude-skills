---
name: content-creator
description: This skill transforms raw ideas into ready-to-post social media content. It should be used when the user has an idea, observation, or concept they want to turn into a post. The skill matches the idea with the most suitable content framework and writes the post following Pablo's distinctive writing style. Also supports "Daily Capture" mode where the user can share daily notes, conversations, or observations, and the skill identifies potential content ideas from them.
---

# Content Creator

## Overview

This skill transforms ideas into polished, ready-to-post content by:
1. Validating the idea against content pillars and business objectives
2. Matching with the best content framework
3. Writing in Pablo's authentic voice and style

## Workflows

Hay dos formas de usar esta skill:

### A. Idea → Post (flujo normal)
Cuando el usuario ya tiene una idea clara y quiere convertirla en post.

### B. Daily Capture → Ideas → Posts
Cuando el usuario dice "Daily Capture" o comparte notas/diario del día.

---

## Workflow A: Idea → Post

### Step 1: Validate Against Pillars

Read `references/pilares-contenido.md` and evaluate:

**A. ¿En qué pilar entra esta idea?**

| # | Pilar | Tema central |
|---|-------|--------------|
| 1 | Tu nicho eres tú | Autenticidad como ventaja |
| 2 | Generalista es superpoder | Versatilidad en era IA |
| 3 | Build in public | Exponer proceso, no solo resultado |
| 4 | Deseo > claridad | Moverse antes de tener el mapa |
| 5 | Happiness formula | Gap entre percepción y expectativas |
| 6 | Skills > Tools | Aprender lo que IA no replica |
| 7 | Creador es forma de ser | Crear sin permiso |
| 8 | El trabajo es interno | Autoconocimiento > productividad |
| 9 | Vulnerabilidad es ventaja | Lo que ocultas te conecta |
| 10 | Sprint + Laboratorio | Construir IA en tiempo real |

- Si entra claramente → continuar
- Si no entra → informar al usuario y evaluar si descartar

**B. Regla de oro:** ¿Esto hace que un futuro trabajo de cliente sea inevitable?
- Si no → sugerir guardarlo en privado

**C. ¿Se alinea con Wave X Labs?**
- Posicionamiento: "Prototipando experiencias de IA físicas en público"
- Audiencia: Creativos que quieren usar IA

### Step 2: Receive and Analyze the Idea

When the user shares an idea, observation, or concept:
- Identify the core message or insight
- Note any specific angle, story, or context provided
- Determine if it's a personal anecdote, contrarian take, universal truth, or practical observation

### Step 3: Match with the Best Framework

Read `references/frameworks-aaron-benitez.md` to select the framework with the highest potential match. Consider these triggers:

| If the idea involves... | Consider framework... |
|------------------------|----------------------|
| A chain of cause-effect logic | #1 Cadena de Consecuencias Lógicas |
| Something observed/heard recently | #2 Anécdota Cotidiana → Reflexión → Principio |
| Exposing a common misconception | #3 Contraste Apariencia vs Realidad |
| Multiple variations of one message | #4 Lista Repetitiva (Anáfora) |
| A belief to challenge directly | #5 Afirmación Provocadora |
| Personal struggle with a lesson | #6 Vulnerabilidad Estratégica |
| Universal desires/behaviors | #7 Lista de Deseos Universales |
| Abstract idea needing practical landing | #8 Paréntesis Meta-Explicativo |
| Two concepts that seem contradictory | #10 Paradoja como Gancho |
| A tiny habit revealing something big | #11 Micro-hábito como Metáfora |
| A quote to build upon | #12 Cita de Tercero + Mejora |
| Action vs inaction comparison | #13 Repetición Espejo |
| Timely relevance to current events | #14 Re-contextualización |
| Writing from a specific place | #15 Escritura en Tiempo Real |
| Wanting audience engagement | #16 Pregunta a la Audiencia |
| Poetic/rhythmic delivery | #17 Formato de Verso |
| Removing vs adding approach | #18 Inversión del Enfoque |

### Step 4: Write Following Pablo's Style

Read `references/estilo-escritura-pablo.md` and apply these patterns:

**Punctuation:**
- Use semicolons (;) for contrasts within a line
- Use angular quotes («») for interruptions or emphasis
- Use parentheses for conversational clarifications
- Use quotes for ironic distance or emphasis
- NEVER use em-dashes (—) — clear AI signal

**Rhythm:**
- Stack short phrases for impact (no bullet lists)
- Start conclusions with "Y" for weight
- Use temporal contrasts (antes/después)

**Tone:**
- Mix Spanish with untranslated English tech terms
- Include moderate Mexican colloquialisms
- Add intentional imperfections ("jaja", incomplete phrases)
- Avoid AI patterns: no perfect symmetry, no generic transitions, no "Espero que esto te haya sido útil"
- Avoid formal/rebuscado words: empleos, brecha, abismal, ocupación, anhelar (check references for alternatives)

**Structure:**
- ONE central idea per post
- Tension → Resolution arc
- Contundent closing (not generic)

### Step 4.5: Apply Threads Format (if applicable)

When the user indicates the post is for **Threads** (e.g., "hazlo para Threads", "formato Threads", "thread corto", "conviértelo en thread"):

Read `references/frameworks-threads.md` and:

1. **Select the appropriate Threads framework:**
   - T1 News + Take → noticias/lanzamientos
   - T2 Mini Hilo Educativo → temas técnicos (1/3 o 1/4)
   - T3 Workflow Story → procesos con herramientas
   - T4 Opinión Minimalista → ideas que se sostienen solas
   - T5 Meta Redes → experiencias con algoritmos
   - T6 Job Pitch → roles emergentes
   - T7 Humor + Imagen → memes/screenshots
   - T8 Tres Momentos → cadenas históricas
   - T9 Experimento Visual → demos técnicas

2. **Apply Threads constraints:**
   - Máximo ~380 caracteres por post individual
   - 2-6 líneas por bloque
   - Si la idea requiere más → dividir en hilo (1/2, 1/3, 1/4)
   - Cierres secos, sin hype ni CTA genérico

3. **Output format:**
   - Post único corto, O
   - Hilo numerado (1/x, 2/x, etc.)

### Step 5: Generate Image Concept

Posts with images perform better. Generate a description for an AI-generated image where Pablo appears as a movie/TV character or iconic scene that represents the post's content.

**Guidelines:**
- Replace Pablo with a recognizable character (DiCaprio, Keanu, etc.)
- Match the scene to the post's theme (sales → Wolf of Wall Street, tech → Matrix, etc.)
- Add a touch of humor or irony
- Keep it visually striking and shareable
- Describe in enough detail to generate with AI image tools

**Example:**
- Post about sales/confidence → "Pablo as DiCaprio in Wolf of Wall Street, pointing at the camera mid-speech, but wearing a casual hoodie instead of a suit"
- Post about AI philosophy → "Pablo as Morpheus offering the red and blue pill, but the pills are labeled 'Tools' and 'Skills'"

### Step 6: Apply Authenticity Checklist

Before presenting the final content, verify:
- Does it sound conversational?
- Is there at least one intentional imperfection?
- Is list symmetry avoided?
- Is the closing contundent, not generic?
- Is punctuation varied?
- Is there clear tension or contrast?
- Is there an image concept that matches the post?

## Example Transformation

**User idea:** "La gente piensa que tener más herramientas de IA es mejor, pero en realidad los abruma y no usan ninguna bien"

**Framework match:** #3 Contraste Apariencia vs Realidad (Desmitificación)

**Output:**

```
Tener 47 herramientas de IA instaladas se ve productivo.

Se siente como estar "a la vanguardia".

Pero la realidad es otra;
la mayoría no saben usar ni una bien.

Conozco gente con ChatGPT Plus, Claude Pro, Gemini Advanced, Copilot... y siguen escribiendo sus correos desde cero.
Pagan $80 dólares al mes en suscripciones.
Usan el 3% de lo que pagan.

El verdadero moat no está en cuántas herramientas tienes.
Está en dominar una «una sola» hasta que se vuelva extensión de tu pensamiento.

Y eso nadie lo quiere escuchar porque suena aburrido.
Pero funciona.
```

**Image concept:** Pablo como Neo en Matrix, pero en lugar de esquivar balas, esquiva logos de apps de IA (ChatGPT, Midjourney, Claude) que vuelan hacia él. Expresión de calma total. Fondo oscuro con código verde cayendo.

---

## Workflow B: Daily Capture

Cuando el usuario dice "Daily Capture" o quiere procesar sus notas del día.

### Opción 1: Preguntas guiadas

Hacer estas preguntas una por una:

1. **¿Qué hiciste hoy?** (reuniones, trabajo, proyectos)
2. **¿Con quién hablaste?** (conversaciones que te dejaron algo)
3. **¿Qué estás construyendo?** (proyectos en progreso)
4. **¿Qué experimentaste?** (herramientas, procesos, ideas)
5. **¿Qué leíste, viste o escuchaste?** (artículos, podcasts, videos)
6. **¿Qué salió mal?** (errores, frustraciones, aprendizajes)
7. **¿Alguna frase o idea que te quedó?**

### Opción 2: Procesar notas

Si el usuario pega notas de su diario, Notion, o cualquier fuente:

1. Leer las notas completas
2. Identificar inputs con potencial de contenido
3. Para cada input, evaluar:
   - ¿En qué pilar entra?
   - ¿Qué framework aplica mejor?
   - ¿Tiene historia, dato, o insight?

### Output del Daily Capture

Presentar una tabla con los inputs identificados:

| Input | Pilar | Framework sugerido | Potencial |
|-------|-------|-------------------|-----------|
| [descripción corta] | #X | #Y Nombre | Alto/Medio/Bajo |

Luego preguntar: **¿Cuál quieres desarrollar primero?**

### Triggers por tipo de input

Consultar `references/diario-frameworks.md` para estructuras completas y ejemplos.

| Si el input es... | Tipo de post | Framework |
|-------------------|--------------|-----------|
| Conversación con alguien | Conversación | #2 Anécdota → Principio |
| Algo que leíste/viste | Lectura | #12 Cita + Mejora |
| Experimento/herramienta | Experimento | #3 Contraste |
| Error o fracaso | Fracaso | #6 Vulnerabilidad |
| Observación cotidiana | Observación | #11 Micro-hábito |
| Reflexión/pensamiento | Reflexión | #10 Paradoja o #5 Provocadora |
| Logro del negocio | Logro | #3 Build in public |
| Escribiendo desde un lugar | Momento presente | #15 Tiempo Real |

---

## Resources

### references/

- `pilares-contenido.md` — 10 content pillars, golden rule, and Wave X Labs business alignment
- `frameworks-aaron-benitez.md` — 18 content frameworks with structures, examples, and replication guides
- `estilo-escritura-pablo.md` — Pablo's writing style patterns: punctuation, rhythm, vocabulary, and anti-patterns to avoid
- `diario-frameworks.md` — 8 tipos de posts diarios con estructura, aperturas y ejemplos para el formato documental
