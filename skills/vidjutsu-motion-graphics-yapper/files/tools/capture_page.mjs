// Capture a real web page as one tall still, plus the boxes of the phrases you
// want to highlight, zoom into or click. The scenes' `page` card plays the still
// behind a camera, so pans, zooms, marks and clicks land on real pixels.
//
//   node capture_page.mjs <url> <out-name> [--width 540] [--height 2400] [--dsf 2]
//        [--scheme light|dark] [--wait 5000] [--find '{"stars":"11.5k","install":"npx tool setup"}']
//        [--click "Copy"] [--out assets]
//
// Writes <out>/<out-name>.png (width*dsf wide, so 1080 by default) and
// <out>/<out-name>.json: {w, h, rects: {key: [[x, y, w, h], ...]}} in the
// still's pixels, ready for a card's `marks`, `lenses`, `cursor` and `cam`.
// --click presses the first button whose text contains the word and also saves
// <out-name>-clicked.png (a "Copied" state, a menu that opened).
import { open } from "./cdp.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
const argv = process.argv.slice(2);
const [url, name] = argv;
const opt = (k, d) => { const i = argv.indexOf("--" + k); return i < 0 ? d : argv[i + 1]; };
if (!url || !name) { console.error("usage: node capture_page.mjs <url> <out-name> [--width 540] [--height 2400] [--find JSON]"); process.exit(2); }
const W = +opt("width", 540), H = +opt("height", 2400), DSF = +opt("dsf", 2), out = opt("out", "assets");
const find = JSON.parse(opt("find", "{}")), click = opt("click", null);
mkdirSync(out, { recursive: true });
const p = await open(+opt("port", 9345));
await p.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: opt("scheme", "light") }] });
await p.size(W, Math.min(H, 1200), DSF);
await p.goto(url, +opt("wait", 5000));
// Every visible occurrence of a phrase, as client rects in page pixels (text can wrap).
const FIND = `(phrase) => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const nodes = []; let n, text = "";
  while ((n = w.nextNode())) { const e = n.parentElement; if (!e || e.closest("script,style,template")) continue;
    const r = e.getBoundingClientRect(); if (!r.width && !r.height) continue; nodes.push([n, text.length]); text += n.nodeValue; }
  const at = (pos) => { for (let i = nodes.length - 1; i >= 0; i--) if (nodes[i][1] <= pos) return [nodes[i][0], pos - nodes[i][1]]; };
  const out = []; let i = -1;
  while ((i = text.indexOf(phrase, i + 1)) >= 0 && out.length < 12) {
    const r = document.createRange(); const a = at(i), b = at(i + phrase.length - 1); r.setStart(a[0], a[1]); r.setEnd(b[0], b[1] + 1);
    for (const q of r.getClientRects()) if (q.width > 1) out.push([q.x + scrollX, q.y + scrollY, q.width, q.height]);
  }
  return JSON.stringify(out);
}`;
const rects = {};
for (const [key, phrase] of Object.entries(find)) {
  const rs = JSON.parse(await p.eval(`(${FIND})(${JSON.stringify(phrase)})`));
  rects[key] = rs.filter(([, y]) => y < H).map((r) => r.map((v) => Math.round(v * DSF)));
  if (!rects[key].length) console.log(`not found on the page: ${key} = ${JSON.stringify(phrase)}`);
}
await p.shot(`${out}/${name}.png`, { x: 0, y: 0, width: W, height: H });
if (click) {
  const box = JSON.parse(await p.eval(`JSON.stringify([...document.querySelectorAll("button,a,[role=button]")].filter(e => e.innerText.includes(${JSON.stringify(click)})).map(e => { const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, b.x + scrollX, b.y + scrollY, b.width, b.height]; })[0] || null)`));
  if (!box) console.log("no button with", click);
  else {
    rects.click = [[box[2], box[3], box[4], box[5]].map((v) => Math.round(v * DSF))];
    for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) await p.send("Input.dispatchMouseEvent", { type, x: box[0], y: box[1], button: "left", clickCount: 1 });
    await new Promise((r) => setTimeout(r, 400));
    await p.shot(`${out}/${name}-clicked.png`, { x: 0, y: 0, width: W, height: H });
  }
}
writeFileSync(`${out}/${name}.json`, JSON.stringify({ url, w: W * DSF, h: H * DSF, rects }, null, 1));
console.log(`${out}/${name}.png ${W * DSF}x${H * DSF}`, Object.keys(rects).map((k) => `${k}:${rects[k].length}`).join(" "));
await p.close();
