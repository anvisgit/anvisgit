

(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- BOOT SEQUENCE ---------------- */
  var bootLinesEl = document.getElementById('boot-lines');
  var bootScreen = document.getElementById('boot-screen');
  var bootSkip = document.getElementById('boot-skip');
  var mainShell = document.getElementById('main-shell');
  var rockyWrap = document.getElementById('rocky-wrap');
  var landing = document.getElementById('landing');

  /* Rocky lives on the Intro content page only — never on the Home
     (landing) splash or the Projects/Writing/Experience/Campus pages. */
  function updateRockyVisibility() {
    if (!rockyWrap) return;
    var pageIntro = document.getElementById('page-intro');
    var introVisible = pageIntro && pageIntro.classList.contains('active');
    if (bootDone && introVisible) {
      rockyWrap.classList.remove('rocky-hidden');
    } else {
      rockyWrap.classList.add('rocky-hidden');
    }
  }

  var BOOT_LINES = [
    { text: 'INIT larpland_os v2.6.26 ...', type: 'ok' },
    { text: 'mounting /dev/curiosity ...', type: 'ok' },
    { text: 'loading personality module ...', type: 'ok' },
    { text: 'calibrating sarcasm levels ...', type: 'warn' },
    { text: 'contacting mission control, Chennai ...', type: 'ok' },
    { text: 'spinning up solar navigation array ...', type: 'ok' },
    { text: 'waking Rocky (Eridian life form) ...', type: 'ok' },
    { text: 'all systems nominal. welcome aboard.', type: 'ok' }
  ];

  var bootDone = false;
  var bootStarted = false;

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    if (bootScreen) {
      bootScreen.style.transition = 'opacity .5s ease';
      bootScreen.style.opacity = '0';
      setTimeout(function () {
        bootScreen.style.display = 'none';
      }, 520);
    }
    if (mainShell) mainShell.classList.add('visible');
    updateRockyVisibility();
  }

  function runBoot() {
    if (bootStarted) return;
    bootStarted = true;
    if (!bootLinesEl) { finishBoot(); return; }
    var i = 0;
    function nextLine() {
      if (bootDone) return;
      if (i >= BOOT_LINES.length) {
        setTimeout(finishBoot, 500);
        return;
      }
      var line = BOOT_LINES[i];
      var span = document.createElement('span');
      span.className = 'boot-line' + (line.type ? ' ' + line.type : '');
      span.textContent = line.text;
      bootLinesEl.appendChild(span);
      // fade this line in
      requestAnimationFrame(function () {
        span.style.transition = 'opacity .25s ease';
        span.style.opacity = '1';
      });
      i++;
      setTimeout(nextLine, 260);
    }
    nextLine();
  }

  if (bootSkip) bootSkip.addEventListener('click', finishBoot);
  document.addEventListener('DOMContentLoaded', runBoot);
  // Safety net: never let the boot screen trap the site for more than a few seconds
  setTimeout(finishBoot, 4500);

  /* ---------------- STARFIELD CANVAS ---------------- */
  var canvas = document.getElementById('cosmos');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H;

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var stars = Array.from({ length: 300 }, function () {
      return {
        x: Math.random(),
        y: Math.random(),
        r: 0.25 + Math.random() * 1.1,
        baseA: 0.18 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        spd: 0.007 + Math.random() * 0.022,
        cross: Math.random() > 0.85
      };
    });

    var shooters = [];
    var nextShot = 3000 + Math.random() * 2000;
    var shotAcc = 0;
    var lastFrame = performance.now();

    function makeGalPts(n) {
      return Array.from({ length: n }, function () {
        var a = Math.random() * Math.PI * 2;
        var d = Math.pow(Math.random(), 1.8);
        return {
          nx: Math.cos(a) * d,
          ny: Math.sin(a) * d * 0.48,
          r: 0.12 + Math.random() * 0.72,
          a: 0.06 + Math.random() * 0.30,
          phase: Math.random() * Math.PI * 2,
          spd: 0.002 + Math.random() * 0.005
        };
      });
    }
    var galaxies = [
      { fx: 0.80, fy: 0.20, fr: 0.085, pts: makeGalPts(160) },
      { fx: 0.14, fy: 0.78, fr: 0.055, pts: makeGalPts(100) }
    ];

    function spawnShooter() {
      var fromTop = Math.random() > 0.3;
      var sx, sy, angle;
      if (fromTop) {
        sx = Math.random() * W;
        sy = -8;
        angle = Math.PI * (0.2 + Math.random() * 0.35);
      } else {
        sx = -8;
        sy = Math.random() * H * 0.65;
        angle = Math.PI * (-0.08 + Math.random() * 0.16);
      }
      var speed = 6 + Math.random() * 5;
      shooters.push({
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.010 + Math.random() * 0.009,
        trail: [],
        trailMax: 28 + Math.floor(Math.random() * 16)
      });
    }

    function draw(now) {
      var dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      shotAcc += dt;
      if (shotAcc >= nextShot) {
        spawnShooter();
        shotAcc = 0;
        nextShot = 3000 + Math.random() * 2000;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      stars.forEach(function (s) {
        s.phase += s.spd;
        var tw = s.baseA * (0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(s.phase)), 1.4));
        if (tw < 0.04) return;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240,240,255,' + tw + ')';
        ctx.fill();
        if (s.cross && s.r > 0.75 && tw > 0.45) {
          var len = s.r * 4.5 * tw;
          ctx.strokeStyle = 'rgba(210,215,255,' + (tw * 0.4) + ')';
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(s.x * W - len, s.y * H);
          ctx.lineTo(s.x * W + len, s.y * H);
          ctx.moveTo(s.x * W, s.y * H - len);
          ctx.lineTo(s.x * W, s.y * H + len);
          ctx.stroke();
        }
      });

      ctx.globalCompositeOperation = 'screen';
      galaxies.forEach(function (g) {
        var gcx = g.fx * W, gcy = g.fy * H, gr = g.fr * Math.min(W, H);
        var cg = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, gr);
        cg.addColorStop(0, 'hsla(230,40%,70%,.18)');
        cg.addColorStop(0.72, 'hsla(210,20%,35%,.04)');
        cg.addColorStop(1, 'hsla(200,10%,10%,0)');
        ctx.beginPath();
        ctx.arc(gcx, gcy, gr, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
        g.pts.forEach(function (p) {
          p.phase += p.spd;
          ctx.beginPath();
          ctx.arc(gcx + p.nx * gr, gcy + p.ny * gr, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(220,225,255,' + (p.a * (0.35 + 0.65 * Math.abs(Math.sin(p.phase)))) + ')';
          ctx.fill();
        });
      });

      ctx.globalCompositeOperation = 'source-over';
      shooters = shooters.filter(function (s) { return s.life > 0; });
      shooters.forEach(function (s) {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > s.trailMax) s.trail.shift();
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        for (var i = 1; i < s.trail.length; i++) {
          var prog = i / s.trail.length;
          ctx.beginPath();
          ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
          ctx.lineTo(s.trail[i].x, s.trail[i].y);
          ctx.strokeStyle = 'rgba(235,235,255,' + (prog * s.life * 0.82) + ')';
          ctx.lineWidth = prog * 1.8;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ---------------- CLOCK WIDGET ---------------- */
  var clockTime = document.getElementById('clock-time');
  var clockSidereal = document.getElementById('clock-sidereal');
  var clockJd = document.getElementById('clock-jd');
  var clockConstellation = document.getElementById('clock-constellation');

  var ZODIAC = [
    { name: 'Capricornus', from: [12, 22], to: [1, 19] },
    { name: 'Aquarius', from: [1, 20], to: [2, 18] },
    { name: 'Pisces', from: [2, 19], to: [3, 20] },
    { name: 'Aries', from: [3, 21], to: [4, 19] },
    { name: 'Taurus', from: [4, 20], to: [5, 20] },
    { name: 'Gemini', from: [5, 21], to: [6, 20] },
    { name: 'Cancer', from: [6, 21], to: [7, 22] },
    { name: 'Leo', from: [7, 23], to: [8, 22] },
    { name: 'Virgo', from: [8, 23], to: [9, 22] },
    { name: 'Libra', from: [9, 23], to: [10, 22] },
    { name: 'Scorpius', from: [10, 23], to: [11, 21] },
    { name: 'Sagittarius', from: [11, 22], to: [12, 21] }
  ];

  function getConstellation(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    for (var i = 0; i < ZODIAC.length; i++) {
      var z = ZODIAC[i];
      var fromM = z.from[0], fromD = z.from[1], toM = z.to[0], toD = z.to[1];
      if (fromM <= toM) {
        if ((m === fromM && day >= fromD) || (m === toM && day <= toD) || (m > fromM && m < toM)) return z.name;
      } else {
        if ((m === fromM && day >= fromD) || (m === toM && day <= toD) || m > fromM || m < toM) return z.name;
      }
    }
    return '----------';
  }

  function julianDate(d) {
    return (d.getTime() / 86400000) + 2440587.5;
  }

  function siderealTime(d, jd) {
    var T = (jd - 2451545.0) / 36525.0;
    var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T - (T * T * T) / 38710000;
    gmst = ((gmst % 360) + 360) % 360;
    var lonOffsetHours = 80.2707 / 15; // Chennai approx longitude / 15
    var lst = (gmst / 15 + lonOffsetHours) % 24;
    if (lst < 0) lst += 24;
    var h = Math.floor(lst);
    var m = Math.floor((lst - h) * 60);
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  var footerTimeEls = document.querySelectorAll('.footer-time-val');
  var footerSignalEls = document.querySelectorAll('.footer-signal-val');
  var SIGNAL_VALUES = ['-83dB', '-84dB', '-86dB', '-82dB', '-85dB'];
  var clockTicks = 0;

  function updateClock() {
    var now = new Date();
    var hms = pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
    if (clockTime) clockTime.textContent = hms;
    var jd = julianDate(now);
    if (clockJd) clockJd.textContent = 'JD ' + jd.toFixed(5);
    if (clockSidereal) clockSidereal.textContent = 'LST ' + siderealTime(now, jd);
    if (clockConstellation) clockConstellation.textContent = '\u2191 ' + getConstellation(now);
    for (var ft = 0; ft < footerTimeEls.length; ft++) footerTimeEls[ft].textContent = hms;
    clockTicks++;
    if (footerSignalEls.length && clockTicks % 7 === 0) {
      var sig = SIGNAL_VALUES[Math.floor(Math.random() * SIGNAL_VALUES.length)];
      for (var fs = 0; fs < footerSignalEls.length; fs++) footerSignalEls[fs].textContent = sig;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ---------------- INTRO CURSOR: GREEN LIGHT + TYPE FIELD ----------------
     On the landing/intro screen only, the OS cursor is replaced by a small
     green point-light. As it nears the wordmark, each letter is pushed and
     very slightly compressed, as if the light carries a physical field.
     Off the landing screen the cursor and field are both inert. */
  (function () {
    var cursorLight = document.getElementById('cursor-light');
    var letters = document.querySelectorAll('.jam-letter');
    if (REDUCED_MOTION || (!cursorLight && !letters.length)) return;

    var RADIUS = 130;      // px, field influence range
    var MAX_PUSH = 14;     // px, max displacement
    var MAX_SQUEEZE = 0.05; // max fractional scale distortion
    var LERP = 0.10;       // spring stiffness (lower = softer)

    var state = [];
    letters.forEach(function (el, i) {
      var cs = getComputedStyle(el);
      var baseR = cs.getPropertyValue('--r').trim() || '0deg';
      var baseY = parseFloat(cs.getPropertyValue('--y')) || 0;
      state.push({ el: el, baseR: baseR, baseY: baseY, phase: i * 0.85, curX: 0, curY: 0, curS: 1, rect: null });
    });

    var mouseX = -9999, mouseY = -9999;
    var mouseActive = false;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY; mouseActive = true;
      if (cursorLight) {
        cursorLight.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
      }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { mouseActive = false; });

    function refreshRects() {
      state.forEach(function (s) {
        s.rect = s.el.getBoundingClientRect();
      });
    }
    refreshRects();
    window.addEventListener('resize', refreshRects);

    var t = 0;
    function tick() {
      t += 1;
      var landingVisible = landing && landing.style.display !== 'none';
      if (cursorLight) {
        cursorLight.classList.toggle('active', landingVisible && mouseActive);
      }
      if (landingVisible) {
        state.forEach(function (s) {
          var idleY = Math.sin(t * 0.012 + s.phase) * 2.4;
          var targetX = 0, targetY = 0, targetS = 1;
          if (mouseActive && s.rect) {
            var cx = s.rect.left + s.rect.width / 2;
            var cy = s.rect.top + s.rect.height / 2;
            var dx = cx - mouseX, dy = cy - mouseY;
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < RADIUS) {
              var force = (1 - dist / RADIUS);
              targetX = (dx / dist) * force * MAX_PUSH;
              targetY = (dy / dist) * force * MAX_PUSH;
              targetS = 1 - force * MAX_SQUEEZE;
            }
          }
          s.curX += (targetX - s.curX) * LERP;
          s.curY += (targetY - s.curY) * LERP;
          s.curS += (targetS - s.curS) * LERP;
          s.el.style.transform =
            'rotate(' + s.baseR + ') translate(' + s.curX.toFixed(2) + 'px,' +
            (s.baseY + idleY + s.curY).toFixed(2) + 'px) scale(' + s.curS.toFixed(3) + ')';
        });
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // rects shift once boot screen clears / layout settles
    setTimeout(refreshRects, 700);
    setTimeout(refreshRects, 1600);
  })();

  /* ---------------- SOLAR SYSTEM LANDING NAV ---------------- */
  var solarStage = document.getElementById('solar-stage');
  var VIEWBOX_W = 900, VIEWBOX_H = 520;

  function positionPlanets() {
    if (!solarStage) return;
    var buttons = solarStage.querySelectorAll('.sol-planet-btn[data-svgx]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var x = parseFloat(btn.getAttribute('data-svgx'));
      var y = parseFloat(btn.getAttribute('data-svgy'));
      btn.style.left = (x / VIEWBOX_W * 100) + '%';
      btn.style.top = (y / VIEWBOX_H * 100) + '%';
    }
  }
  positionPlanets();
  window.addEventListener('resize', positionPlanets);

  /* ---------------- PROJECT MASK-REVEAL TRACKING ---------------- */
  (function () {
    var items = document.querySelectorAll('.proj-item');
    if (!items.length) return;
    items.forEach(function (item) {
      var panel = item.querySelector('.proj-reveal');
      if (!panel) return;
      item.addEventListener('mousemove', function (e) {
        // clip-path percentages are relative to the panel's own box, not the card
        var r = panel.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width) * 100;
        var my = ((e.clientY - r.top) / r.height) * 100;
        panel.style.setProperty('--mx', mx + '%');
        panel.style.setProperty('--my', my + '%');
      }, { passive: true });
    });
  })();

  /* ---------------- PAGE ROUTING ---------------- */
  var contentShell = document.getElementById('content-shell');
  var pages = document.querySelectorAll('.page');
  var mnavButtons = document.querySelectorAll('.mnav-btn');

  window.showPage = function (name) {
    if (landing) landing.style.display = 'none';
    if (contentShell) contentShell.classList.add('visible');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
    var target = document.getElementById('page-' + name);
    if (target) target.classList.add('active');
    for (var j = 0; j < mnavButtons.length; j++) {
      mnavButtons[j].classList.toggle('active', mnavButtons[j].id === 'mnav-' + name);
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    updateRockyVisibility();
    fireMissionToast(name);
  };

  /* ---------------- MISSION-LOG TOAST ----------------
     Fires once per page per visit, echoing each section's own
     CATALOG id (pulled straight from the .sec-cat markup already
     on the page) so it reads like a real log entry, not a generic pop-up. */
  var visitedPages = {};
  var missionToast = document.getElementById('mission-toast');
  var missionToastBody = document.getElementById('mission-toast-body');
  var missionToastSub = document.getElementById('mission-toast-sub');
  var missionToastTimer = null;

  var PAGE_LABELS = {
    intro: 'EARTH-01 · HOME BASE',
    projects: null,   /* pulled live from .sec-cat when present */
    writing: null,
    experience: null,
    campus: null
  };

  function fireMissionToast(name) {
    if (!missionToast || visitedPages[name]) return;
    visitedPages[name] = true;

    var label = PAGE_LABELS[name];
    if (!label) {
      var target = document.getElementById('page-' + name);
      var catEl = target && target.querySelector('.sec-cat');
      label = catEl ? catEl.textContent : name.toUpperCase();
    }
    if (missionToastBody) missionToastBody.textContent = name.charAt(0).toUpperCase() + name.slice(1) + ' logged.';
    if (missionToastSub) missionToastSub.textContent = label;

    clearTimeout(missionToastTimer);
    missionToast.classList.add('show');
    missionToastTimer = setTimeout(function () {
      missionToast.classList.remove('show');
    }, 3200);
  }

  window.showLanding = function () {
    if (contentShell) contentShell.classList.remove('visible');
    if (landing) landing.style.display = 'flex';
    for (var j = 0; j < mnavButtons.length; j++) mnavButtons[j].classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'auto' });
    updateRockyVisibility();
  };

  /* ---------------- PLANET-NAV MASK TRANSITION ----------------
     Selecting a destination IS the transition: the viewport "irises"
     shut around the point you clicked, the new page swaps in underneath,
     then the iris opens back up on the destination. */
  var transitionWipe = document.getElementById('transition-wipe');
  var wipeBusy = false;

  window.handleDestinationClick = function (evt, name) {
    if (wipeBusy) return;
    if (!transitionWipe || REDUCED_MOTION) {
      window.showPage(name);
      return;
    }
    wipeBusy = true;
    var x = (evt && evt.clientX) || window.innerWidth / 2;
    var y = (evt && evt.clientY) || window.innerHeight / 2;
    transitionWipe.style.setProperty('--tx', x + 'px');
    transitionWipe.style.setProperty('--ty', y + 'px');
    transitionWipe.classList.add('closing');
    setTimeout(function () {
      window.showPage(name);
      transitionWipe.classList.remove('closing');
      transitionWipe.classList.add('opening');
      setTimeout(function () {
        transitionWipe.classList.remove('opening');
        wipeBusy = false;
      }, 420);
    }, 360);
  };

  /* ---------------- EMAIL POPOVER ---------------- */
  var emailPopover = document.getElementById('email-popover');
  var emailTrigger = document.getElementById('email-popover-trigger');

  window.toggleEmailPopup = function (evt) {
    if (evt) evt.stopPropagation();
    if (!emailPopover || !emailTrigger) return;
    var isShown = emailPopover.classList.contains('show');
    if (isShown) {
      window.closeEmailPopup();
    } else {
      emailPopover.classList.add('show');
      emailPopover.setAttribute('aria-hidden', 'false');
      emailTrigger.setAttribute('aria-expanded', 'true');
    }
  };

  window.closeEmailPopup = function () {
    if (!emailPopover || !emailTrigger) return;
    emailPopover.classList.remove('show');
    emailPopover.setAttribute('aria-hidden', 'true');
    emailTrigger.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', function (evt) {
    if (!emailPopover || !emailPopover.classList.contains('show')) return;
    if (!emailPopover.contains(evt.target) && evt.target !== emailTrigger) {
      window.closeEmailPopup();
    }
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') window.closeEmailPopup();
  });

  /* ---------------- ROCKY WIDGET ---------------- */
  var rockyText = document.getElementById('rocky-text');
  var rockyTyping = document.getElementById('rocky-typing');
  var rockySvg = document.getElementById('rocky-svg');
  var rockyGlitch = document.getElementById('rocky-glitch');

  var ROCKY_LINES = [
    "still working on 'make rocky talk'. baby steps.",
    "did you know Chennai is on Eridian time too? approximately.",
    "I run on vibes and requestAnimationFrame.",
    "solar system's fake. the ambition is real.",
    "click 'fact' if you want to feel smarter.",
    "boot sequence took forever. sorry about that.",
    "I'm not a chatbot. I'm barely even a bot.",
    "loading personality... still loading..."
  ];

  var ROCKY_FACTS = [
    "A day on Venus is longer than its year.",
    "GRPO looked great early, then collapsed. sound familiar?",
    "Sidereal time isn't the same as clock time — ask the clock widget.",
    "Neutron stars can spin over 600 times per second.",
    "The Bayesian update never really stops.",
    "Jupiter's Great Red Spot has been raging for centuries.",
    "Edit distance is just disagreement, formalized.",
    "Light from the Sun takes about 8 minutes to reach here."
  ];

  var rockyBusy = false;
  var lastLineIdx = -1, lastFactIdx = -1;

  function pickIndex(len, last) {
    if (len <= 1) return 0;
    var idx;
    do { idx = Math.floor(Math.random() * len); } while (idx === last);
    return idx;
  }

  function rockySay(msg) {
    if (!rockyText) return;
    rockyBusy = true;
    if (rockyTyping) rockyTyping.classList.add('show');
    if (rockySvg) rockySvg.classList.add('talking');
    if (rockyGlitch) {
      rockyGlitch.classList.add('flash');
      setTimeout(function () { rockyGlitch.classList.remove('flash'); }, 90);
    }
    setTimeout(function () {
      if (rockyTyping) rockyTyping.classList.remove('show');
      rockyText.textContent = msg;
      rockyText.classList.add('glitching');
      setTimeout(function () { rockyText.classList.remove('glitching'); }, 260);
      if (rockySvg) {
        setTimeout(function () { rockySvg.classList.remove('talking'); }, 400);
      }
      rockyBusy = false;
    }, 550);
  }

  window.rockySpeak = function () {
    if (rockyBusy) return;
    lastLineIdx = pickIndex(ROCKY_LINES.length, lastLineIdx);
    rockySay(ROCKY_LINES[lastLineIdx]);
  };

  window.rockyFact = function () {
    if (rockyBusy) return;
    lastFactIdx = pickIndex(ROCKY_FACTS.length, lastFactIdx);
    rockySay(ROCKY_FACTS[lastFactIdx]);
  };

  // If DOMContentLoaded already fired before this script ran (script at end of body), boot manually.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runBoot();
  }
})();
