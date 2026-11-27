// Tiny Chrome DevTools Protocol helper: headless Chrome, one page. Node 22+.
// CHROME overrides the browser path; the default is Chrome on macOS.
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export async function open(port = 9344) {
  const profile = mkdtempSync(join(tmpdir(), "yap-cdp-"));
  const proc = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--hide-scrollbars",
    "--force-color-profile=srgb", "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
  let targets;
  for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 400)); try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch {} }
  if (!targets) throw new Error("Chrome did not start; set CHROME to the browser binary");
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const evs = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { const { res, rej } = pend.get(d.id); pend.delete(d.id); d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result); } else evs.push(d); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable");
  const page = {
    send, evs,
    async size(width, height, dsf = 1) { await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dsf, mobile: false }); },
    async goto(url, waitMs = 2500) {
      await send("Page.navigate", { url });
      for (let i = 0; i < 150; i++) { await new Promise((r) => setTimeout(r, 200)); if ((await page.eval("document.readyState")) === "complete") break; }
      await new Promise((r) => setTimeout(r, waitMs));
    },
    async eval(expression) { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600)); return r.result.value; },
    async shot(path, clip, format = "png", quality) {
      const r = await send("Page.captureScreenshot", { format, ...(quality ? { quality } : {}), ...(clip ? { clip: { ...clip, scale: 1 }, captureBeyondViewport: true } : {}) });
      writeFileSync(path, Buffer.from(r.data, "base64"));
    },
    async close() { try { ws.close(); } catch {} proc.kill(); },
  };
  return page;
}
