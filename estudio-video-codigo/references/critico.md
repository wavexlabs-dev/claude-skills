# Crítico nuevo

Quien construye no juzga su propio trabajo. Después de cada render completo, lanzar un subagente nuevo
(Agent, `general-purpose`, en segundo plano) que no vio el build. Si se corta por límite de uso, reanudarlo
con SendMessage en vez de empezar otro.

## Prompt base (rellenar lo que está entre <>)

```
Eres un crítico de motion design que NO vio cómo se construyó este video. Revisa un video de <duración> y devuelve
problemas concretos. No edites ningún archivo del proyecto; trabaja con copias en tu directorio temporal.

Proyecto: <ruta>. Videos: out/video_16x9.mp4 y out/video_9x16.mp4. Cues exactos: out/cues_16x9.json.
Referencias: brief/brief.md, brief/facts.json (única fuente válida de texto), brief/timing.json, brief/ledger.md.
Contexto: <qué es el video y qué capas son propias vs. del producto>.
Decisiones del dueño que no son defectos: <música a volumen fijo, guion aprobado, zonas de interfaz en 9:16…>.
<Si no es la primera ronda: lo que pidió la ronda anterior, para verificar que quedó.>

1. Frames cada 0.2 s de ambos formatos y cada frame alrededor de cortes y golpes: <tiempos>. Contact sheets;
   verifica a resolución completa antes de reportar.
2. Lectura sin sonido a 2 fps: cuenta la historia en dos frases.
3. Sync: cada golpe visual a ≤1 frame de su cue.
4. Fact check de cada palabra de las capas contra facts.json.
5. Calidad medida: legibilidad, colisiones, artefactos (restos de píxeles, destellos), cuadros vacíos, márgenes.
6. Revisión de director, brutal pero dentro de las decisiones del dueño.

Lista ordenada del problema más grande al más chico (formato, timestamp, qué se ve, por qué importa, corrección),
separando lo verificado a resolución completa de la opinión. Cierra con: "ship" o "una pasada más".
```

## Con el reporte
- Verificar cada hallazgo en el frame antes de corregir (los críticos a veces leen mal la causa).
- Lo que cambie el guion, la voz o una decisión del dueño se le pregunta a la persona; no se corrige solo.
- Corregir primero lo más grande, re-renderizar, medir y lanzar un crítico nuevo. Registrar la ronda en el ledger
  con números de antes y después.
