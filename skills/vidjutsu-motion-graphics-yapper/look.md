# Look

One look, two grounds. Change the accent per page; keep everything else.

## Palette

| Token | Paper (default) | Ink | Use |
| --- | --- | --- | --- |
| `--paper` | `#F3F2EE` | `#0E0F12` | The ground. Paper has a 54 px line grid, ink a dot grid. |
| `--ink` | `#111214` | `#F4F4F5` | Headers, captions, card text. |
| `--ink-2` | `#5E6066` | `#9A9DA6` | Secondary text. |
| `--card` | `#FFFFFF` | `#181A20` | UI cards. |
| `--code-bg` | `#15171C` | `#0A0B0D` | Terminals and code, on both grounds. |
| `--accent` | `#2F6BFF` | `#2F6BFF` | One accent per page: boxed words, flair words, the window frame, the pill. |
| `--good` / `--bad` | `#17945A` / `#E0533D` | same | Checks and warnings in cards only. |

Set the ground with `look: "ink"` and the accent with `accent: "#..."` in the
scene config. Keep them the same in every scene of a short.

## Type

| Role | Font | Where |
| --- | --- | --- |
| Display | Bricolage Grotesque 800 | Headers (74 px), captions (76 px), big numbers. |
| Flair | Instrument Serif italic | The one accent word in a header or caption: `*word*`. |
| UI | Inter | Text inside cards. |
| Mono | JetBrains Mono | Commands, code, file names, star counts. |

All four ship in `files/kit/fonts/` under the SIL Open Font License 1.1.

## Frame (1080x1920)

| Zone | Pixels | Timeline grid (1000x1000) |
| --- | --- | --- |
| Title | top 168, sides 70 | |
| Cards, split | y 340 to 1020 | |
| Caption, split | centered on y 1078 | |
| Presenter window | x 60, y 1160, 960x630, radius 26 | x 56, y 604, 889x328, radius 24 |
| Cards, card layout | y 290 to 1280, scaled 1.3 | |
| Caption, card layout | centered on y 1390 | |
| CTA pill | x 120, y 1210, 840x240 | x 111, y 630, 778x125 |

The window's frame (a 4 px accent edge and eight square handles, like a
selection in a design tool) is drawn by the film; the presenter is laid into
it on the timeline.

## Motion

- **Pop in:** 0.34 s, opacity up fast, scale from 0.86 with a small overshoot,
  28 px rise. Words of a header pop one after another, 0.07 s apart.
- **Pop out:** 0.16 s, ease in, slight shrink.
- **Counters:** ease out over 1.3 to 3.2 s to the real value.
- **Typing:** 30 characters a second, then the result line 0.1 s later.
- **Captions:** each group scales in from 0.88 in a tenth of a second and
  cuts to the next; no fade between groups.
- **Window:** glides to full frame for the CTA in a third of a second; hides
  with a cut on card beats.
