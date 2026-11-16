/* ============================================================
   Cinematic intro (~13 s), inspired by the Project Marco Polo opener:
   kinetic words → Kerala map with lock-ons → arcs to Guruvayur → title slam.
   Exposes window.WeddingIntro.play(W, onDone) and .stop().
   ============================================================ */
window.WeddingIntro = (() => {
  const $ = (id) => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const eio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const lerp = (a, b, k) => a + (b - a) * k;

  // Stylised Kerala outline (lon, lat): coast north→south, then the Ghats south→north
  const KERALA = [
    [74.86, 12.78], [75.0, 12.5], [75.2, 12.05], [75.45, 11.8], [75.7, 11.4], [75.8, 11.1], [75.9, 10.85], [76.0, 10.6],
    [76.08, 10.35], [76.2, 10.1], [76.25, 9.9], [76.3, 9.6], [76.38, 9.3], [76.47, 9.05], [76.56, 8.88], [76.7, 8.7],
    [76.88, 8.5], [77.07, 8.28], [77.2, 8.45], [77.25, 8.75], [77.15, 9.1], [77.2, 9.45], [77.1, 9.8], [77.25, 10.1],
    [76.95, 10.25], [76.8, 10.65], [76.9, 10.85], [76.6, 11.25], [76.45, 11.55], [76.2, 11.75], [76.0, 11.95],
    [75.85, 12.15], [75.5, 12.4], [75.25, 12.65], [74.95, 12.82]
  ];
  const COSLAT = Math.cos(10.5 * Math.PI / 180);
  const inPoly = (x, y, poly) => {
    let ins = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
    }
    return ins;
  };
  const km = (a, b) => {
    const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  };
  const fmtLL = (p) => `${p.lat.toFixed(2)}°N ${p.lon.toFixed(2)}°E`;

  // Dots inside Kerala (deterministic)
  const DOTS = [];
  (() => {
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    while (DOTS.length < 1500) {
      const lon = 74.8 + rnd() * 2.5, lat = 8.2 + rnd() * 4.7;
      if (inPoly(lon, lat, KERALA)) DOTS.push({ lon, lat, seed: rnd(), d: Math.hypot((lon - 76.1) * COSLAT, lat - 10.5) });
    }
  })();

  let cv, ctx, W, H, dpr, raf = 0, running = false, tStart = 0, onDone = null, finished = false;
  let ac = null, master = null, fired = new Set();
  let S = {}; // per-run state

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
  }

  // ---------- subtle sound accents (the song plays underneath) ----------
  function audioInit() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      if (!master) { master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination); }
    } catch (_) { ac = null; }
  }
  function tone(f, v, dur, type = "sine", delay = 0) {
    if (!ac) return;
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function thump() {
    if (!ac) return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.5);
  }
  const once = (key, fn) => { if (!fired.has(key)) { fired.add(key); fn(); } };

  // ---------- map projection with a camera that can zoom toward the venue ----------
  function proj(lon, lat, out) {
    out[0] = S.cx + (lon - S.lonC) * COSLAT * S.sc;
    out[1] = S.cy - (lat - S.latC) * S.sc;
    return out;
  }

  function brackets(x, y, r, L, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x + sx * r, y + sy * (r - L)); ctx.lineTo(x + sx * r, y + sy * r); ctx.lineTo(x + sx * (r - L), y + sy * r);
      ctx.stroke();
    });
  }

  function label(x, y, side, big, small, u, fs) {
    ctx.textAlign = side > 0 ? "left" : "right";
    ctx.font = `900 ${fs}px "Inter Tight", "Helvetica Neue", Arial, sans-serif`;
    ctx.fillStyle = "#fcf8ef";
    ctx.fillText(big.slice(0, Math.ceil(big.length * clamp(u * 1.6))), x, y - 2);
    ctx.font = `700 ${Math.round(fs * 0.48)}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
    ctx.fillStyle = "#d9b45e"; ctx.globalAlpha *= clamp(u * 2 - 1);
    ctx.fillText(small, x, y + fs * 0.66);
  }

  function frame() {
    if (!running) return;
    const t = performance.now() / 1000 - tStart;
    const T = S.T;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ----- Act 1: kinetic words -----
    const wordEl = $("iWord");
    if (t < T.map) {
      let k = 0;
      while (k < S.words.length - 1 && t >= S.starts[k + 1]) k++;
      const w = S.words[k], local = (t - S.starts[k]) / w[5];
      wordEl.style.opacity = 1; wordEl.style.background = w[2]; wordEl.style.color = w[3];
      if (S.k !== k) {
        S.k = k; $("iWText").textContent = w[0]; $("iWCap").textContent = w[1];
        const ph = $("iPhoto");
        ph.classList.remove("show");
        wordEl.classList.toggle("has-photo", !!w[4]);
        if (w[4]) {
          ph.src = w[4];
          ph.style.setProperty("--tilt", (k % 2 ? 3 : -3) + "deg");
          ph.style.setProperty("--tilt-in", (k % 2 ? 9 : -9) + "deg");
          void ph.offsetWidth;
          ph.classList.add("show");
        }
      }
      const sc = 1 + 0.2 * Math.pow(1 - clamp(local * 3), 3);
      const jit = local < 0.12 ? `translate(${(Math.random() - .5) * 10}px, ${(Math.random() - .5) * 4}px)` : "";
      $("iWText").style.transform = `${jit} scale(${sc}) translateX(${(1 - ease(local * 4)) * -3}vw)`;
      $("iWCap").style.opacity = ease(local * 3 - .3);
      wordEl.style.textShadow = local < 0.15 ? "4px 0 rgba(139,35,51,.7), -4px 0 rgba(217,180,94,.7)" : "none";
    } else wordEl.style.opacity = 0;

    // ----- Act 2: map -----
    const bg = ctx.createRadialGradient(W * .55, H * .45, 0, W * .55, H * .45, Math.hypot(W, H) * .7);
    bg.addColorStop(0, "#1c3a2c"); bg.addColorStop(1, "#0a1712");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (t >= T.map - 0.05) {
      const m = t - T.map;
      const zoom = eio((t - T.venue + 0.6) / 1.6) * (1 - eio((t - T.route + 0.2) / 0.9));
      const base = Math.min(W * 0.86 / (2.75 * COSLAT), H * (W > 900 ? 0.8 : 0.72) / 4.75);
      S.sc = base * (1 + 0.5 * zoom);
      S.cx = W * (W > 900 ? 0.6 : 0.5); S.cy = H * (W > 900 ? 0.5 : 0.41);
      S.lonC = lerp(76.1, S.venue.lon, zoom * 0.6); S.latC = lerp(10.5, S.venue.lat, zoom * 0.35);
      const dim = t >= T.title ? 1 - 0.82 * ease((t - T.title) / 0.6) : 1;
      const p = [0, 0], q = [0, 0];

      // dots revealed by an expanding sweep
      const R = eio((m - 0.2) / 1.6) * 3.2;
      ctx.fillStyle = "#f1dc9e";
      for (const d of DOTS) {
        if (d.d > R) continue;
        const fresh = R - d.d < 0.18;
        proj(d.lon, d.lat, p);
        ctx.globalAlpha = dim * (fresh ? 0.95 : 0.22 + 0.2 * Math.sin(t * 3 + d.seed * 30));
        const s = fresh ? 2.2 : 1.5;
        ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      // outline drawing on
      const op = eio(m / 1.4);
      if (op > 0) {
        const pts = KERALA.map(([lo, la]) => proj(lo, la, [0, 0]));
        pts.push(pts[0]);
        let total = 0; const seg = [];
        for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
        let left = total * op;
        ctx.strokeStyle = "#d9b45e"; ctx.lineWidth = 1.6; ctx.globalAlpha = dim;
        ctx.shadowColor = "rgba(217,180,94,.8)"; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length && left > 0; i++) {
          const f = Math.min(1, left / seg[i - 1]);
          ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f));
          left -= seg[i - 1];
        }
        ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      const fs = Math.max(14, Math.min(26, H / 34));
      // lock-on labels fade out completely under the title
      const ldim = t >= T.title ? 1 - ease((t - T.title) / 0.35) : 1;

      // arcs from both hometowns to the venue
      const vp = proj(S.venue.lon, S.venue.lat, [0, 0]);
      S.pins.forEach((pin, i) => {
        const a = clamp((t - T.arcs - i * 0.15) / 1.3);
        if (a <= 0) return;
        const s0 = proj(pin.lon, pin.lat, [0, 0]);
        const mx = (s0[0] + vp[0]) / 2, my = (s0[1] + vp[1]) / 2;
        const dx = vp[0] - s0[0], dy = vp[1] - s0[1], len = Math.hypot(dx, dy) || 1;
        const bend = Math.min(160, len * 0.45) * (i ? -1 : 1);
        const c = [mx - (dy / len) * bend - Math.abs(bend) * 0.4, my + (dx / len) * bend];
        const e = eio(a);
        ctx.strokeStyle = "#f1dc9e"; ctx.lineWidth = 2; ctx.globalAlpha = dim;
        ctx.shadowColor = "rgba(241,220,158,.9)"; ctx.shadowBlur = 12;
        ctx.beginPath();
        let hx = s0[0], hy = s0[1];
        for (let k = 0; k <= 40; k++) {
          const u = (k / 40) * e;
          hx = (1 - u) * (1 - u) * s0[0] + 2 * (1 - u) * u * c[0] + u * u * vp[0];
          hy = (1 - u) * (1 - u) * s0[1] + 2 * (1 - u) * u * c[1] + u * u * vp[1];
          k ? ctx.lineTo(hx, hy) : ctx.moveTo(hx, hy);
        }
        ctx.stroke();
        if (a < 1) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx, hy, 3.5, 0, 7); ctx.fill(); }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });

      // hometown lock-ons
      S.pins.forEach((pin, i) => {
        const tk = T.pins + i * 0.75;
        if (t < tk) return;
        once("pin" + i, () => { tone(880, 0.08, 0.35); tone(1320, 0.05, 0.5, "sine", 0.06); });
        const u = clamp((t - tk) / 0.6), e = ease(u);
        proj(pin.lon, pin.lat, p);
        const r = 60 * (1 - e) + 12, L = 7 + 6 * (1 - e);
        ctx.globalAlpha = dim * ldim * (t > T.route ? 0.3 : t > T.venue + 0.8 ? 0.55 : 1);
        brackets(p[0], p[1], r, L, u < 1 ? "#fcf8ef" : "#d9b45e");
        ctx.fillStyle = "#e0566a"; ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5);
        // hometown labels step aside once the celebrations route starts
        if (t < T.route) label(p[0] + (r + 10), p[1], 1, pin.name.toUpperCase(), `${pin.city.toUpperCase()} · ${fmtLL(pin)}`, u, fs * 0.85);
        ctx.globalAlpha = 1;
      });

      // venue lock-on
      if (t >= T.venue) {
        once("venue", () => { tone(523, 0.07, 1.2); tone(659, 0.06, 1.2, "sine", 0.05); tone(784, 0.06, 1.4, "sine", 0.1); });
        const u = clamp((t - T.venue) / 0.7), e = ease(u);
        const r = 110 * (1 - e) + 20, L = 10 + 8 * (1 - e);
        ctx.globalAlpha = dim * ldim;
        for (let k = 0; k < 2; k++) {
          const ph = ((t - T.venue) * 0.9 + k * 0.5) % 1;
          ctx.strokeStyle = `rgba(241,220,158,${(1 - ph) * 0.7})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(vp[0], vp[1], 10 + ph * 70, 0, 7); ctx.stroke();
        }
        brackets(vp[0], vp[1], r, L, u < 1 ? "#fcf8ef" : "#e0566a");
        ctx.fillStyle = "#f1dc9e"; ctx.beginPath(); ctx.arc(vp[0], vp[1], 4, 0, 7); ctx.fill();
        if (W < 700) {
          // narrow screens: centre the venue label above the lock-on so nothing is cut off
          ctx.textAlign = "center";
          const vfs = fs * 1.15;
          ctx.font = `900 ${vfs}px "Inter Tight", "Helvetica Neue", Arial, sans-serif`; ctx.fillStyle = "#fcf8ef";
          const big = S.venue.city.toUpperCase();
          ctx.fillText(big.slice(0, Math.ceil(big.length * clamp(u * 1.6))), vp[0], vp[1] - r - vfs * 1.3);
          ctx.font = `700 ${Math.round(vfs * 0.42)}px "JetBrains Mono", ui-monospace, Menlo, monospace`; ctx.fillStyle = "#d9b45e";
          ctx.globalAlpha *= clamp(u * 2 - 1);
          ctx.fillText(S.venueSub, vp[0], vp[1] - r - vfs * 0.55);
        } else label(vp[0] - (r + 12), vp[1], -1, S.venue.city.toUpperCase(), S.venueSub, u, fs * 1.15);
        ctx.globalAlpha = 1;
      }

      // celebrations route: dotted line through every stop, in date order
      if (t >= T.route && S.stops.length > 1) {
        const pts = S.stops.map((st) => proj(st.lon, st.lat, [0, 0]));
        ctx.save();
        ctx.setLineDash([3, 7]); ctx.lineCap = "round";
        ctx.strokeStyle = "#f1dc9e"; ctx.lineWidth = 2.2; ctx.globalAlpha = dim * ldim;
        ctx.shadowColor = "rgba(241,220,158,.8)"; ctx.shadowBlur = 8;
        for (let i = 1; i < pts.length; i++) {
          const a = eio((t - T.route - (i - 1) * T.leg) / (T.leg * 0.75));
          if (a <= 0) break;
          ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]);
          ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], a), lerp(pts[i - 1][1], pts[i][1], a));
          ctx.stroke();
        }
        ctx.restore();
        S.stops.forEach((st, i) => {
          if (i === 0) return; // the venue already has its lock-on
          const tk = T.route + (i - 1) * T.leg + T.leg * 0.7;
          if (t < tk) return;
          once("stop" + i, () => {});
          const u = clamp((t - tk) / 0.5), e = ease(u), p2 = pts[i];
          const r = 46 * (1 - e) + 11, L = 6 + 5 * (1 - e);
          ctx.globalAlpha = dim * ldim;
          brackets(p2[0], p2[1], r, L, u < 1 ? "#fcf8ef" : "#f1dc9e");
          ctx.fillStyle = "#f1dc9e"; ctx.beginPath(); ctx.arc(p2[0], p2[1], 3.5, 0, 7); ctx.fill();
          // labels go on the sea side (left); if that would run off-screen, centre them below
          const big = st.city.toUpperCase(), sfs = fs * 0.85;
          ctx.font = `900 ${sfs}px "Inter Tight", "Helvetica Neue", Arial, sans-serif`;
          const wBig = ctx.measureText(big).width;
          if (p2[0] - (r + 10) - wBig > 8) label(p2[0] - (r + 10), p2[1], -1, big, st.sub, u, sfs);
          else {
            ctx.textAlign = "center"; ctx.fillStyle = "#fcf8ef";
            ctx.fillText(big.slice(0, Math.ceil(big.length * clamp(u * 1.6))), p2[0], p2[1] + r + sfs * 1.1);
            ctx.font = `700 ${Math.round(sfs * 0.48)}px "JetBrains Mono", ui-monospace, Menlo, monospace`; ctx.fillStyle = "#d9b45e";
            ctx.globalAlpha *= clamp(u * 2 - 1);
            ctx.fillText(st.sub, p2[0], p2[1] + r + sfs * 1.75);
          }
          ctx.globalAlpha = 1;
        });
      }
    }

    // ----- terminal log -----
    const term = $("iTerm");
    if (t >= T.map + 0.1 && t < T.title + 0.4) {
      const u = (t - T.map - 0.1) / (T.title - T.map - 0.6);
      const all = S.term.join("\n"), chars = Math.floor(clamp(u) * all.length);
      let out = "", left = chars;
      for (const l of S.term) { if (left <= 0) break; out += l.slice(0, left) + "\n"; left -= l.length + 1; }
      term.textContent = out + (Math.floor(t * 4) % 2 ? "█" : " ");
      term.style.opacity = t < T.title ? 1 : 1 - (t - T.title) / 0.4;
    } else term.style.opacity = 0;

    // ----- Act 3: title slam -----
    const ti = $("iTitle");
    if (t >= T.title) {
      once("title", () => { thump(); tone(1046, 0.05, 1.6, "sine", 0.02); });
      const u = t - T.title;
      ti.style.opacity = 1;
      const j = u < 0.5 ? (0.5 - u) * 18 : 0;
      const h1 = $("iH1");
      h1.style.textShadow = j ? `${j}px 0 rgba(224,86,106,.85), ${-j}px 0 rgba(241,220,158,.85)` : "0 0 40px rgba(217,180,94,.35)";
      h1.style.transform = `scale(${1 + 0.1 * Math.pow(1 - clamp(u / 0.35), 3)})`;
      cv.style.transform = u < 0.3 ? `translate(${(Math.random() - .5) * 10}px, ${(Math.random() - .5) * 4}px)` : "none";
      $("iSub").style.opacity = ease((u - 0.35) / 0.4);
      document.querySelectorAll("#iChips span").forEach((s, k) => {
        const v = ease((u - 0.7 - k * 0.22) / 0.25);
        s.style.opacity = v; s.style.transform = `translateY(${(1 - v) * 12}px)`;
      });
    } else ti.style.opacity = 0;

    if (t >= T.end) return finish();
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (finished) return;
    finished = true; running = false; cancelAnimationFrame(raf);
    const el = $("intro");
    el.classList.add("out");
    setTimeout(() => { el.hidden = true; el.classList.remove("out"); }, 1000);
    onDone && onDone();
  }

  function play(Wcfg, cb) {
    onDone = cb; finished = false; fired = new Set();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    const first = Wcfg.first, second = Wcfg.second, IP = Wcfg.introPins || {};
    const pin = (who, fallback) => ({ name: who.name, ...(fallback || {}) });
    const p1 = pin(first, Wcfg.brideFirst ? IP.bride : IP.groom);
    const p2 = pin(second, Wcfg.brideFirst ? IP.groom : IP.bride);
    const venue = IP.venue || { city: "Guruvayur", lat: 10.594, lon: 76.041 };
    const d = new Date(Wcfg.date);
    const f = (o) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o }).format(d);
    const dd = f({ day: "2-digit" }), mm = f({ month: "2-digit" }), yyyy = f({ year: "numeric" });
    const time = f({ hour: "2-digit", minute: "2-digit", hour12: false });
    const dist = km(p1, p2);
    const G = "#12261d", I = "#fcf8ef", M = "#8b2333", Au = "#d9b45e", Au3 = "#f1dc9e";
    const PH = Wcfg.introPhotos || {};
    const dayOf = (e) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }).format(new Date(e.date)).toUpperCase();
    const stops = [];
    Wcfg.events.filter((e) => e.date && e.lat != null).sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((e) => {
      const city = e.city || (e.address || "").split(",").pop().trim();
      let st = stops.find((x) => Math.abs(x.lat - e.lat) < 0.08 && Math.abs(x.lon - e.lon) < 0.08);
      if (!st) stops.push(st = { city, lat: e.lat, lon: e.lon, days: [], names: [] });
      if (!st.days.includes(dayOf(e))) st.days.push(dayOf(e));
      st.names.push(e.name.split("·")[0].trim().toUpperCase());
    });
    stops.forEach((st) => (st.sub = `${st.days.join(" & ")} · ${st.names.join(" + ")}`));
    S = {
      k: -1, pins: [p1, p2], venue, stops,
      venueSub: `${dd}.${mm}.${yyyy} · ${time} IST · LOCKED`,
      // [big text, caption, background, colour, photo, seconds on screen]
      words: [
        ["2", "families", I, G, PH.families, 0.95],
        ["2", `hometowns · ${p1.city} & ${p2.city}`, M, I, PH.hometowns, 1.05],
        [`${dist} km`, "apart", G, Au3, PH.apart, 0.95],
        [String(Wcfg.events.length), "celebrations", Au, G, PH.celebrations, 0.95],
        [`${dd}.${mm}`, yyyy, G, I, PH.date, 0.95],
        ["so…", "", I, M, null, 0.65],
        ["where?", "", M, Au3, null, 0.9]
      ],
      term: [].concat([
        `> locate ${p1.name.toLowerCase()} · ${p1.city.toLowerCase()}`,
        `> locate ${p2.name.toLowerCase()} · ${p2.city.toLowerCase()}`,
        `> distance ${dist} km · searching for common ground`,
        `> match: ${venue.city.toLowerCase()} · ${dd}.${mm}.${yyyy}`,
        stops.length > 1 ? `> route: ${stops.map((st) => st.city.toLowerCase()).join(' → ')}` : null,
        `> status: getting married ✓`
      ]).filter(Boolean)
    };
    S.starts = []; let acc = 0;
    S.words.forEach((w) => { S.starts.push(acc); acc += w[5]; });
    const map = acc + 0.2;
    const venueT = map + 4.3, leg = 0.85, legs = Math.max(0, S.stops.length - 1);
    const routeT = venueT + 1.2, titleT = legs ? routeT + legs * leg + 0.9 : venueT + 1.4;
    S.T = { map, pins: map + 1.5, arcs: map + 2.9, venue: venueT, route: routeT, leg, title: titleT, end: titleT + 3.7 };

    // title DOM
    $("iH1").innerHTML = `<span>${first.name}</span><span class="amp">&amp;</span><span>${second.name}</span>`;
    $("iSub").textContent = `${f({ weekday: "long" })}, ${f({ day: "numeric", month: "long", year: "numeric" })} · ${venue.city}, Kerala`;
    $("iChips").innerHTML = Wcfg.events.filter((e) => e.date).map((e) => {
      const ed = new Date(e.date);
      const day = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }).format(ed);
      return `<span>${e.name.split("·")[0].trim()} · ${(e.address || "").split(",").pop().trim()} · ${day}</span>`;
    }).join("");

    cv = $("introCanvas"); ctx = cv.getContext("2d");
    $("intro").hidden = false; cv.style.transform = "none";
    resize(); addEventListener("resize", resize);
    // No extra sound: the site's song is the only audio during the intro
    tStart = performance.now() / 1000; running = true;
    raf = requestAnimationFrame(frame);
  }

  // Preload the intro photos so they are ready by the time guests tap Open
  const PRE = [];
  Object.values((window.WEDDING && window.WEDDING.introPhotos) || {}).forEach((src) => { const im = new Image(); im.src = src; PRE.push(im); });

  return { play, stop: finish };
})();
