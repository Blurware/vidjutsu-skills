# References

The look and beats come from short-form reels that beat their accounts'
median views. They are described here as patterns, not by account: pick the
reel your script recreates from the person's own bank of outliers (3x or more
its account's median views), and use these patterns as rules for what a
Yapper short does on screen.

| # | Pattern | Length | What to take |
| --- | --- | --- | --- |
| 1 | Resource reveal, presenter in a selection box | 30 to 40 s | The beat order: hook, proof, what it does, the clever part, free, install, CTA. Live counters for the payoff. |
| 2 | Light "you can now" variant | 35 to 40 s | "You can now X... completely free" hook, one card per step, before and after payoff. |
| 3 | Window and graphics layout | about 50 s | Window at the bottom, graphics above; the window steps away so graphics take the full screen. |
| 4 | Framework reel | 60 to 110 s | One diagram that returns for every step, then a recap. |
| 5 | Hidden command | about 60 s | "Most people don't know this, but you can just type /X": the command typed out live, a grid of results, a proof card. |
| 6 | Old way vs new way | about 75 s | One graph that keeps building. |
| 7 | One command, big result | about 50 s | "You can now type one command into Claude...", a flow chart, a "that's the easy version" twist, dollar proof. Dark dot grid. |
| 8 | Tool stack | about 65 s | App windows with selection handles and a moving cursor; a numbered stack of tools, one card each. |
| 9 | Short version | under 20 s | Countdown, three steps, one vivid comparison, follow CTA. |

## Pattern 1, second by second

One pattern 1 reel (32.7 s, 9:16), as a worked example of the format. This is
what that reel does on screen, from a Gemini watch of the reel checked against a frame every
second. Pixel positions are on a 1080x1920 frame. The resource in it is a free,
open-source tool that plants decoy code so AI agents waste tokens trying to
reverse-engineer an app.

### Ground and frame

- **Ground:** near-black charcoal (about `#141518`) with a faint blueprint
  layer: thin grid lines, a few large arcs and tiny coordinate ticks at low
  opacity. It never moves. (The kit's `ink` look is this ground; `paper` is
  the light version.)
- **Three layouts, and only three:**
  1. **Split.** Graphics on top, the presenter window at the bottom.
  2. **Graphics only.** The window is gone and the graphics take the screen.
  3. **Presenter full frame.** Only for the CTA (the last 3.5 s).
- **Presenter window (split):** x 108 to 972 (80 % of the width), top edge at
  y 1340, running off the bottom of the frame (no bottom edge shows). Square
  corners, a 2 px electric-blue border (about `#2F80FF`) with eight small
  white-filled square handles at the corners and edge midpoints, like a
  selected layer in a design tool. A black arrow cursor rests on the top-right
  handle. Inside: head and shoulders, centered, eyes to the lens, soft key
  light, plain light-grey wall, black hoodie, a small dark mic at the chin.
  The head sits fully inside the window; the top of the hair is just under the
  top edge. (This skill adds a head pop-out on top of that: see SKILL.md, Head
  room.)
- **Graphics zone (split):** y 250 to 1000. **Graphics zone (graphics only):**
  y 200 to 1300, cards up to 85 % of the width.
- **Every card is selected.** Code editors, browser windows and docs cards all
  carry the same blue border and eight handles as the presenter window. That
  one detail is most of the look.

### Captions

- One word at a time, sometimes two ("by AI", "it's called"), synced to the
  voice, changing every 0.3 to 0.6 s.
- Heavy rounded grotesk (Inter or SF Pro Black feel), white, about 64 px cap
  height, a soft dark shadow, no box.
- **Position:** y about 1040 in the split layout (in the gap between the cards
  and the window), y about 1400 when the graphics take the screen, y about
  1480 over the full-frame presenter.
- **Accents:** the key noun turns electric blue ("fake", "free"); a few words
  switch to a serif italic ("decoy code", "useful", "comment"). A word being
  spoken can fade in from 50 % grey to white ("then it'll plant").
- The CTA keyword is set in quotes inside a selection box with handles:
  `comment` in serif italic on one line, `"Trap"` big below it.

### Beats

