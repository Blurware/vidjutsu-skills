---
name: vidjutsu-ftc-disclosure
description: Decide whether a video needs an ad, sponsorship, affiliate or AI disclosure for US viewers, and write and place it. Use when a video is paid, gifted, has affiliate links, reviews a product, or shows realistic AI-made people or events.
---

# Add the FTC disclosure a video needs

Rules: `policies {platform: "ftc"}` (endorsements, reviews and AI claims, with source links). Informational, not legal advice.

## Does it need one?

Yes, when any of these is true and US viewers can see it:
- the creator was paid, given the product free, or has any family, work or business tie to the brand,
- there's an affiliate link or code that earns money,
- it reviews or endorses a product the creator got for free or at a discount,
- it shows realistic AI-made people, voices or events (also turn on the platform's AI label when posting).

## How to say it

- Plain words the viewer understands: "Ad", "Paid partnership with Brand", "Brand gave me this for free", "I earn from links in my bio".
- Not enough on its own: "#sp", "#collab", "#thanks", a disclosure only in the bio, or one hidden among many hashtags.
- Say it in the video and show it on screen, because people watch without reading the caption. Put it in the caption too, before "more".

## Where to put it in the edit

1. On screen in the first 3 seconds, and again next to the claim or link if the video is long: a lower third or a title card (make it with `make_graphics`, place it with `edit`).
2. Read it aloud near the start if the video has speech.
3. Keep it on screen long enough to read (at least 2 seconds), large and with contrast, away from the platform's buttons.
4. Use the platform's own paid-partnership or AI label too when posting (`schedule_post`).

Then run the compliance check (compliance_skill) with `ftc` included.
