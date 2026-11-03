// Portfolio interactions — Jaderick N. Cuevas (vanilla JavaScript)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Typing effect: cycles through roles, typing and deleting each one */
(function typing() {
  const el = document.getElementById("typed");
  const words = ["BSIT Student", "Aspiring Developer", "Problem Solver", "Technology Enthusiast"];
  if (reduceMotion) { el.textContent = words.join(" · "); return; }
  let w = 0, c = 0, deleting = false;
  function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1500); }
    if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
    c += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();

/* 2. Animated particle background: dots drift and link when close */
(function particles() {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let pts = [], W, H;
  function resize() {
    W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    const n = Math.min(80, Math.floor((W * H) / 18000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.fillStyle = "rgba(124,140,255,.7)";
      ctx.fillRect(p.x, p.y, 2, 2);
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - d / 120)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  addEventListener("resize", resize);
  resize(); draw();
})();

/* 3. Mobile menu toggle */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", false);
}));

/* 4. Scroll handlers: progress bar, back-to-top, active nav link */
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
const sections = [...document.querySelectorAll("main section")];
const links = [...navLinks.querySelectorAll("a")];
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (scrollY / max) * 100 + "%";
  toTop.classList.toggle("show", scrollY > 500);
  let current = sections[0].id;
  sections.forEach(s => { if (scrollY >= s.offsetTop - innerHeight / 3) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}
addEventListener("scroll", onScroll, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
onScroll();

/* 5. Reveal on scroll + animate skill bars and counters when visible */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("visible");
    el.querySelectorAll(".bar i").forEach(b => (b.style.width = b.dataset.w + "%"));
    el.querySelectorAll(".count").forEach(animateCount);
    observer.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* Counts a number up from 0 to its data-target */
function animateCount(el) {
  const target = +el.dataset.target;
  if (reduceMotion) { el.textContent = target; return; }
  let n = 0;
  const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 1200 / target); };
  step();
}

/* 6. "More About Me" reveal */
const moreBtn = document.getElementById("moreBtn");
const more = document.getElementById("moreAbout");
moreBtn.addEventListener("click", () => {
  const open = more.hidden;
  more.hidden = !open;
  moreBtn.setAttribute("aria-expanded", open);
  moreBtn.textContent = open ? "Show Less ↑" : "More About Me ↓";
});

/* 7. Project filters and 3D tilt on hover */
document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const f = chip.dataset.filter;
  document.querySelectorAll(".project").forEach(p => p.classList.toggle("hide", f !== "all" && p.dataset.tag !== f));
}));
if (!reduceMotion && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

/* 8. Custom cursor (desktop only, pointer: fine) */
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
  document.body.classList.add("custom-cursor");
  const dot = document.getElementById("cursorDot"), ring = document.getElementById("cursorRing");
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
  (function follow() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(follow); })();
  document.querySelectorAll("a, button, .project").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}

/* 9. Live digital clock + footer year */
const clock = document.getElementById("clock");
function updateClock() { clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
updateClock(); setInterval(updateClock, 1000);
document.getElementById("year").textContent = new Date().getFullYear();