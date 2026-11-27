// Draw stills of scenes on your machine, to look at before paying for a render.
//   node preview.mjs <scenes-folder> '{"01-hook":[0.2,2.5],"04-tour":[1]}' [out-folder]
import { open } from "./cdp.mjs";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
const [dir, spec, out = "preview"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const p = await open(9355); await p.size(1080, 1920, 1);
for (const [scene, ts] of Object.entries(JSON.parse(spec))) {
  await p.goto("file://" + resolve(dir, scene, "index.html"), 300);
  for (const t of ts) {
    await p.eval(`(async () => { await document.fonts.ready; await window.render(${t}); })()`);
    await p.shot(`${out}/${scene}-${t.toFixed(2)}.jpg`, { x: 0, y: 0, width: 1080, height: 1920 }, "jpeg", 82);
  }
  const errs = p.evs.filter((e) => e.method === "Runtime.exceptionThrown"); if (errs.length) console.log("ERROR in", scene, JSON.stringify(errs[0].params.exceptionDetails).slice(0, 300)); p.evs.length = 0;
}
console.log("stills in", out);
await p.close();