| Time | Voice (paraphrased) | Layout | On screen |
| --- | --- | --- | --- |
| 0.0 to 4.0 | Here's how to protect your app from being cloned or reverse-engineered by AI... | Split | Two-line title types in word by word at y 290: "Set A Trap For" in white, then "AI Copycats" white on a solid blue block with selection handles. Two shield logos flank the title. Under it a dark code-editor card (y 510 to 975) with two lines highlighted amber and tagged `fake key` / `decoy`, colored multiplayer cursors labelled with AI agent names hovering on them, and a TOKENS BURNED counter at the card's top right racing 6,026 to 249,731 in four seconds. |
| 4.0 to 9.0 | ...by setting up a trap. It's called [tool], a free tool that protects your app, website or even video game. | Graphics only | The shield logo scales in alone, center, with a blur-to-sharp pop (4.0). The wordmark and a blue subtitle land under it (5.0). A pill "Free · open source (MIT)" (6.0). Then three list cards stack in one per second, each a dark card with a blue outline, the shield icon, a bold title and a grey subline: Apps (6.0), Websites (7.0), Video games (8.0). Each card lands on the word that names it. |
| 9.0 to 12.0 | Using it is simple: you just install it and point it at your app right before you release it. | Split | A white docs card, "30-Second Quick Start", with a one-line install command. At 10.5 the cursor drags across the command and it highlights blue. |
| 12.0 to 17.0 | Then it'll plant fake keys and decoy code inside your app. | Graphics only | A tall dark code editor (y 250 to 1270). The code scrolls up slowly; line after line lights amber with a right-aligned tag (`decoy`, `fake key`) as the words land. |
| 17.0 to 22.0 | So when someone uses AI to reverse-engineer it, their AI gets confused and burns through all their tokens without getting anything useful. | Graphics only | Same editor. Four labelled AI cursors crawl the decoy lines. A wide counter card docks under the editor: TOKENS BURNED counting 5,176, 52,543, 1,005,258, 12,930,346, 13,500,000 (one step per second, easing), a dollar cost top right ($0.21 to $212.82), a thin orange progress bar, and one log line ("found API_KEY, trying it"). |
| 22.0 to 26.0 | And the best part: your users get the exact same app, with no loss in performance. | Split | A browser card of the tool's dark-blue landing page. At 25.0 a big "100%" stamp with "same runtime behavior" under it scales in over the page. |
| 26.0 to 29.0 | Plus it's completely free and works right inside your coding agents. | Graphics only | A white repo sidebar card: topic chips, the MIT license row boxed with handles, a star count. At 28.0 it swaps to a docs card with an agent's name highlighted in a box. |
| 29.0 to 32.7 | If you want to try it, comment "trap" below and I'll DM it to you. | Presenter full frame | The window grows to full frame. Captions sit low. The keyword lands in quotes in a handled box for the last two seconds. |

### Motion and sound

- **The screen changes every 1 to 2 s.** A new card, a stacking list item, a
  counter step, a highlight, a cursor drag, or a layout switch. Nothing holds
  still for more than about 2 s.
- **Layout switches are cuts**, not slides: the window disappears on one frame
  and the graphics re-center.
- **Entrances:** a 0.25 to 0.35 s scale from about 0.9 to 1.0 with a small
  overshoot and a fade. List cards drop in from about 20 px above.
  Highlights sweep left to right in about 0.2 s.
- **Counters** ease out and land on round, absurd numbers. The number is the
  payoff of the beat, so it is the largest text on screen.
- **Cursors** are the motion that makes a static screenshot feel live: a black
  arrow for "the viewer", colored labelled cursors for the agents.
- **Sound:** the voice is fast, warm and even, with every pause cut (no gap
  over about 0.15 s). Under it: a low, steady electronic bed, and small UI
  clicks and pops on card entrances and highlights.

### What a recreation keeps and what it changes

Keeps: the beat order and timing above, the three layouts, the selection
handles on every card, one-word captions between the cards and the window,
counters for the payoff, the full-frame CTA with the keyword in a box.
Changes: the resource and its facts, the keyword, the light `paper` ground
(the `ink` ground matches the reel), a rounded window that shows its bottom
edge, and the head pop-out over the cards, which the reel does not do.

## Rules the references share

1. **The resource is the hero.** One tool, repo or library per short, named
   in the first five seconds and shown as itself: its real page with a camera
   moving over it, marker highlights on the words being said, a cursor
   clicking its real buttons, its own demo clips. A still screenshot that
   just sits there is the one thing to avoid; every capture moves and points.
2. **The screen changes every 1.5 to 3 seconds.** A new card, a number
   counting, a line typing, or the window stepping away. The kit's pop is a
   0.34 s scale-in with a small overshoot.
3. **Captions are 1 to 3 words**, bold sans, between the cards and the
   presenter, one accent word in a serif italic or the accent color.
4. **One accent color** on a quiet ground (light grid paper or a dark dot
   grid). Everything else is ink and white cards.
5. **The presenter is a window, not the frame.** Bottom third, rounded, a
   design-tool selection frame around it. Full frame only for the CTA (and at
   most one pivot).
6. **Numbers move.** Stars, counts and totals count up to their real value.
7. **The last line is one ask**, with the keyword big on screen.

## Recreating a reference

Keep: the beat order, each line's job and length, the hook's sentence shape,
the pacing. Change: the resource, its facts, the keyword. The script table
names the reference line for every beat. [sample/script.md](sample/script.md)
is the sample's script, beat by beat with what each scene shows.
