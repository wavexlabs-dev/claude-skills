---
name: flujo-shorts-pablo
description: "Pablo's agreed workflow and delivery rules for vertical Shorts/Reels (from the Maya Short, Nov 2026)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 02e71ab7-289f-48e8-9533-d8b3ffea9b51
  modified: 2026-11-13T07:35:32.910Z
---

Rules Pablo set or confirmed while making the Maya Short (2026-11-10/11), to reuse on every new Short:

- Skills: `video-short` for the process + `marca-pablo-video` for the look (Nocturno morado, Inter Tight, accent #8a6bff only on the key word). Write a project `style.json` with the brand fonts/colors.
- Source footage: see [[camara-vertical-4k-shorts]] — make a lanczos x264 1080x1920 proxy from the vertical 4K before cutting.
- Visuals come from the real source (article images, its own video, receipts of official documents); label any AI-generated image on screen as "Recreación hecha con IA … no es una foto".
- Music: ElevenLabs Music v2.5 (instrumental, length of the Short), quote USD with estimate_only and ask before generating; make 2 takes and let him pick by ear (he chose take B).
- He wanted the finished cut sped up to 1.2x (atempo keeps pitch). Ask whether he wants it again rather than assuming.
- Delivery loudness for Reels: about -13 LUFS, true peak ≤ -1.5 dBTP (loudnorm, then alimiter at 192 kHz).
- He judges quality on the full file, not the 720p share copy — say clearly which file is the master. Files over 30 MB don't reach him over Remote Control; tell him to AirDrop it.
- Back up drafts in `borradores/` before a final render (render.py final prunes earlier versions).
- He wants to render early and see drafts fast; keep long encodes in the background and give short status lines.
- Added after Dreaming + Kindle (2026-11-11/13):
  - Cut silences >0.3 s down to ~0.18 s and start the cut on the first audible word (no dead air at 0). Export the cut voice as WAV; he cleans it in Adobe Podcast and returns a same-length file to swap into work/clean.mp4.
  - Music level: `-12` in edit.md when he talks nonstop (≈ −17 dB under the voice while ducked). At -18 he said it was barely audible.
  - Split side fill: style `speaker_pad_image` (a starfield crop of his own background) + `speaker_feather: 90`. Solid black looked wrong; the first-frame blur showed a purple hand blob.
  - If a take lacks his violet key light, grade it with mild curves (mids 0.45→0.51), colorbalance toward blue and a left-side violet multiply (geq). A stronger lift (0.55) read as "HDR".
  - Send 1080 copies over chat as a 2-pass ~2.9 Mbps "1080 ligero" (<30 MB), not 720p. The master is still the full file.
  - Native 4K via HyperFrames page-scale fails on the Mac (capture timeout). Real 4K needs a Claude Code session running on his PC (Remote Control only drives this Mac).
  - Higgsfield GPU smoke test (2026-11-15): L40S x1 failed to start (no stock, not charged). H100 x1 started after ~4 min and cost 3.89 credits for ~2 min: Ubuntu 24.04 gVisor sandbox, 512G disk, fast internet (GitHub ~120 MB/s), only python3 preinstalled (no ffmpeg/node/chrome/xz). H100 has NO NVENC, so encode 4K on CPU x264 (3 s of 4K in 2 s); tar.xz must be extracted with python tarfile. Chrome/HyperFrames on that box is still untested.
  - 4K on Higgsfield H100 works (EP1, 2026-11-15, 28.65 credits, ~14 min box time): media_upload the hf/ folder as a .tar (general file, <~500 MB per PUT — 572 MB got 413, so split into parts), rent H100, curl the cloudfront URL on the box, install Node 22 tarball + BtbN ffmpeg (extract .xz with python tarfile) + apt Chrome libs + `npx hyperframes@0.8.169 browser ensure`, render `--resolution portrait-4k --quality delivery` (4 workers, ~8 fps capture, 10 min total for 91 s), PUT the result back in parts, stop the box, download, mux the mastered audio from the 1080 final. Camera footage is still the 1080 proxy upscaled; only text/graphics are native 4K. On the Mac, 4K with auto workers needs ~23 GB temp disk; --workers 1 streams.

**Why:** he corrected framing, quality and music during review; these are what he approved.
**How to apply:** start every new Short from these defaults; ask only about what changes per video (topic, sources, speed, music).
