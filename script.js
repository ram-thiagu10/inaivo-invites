/* ── SCATTERED BLOOM INTRO ── */
const INTRO_ICONS = ['🌸','🌺','🌷','🌼','🍃','🌿','🕊️','🌹','✨'];
let introOpened = false;

function scatterIntroParticles() {
  const container = document.getElementById('intro-particles');
  if (!container) return;
  const w = window.innerWidth, h = window.innerHeight;
  const count = w < 640 ? 22 : 34;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'intro-particle';
    el.textContent = INTRO_ICONS[Math.floor(Math.random() * INTRO_ICONS.length)];

    const startX = Math.random() * w;
    const startY = Math.random() * h;
    const size = 16 + Math.random() * 20;

    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.fontSize = size + 'px';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;

    // destination: converge toward center with slight random scatter so it feels like a vortex, not a single point
    const centerX = w / 2, centerY = h / 2;
    const dx = (centerX - startX) + (Math.random() - 0.5) * 60;
    const dy = (centerY - startY) + (Math.random() - 0.5) * 60;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');

    container.appendChild(el);
  }
}

function openDoors() {
  if (introOpened) return;
  introOpened = true;

  const overlay = document.getElementById('intro-overlay');
  const center = document.getElementById('intro-center');
  const particles = document.querySelectorAll('.intro-particle');

  if (center) center.classList.add('fading');

  // Sweep every bloom into the tornado, staggered for an organic swirl
  particles.forEach((p) => {
    const delay = Math.random() * 260;
    setTimeout(() => { p.style.animationPlayState = 'running'; }, delay);
  });

  // Let the swirl finish, then dissolve the overlay to reveal the invitation
  setTimeout(() => {
    if (overlay) overlay.classList.add('hidden');

    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) musicToggle.classList.add('visible');

    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }

    if (window.startSparkleShower) window.startSparkleShower();

    document.body.classList.add('intro-done');
    initScrollReveal();
  }, 1650);

  setTimeout(() => {
    if (overlay) overlay.style.display = 'none';
  }, 2600);
}

/* ── MUSIC TOGGLE ── */
let musicPlaying = true;
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const on  = document.getElementById('music-icon-on');
  const off = document.getElementById('music-icon-off');
  if(!audio) return;

  if (musicPlaying) {
    audio.pause();
    if(on) on.style.display='none';
    if(off) off.style.display='block';
  } else {
    audio.play().catch(()=>{});
    if(on) on.style.display='block';
    if(off) off.style.display='none';
  }
  musicPlaying = !musicPlaying;
}

/* ── GOLD AMBIENT SHOWER ── */
(function(){
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  let running = false;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#E8CD86', '#C6A34D', '#FBF6EA', '#1F4B3F', '#6E1423'];

  function makeParticle(spawnAtTop){
    return {
      x: Math.random() * w,
      y: spawnAtTop ? -10 : Math.random() * h,
      size: Math.random() * 3 + 1.5,
      speedY: Math.random() * 0.4 + 0.2,
      drift: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.35
    };
  }

  function initParticles(){
    particles = [];
    for (let i = 0; i < 40; i++){
      particles.push(makeParticle(false));
    }
  }

  function animate(){
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (let p of particles){
      p.y += p.speedY;
      p.x += p.drift;

      if (p.y > h) {
        p.y = -10;
        p.x = Math.random() * w;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  window.startSparkleShower = function(){
    running = true;
    initParticles();
    animate();
  };
})();

/* ── COUNTDOWN TIMER ── */
// Muhurtham: 02 September 2026, 10:30 AM IST (IST = UTC+5:30 -> 05:00 UTC)
const WEDDING_TARGET_UTC = Date.UTC(2026, 8, 2, 5, 0, 0);

function updateCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const noteEl = document.getElementById('countdown-note');
  if (!daysEl) return;

  const now = Date.now();
  let diff = WEDDING_TARGET_UTC - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';
    if (noteEl) noteEl.textContent = '🌸 The celebration has begun — thank you for being part of our story!';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

/* ── SCROLL REVEAL ── */
let revealObserver = null;
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((t) => revealObserver.observe(t));
}

/* ── WISHES WALL SUBMISSION ── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoo2_KLeDevK54-qVhzj8iDgxyyYSQ7HjJqeipqjmncxCk44SS9Np3I6_3X416sux7tg/exec';
const COUPLE_ID = 'arjun-riya';

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addWishCard(wish, prepend = false) {
  const wall = document.getElementById('wishes-wall');
  if (!wall) return;

  const placeholder = document.getElementById('wishes-placeholder');
  if (placeholder) placeholder.remove();

  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `
    <div class="wish-card-name">${escapeHtml(wish.name)}</div>
    <div class="wish-card-relation">${wish.relation ? escapeHtml(wish.relation) : 'Guest'}</div>
    <div class="wish-card-message">${escapeHtml(wish.message)}</div>
    <div class="wish-card-time">${wish.timestamp || ''}</div>
  `;
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  if (prepend) wall.prepend(card);
  else wall.appendChild(card);

  requestAnimationFrame(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
}

async function submitWish() {
  const name    = document.getElementById('wish-name').value.trim();
  const relation= document.getElementById('wish-relation').value.trim();
  const message = document.getElementById('wish-message').value.trim();
  const status  = document.getElementById('wish-status');
  const btn     = document.getElementById('wish-submit');

  if (!name) { status.textContent = '⚠️ Please enter your name.'; return; }
  if (!message) { status.textContent = '⚠️ Please write a wish.'; return; }

  btn.disabled = true;
  btn.style.opacity = '0.6';
  status.textContent = 'Sending…';

  try {
    await fetch(`${APPS_SCRIPT_URL}?couple=${COUPLE_ID}`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') })
    });

    addWishCard({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') }, true);

    document.getElementById('wish-name').value = '';
    document.getElementById('wish-relation').value = '';
    document.getElementById('wish-message').value = '';
    status.textContent = '🌸 Your wish was sent! Thank you.';
    status.style.color = 'var(--gold-hover)';
  } catch (e) {
    status.textContent = '❌ Something went wrong. Please try again.';
  } finally {
    btn.disabled = false;
    btn.style.opacity = '1';
    setTimeout(() => { status.textContent = ''; status.style.color = 'var(--text-soft)'; }, 5000);
  }
}

async function loadWishes() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_APPS')) return;
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get&couple=${COUPLE_ID}`);
    const data = await res.json();
    if (data && data.wishes && data.wishes.length > 0) {
      data.wishes.reverse().forEach(w => addWishCard(w));
    }
  } catch(e) {
    // Silently fail if unable to load wishes
  }
}

// Initializations
window.onload = () => {
  scatterIntroParticles();
  loadWishes();
  updateCountdown();
  setInterval(updateCountdown, 1000);
};