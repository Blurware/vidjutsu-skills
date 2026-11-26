// Motion Graphics Yapper kit: layout, captions, cards and motion.
//
// A scene page calls Yap.scene({...}) once. It builds every element up front
// and defines window.render(t), which sets every moving property from t alone
// (no clocks, no CSS animations, nothing kept between frames), so any frame
// can be drawn first, last or twice and come out the same.
//
// Frame: 1080x1920. Three layouts, one per scene:
//   split  cards on top, caption in the gap, presenter window at the bottom,
//          with the presenter's head popping out over the window's top edge
//   card   cards take the whole screen (the presenter track is hidden)
//   face   presenter full frame (the CTA); the film only draws the CTA pill,
//          which the timeline crops out and lays over the face
(function () {
  "use strict";
  const Y = (window.Yap = {});

  // ---- Time helpers: pure functions of t.
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const span = (t, a, b) => (b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a)));
  const E = {
    outQuint: (p) => 1 - Math.pow(1 - p, 5),
    outCubic: (p) => 1 - Math.pow(1 - p, 3),
    inCubic: (p) => p * p * p,
    inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    outBack: (p) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  };
  Y.clamp = clamp; Y.span = span; Y.ease = E;

  // ---- Layout (pixels on the 1080x1920 frame). The presenter window and the
  // pill are also given in the timeline's 1000x1000 grid in SKILL.md: keep
  // them in step if you move them.
  const L = {
    window: { x: 60, y: 1160, w: 960, h: 630 },
    pill: { x: 120, y: 1210, w: 840, h: 240 },
    split: { top: 330, height: 500, caption: 890 },
    // Head room: the strip just above the window where the presenter's head
    // breaks out of it. Keep cards and captions out of it on split beats.
    pop: { x: 60, y: 900, w: 960, h: 260 },
    card: { top: 290, height: 990, caption: 1390, scale: 1.3 },
    titleTop: 168,
  };
  Y.LAYOUT = L;

  // ---- Small DOM helpers.
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Inline marks: [boxed words]  *flair italic*  ^accent color^
  const rich = (s) => esc(s)
    .replace(/\[(.+?)\]/g, '<span class="box">$1</span>')
    .replace(/\*(.+?)\*/g, '<span class="fl">$1</span>')
    .replace(/\^(.+?)\^/g, '<span class="hl">$1</span>');
  const el = (tag, cls, parent, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  const commas = (n) => { const s = String(Math.round(n)); return s.replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  Y.el = el; Y.rich = rich; Y.commas = commas;

  // Words of a rich string as separate spans, so each can pop on its own.
  function words(parent, text) {
    const out = [];
    // Keep [..] and *..* groups together as one unit.
    const parts = String(text).match(/\[[^\]]+\]|\*[^*]+\*|\^[^^]+\^|\S+/g) || [];
    parts.forEach((p, i) => {
      const w = el("span", "w", parent, rich(p));
      out.push(w);
      if (i < parts.length - 1) parent.appendChild(document.createTextNode(" "));
    });
    return out;
  }

  // Standard entrance and exit for anything that pops: returns {o, s, y}.
  function pop(lt, dur, opts) {
    const o = opts || {};
    const inD = o.inD || 0.34, outD = o.outD || 0.16, from = o.from == null ? 0.86 : o.from;
    const pi = span(lt, 0, inD), po = dur == null ? 0 : span(lt, dur - outD, dur);
    const s = from + (1 - from) * E.outBack(pi) - 0.04 * E.inCubic(po);
    return { o: clamp(pi * 3) * (1 - E.inCubic(po)), s, y: (1 - E.outQuint(pi)) * 28 };
  }
  Y.pop = pop;

  // ================= Cards =================
  // Each returns {el, draw(lt, dur)}; lt is seconds since the card came in.
  const C = (Y.cards = {});

  C.header = (p) => {
    const root = el("div", "c-header");
    const line = el("div", null, root);
    const ws = words(line, p.text);
    let sub = null;
    if (p.sub) sub = el("span", "sub", root, rich(p.sub));
    return { el: root, draw(lt) {
      ws.forEach((w, i) => { const q = pop(lt - 0.05 - i * 0.07); w.style.opacity = q.o; w.style.transform = `translateY(${q.y}px) scale(${q.s})`; });
      if (sub) { const q = pop(lt - 0.25 - ws.length * 0.07); sub.style.opacity = q.o; sub.style.transform = `translateY(${q.y}px)`; }
    } };
  };

  C.logo = (p) => {
    const root = el("div", "c-logo");
    const mark = el("div", "mark mv-in", root, p.markHtml || esc(p.mark || (p.name || "?")[0]));
    const name = el("div", "name", root, rich(p.name));
    const by = p.by ? el("div", "by", root, rich(p.by)) : null;
    const tags = el("div", "tags", root);
    const pills = (p.pills || []).map((x, i) => el("span", "pillx" + (i === 0 ? " solid" : ""), tags, rich(x)));
    [mark, name, by, ...pills].forEach((e) => e && (e.style.willChange = "transform, opacity"));
    return { el: root, draw(lt) {
      const m = pop(lt, null, { from: 0.4, inD: 0.42 });
      mark.style.opacity = m.o; mark.style.transform = `scale(${m.s}) rotate(${(1 - E.outQuint(span(lt, 0, 0.5))) * -12}deg)`;
      const n = pop(lt - 0.18); name.style.opacity = n.o; name.style.transform = `translateY(${n.y}px)`;
      if (by) { const b = pop(lt - 0.3); by.style.opacity = b.o; by.style.transform = `translateY(${b.y}px)`; }
      pills.forEach((e, i) => { const q = pop(lt - 0.5 - i * 0.12); e.style.opacity = q.o; e.style.transform = `scale(${q.s})`; });
    } };
  };

  C.repo = (p) => {
    const root = el("div", "card c-repo sel");
    const top = el("div", "top", root);
    el("span", "owner", top, esc(p.owner) + " /");
    el("span", "name", top, esc(p.name));
    el("span", "vis", top, esc(p.visibility || "Public"));
    el("div", "desc", root, rich(p.desc || ""));
    const meta = el("div", "meta", root);
    const st = el("span", null, meta, '<span class="star">&#9733;</span> ');
    const num = el("span", "num", st, "0");
    if (p.license) el("span", null, meta, esc(p.license));
    if (p.lang) el("span", null, meta, esc(p.lang));
    const from = p.starsFrom == null ? Math.round(p.stars * 0.62) : p.starsFrom;
    return { el: root, draw(lt) {
      const k = E.outQuint(span(lt, 0.25, (p.countFor || 1.4) + 0.25));
      num.textContent = commas(from + (p.stars - from) * k);
    } };
  };

  C.term = (p) => {
    const root = el("div", "card c-term");
    const bar = el("div", "bar", root);
    el("i", "dot", bar); el("i", "dot", bar); el("i", "dot", bar);
    el("span", "ttl", bar, esc(p.title || "agent"));
    const body = el("div", "body", root);
    const rows = (p.lines || []).map((ln) => {
      const row = el("div", "ln" + (ln.type && ln.type !== "cmd" ? " " + ln.type : ""), body);
      const pre = ln.type === "cmd" || !ln.type ? el("span", "p", row, esc(p.prompt || "> ")) : null;
      const txt = el("span", null, row);
      const caret = el("span", "caret", row);
      return { ln, row, txt, caret, pre };
    });
    return { el: root, draw(lt) {
      let active = -1;
      rows.forEach((r, i) => {
        const at = r.ln.at || 0, s = r.ln.text;
        const typed = r.ln.type === "cmd" || !r.ln.type;
        const n = typed ? Math.floor(clamp((lt - at) * (r.ln.cps || 30) / s.length) * s.length) : (lt >= at ? s.length : 0);
        r.row.style.opacity = lt >= at - (typed ? 0.25 : 0) ? 1 : 0;
        r.txt.textContent = s.slice(0, n);
        if (lt >= at - 0.25) active = i;
      });
      rows.forEach((r, i) => { r.caret.style.opacity = i === active && Math.floor(lt * 2.4) % 2 === 0 ? 1 : 0; });
    } };
  };

  C.chips = (p) => {
    const root = el("div", "c-chips");
    let cnt = null;
    if (p.count) { cnt = el("div", "count", root); }
    const chips = (p.items || []).map((x) => el("span", "chip", root, esc(x)));
    const gap = p.gap || 0.055;
    return { el: root, draw(lt) {
      chips.forEach((c, i) => {
        const q = pop(lt - 0.1 - i * gap, null, { from: 0.5, inD: 0.28 });
        c.style.opacity = q.o; c.style.transform = `scale(${q.s})`;
        const lit = p.on && p.on.includes(i) && lt >= (p.onAt || 99);
        c.className = "chip" + (lit ? " on" : "");
      });
      if (cnt) {
        const shown = Math.min(chips.length, Math.floor(clamp((lt - 0.1) / (gap * chips.length + 0.001)) * chips.length));
        cnt.innerHTML = `<span class="n">${p.count.n == null ? shown : commas(Math.round(p.count.n * clamp((lt - 0.1) / (gap * chips.length + 0.001))))}</span> ${rich(p.count.label || "")}`;
      }
    } };
  };

  C.list = (p) => {
    const root = el("div", "c-list");
    const its = (p.items || []).map((x, i) => {
      const it = el("div", "card it", root);
      el("div", "ix", it, String(i + 1));
      el("div", "ic", it, x.iconHtml || esc(x.icon || ""));
      el("div", "lb", it, rich(x.label));
      return { it, at: x.at == null ? 0.2 + i * 0.35 : x.at };
    });
    return { el: root, draw(lt) {
      its.forEach((o, i) => {
        const q = pop(lt - i * 0.08);
        const on = lt >= o.at;
        const k = E.outBack(span(lt, o.at, o.at + 0.3));
        o.it.style.opacity = q.o * (on ? 1 : 0.5);
        o.it.style.transform = `translateY(${q.y - 18 * k}px) scale(${q.s})`;
        o.it.className = "card it" + (on ? " on" : "");
      });
    } };
  };

  C.stat = (p) => {
    const root = el("div", "c-stat");
    const big = el("div", "big", root);
    if (p.label) el("div", "lb", root, rich(p.label));
    const from = p.from || 0;
    return { el: root, draw(lt) {
      const k = E.outQuint(span(lt, 0.15, 0.15 + (p.countFor || 1.3)));
      big.innerHTML = esc(p.prefix || "") + commas(from + (p.value - from) * k) + `<span class="u">${esc(p.suffix || "")}</span>`;
    } };
  };

  C.files = (p) => {
    const root = el("div", "c-files");
    const fs = (p.items || []).map((x) => {
      const f = el("div", "f", root);
      const ext = el("div", "ext", f, esc(x.ext));
      ext.style.background = x.color || "var(--accent)";
      if (x.name) el("div", "nm", f, esc(x.name));
      return f;
    });
    return { el: root, draw(lt) {
      fs.forEach((f, i) => {
        const q = pop(lt - 0.1 - i * (p.gap || 0.16), null, { from: 0.6 });
        const bob = Math.sin((lt - i * 0.4) * 2.2) * 4;
        f.style.opacity = q.o; f.style.transform = `translateY(${q.y * 2 + bob}px) scale(${q.s}) rotate(${(i - (fs.length - 1) / 2) * 2.5}deg)`;
      });
    } };
  };

  C.meter = (p) => {
    const root = el("div", "card c-meter sel");
    const lb = el("div", "lb", root);
    el("span", null, lb, rich(p.label || ""));
    const right = el("span", null, lb);
    const track = el("div", "track", root);
    const bar = el("div", "bar", track);
    const rowsEl = el("div", "rows", root);
    const rows = (p.rows || []).map((r) => {
      const e = el("div", "row", rowsEl);
      el("span", null, e, esc(r.name));
      el("span", "s", e, esc(r.size || ""));
      return { r, e };
    });
    return { el: root, draw(lt) {
      let v = p.from || 0;
      (p.steps || [{ at: 0.3, value: p.value || 0 }]).forEach((s) => { v += (s.value - v) * E.outQuint(span(lt, s.at, s.at + 0.5)); });
      bar.style.transform = `scaleX(${Math.max(0.0001, v)})`;
      right.textContent = p.right ? p.right.replace("{pct}", Math.round(v * 100) + "%") : "";
      rows.forEach(({ r, e }, i) => {
        const q = pop(lt - 0.2 - i * 0.12);
        e.style.opacity = q.o; e.style.transform = `translateX(${(1 - E.outQuint(span(lt - 0.2 - i * 0.12, 0, 0.34))) * -40}px)`;
        e.className = "row" + (r.at != null && lt >= r.at ? " on" : "");
      });
    } };
  };

  C.compare = (p) => {
    const root = el("div", "c-compare");
    const col = (side, d) => {
      const c = el("div", "card col " + side, root);
      el("div", "h", c, rich(d.title));
      return (d.rows || d.items || []).map((r) => el("div", "row", c, rich(r)));
    };
    const a = col("a", p.a || {}), b = col("b", p.b || {});
    return { el: root, draw(lt) {
      a.concat(b).forEach((r, i) => { r.style.opacity = clamp((lt - 0.2 - i * 0.12) / 0.2); });
    } };
  };

  // ================= Scene =================
  Y.scene = function (cfg) {
    const layout = cfg.layout || "split";
    const SECONDS = cfg.seconds;
    const body = document.body;
    if (cfg.look) body.dataset.look = cfg.look;
    if (cfg.accent) { body.style.setProperty("--accent", cfg.accent); }
    if (cfg.accentSoft) body.style.setProperty("--accent-soft", cfg.accentSoft);

    el("div", null, body).id = "ground";
    el("div", null, body).id = "glow";
    // Load every font at once so the renderer waits for all of them.
    const pre = el("div", null, body, '<span style="font-family:var(--f-display)">a</span><span style="font-family:var(--f-flair);font-style:italic">a</span><span style="font-family:var(--f-mono)">a</span><span style="font-family:var(--f-ui)">a</span>');
    pre.style.cssText = "position:absolute;left:-200px;top:0;opacity:0";

    // Presenter window frame (split only).
    let win = null;
    if (layout === "split") {
      const w = L.window;
      win = el("div", "mv", body);
      win.id = "window";
      Object.assign(win.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" });
      el("div", "fill", win); el("div", "edge", win);
      [[0, 0], [0.5, 0], [1, 0], [0, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1]].forEach(([fx, fy]) => {
        const h = el("div", "handle", win);
        h.style.left = (fx * w.w + (fx - 0.5) * 20 - 11) + "px";
        h.style.top = (fy * w.h + (fy - 0.5) * 20 - 11) + "px";
      });
    }

    // Head pop-out (split only): cutout stills of the presenter's head, one per
    // frame, drawn over the window's top edge. pop: {fps, frames} reads
    // pop/0001.png.. (RGBA, L.pop size) from this scene's folder; film.json
    // extracts them from pop.mov. See SKILL.md, "Head room".
    let popImg = null;
    const P = cfg.pop && layout === "split" ? cfg.pop : null;
    if (P) {
      popImg = el("img", "mv", body);
      popImg.id = "pop";
      popImg.alt = "";
      popImg.decoding = "sync";
      Object.assign(popImg.style, { left: L.pop.x + "px", top: L.pop.y + "px", width: L.pop.w + "px", height: L.pop.h + "px" });
    }
    const loadPop = (t) => {
      const n = Math.max(1, Math.min(P.frames, Math.floor(t * (P.fps || 30) + 1e-6) + 1));
      const src = `pop/${String(n).padStart(4, "0")}.png`;
      if (popImg.getAttribute("src") === src) return null;
      return new Promise((loaded, failed) => {
        popImg.onload = loaded;
        popImg.onerror = () => failed(new Error("missing still " + src));
        popImg.setAttribute("src", src);
      }).then(() => popImg.decode());
    };

    // Title header.
    let titleWords = [];
    if (cfg.title && layout !== "face") {
      const tEl = el("div", "mv", body);
      tEl.id = "title";
      tEl.style.top = L.titleTop + "px";
      titleWords = words(tEl, cfg.title.text);
    }

    // Stage and cards.
    const zone = layout === "card" ? L.card : L.split;
    const stage = el("div", "mv", body);
    stage.id = "stage";
    stage.style.top = zone.top + "px"; stage.style.height = zone.height + "px";
    const cards = (cfg.cards || []).map((c, i, all) => {
      const slot = el("div", "card-slot mv", stage);
      const made = C[c.type](c);
      slot.appendChild(made.el);
      const until = c.until != null ? c.until : (all[i + 1] ? all[i + 1].at : SECONDS);
      const scale = (c.scale || 1) * (layout === "card" && c.type !== "header" ? zone.scale : 1);
      return { c, slot, made, at: c.at || 0, until, scale };
    });

    // Notes: annotation chips at frame positions.
    const notes = (cfg.notes || []).map((n) => {
      const e = el("div", "c-note mv", body, rich(n.text));
      e.style.left = n.x + "px"; e.style.top = n.y + "px";
      return { n, e };
    });

    // Caption.
    let cap = null;
    if (layout !== "face" && cfg.captions && cfg.captions.length) {
      cap = el("div", "mv", body);
      cap.id = "caption";
      cap.style.top = (zone.caption - 40) + "px";
    }
    const caps = (cfg.captions || []).map((c) => ({ a: c[0], b: c[1], html: rich(c[2]) }));

    // CTA pill (face).
    let pill = null, pk2 = null;
    if (layout === "face" && cfg.cta) {
      const p = L.pill;
      pill = el("div", "mv", body);
      pill.id = "pill";
      Object.assign(pill.style, { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px" });
      el("div", "k1", pill, rich(cfg.cta.lead || "comment"));
      pk2 = el("div", "k2", pill, rich(cfg.cta.keyword));
      pk2.style.willChange = "transform";
    }

    // Cursor.
    let cur = null, ring = null;
    const keys = cfg.cursor || [];
    if (keys.length) {
      cur = el("div", "mv", body);
      cur.id = "cursor";
      cur.innerHTML = '<svg width="46" height="58" viewBox="0 0 46 58"><path d="M3 3 L3 47 L15 36 L23 55 L31 51 L23 33 L40 33 Z" fill="#fff" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/></svg>';
      ring = el("div", "ring", cur);
    }

    const draw = (t) => {
      // A slow push on the whole stage so a hold never freezes.
      const push = 1 + 0.018 * span(t, 0, SECONDS);
      stage.style.transform = `scale(${push})`;

      titleWords.forEach((w, i) => {
        const tt = cfg.title, until = tt.until == null ? SECONDS : tt.until;
        const q = pop(t - (tt.at || 0) - i * 0.06, until - (tt.at || 0) - i * 0.06 + i * 0.06);
        w.style.opacity = q.o; w.style.transform = `translateY(${q.y}px) scale(${q.s})`;
      });

      cards.forEach(({ c, slot, made, at, until, scale }) => {
        const lt = t - at;
        const vis = t >= at - 0.001 && t < until;
        if (!vis) { slot.style.opacity = 0; slot.style.transform = "translate(-50%, -50%) scale(0.9)"; made.draw(Math.max(0, Math.min(lt, until - at))); return; }
        const last = until >= SECONDS - 0.001;
        const q = pop(lt, last ? null : until - at, { from: c.from == null ? 0.88 : c.from });
        const hold = 1 + 0.025 * span(lt, 0.35, until - at);
        // Never wider than 1000 px on screen (40 px margins) or taller than the
        // stage, unless the scene set a scale. Measured with the card in its
        // final state, so its size never changes while it types or fills in
        // (and never depends on the frame drawn before).
        made.draw(until - at, until - at);
        const w = made.el.offsetWidth, h = made.el.offsetHeight;
        const fit = c.scale || !w ? scale : Math.min(scale, 1000 / (w * 1.03), h ? zone.height / (h * 1.03) : scale);
        made.draw(lt, until - at);
        slot.style.opacity = q.o;
        slot.style.transform = `translate(-50%, -50%) translate(${c.x || 0}px, ${(c.y || 0) + q.y}px) scale(${q.s * fit * hold})`;
      });

      notes.forEach(({ n, e }) => {
        const q = pop(t - n.at, (n.until == null ? SECONDS : n.until) - n.at);
        e.style.opacity = q.o; e.style.transform = `scale(${q.s}) rotate(${n.rot || -3}deg)`;
      });

      if (cap) {
        let cur = -1;
        caps.forEach((c, i) => { if (t >= c.a - 0.02) cur = i; });
        const c = caps[cur];
        if (c && t < (caps[cur + 1] ? caps[cur + 1].a : Math.max(c.b + 0.4, SECONDS))) {
          if (cap.dataset.i !== String(cur)) { cap.innerHTML = c.html; cap.dataset.i = String(cur); }
          const k = E.outBack(span(t, c.a - 0.02, c.a + 0.12));
          cap.style.opacity = 1; cap.style.transform = `scale(${0.88 + 0.12 * k})`;
        } else { cap.style.opacity = 0; }
      }

      if (pill) {
        const k = E.outBack(span(t, 0.12, 0.5));
        const beat = 1 + 0.03 * Math.sin(Math.max(0, t - 0.6) * 5.2) * span(t, 0.6, 1.0);
        pk2.style.transform = `scale(${(0.6 + 0.4 * k) * beat})`;
      }

      if (cur) {
        let x = keys[0].x, y = keys[0].y, click = 0;
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i], nx = keys[i + 1];
          if (t >= k.at) { x = k.x; y = k.y; if (k.click) click = Math.max(click, 1 - span(t, k.at, k.at + 0.4)) * (t < k.at + 0.4 ? 1 : 0); }
          if (nx && t >= k.at && t < nx.at) {
            const mv = E.inOutCubic(span(t, nx.at - (nx.travel || 0.5), nx.at));
            x = k.x + (nx.x - k.x) * mv; y = k.y + (nx.y - k.y) * mv;
          }
        }
        const show = span(t, keys[0].at - 0.2, keys[0].at) * (1 - span(t, (cfg.cursorUntil || SECONDS) - 0.15, cfg.cursorUntil || SECONDS));
        cur.style.opacity = show;
        cur.style.transform = `translate(${x}px, ${y}px) scale(${1 - 0.12 * click})`;
        ring.style.opacity = click; ring.style.transform = `scale(${1.6 - 0.6 * click})`;
      }
    };
    // render(t) may be async: the frame is taken once the head still has loaded.
    window.render = P ? async (t) => { await loadPop(t); draw(t); } : draw;
    window.render(0);
  };
})();
