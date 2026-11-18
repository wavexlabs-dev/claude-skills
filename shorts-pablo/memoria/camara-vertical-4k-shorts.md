---
name: camara-vertical-4k-shorts
description: "Pablo's Sony C08xx clips for Shorts are vertical 4K stored as 3840x2160 with -90° rotation; how to prep them without losing sharpness"
metadata:
  node_type: memory
  type: project
  originSessionId: 02e71ab7-289f-48e8-9533-d8b3ffea9b51
  modified: 2026-11-11T06:34:25.626Z
---

For Shorts/Reels Pablo records vertical on the Sony: files are 3840x2160 with rotation -90 (displayed 2160x3840). ffmpeg autorotates before filters, so never crop them as if landscape (2026-11-10 Maya short: a 1216x2160 "vertical crop" zoomed into the top-right corner).

Prep a 1080x1920 proxy once: `scale=1080:1920:flags=lanczos,unsharp=5:5:0.35`, libx264 crf 12. Pablo noticed the h264_videotoolbox 25 Mbps proxy looked visibly softer than his 4K original, so don't use the hardware encoder for the delivery path (fine for a quick draft only). Face center ≈ Framing 0.5, 0.40.

**Why:** cutting straight from the 4K file at crf16 took 30+ min; the proxy makes cut/render ~5x faster without the softness of the hardware encode.
**How to apply:** any video-short / html-reel job on his C08xx footage. Related: [[pablo-video-preferencias]].
