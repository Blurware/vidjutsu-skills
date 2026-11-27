// Local pre-check before make_graphics: does every scene draw the same frame
// whatever frame came before it? The renderer refuses a scene that doesn't
// ("not repeatable"), and a refused slice costs a retry.
//
//   node check_repeat.mjs <scenes-folder> <film.json> [--step 6] [--only 04-]
//
// Draws every step-th frame forward, then backward, and compares each pair.
// Chrome leaves small differences that nobody can see: +-1 level of raster
// noise, and up to ~16 levels where it resamples a scaled image with a cheaper
// filter after a size change. So a frame fails only when more than 50 pixels
// differ by more than 24 levels; the bugs that matter (a font not loaded yet,
// a layer drawn at the wrong scale, state kept between frames) are far bigger.
// Also reports page errors and frames slower than 2.5 s (the renderer allows 30 s).
import { open } from "./cdp.mjs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const argv = process.argv.slice(2);
const [dir, filmPath] = argv;
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i < 0 ? d : argv[i + 1]; };
const film = JSON.parse(readFileSync(filmPath, "utf8")), step = +opt("step", 6), only = opt("only", "");
const p = await open(+opt("port", 9366)); await p.size(film.width || 1080, film.height || 1920, 1);
const DIFF = `async (a, b) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = "data:image/png;base64," + s; });
  const [ia, ib] = await Promise.all([load(a), load(b)]);
  const px = (img) => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
  const da = px(ia), db = px(ib); let n = 0;
  for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) > 24 || Math.abs(da[i + 1] - db[i + 1]) > 24 || Math.abs(da[i + 2] - db[i + 2]) > 24) n++;
  return n;
}`;
let failed = 0;
for (const s of film.scenes) {
  if (only && !s.dir.startsWith(only)) continue;
  await p.goto("file://" + resolve(dir, s.dir, s.entry || "index.html"), 300);
  const n = Math.round(s.seconds * (film.fps || 30)), ts = [];
  for (let i = 0; i < n; i += step) ts.push(i / (film.fps || 30));
  const grab = async (t) => { const t0 = Date.now(); await p.eval(`(async () => { await document.fonts.ready; await window.render(${t}); })()`); const r = await p.send("Page.captureScreenshot", { format: "png" }); return [r.data, Date.now() - t0]; };
  const fwd = {}; let slow = 0;
  try { for (const t of ts) { const [d, ms] = await grab(t); fwd[t] = d; if (ms > 2500) slow++; } }
  catch (e) {
    const msg = (String(e.message).match(/"description":"([^"\\]*)/) || [])[1] || String(e.message).slice(0, 200);
    console.log(s.dir.padEnd(14), "PAGE ERROR", msg, /missing still pop/.test(msg) ? "(extract pop/ from pop.mov first, see Head room)" : "");
    failed++; p.evs.length = 0; continue;
  }
  const bad = [];
  for (const t of [...ts].reverse()) { const [d] = await grab(t); const px = await p.eval(`(${DIFF})(${JSON.stringify(fwd[t])}, ${JSON.stringify(d)})`); if (px > 50) bad.push(`${t.toFixed(2)}s (${px} px)`); }
  const errs = p.evs.filter((e) => e.method === "Runtime.exceptionThrown").map((e) => e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text); p.evs.length = 0;
  if (bad.length || errs.length || slow) failed++;
  console.log(s.dir.padEnd(14), bad.length ? "NOT REPEATABLE at " + bad.join(", ") : "ok", slow ? `| ${slow} slow frames` : "", errs.length ? "| ERRORS " + errs.slice(0, 2).join(" / ") : "");
}
await p.close();
process.exit(failed ? 1 : 0);
