(() => {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // Name order: groom first by default, bride first when brideFirst is set
  W.first = W.brideFirst ? W.bride : W.groom;
  W.second = W.brideFirst ? W.groom : W.bride;
  const couple = `${W.first.name} & ${W.second.name}`;
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), W);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TZ = "Asia/Kolkata";
  const fmt = (d, opts) => new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(d);

  /* ---------- Bind text from config ---------- */
  $$("[data-bind]").forEach((el) => (el.textContent = get(el.dataset.bind) || ""));
  document.title = `${couple} · Wedding Invitation`;

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
      text: `${ev.name} · ${couple}`,
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
      `SUMMARY:${ev.name} · ${couple}`,
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

  /* ---------- Hero portrait ---------- */
  if (W.heroPhoto) { $("#heroImg").src = W.heroPhoto; $("#heroImg").alt = couple; }
  else $("#heroPortrait").remove();

  /* ---------- Film (Google Drive player shown directly: one tap to play) ---------- */
  const V = W.video;
  if (!V || !V.driveId) $("#film").outerHTML = "";
  else {
    $("#filmTitle").textContent = V.title || "Our Film";
    const phone = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    if (phone) {
      // Drive's embedded player is broken on phones: open the film full screen in Drive instead
      $("#film-frame").innerHTML = `
        <a class="film-poster" id="filmLink" href="https://drive.google.com/file/d/${V.driveId}/view" target="_blank" rel="noopener">
          ${V.poster ? `<img src="${V.poster}" alt="" loading="lazy" />` : ""}
          <span class="film-play"><svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></span>
          <span class="film-cap">Watch the film · opens full screen</span>
        </a>`;
      $("#filmLink").addEventListener("click", () => window.__pauseMusic && window.__pauseMusic());
    } else {
      $("#film-frame").innerHTML =
        `<iframe id="filmFrame" src="https://drive.google.com/file/d/${V.driveId}/preview" loading="lazy" allow="autoplay; fullscreen" allowfullscreen title="${V.title || "Film"}"></iframe>`;
    }
    // Taps inside the player can't be seen directly, but focus moves into the iframe:
    // when that happens, pause the background song so the film's audio is clear.
    let inFilm = false;
    const checkFilm = () => {
      const now = !!(document.activeElement && document.activeElement.id === "filmFrame");
      if (now && !inFilm) window.__pauseMusic && window.__pauseMusic();
      inFilm = now;
    };
    addEventListener("blur", () => setTimeout(checkFilm, 0));
    setInterval(checkFilm, 500);
  }

  /* ---------- Family cards follow the name order ---------- */
  if (W.brideFirst) {
    const [groomCard, brideCard] = $$(".family-card");
    const heart = $(".family-heart");
    // bride card, heart, groom card
    groomCard.parentNode.insertBefore(brideCard, groomCard);
    groomCard.parentNode.insertBefore(heart, groomCard);
  }

  /* ---------- Private ceremony note ---------- */
  if (W.privateNote) $("#privateNote").textContent = W.privateNote;
  else $("#privateNote").hidden = true;

  /* ---------- Floating scroll prompt (hides once guests start scrolling) ---------- */
  const prompt = $("#scrollPrompt");
  const syncPrompt = () => prompt.classList.toggle("show", document.body.classList.contains("opened") && scrollY < 120);
  addEventListener("scroll", syncPrompt, { passive: true });
  setInterval(syncPrompt, 800);

  /* ---------- Notes ---------- */
  const notesEl = $("#notes");
  if (W.notes && W.notes.length) notesEl.innerHTML = W.notes.map((n) => `<li>${n}</li>`).join("");
  else notesEl.hidden = true;

  /* ---------- Story ---------- */
  if (!W.story || !W.story.length) $("#story").outerHTML = "";
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
  $("#eventList").dataset.count = W.events.length;
  $("#eventList").innerHTML = W.events.map((ev, i) => {
    const d = ev.date ? new Date(ev.date) : null;
    const past = d && d.getTime() + (ev.durationHours || 2) * 36e5 < now;
    const when = ev.timeText || (d ? fmt(d, { hour: "numeric", minute: "2-digit", hour12: true }) : "Time to be announced");
    return `
    <article class="event reveal ${ev.highlight ? "highlight" : ""} ${past ? "past" : ""}" style="transition-delay:${i * 90}ms">
      ${ev.highlight ? '<span class="ev-badge">Main event</span>' : ""}
      <div class="ev-date">
        ${d
          ? `<span class="ev-day">${fmt(d, { day: "2-digit" })}</span>
             <span class="ev-month">${fmt(d, { month: "short" })} · ${fmt(d, { weekday: "short" })}</span>`
          : `<span class="ev-day tba">Soon</span><span class="ev-month">Date to be announced</span>`}
      </div>
      <h4 class="ev-name">${ev.name}</h4>
      <ul class="ev-meta">
        <li>${icon.clock}<span>${when}</span></li>
        <li>${icon.pin}<span>${ev.venue}${ev.address ? `<br/><small>${ev.address}</small>` : ""}</span></li>
        ${ev.dress ? `<li>${icon.dress}<span>${ev.dress}</span></li>` : ""}
      </ul>
      <div class="ev-actions">
        ${ev.mapUrl ? `<a class="btn small" href="${ev.mapUrl}" target="_blank" rel="noopener">Directions</a>` : ""}
        ${d ? `<button class="btn small ghost" data-cal="${i}">Save date</button>` : ""}
      </div>
    </article>`;
  }).join("");
  $$("[data-cal]").forEach((b) => b.addEventListener("click", () => addToCal(W.events[+b.dataset.cal])));

  /* ---------- Gallery ---------- */
  const grid = $("#galleryGrid");
  if (W.gallery && W.gallery.length) {
    grid.innerHTML = W.gallery.map((src, i) => `<figure class="reveal" style="transition-delay:${(i % 3) * 120}ms"><img src="${src}" loading="lazy" alt="${couple}"/></figure>`).join("");
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
  const picks = $("#eventPicks");
  picks.innerHTML = W.events.map((ev, i) => {
    if (ev.rsvp === false) return "";
    const d = ev.date ? new Date(ev.date) : null;
    const when = d ? fmt(d, { day: "numeric", month: "short" }) : "Date TBA";
    return `<label><input type="checkbox" name="events" value="${i}" checked /><b>${ev.name}<small>${when} · ${ev.venue.split(",")[0]}</small></b></label>`;
  }).join("");
  const syncAttend = () => {
    const no = form.attend.value !== "Joyfully accepts";
    $("#guestsField").classList.toggle("hide", no);
    $("#eventsField").classList.toggle("hide", no);
  };
  $$("input[name=attend]", form).forEach((r) => r.addEventListener("change", syncAttend));
  picks.addEventListener("change", () => picks.classList.remove("err"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) { form.name.classList.add("err"); form.name.focus(); return; }
    form.name.classList.remove("err");
    const yes = form.attend.value === "Joyfully accepts";
    const chosen = $$("input[name=events]:checked", form).map((c) => W.events[+c.value]);
    if (yes && !chosen.length) { picks.classList.add("err"); toast("Pick at least one celebration"); return; }
    const msg = [
      `🪔 *RSVP — ${couple}*`,
      `Name: ${name}`,
      `Response: ${form.attend.value}${yes ? ` (${guests.value} guest${guests.value > 1 ? "s" : ""})` : ""}`,
      yes ? `Attending:\n${chosen.map((ev) => `• ${ev.name}`).join("\n")}` : "",
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
    syncAttend();
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
    const data = { title: document.title, text: `You're invited to ${couple}'s wedding!`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); toast("Link copied — share the love!"); }
    } catch (_) {}
  });

  /* ---------- Music (YouTube or own file) ---------- */
  const S = W.song || {};
  const jb = $("#jukebox"), audio = $("#bgm");
  let yt = null, ytReady = false, wantPlay = false, playing = false, warming = false;
  // The Open button waits until the player is ready, so the tap itself starts the song
  const openBtn = $("#openBtn");
  const armOpen = () => { openBtn.disabled = false; openBtn.classList.remove("loading"); openBtn.textContent = "Open invitation"; };
  const setPlaying = (v) => {
    playing = v;
    jb.classList.toggle("playing", v);
    jb.classList.remove("nudge");
    document.body.classList.toggle("beat", v && !reduced);
  };
  const music = {
    play() {
      wantPlay = true;
      if (S.file) audio.play().catch(() => jb.classList.add("nudge"));
      else if (ytReady) { yt.unMute(); yt.setVolume(75); yt.playVideo(); }
      setTimeout(() => { if (wantPlay && !playing) jb.classList.add("nudge"); }, 2500);
    },
    pause() {
      wantPlay = false;
      if (S.file) audio.pause();
      else if (ytReady) yt.pauseVideo();
    },
    toggle() { playing ? this.pause() : this.play(); }
  };
  window.__pauseMusic = () => music.pause();
  if (S.youtubeId || S.file) {
    jb.hidden = false;
    $("#npTitle").textContent = S.title || "Our song";
    $("#npArtist").textContent = S.artist || "";
    document.documentElement.style.setProperty("--beat", `${60 / (S.bpm || 120)}s`);
    $("#vinylBtn").addEventListener("click", () => music.toggle());
    $("#vinylBtn").title = `${S.title}${S.artist ? " · " + S.artist : ""}`;
    $("#npExpand").addEventListener("click", () => jb.classList.toggle("expanded"));
    if (S.file) {
      audio.src = S.file;
      audio.loop = false;
      audio.addEventListener("loadedmetadata", () => { if (S.start) audio.currentTime = S.start; }, { once: true });
      audio.addEventListener("ended", () => { audio.currentTime = S.start || 0; audio.play(); });
      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
    } else {
      openBtn.disabled = true; openBtn.classList.add("loading"); openBtn.textContent = "Getting ready…";
      setTimeout(armOpen, 6000); // never keep guests waiting on a slow connection
      window.onYouTubeIframeAPIReady = () => {
        yt = new YT.Player("ytHost", {
          width: 240, height: 135, videoId: S.youtubeId,
          playerVars: { playsinline: 1, rel: 0, modestbranding: 1, start: S.start || 0 },
          events: {
            onReady: () => {
              ytReady = true; armOpen();
              if (wantPlay) { yt.unMute(); yt.setVolume(75); yt.playVideo(); return; }
              // Pre-buffer silently so the song starts the instant guests tap Open
              warming = true; yt.mute(); yt.playVideo();
              setTimeout(() => { if (warming && !wantPlay) { warming = false; yt.pauseVideo(); } }, 4000);
            },
            onStateChange: (e) => {
              if (warming && e.data === YT.PlayerState.PLAYING) {
                warming = false;
                if (!wantPlay) { yt.pauseVideo(); yt.seekTo(S.start || 0, true); return; }
                yt.unMute(); yt.setVolume(75);
              }
              if (e.data === YT.PlayerState.PLAYING) setPlaying(wantPlay);
              else if (e.data === YT.PlayerState.ENDED && wantPlay) { yt.seekTo(S.start || 0, true); yt.playVideo(); }
              else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) setPlaying(false);
            },
            onError: () => { jb.hidden = true; }
          }
        });
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }

  /* ---------- Marquee ---------- */
  const fmtShort = (d) => fmt(d, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ");
  const city = (ev) => (ev.address || "").split(",").pop().trim();
  const line1 = ["Save the date", fmtShort(wDate), W.venue.city || "Guruvayur", `${couple}`];
  const line2 = W.events.filter((e) => e.date).map((e) => `${e.name.split("·")[0].trim()} · ${city(e)} · ${fmt(new Date(e.date), { day: "numeric", month: "short" })}`);
  const fill = (el, items) => {
    const chunk = items.map((t) => `<span>${t}</span><b>✦</b>`).join("");
    // Keep the strip short: iOS Safari stops drawing very wide animated layers.
    // Two identical halves, each just wide enough to cover the screen.
    el.innerHTML = chunk;
    const reps = Math.max(1, Math.ceil((innerWidth * 1.1) / el.scrollWidth));
    el.innerHTML = chunk.repeat(reps * 2);
  };
  fill($("#mq1"), line1);
  fill($("#mq2"), line2);

  /* ---------- Hero names: split letters ---------- */
  $$("#heroNames .script-name").forEach((el) => {
    const text = el.textContent;
    let i = 0;
    // Letters are grouped per word so a name never breaks mid-word
    el.innerHTML = text.split(" ").map((word) =>
      `<span class="word">${[...word].map((c) => `<span class="ch" style="--i:${i++}">${c}</span>`).join("")}</span>`
    ).join(" ");
    if (text.length > 8) el.classList.add("long");
  });

  /* ---------- Scroll progress + hero tilt ---------- */
  const bar = $("#progressBar");
  addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  }, { passive: true });

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

  /* ---------- Canvas: petals, fireworks, sparkles ---------- */
  const cv = $("#petals"), ctx = cv.getContext("2d");
  const colors = ["#f4a62a", "#f7c34a", "#fffaf0", "#fff3e0", "#d9475b", "#e98a3a"];
  const fwColors = ["#c9952a", "#e0ae3c", "#d94a64", "#b3263c", "#f08a24", "#a8761c"];
  let P = [], R = [], K = [], dpr = 1, ambient = false;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size(); addEventListener("resize", size);

  const mk = (x, y, burstMode) => ({
    x, y,
    vx: burstMode ? rnd(-4.5, 4.5) : rnd(-.3, .3),
    vy: burstMode ? -rnd(2, 11) : rnd(.6, 1.6),
    r: burstMode ? rnd(5, 11) : rnd(4, 8),
    a: rnd(0, 6.3), va: rnd(-.04, .04), sw: rnd(0, 6.3),
    c: pick(colors), burst: burstMode
  });
  function burst(x, y, n) { if (reduced) return; for (let i = 0; i < n; i++) P.push(mk(x, y, true)); }

  function explode(x, y, c, heart) {
    const n = heart ? 90 : 70;
    for (let i = 0; i < n; i++) {
      let vx, vy;
      if (heart) {
        const t = (i / n) * Math.PI * 2, s = rnd(.22, .26);
        vx = 16 * Math.sin(t) ** 3 * s;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s;
      } else {
        const a = (i / n) * Math.PI * 2, sp = rnd(1.5, 5.5);
        vx = Math.cos(a) * sp; vy = Math.sin(a) * sp;
      }
      K.push({ x, y, vx, vy, life: 1, decay: rnd(.009, .016), c: Math.random() < .25 ? "#e9c46a" : c, r: rnd(1.4, 2.6), g: heart ? .025 : .05 });
    }
  }
  function firework(x, y, heart) {
    if (reduced) return;
    const tx = x ?? innerWidth * rnd(.15, .85), ty = y ?? innerHeight * rnd(.12, .4);
    R.push({ x: tx + rnd(-60, 60), y: innerHeight + 10, tx, ty, c: pick(fwColors), heart });
  }
  function volley(n, gap = 260, heartFirst = false) {
    for (let i = 0; i < n; i++) setTimeout(() => firework(undefined, undefined, heartFirst && i === 0), i * gap);
  }
  function sparkle(x, y, n = 1, spread = 1.2) {
    for (let i = 0; i < n; i++)
      K.push({ x, y, vx: rnd(-spread, spread), vy: rnd(-spread, spread * .5), life: .9, decay: rnd(.025, .045), c: pick(["#d4a537", "#e9c46a", "#c9952a"]), r: rnd(.8, 2), g: .03 });
  }

  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (ambient && P.length < 12 && Math.random() < .02) P.push(mk(rnd(0, innerWidth), -20, false));
    P = P.filter((p) => p.y < innerHeight + 30);
    for (const p of P) {
      p.sw += .03; p.vy = Math.min(p.vy + .12, 2.2); p.vx *= .985;
      p.x += p.vx + Math.sin(p.sw) * .6; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, Math.abs(Math.sin(p.sw)) * .6 + .4);
      ctx.fillStyle = p.c; ctx.globalAlpha = p.burst ? .9 : .55;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
        R = R.filter((r) => {
      const dy = r.ty - r.y;
      r.y += Math.max(dy * .06, -14) - 2; r.x += (r.tx - r.x) * .06;
      ctx.globalAlpha = 1; ctx.fillStyle = "#c9952a";
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, 7); ctx.fill();
      sparkle(r.x, r.y + 4, 1, .4);
      if (r.y <= r.ty + 4) { explode(r.x, r.y, r.c, r.heart); return false; }
      return true;
    });
    K = K.filter((k) => k.life > 0);
    for (const k of K) {
      k.vx *= .975; k.vy = k.vy * .975 + k.g; k.x += k.vx; k.y += k.vy; k.life -= k.decay;
      ctx.globalAlpha = Math.max(k.life, 0); ctx.fillStyle = k.c;
      ctx.beginPath(); ctx.arc(k.x, k.y, k.r * (k.life + .3), 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  if (!reduced) requestAnimationFrame(draw);

  // Sparkle trail (mouse) and tap hearts (touch/click on empty space)
  if (!reduced) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = performance.now();
      if (t - last > 40) { sparkle(e.clientX, e.clientY, 1, .6); last = t; }
    }, { passive: true });
    addEventListener("pointerdown", (e) => {
      if (e.target.closest("a, button, input, textarea, label, .jukebox, #gate")) return;
      sparkle(e.clientX, e.clientY, 14, 2.2);
    });
  }

  // Easter egg: tap the names three times
  let taps = [];
  $("#heroNames").addEventListener("click", () => {
    const now2 = Date.now();
    taps = taps.filter((t) => now2 - t < 1500).concat(now2);
    if (taps.length >= 3) { taps = []; volley(6, 200); }
  });
  const celebrate = $("#celebrateBtn");
  if (celebrate) celebrate.addEventListener("click", () => { volley(10, 200); burst(innerWidth / 2, innerHeight, 60); });

  // When the countdown scrolls into view the first time, pop a couple of fireworks
  const cdObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting && document.body.classList.contains("opened")) { volley(3, 300); cdObs.disconnect(); }
  }), { threshold: .5 });
  cdObs.observe($("#countdown"));

  /* ---------- Opening gate ---------- */
  const gate = $("#gate");
  $("#startK").textContent = `Wedding invitation · ${fmt(wDate, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".")}`;
  let started = false, revealed = false;
  const reveal = (celebrate = true) => {
    if (revealed) return;
    revealed = true;
    gate.classList.add("gone");
    document.body.classList.remove("locked");
    document.body.classList.add("opened");
    if (celebrate) {
      burst(innerWidth / 2, innerHeight / 2, 120);
      setTimeout(() => volley(6, 280, true), 400);
    }
    setTimeout(() => (ambient = true), 1200);
  };
  $("#openBtn").addEventListener("click", () => {
    if (started) return;
    started = true;
    music.play();
    gate.classList.add("leaving");
    setTimeout(() => gate.classList.add("gone"), 500);
    if (window.WeddingIntro) window.WeddingIntro.play(W, () => reveal(true));
    else reveal(true);
  });
  $("#skipIntro").addEventListener("click", () => {
    if (started) return;
    started = true;
    music.play();
    reveal(true);
  });
  $("#iSkip").addEventListener("click", () => window.WeddingIntro && window.WeddingIntro.stop());
  // Let people skip the gate when linked straight to a section
  if (location.hash && location.hash !== "#home") {
    started = true;
    reveal(false);
  }
})();
