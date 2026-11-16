(() => {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), W);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TZ = "Asia/Kolkata";
  const fmt = (d, opts) => new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(d);

  /* ---------- Bind text from config ---------- */
  $$("[data-bind]").forEach((el) => (el.textContent = get(el.dataset.bind) || ""));
  document.title = `${W.groom.name} & ${W.bride.name} · Wedding Invitation`;

  const wDate = new Date(W.date);
  $("#heroDay").textContent = fmt(wDate, { weekday: "long" });
  $("#heroDate").textContent = fmt(wDate, { day: "numeric", month: "long" });
  $("#heroYear").textContent = fmt(wDate, { year: "numeric" });
  $("#mcDate").textContent = fmt(wDate, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  $("#footerDate").textContent = fmt(wDate, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ");
  $("#mainMap").href = W.venue.mapUrl;

  /* ---------- Calendar helpers ---------- */
  const icsStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcalUrl = (ev) => {
    const s = new Date(ev.date), e = new Date(s.getTime() + (ev.durationHours || 2) * 36e5);
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: `${ev.name} · ${W.groom.name} & ${W.bride.name}`,
      dates: `${icsStamp(s)}/${icsStamp(e)}`,
      location: `${ev.venue}, ${ev.address || ""}`,
      details: `${W.titleEnglish}\n${location.href}`
    });
    return `https://calendar.google.com/calendar/render?${p}`;
  };
  const downloadIcs = (ev) => {
    const s = new Date(ev.date), e = new Date(s.getTime() + (ev.durationHours || 2) * 36e5);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding//EN", "BEGIN:VEVENT",
      `UID:${icsStamp(s)}-${Math.random().toString(36).slice(2)}@wedding`,
      `DTSTAMP:${icsStamp(new Date())}`, `DTSTART:${icsStamp(s)}`, `DTEND:${icsStamp(e)}`,
      `SUMMARY:${ev.name} · ${W.groom.name} & ${W.bride.name}`,
      `LOCATION:${ev.venue}, ${ev.address || ""}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${ev.name.replace(/\W+/g, "-").toLowerCase()}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const addToCal = (ev) => {
    // Apple devices handle .ics natively; everyone else gets Google Calendar
    if (/iPhone|iPad|Macintosh/.test(navigator.userAgent)) downloadIcs(ev);
    else window.open(gcalUrl(ev), "_blank", "noopener");
  };
  const mainEvent = W.events.find((e) => e.highlight) || {
    name: "Wedding", date: W.date, durationHours: 2, venue: W.venue.name, address: W.venue.address
  };
  $("#mainCal").addEventListener("click", () => addToCal(mainEvent));

  /* ---------- Story ---------- */
  if (!W.story || !W.story.length) $("#story").remove();
  else $("#timeline").innerHTML = W.story.map((s) => `
    <div class="tl-item reveal">
      <div class="tl-year">${s.year}</div>
      <h4 class="tl-title">${s.title}</h4>
      <p class="tl-text">${s.text}</p>
    </div>`).join("");

  /* ---------- Events ---------- */
  const icon = {
    clock: '<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    dress: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 2h6l-1 4 4 6-2 10H8L6 12l4-6z"/></svg>'
  };
  const now = Date.now();
  $("#eventList").innerHTML = W.events.map((ev, i) => {
    const d = new Date(ev.date);
    const past = d.getTime() + (ev.durationHours || 2) * 36e5 < now;
    return `
    <article class="event reveal ${ev.highlight ? "highlight" : ""} ${past ? "past" : ""}" style="transition-delay:${i * 90}ms">
      ${ev.highlight ? '<span class="ev-badge">Main event</span>' : ""}
      <div class="ev-date">
        <span class="ev-day">${fmt(d, { day: "2-digit" })}</span>
        <span class="ev-month">${fmt(d, { month: "short" })} · ${fmt(d, { weekday: "short" })}</span>
      </div>
      <h4 class="ev-name">${ev.name}</h4>
      ${ev.malayalam ? `<p class="ev-mal">${ev.malayalam}</p>` : ""}
      <ul class="ev-meta">
        <li>${icon.clock}<span>${fmt(d, { hour: "numeric", minute: "2-digit", hour12: true })}</span></li>
        <li>${icon.pin}<span>${ev.venue}${ev.address ? `<br/><small>${ev.address}</small>` : ""}</span></li>
        ${ev.dress ? `<li>${icon.dress}<span>${ev.dress}</span></li>` : ""}
      </ul>
      <div class="ev-actions">
        ${ev.mapUrl ? `<a class="btn small" href="${ev.mapUrl}" target="_blank" rel="noopener">Directions</a>` : ""}
        <button class="btn small ghost" data-cal="${i}">Save date</button>
      </div>
    </article>`;
  }).join("");
  $$("[data-cal]").forEach((b) => b.addEventListener("click", () => addToCal(W.events[+b.dataset.cal])));

  /* ---------- Gallery ---------- */
  const grid = $("#galleryGrid");
  if (W.gallery && W.gallery.length) {
    grid.innerHTML = W.gallery.map((src) => `<figure class="reveal"><img src="${src}" loading="lazy" alt="Photo of the couple"/></figure>`).join("");
    const lb = $("#lightbox");
    grid.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      $("img", lb).src = img.src;
      lb.hidden = false;
    });
    lb.addEventListener("click", () => (lb.hidden = true));
    addEventListener("keydown", (e) => e.key === "Escape" && (lb.hidden = true));
  } else {
    const ph = [
      ["#1c3a2c", "#3f6b52", "3/4", "Pre-wedding"], ["#8b2333", "#c65a5a", "1/1", "Engagement"],
      ["#b88a2e", "#e6c77a", "4/5", "Us"], ["#3f6b52", "#9cbf9e", "1/1", "Haldi"],
      ["#5a1420", "#8b2333", "3/4", "Temple"], ["#c9a24a", "#f1dc9e", "4/3", "Sadya"]
    ];
    grid.innerHTML = ph.map(([c1, c2, ar, t]) =>
      `<figure class="reveal"><div class="frame-ph" style="--c1:${c1};--c2:${c2};--ar:${ar}"><div>${t}<small>Photo coming soon</small></div></div></figure>`
    ).join("");
  }

  /* ---------- Countdown ---------- */
  const cdEls = Object.fromEntries($$("[data-u]").map((el) => [el.dataset.u, el]));
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    let diff = wDate - Date.now();
    if (diff <= 0) {
      $("#cdTitle").textContent = Date.now() - wDate < 864e5 ? "Today is the day!" : "Happily ever after";
      Object.values(cdEls).forEach((el) => (el.textContent = "00"));
      return clearInterval(timer);
    }
    const v = {
      d: Math.floor(diff / 864e5),
      h: Math.floor((diff / 36e5) % 24),
      m: Math.floor((diff / 6e4) % 60),
      s: Math.floor((diff / 1e3) % 60)
    };
    for (const k in v) {
      const t = k === "d" ? String(v[k]).padStart(2, "0") : pad(v[k]);
      if (cdEls[k].textContent !== t) {
        cdEls[k].textContent = t;
        if (!reduced) { cdEls[k].classList.remove("tick"); void cdEls[k].offsetWidth; cdEls[k].classList.add("tick"); }
      }
    }
  };
  const timer = setInterval(tick, 1000);
  tick();

  /* ---------- RSVP via WhatsApp ---------- */
  const form = $("#rsvpForm");
  $("#rsvpNote").textContent = W.rsvpDeadline ? `Please respond by ${W.rsvpDeadline}` : "";
  const guests = form.guests;
  $$("[data-step]", form).forEach((b) =>
    b.addEventListener("click", () => {
      guests.value = Math.min(20, Math.max(1, (+guests.value || 1) + +b.dataset.step));
    })
  );
  $$("input[name=attend]", form).forEach((r) =>
    r.addEventListener("change", () => $("#guestsField").classList.toggle("hide", form.attend.value !== "Joyfully accepts"))
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) { form.name.classList.add("err"); form.name.focus(); return; }
    form.name.classList.remove("err");
    const yes = form.attend.value === "Joyfully accepts";
    const msg = [
      `🪔 *RSVP — ${W.groom.name} & ${W.bride.name}*`,
      `Name: ${name}`,
      `Response: ${form.attend.value}${yes ? ` (${guests.value} guest${guests.value > 1 ? "s" : ""})` : ""}`,
      form.wish.value.trim() ? `Wishes: ${form.wish.value.trim()}` : ""
    ].filter(Boolean).join("\n");
    if (W.rsvpWhatsApp) {
      window.open(`https://wa.me/${W.rsvpWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    } else {
      navigator.clipboard?.writeText(msg).catch(() => {});
    }
    toast(yes ? "Thank you! We can't wait to celebrate with you 💛" : "Thank you — you'll be missed 💛");
    if (yes) burst(innerWidth / 2, innerHeight / 2, 80);
    form.reset();
    $("#guestsField").classList.remove("hide");
  });

  /* ---------- Toast & share ---------- */
  let tt;
  function toast(t) {
    const el = $("#toast");
    el.textContent = t;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove("show"), 3200);
  }
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: document.title, text: `You're invited to ${W.groom.name} & ${W.bride.name}'s wedding!`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); toast("Link copied — share the love!"); }
    } catch (_) {}
  });

  /* ---------- Music ---------- */
  const audio = $("#bgm"), mBtn = $("#musicBtn");
  if (W.music) {
    audio.src = W.music;
    mBtn.hidden = false;
    mBtn.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
    audio.addEventListener("play", () => mBtn.classList.add("playing"));
    audio.addEventListener("pause", () => mBtn.classList.remove("playing"));
  }

  /* ---------- Section dots ---------- */
  const sections = $$("main section[data-label]");
  const dots = $(".dots");
  dots.innerHTML = sections.map((s) => `<a href="#${s.id}" aria-label="${s.dataset.label}"><span>${s.dataset.label}</span></a>`).join("");
  const dotObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) $$("a", dots).forEach((a) => a.classList.toggle("active", a.hash === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach((s) => dotObs.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Petals (marigold, jasmine, rose) ---------- */
  const cv = $("#petals"), ctx = cv.getContext("2d");
  const colors = ["#f4a62a", "#f7c34a", "#fffaf0", "#fff3e0", "#d9475b", "#e98a3a"];
  let P = [], dpr = 1, ambient = false;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size(); addEventListener("resize", size);
  const mk = (x, y, burstMode) => ({
    x, y,
    vx: burstMode ? (Math.random() - .5) * 9 : (Math.random() - .5) * .6,
    vy: burstMode ? -Math.random() * 9 - 2 : Math.random() * 1 + .6,
    r: burstMode ? Math.random() * 6 + 5 : Math.random() * 4 + 4,
    a: Math.random() * Math.PI * 2,
    va: (Math.random() - .5) * .08,
    sw: Math.random() * Math.PI * 2,
    c: colors[(Math.random() * colors.length) | 0],
    burst: burstMode
  });
  function burst(x, y, n) { if (reduced) return; for (let i = 0; i < n; i++) P.push(mk(x, y, true)); }
  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (ambient && P.length < 12 && Math.random() < .02) P.push(mk(Math.random() * innerWidth, -20, false));
    P = P.filter((p) => p.y < innerHeight + 30);
    for (const p of P) {
      p.sw += .03; p.vy = Math.min(p.vy + .12, 2.2); p.vx *= .985;
      p.x += p.vx + Math.sin(p.sw) * .6; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, Math.abs(Math.sin(p.sw)) * .6 + .4);
      ctx.fillStyle = p.c; ctx.globalAlpha = p.burst ? .9 : .55;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  };
  if (!reduced) requestAnimationFrame(draw);

  /* ---------- Opening gate ---------- */
  const gate = $("#gate");
  $("#openBtn").addEventListener("click", () => {
    gate.classList.add("open");
    document.body.classList.remove("locked");
    burst(innerWidth / 2, innerHeight / 2, 140);
    setTimeout(() => (ambient = true), 1200);
    if (W.music) audio.play().catch(() => {});
    setTimeout(() => gate.classList.add("gone"), 1700);
  });
  // Let people skip the gate on revisits via #home etc.
  if (location.hash && location.hash !== "#home") $("#openBtn").click();
})();
