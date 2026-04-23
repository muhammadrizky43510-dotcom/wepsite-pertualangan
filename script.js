// ================= LOAD COMPONENTS =================
async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      el.innerHTML = html;
      
      // Jalankan script yang ada di dalam komponen
      const scripts = el.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.innerHTML) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch(e) { console.warn('Component load failed:', path); }
}

async function initComponents() {
  await loadComponent('navbar-container', 'components/navbar.html');
  await loadComponent('footer-container', 'components/footer.html');
  initNavbar();
  initPageTransitions();
  initAds(); // Panggil iklan setelah komponen dimuat
}

initComponents();

// ================= NAVBAR =================
function initNavbar() {
  // Active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ================= PARTICLE =================
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const COUNT = 50;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  let mouse = { x: null, y: null };

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
  }
  createParticles();

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      let dx = mouse.x ? mouse.x - p.x : 999;
      let dy = mouse.y ? mouse.y - p.y : 999;
      let dist = dx*dx + dy*dy;
      ctx.shadowBlur = dist < 10000 ? 12 : 5;
      ctx.shadowColor = '#60a5fa';
      ctx.fillStyle = `rgba(147,197,253,${p.opacity})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        if (dx*dx + dy*dy < 5000) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(100,150,255,0.08)';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function updateParticles() {
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (mouse.x && mouse.y) {
        let dx = mouse.x - p.x, dy = mouse.y - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) { p.x += dx * 0.008; p.y += dy * 0.008; }
      }
      if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;
      if (p.y < 0 || p.y > canvas.height) p.y = Math.random() * canvas.height;
    });
  }

  (function animate() { drawParticles(); updateParticles(); requestAnimationFrame(animate); })();
  window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; createParticles(); });
}

// ================= CURSOR GLOW =================
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ================= TYPING EFFECT =================
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const text = 'MENCARI SENSASI';
  let idx = 0;
  typingEl.textContent = '';
  function typeChar() {
    if (idx < text.length) { typingEl.textContent += text[idx]; idx++; setTimeout(typeChar, 80); }
  }
  setTimeout(typeChar, 500);
}

// ================= MAGNETIC BUTTON =================
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.3}px,${(e.clientY-r.top-r.height/2)*0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ================= COUNTER ANIMATION =================
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        const target = +el.dataset.target;
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString();
        }, 25);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));

// ================= PROGRESS BARS =================
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.glass-card, .section').forEach(el => {
  if (el.querySelector('.progress-fill')) progressObserver.observe(el);
});

// ================= ACCORDION =================
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ================= MENU FILTER =================
const filterTabs = document.querySelectorAll('.filter-tab');
const menuItems = document.querySelectorAll('.menu-item');
const searchInput = document.getElementById('search-input');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterMenu();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', filterMenu);
}

function filterMenu() {
  const activeFilter = document.querySelector('.filter-tab.active');
  const filter = activeFilter ? activeFilter.dataset.filter : 'semua';
  const search = searchInput ? searchInput.value.toLowerCase() : '';

  menuItems.forEach(item => {
    const matchFilter = filter === 'semua' || item.dataset.kategori === filter;
    const matchSearch = !search || item.textContent.toLowerCase().includes(search);
    item.style.display = (matchFilter && matchSearch) ? '' : 'none';
  });
}

// ================= DONASI =================
let selectedNominal = 0;
document.querySelectorAll('.nominal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const customBox = document.getElementById('custom-nominal');
    if (btn.dataset.nominal === 'custom') {
      if (customBox) customBox.style.display = 'block';
      selectedNominal = 0;
    } else {
      if (customBox) customBox.style.display = 'none';
      selectedNominal = parseInt(btn.dataset.nominal);
    }
  });
});

const donasiForm = document.getElementById('donasi-form');
if (donasiForm) {
  donasiForm.addEventListener('submit', e => {
    e.preventDefault();
    const customAmt = document.getElementById('custom-amount');
    const nominal = selectedNominal || (customAmt ? parseInt(customAmt.value) : 0);
    if (!nominal || nominal < 1000) { alert('Pilih nominal donasi terlebih dahulu!'); return; }
    const nama = document.getElementById('donasi-nama').value;
    if (!nama) { alert('Masukkan nama kamu!'); return; }
    alert(`Terima kasih ${nama}! 🎉\nDonasi Rp ${nominal.toLocaleString()} berhasil diterima.\nSemoga berkah! ❤️`);
    donasiForm.reset();
    document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('selected'));
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById('login-form');
const togglePass = document.getElementById('toggle-password');

if (togglePass) {
  togglePass.addEventListener('click', () => {
    const inp = document.getElementById('login-password');
    if (inp.type === 'password') { inp.type = 'text'; togglePass.textContent = '🙈'; }
    else { inp.type = 'password'; togglePass.textContent = '👁️'; }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('login-email');
    const pass = document.getElementById('login-password');
    const fgEmail = document.getElementById('fg-email');
    const fgPass = document.getElementById('fg-password');

    fgEmail.classList.remove('error'); fgPass.classList.remove('error');

    if (!email.value || !email.value.includes('@')) { fgEmail.classList.add('error'); valid = false; }
    if (!pass.value || pass.value.length < 6) { fgPass.classList.add('error'); valid = false; }

    if (valid) {
      const btn = document.getElementById('login-btn');
      btn.innerHTML = '<span class="spinner"></span>Memproses...';
      btn.classList.add('btn-loading');
      setTimeout(() => {
        alert('Login berhasil! 🎉 Selamat datang, petualang!');
        btn.textContent = 'Masuk';
        btn.classList.remove('btn-loading');
        loginForm.reset();
      }, 1500);
    }
  });
}

// ================= WIZARD =================
function selectJenis(el) {
  document.querySelectorAll('#step-1 label.glass-card').forEach(c => {
    c.style.borderColor = 'var(--glass-border)';
    c.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--blue-500)';
  el.style.background = 'rgba(59,130,246,0.1)';
  el.querySelector('input').checked = true;
}

function wizardNext(step) {
  document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('step-' + step);
  if (target) target.classList.add('active');

  document.querySelectorAll('.wizard-step').forEach(s => {
    const sNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sNum < step) s.classList.add('done');
    if (sNum === step) s.classList.add('active');
  });

  if (step === 3) updateSummary();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function updateSummary() {
  const jenis = document.querySelector('input[name="jenis"]:checked');
  const labels = { alam:'🏔️ Alam & Pendakian', laut:'🌊 Laut & Diving', ekstrem:'⚡ Olahraga Ekstrem', budaya:'🎭 Budaya & Heritage' };
  document.getElementById('sum-jenis').textContent = jenis ? (labels[jenis.value] || jenis.value) : '-';
  document.getElementById('sum-nama').textContent = document.getElementById('mulai-nama')?.value || '-';
  document.getElementById('sum-peserta').textContent = document.getElementById('mulai-peserta')?.value || '-';
  document.getElementById('sum-level').textContent = document.getElementById('mulai-level')?.value || '-';
  document.getElementById('sum-tanggal').textContent = document.getElementById('mulai-tanggal')?.value || '-';
}

function submitWizard() {
  alert('🎉 Pendaftaran berhasil!\nTim kami akan menghubungi kamu dalam 24 jam.\nSelamat berpetualang!');
  wizardNext(1);
}

// ================= PAGE TRANSITIONS =================
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.href;
      document.body.classList.remove('page-loaded');
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = url; }, 300);
    });
  });
}

window.addEventListener('load', () => { document.body.classList.add('page-loaded'); });

function initAds() {
  // 1. Popunder
  const pop = document.createElement('script');
  pop.src = 'https://pl29227309.profitablecpmratenetwork.com/ed/1f/54/ed1f548cb2d54c21917d55a267c1f56e.js';
  document.head.appendChild(pop);

  // 2. Social Bar
  const social = document.createElement('script');
  social.src = 'https://pl29227312.profitablecpmratenetwork.com/14/83/a8/1483a831bc26266bccac9635a531f.js';
  document.body.appendChild(social);
}

function goTo(url) {
  document.body.classList.remove('page-loaded');
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = url; }, 300);
}