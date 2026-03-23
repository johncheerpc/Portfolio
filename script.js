/* ── toggleDomain — defined early so onclick can always find it ── */
function toggleDomain(trigger) {
  var article = trigger.closest('.domain');
  var isOpen  = article.classList.contains('open');
  document.querySelectorAll('.domain.open').forEach(function(d) { d.classList.remove('open'); });
  if (!isOpen) article.classList.add('open');
}

/* ─────────────────────────────── */

// Bulletproof preloader kill — runs before anything else
(function(){
  function killLoader(){
    var p = document.getElementById('preloader');
    if(!p) return;
    p.style.transition = 'opacity 0.4s ease';
    p.style.opacity = '0';
    p.style.pointerEvents = 'none';
    setTimeout(function(){ p.style.display='none'; }, 450);
  }
  // Kill at 1.8s MAX regardless of anything else
  setTimeout(killLoader, 1800);
  // Also kill on DOMContentLoaded
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(killLoader, 200); });
  } else {
    setTimeout(killLoader, 200);
  }
})();

/* ─────────────────────────────── */

/* ════════════════════════════════════════════════
   PORTFOLIO SCRIPT
════════════════════════════════════════════════ */

/* ── PRELOADER (progress animation only — kill handled by inline script) ── */
(function () {
  var fill = document.getElementById('pl-fill');
  var lbl  = document.getElementById('pl-label');
  var stages = [[0,'Initialising systems…'],[28,'Loading modules…'],[60,'Connecting services…'],[88,'Rendering portfolio…'],[100,'Ready.']];
  var i = 0;
  var delays = [0, 250, 230, 200, 160];
  function step() {
    if (i >= stages.length) return;
    if (fill) fill.style.width = stages[i][0] + '%';
    if (lbl)  lbl.textContent  = stages[i][1];
    i++;
    if (i < stages.length) setTimeout(step, delays[i]||230);
  }
  step();
})();

/* ── SCROLL PROGRESS BAR ────────────────────────── */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ── STICKY NAV ─────────────────────────────────── */
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── HAMBURGER ──────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ticker removed — replaced with static spec tags */

/* ── COUNTER ANIMATION ──────────────────────────── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const decimals = target % 1 !== 0 ? 1 : 0;
  const duration = 1600;
  const start    = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOut(progress) * target;
    el.textContent = value.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals);
  };

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sn[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const statsStrip = document.getElementById('stats-strip');
if (statsStrip) counterObserver.observe(statsStrip);

/* ── DOMAIN ACCORDION ───────────────────────────── */
/* toggleDomain defined early in <body> */

/* ── SCROLL REVEAL ──────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  el.classList.add('animate');
  revealObserver.observe(el);
});

// Safety fallback: if anything is still hidden after 1.5s, force-show it
setTimeout(function() {
  document.querySelectorAll('.reveal.animate:not(.visible)').forEach(function(el) {
    el.classList.add('visible');
  });
}, 1500);

/* ── PROJECT FILTER TABS ── */
document.querySelectorAll('.ptab').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('#projects-grid .bc').forEach(card => {
      const cat = card.dataset.cat || 'all';
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? '' : 'none';
      card.style.opacity  = show ? '1' : '0';
    });
  });
});

/* ── CONTACT FORM ───────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();

  const btn  = document.getElementById('sub-btn');
  const txt  = document.getElementById('sub-txt');
  const name = document.getElementById('fn').value.trim();
  const email= document.getElementById('fe').value.trim();
  const msg  = document.getElementById('fm').value.trim();

  if (!name || !email || !msg) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }
  if (!email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  btn.disabled   = true;
  txt.textContent = 'Sending…';

  // Simulate async send
  setTimeout(() => {
    showToast("Thanks for the message ! I'll be in touch as early as possible", 'success');
    btn.disabled    = false;
    txt.textContent = 'Send Message';
    e.target.reset();
  }, 1400);
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  // Remove existing
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      ${type === 'success'
        ? '<polyline points="20 6 9 17 4 12"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    <span>${message}</span>`;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '32px',
    right:        '32px',
    zIndex:       '9999',
    display:      'flex',
    alignItems:   'center',
    gap:          '10px',
    padding:      '14px 22px',
    borderRadius: '12px',
    fontSize:     '14px',
    fontWeight:   '600',
    fontFamily:   'Plus Jakarta Sans, sans-serif',
    backdropFilter: 'blur(16px)',
    boxShadow:    '0 8px 40px rgba(0,0,0,0.4)',
    animation:    'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
    background:   type === 'success' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
    border:       type === 'success' ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(239,68,68,0.35)',
    color:        type === 'success' ? '#34d399' : '#f87171',
  });

  // Inject keyframe
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `
      @keyframes toastIn  { from { opacity:0; transform: translateY(20px) scale(0.9); } to { opacity:1; transform: none; } }
      @keyframes toastOut { from { opacity:1; transform: none; } to { opacity:0; transform: translateY(20px); } }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── SMOOTH ANCHOR CLOSE ON MOBILE ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});
