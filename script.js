/* ── DOOR OPENING CONCEPT ── */
let doorsOpened = false;

function openDoors() {
  if (doorsOpened) return;
  doorsOpened = true;

  const overlay = document.getElementById('door-overlay');
  if (overlay) {
    overlay.classList.add('opened');
  }

  // Fade in the music and sparkles slightly after the doors start opening
  setTimeout(() => {
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) musicToggle.classList.add('visible');

    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.volume = 0.25;
      audio.play().catch(()=>{});
    }

    if (window.startSparkleShower) window.startSparkleShower();
  }, 600);
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

/* ── PASTEL AMBIENT SHOWER ── */
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

  const colors = ['#E3E7D3', '#FCEBD9', '#F5E8E8', '#F4EAE1', '#D2B48C'];

  function makeParticle(spawnAtTop){
    return {
      x: Math.random() * w,
      y: spawnAtTop ? -10 : Math.random() * h,
      size: Math.random() * 3 + 1.5,
      speedY: Math.random() * 0.4 + 0.2,
      drift: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.4
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

/* ── WISHES WALL SUBMISSION (RESTORED) ── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoo2_KLeDevK54-qVhzj8iDgxyyYSQ7HjJqeipqjmncxCk44SS9Np3I6_3X416sux7tg/exec';
const COUPLE_ID = 'arjun-riya'; // Updated Couple ID

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
    status.style.color = 'var(--pastel-gold)';
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
  loadWishes();
};