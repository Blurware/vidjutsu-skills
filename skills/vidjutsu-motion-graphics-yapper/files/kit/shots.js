// Shots for the Yapper kit. Adds card types to Yap.cards:
//   page   a real page capture behind a camera (pan, zoom, tilt), with marker
//          highlights, strike-throughs, magnifier lenses, a dim and a cursor
//   crop   one region of a capture, as a sticker
//   demo   a tool's name, the repo's own before/after clip (sprite sheet) and
//          the real command typing in
//   odo    a number that counts up, with a burst of stars
// Every property is set from the card's local time alone.
(function () {
  "use strict";
  const Y = window.Yap, el = Y.el, span = Y.span, E = Y.ease, clamp = Y.clamp, C = Y.cards;
  const lerp = (a, b, k) => a + (b - a) * k;
  const IMGS = [];
  let used = false;  // set when a scene builds a shot card
  const image = (src, parent, cls) => { used = true; const i = el("img", cls || null, parent); i.alt = ""; i.decoding = "sync"; i.src = src; IMGS.push(i); return i; };
  const STAR = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 1.6l3.2 6.6 7.2 1-5.2 5.1 1.3 7.2L12 18.1l-6.5 3.4 1.3-7.2L1.6 9.2l7.2-1z" fill="#F5B301" stroke="#B97F00" stroke-width="0.9" stroke-linejoin="round"/></svg>';

  // Camera: keys [{at, cx, cy, z, dur, ease}]. cx, cy: the image point at the
  // view's centre; z: screen pixels per image pixel. Each key eases from the
  // state before it, starting at `at` and taking `dur` (0 = a cut).
  function camAt(keys, lt) {
    let s = { cx: keys[0].cx, cy: keys[0].cy, z: keys[0].z };
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i], d = k.dur == null ? 0.5 : k.dur;
      const p = d <= 0 ? (lt >= k.at ? 1 : 0) : E[k.ease || "inOutCubic"](span(lt, k.at, k.at + d));
      s = { cx: lerp(s.cx, k.cx, p), cy: lerp(s.cy, k.cy, p), z: s.z * Math.pow(k.z / s.z, p) };
    }
    return s;
  }

  C.page = (p) => {
    // No compositor layers and no scale transforms in here: the camera is laid
    // out in pixels on every call, so a frame never depends on the one before.
    const barH = p.url ? 62 : 0, vw = p.w, vh = p.h - barH, dk = p.dark ? " dk" : "";
    const root = el("div", "s-page"); root.style.width = p.w + "px"; root.style.height = p.h + "px";
    const win = el("div", "s-win" + (p.dark ? " dark" : ""), root);
    if (p.url) { const bar = el("div", "s-bar", win); el("i", null, bar); el("i", null, bar); el("i", null, bar); el("div", "s-url", bar, "<b>&#9679;</b>" + p.url); }
    const view = el("div", "s-view", win); view.style.top = barH + "px";
    const im = image(p.img, view, "s-img");
    const dim = p.dim ? el("div", "s-dim" + dk, view) : null;
    const marks = (p.marks || []).map((m) => (m.rects || [m.rect]).map((r, i, all) => {
      const e = el("div", "s-mark " + (m.kind || "hl") + (m.kind === "strike" || m.kind === "under" ? "" : dk), view);
      let [x, y, w, h] = r;
      if (m.kind === "strike") { y = y + h * 0.5 - 4; h = 8; x -= 4; w += 8; }
      else if (m.kind === "under") { y = y + h + 2; h = 7; }
      else { x -= 7; w += 14; y -= 3; h += 6; }
      if (m.color) e.style.background = m.color;
      const d = (m.dur || 0.32) / all.length;
      return { e, x, y, w, h, at: m.at + i * d, d, until: m.until };
    })).flat();
    const lenses = (p.lenses || []).map((l) => {
      const pad = l.pad == null ? 10 : l.pad, [x, y, w, h] = [l.rect[0] - pad, l.rect[1] - pad, l.rect[2] + 2 * pad, l.rect[3] + 2 * pad];
      const e = el("div", "s-lens" + dk, view);
      const ii = image(p.img, e);
      return { e, ii, l, x, y, w, h };
    });
    let cur = null, ring = null; const ck = p.cursor || [];
    if (ck.length) {
      cur = el("div", "s-cur", view);
      cur.innerHTML = '<svg viewBox="0 0 46 58"><path d="M3 3 L3 47 L15 36 L23 55 L31 51 L23 33 L40 33 Z" fill="#fff" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/></svg>';
      ring = el("div", "ring", cur);
    }
    const T = p.tilt === false ? null : Object.assign({ rot: -3, dur: 0.5, dy: 90, from: 0.9 }, p.tilt || {});
    const px = (v) => v.toFixed(2) + "px";
    return { el: root, draw(lt) {
      const c = camAt(p.cam, lt);
      const z = c.z * (1 + (p.push == null ? 0.03 : p.push) * span(lt, 0, p.life || 6));
      // keep the image over the whole view where it can
      const hw = vw / 2 / z, hh = vh / 2 / z;
      const cx = p.iw <= 2 * hw ? p.iw / 2 : Math.min(p.iw - hw, Math.max(hw, c.cx));
      const cy = p.ih <= 2 * hh ? p.ih / 2 : Math.min(p.ih - hh, Math.max(hh, c.cy));
      const ox = vw / 2 - cx * z, oy = vh / 2 - cy * z;
      Object.assign(im.style, { left: px(ox), top: px(oy), width: px(p.iw * z), height: px(p.ih * z) });
      if (T) {
        const k = 1 - E.outQuint(span(lt, 0, T.dur));
        win.style.transform = k <= 0 ? "none" : `translateY(${(T.dy * k).toFixed(2)}px) rotate(${(T.rot * k).toFixed(3)}deg) scale(${(1 - (1 - T.from) * k).toFixed(4)})`;
      }
      if (dim) { const d = p.dim; dim.style.opacity = ((d.to == null ? 0.7 : d.to) * span(lt, d.at, d.at + 0.3) * (1 - span(lt, (d.until == null ? 99 : d.until) - 0.25, d.until == null ? 99 : d.until))).toFixed(4); }
      marks.forEach((m) => {
        const k = E.outCubic(span(lt, m.at, m.at + m.d));
        const off = m.until == null ? 1 : 1 - span(lt, m.until - 0.2, m.until);
        m.e.style.opacity = k <= 0 ? 0 : off;
        Object.assign(m.e.style, { left: px(ox + m.x * z), top: px(oy + m.y * z), width: px(Math.max(0.01, m.w * z * k)), height: px(m.h * z), borderRadius: px(7 * z) });
      });
      lenses.forEach(({ e, ii, l, x, y, w, h }) => {
        const until = l.until == null ? 99 : l.until;
        const a = span(lt, l.at, l.at + 0.3), b = span(lt, until - 0.16, until);
        const k = E.outBack(a) * (1 - E.inCubic(b));
        const s = z * (1 + ((l.scale || 1.25) - 1) * k), bw = 4;
        const mx = ox + (x + w / 2 + (l.dx || 0) * k) * z, my = oy + (y + h / 2 + (l.dy || 0) * k) * z;
        e.style.opacity = a <= 0 ? 0 : (clamp(a * 4) * (1 - b)).toFixed(4);
        Object.assign(e.style, { left: px(mx - (w * s) / 2 - bw), top: px(my - (h * s) / 2 - bw), width: px(w * s + 2 * bw), height: px(h * s + 2 * bw) });
        Object.assign(ii.style, { left: px(-x * s), top: px(-y * s), width: px(p.iw * s), height: px(p.ih * s) });
      });
      if (cur) {
        let x = ck[0].x, y = ck[0].y, click = 0;
        for (let i = 0; i < ck.length; i++) {
          const k = ck[i], nx = ck[i + 1];
          if (lt >= k.at) { x = k.x; y = k.y; if (k.click && lt < k.at + 0.45) click = Math.max(click, 1 - span(lt, k.at, k.at + 0.45)); }
          if (nx && lt >= k.at && lt < nx.at) { const mv = E.inOutCubic(span(lt, nx.at - (nx.travel || 0.5), nx.at)); x = k.x + (nx.x - k.x) * mv; y = k.y + (nx.y - k.y) * mv; }
        }
        const end = p.cursorUntil == null ? 99 : p.cursorUntil;
        cur.style.opacity = (span(lt, ck[0].at - 0.2, ck[0].at) * (1 - span(lt, end - 0.15, end))).toFixed(4);
        Object.assign(cur.style, { left: px(ox + x * z - 4), top: px(oy + y * z - 4 + 6 * click) });
        const rs = 60 + 90 * (1 - click);
        ring.style.opacity = click.toFixed(4); Object.assign(ring.style, { left: px(4 - rs / 2), top: px(4 - rs / 2), width: px(rs), height: px(rs) });
      }
    } };
  };

  C.crop = (p) => {
    const [x, y, w, h] = p.rect, k = p.zoom || 1;
    const root = el("div", "s-crop"); root.style.width = w * k + "px"; root.style.height = h * k + "px";
    if (p.radius != null) root.style.borderRadius = p.radius + "px";
    if (p.plain) { root.style.border = "0"; root.style.background = "transparent"; }
    const i = image(p.img, root); Object.assign(i.style, { left: -x * k + "px", top: -y * k + "px", width: p.iw * k + "px", height: p.ih * k + "px" });
    return { el: root, draw(lt) { root.style.transform = `rotate(${(p.rot || 0) + 1.5 * Math.sin(lt * 2.1)}deg)`; } };
  };

  C.demo = (p) => {
    const root = el("div", "s-demo");
    const nm = el("div", "nm", root, p.name.replace(/^(\w+)/, "<b>$1</b>"));
    const clip = el("div", "clip", root);
    const fw = 980, fh = Math.round(980 * p.fh / p.fw); clip.style.height = fh + "px";
    const i = image(p.sheet, clip); i.style.width = fw * p.cols + "px"; i.style.height = fh * p.rows + "px";
    const cmd = el("div", "cmd", root); el("span", "p", cmd, "$ "); const txt = el("span", null, cmd); const caret = el("span", "caret", cmd);
    const dir = p.dir || 1;
    return { el: root, draw(lt) {
      const a = E.outQuint(span(lt, 0, 0.3));
      nm.style.opacity = clamp(lt / 0.08); nm.style.transform = `translateX(${((1 - a) * -90 * dir).toFixed(2)}px)`;
      const b = E.outBack(span(lt, 0.04, 0.36));
      clip.style.opacity = clamp((lt - 0.04) / 0.08); clip.style.transform = `translateX(${((1 - E.outQuint(span(lt, 0.04, 0.36))) * 140 * dir).toFixed(2)}px) rotate(${((1 - b) * 3 * dir).toFixed(3)}deg) scale(${(0.9 + 0.1 * b).toFixed(4)})`;
      const f = Math.min(p.frames - 1, Math.max(0, Math.floor(lt * (p.fps || 12) + 1e-6)));
      i.style.transform = `translate(${-(f % p.cols) * fw}px, ${-Math.floor(f / p.cols) * fh}px)`;
      const n = Math.floor(clamp((lt - 0.12) * (p.cps || 46) / p.cmd.length) * p.cmd.length);
      txt.textContent = p.cmd.slice(0, n) + "​";
      cmd.style.opacity = clamp((lt - 0.1) / 0.08);
      caret.style.opacity = n < p.cmd.length || Math.floor(lt * 2.4) % 2 === 0 ? 1 : 0;
    } };
  };

  C.odo = (p) => {
    used = true;
    const root = el("div", "s-odo" + (p.dark ? " dk" : ""));
    const star = p.star === false ? null : el("div", "star", root, STAR);
    const num = el("div", "num", root, "0");
    if (p.size) num.style.fontSize = p.size + "px";
    const lb = p.label ? el("div", "lb", root, Y.rich(p.label)) : null;
    const N = p.burst === false ? 0 : (p.count || 22);
    const pts = []; let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < N; i++) {
      const e = el("div", "pt", root, STAR);
      pts.push({ e, a: (i / N) * Math.PI * 2 + rnd() * 0.5, d: 300 + rnd() * 420, s: 0.45 + rnd() * 0.9, r: (rnd() - 0.5) * 540 });
    }
    const t0 = p.start == null ? 0.1 : p.start, tb = t0 + (p.countFor || 1.0);
    return { el: root, draw(lt) {
      const k = E.outCubic(span(lt, t0, tb));
      num.textContent = (p.prefix || "") + Y.commas(p.from + (p.value - p.from) * k) + (p.suffix || "");
      const hit = E.outBack(span(lt, tb, tb + 0.28)), tick = 1 + 0.012 * Math.sin(lt * 46) * (lt > t0 && lt < tb ? 1 : 0);
      num.style.transform = `scale(${((0.94 + 0.12 * hit - 0.06 * span(lt, tb + 0.28, tb + 0.5)) * tick).toFixed(4)})`;
      if (star) star.style.transform = `rotate(${(-28 * (1 - E.outBack(span(lt, 0, 0.4))) + 360 * E.outQuint(span(lt, tb, tb + 0.6))).toFixed(2)}deg) scale(${(0.5 + 0.5 * E.outBack(span(lt, 0, 0.4)) + 0.25 * hit * (1 - span(lt, tb + 0.28, tb + 0.6))).toFixed(4)})`;
      if (lb) { const q = Y.pop(lt - tb - 0.05); lb.style.opacity = q.o; lb.style.transform = `translateY(${q.y}px) scale(${q.s})`; }
      pts.forEach((o) => {
        const q = span(lt, tb, tb + 0.9), m = E.outQuint(q);
        o.e.style.opacity = lt < tb ? 0 : 1 - E.inCubic(span(lt, tb + 0.4, tb + 0.9));
        o.e.style.transform = `translate(${(Math.cos(o.a) * o.d * m).toFixed(2)}px, ${(Math.sin(o.a) * o.d * m * 0.8 + 160 * q * q).toFixed(2)}px) rotate(${(o.r * m).toFixed(2)}deg) scale(${(o.s * (1 - 0.35 * q)).toFixed(4)})`;
      });
    } };
  };

  // Wait for every image before the first frame is drawn.
  Y.shots = function () {
    // A scene with shots draws with no compositor layers at all. Its images and
    // counters scale every frame, and Chrome rasters a will-change layer once at
    // the scale it first meets, then stretches that bitmap: the same t came out
    // sharper or softer depending on the frame before it. Without layers every
    // frame rasters at its real scale. A scene with only drawn cards (or the
    // CTA) keeps the kit's layers, which keep its popping text steady.
    if (used) document.querySelectorAll("*").forEach((e) => { if (getComputedStyle(e).willChange !== "auto") e.style.willChange = "auto"; });
    const base = window.render;
    const ready = Promise.all(IMGS.map((i) => (i.complete && i.naturalWidth ? Promise.resolve() : new Promise((ok, no) => { i.onload = ok; i.onerror = () => no(new Error("missing image " + i.getAttribute("src"))); })).then(() => i.decode())));
    window.render = async (t) => { await ready; return base(t); };
    window.render(0);
  };
})();
