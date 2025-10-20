// header.js (ES module) - injecte header + svg filters + init nav interactions
// Remplace les anciens header.js qui utilisaient document.write

const HEADER_HTML = `
  <!-- Header -->
  <header class="header">
    <!-- Logo -->
    <a href="/index.html" class="logo-link">
      <img src="https://i.imgur.com/Kl9kTBg.png" alt="Burban Logo" class="logo-img">
    </a>

    <!-- Nav desktop -->
    <nav class="nav">
      <a href="/index.html" class="nav-item">Home</a>
      <a href="/shop.html" class="nav-item active">Shop</a>
      <a href="/about-burban.html" class="nav-item">About Burban</a>
      <a href="/contact.html" class="nav-item">Contact Us</a>
    </nav>

    <!-- Icônes + hamburger -->
    <div class="actions">
      <a href="/account.html" class="account-btn" aria-label="Mon compte"><i class="fa-solid fa-user"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="/public/index.html" class="cart-btn" aria-label="Mon panier"><i class="fa-solid fa-bag-shopping"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="hamburger" aria-label="Ouvrir le menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <div class="lang-switcher desktop-lang">
        <select id="languageSelector" aria-label="Changer de langue">
          <option value="EN">EN</option>
          <option value="FR">FR</option>
        </select>
      </div>
    </div>
  </header>

  <!-- Overlay menu mobile -->
  <div class="overlay-menu" id="overlayMenu">
    <button class="close-btn" aria-label="Fermer le menu">&times;</button>
    <ul class="overlay-nav">
      <li><a href="/index.html">Home</a></li>
      <li><a href="/shop.html">Shop</a></li>
      <li><a href="/about-burban.html">About Burban</a></li>
      <li><a href="/contact.html">Contact Us</a></li>
      <li class="mobile-lang">
        <label for="languageSelectorMobile">Language:</label>
        <select id="languageSelectorMobile" aria-label="Changer de langue">
          <option value="EN">EN</option>
          <option value="FR">FR</option>
        </select>
      </li>
    </ul>
  </div>
`;

// SVG filters (injected once)
const SVG_FILTERS = `
  <svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;">
    <defs>
      <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%" primitiveUnits="objectBoundingBox">
        <feTurbulence id="feTurb" type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" stitchTiles="stitch" result="noise"/>
        <feGaussianBlur stdDeviation="0.6" in="noise" result="noiseBlur"/>
        <feDisplacementMap id="feDisp" in="SourceGraphic" in2="noiseBlur" scale="8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>

  <svg style="position:absolute;width:0;height:0;">
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 16 -10" result="goo"/>
      <feBlend in="SourceGraphic" in2="goo"/>
    </filter>
  </svg>
`;

/* ---------- Injection DOM ---------- */
function injectHeader() {
  if (document.querySelector('header.header')) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = HEADER_HTML;
  document.body.insertBefore(wrapper, document.body.firstChild);
}

function injectSvgFiltersIfMissing() {
  // insert only if missing
  const hasLiquid = !!document.getElementById('liquid');
  const hasGoo = !!document.querySelector('filter#goo');
  if (!hasLiquid || !hasGoo) {
    const tmp = document.createElement('div');
    tmp.innerHTML = SVG_FILTERS;
    document.body.insertBefore(tmp, document.body.firstChild);
  }
}

/* ---------- Overlay / Hamburger ---------- */
function initOverlayMenu() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.getElementById('overlayMenu');
  if (!hamburger || !overlay) return;

  const closeBtn = overlay.querySelector('.close-btn');

  hamburger.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
  });

  // Close overlay when clicking a link inside
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });
}

/* ---------- Language selectors ---------- */
function initLanguageSelectors() {
  const handleLang = (value) => {
    if (value === 'EN') {
      window.location.href = 'https://burbanofficial.com/';
    } else if (value === 'FR') {
      window.location.href = 'https://burbanofficial.com/FR-fr/';
    }
  };

  const sel = document.getElementById('languageSelector');
  if (sel) sel.addEventListener('change', () => handleLang(sel.value));

  const selMobile = document.getElementById('languageSelectorMobile');
  if (selMobile) selMobile.addEventListener('change', () => handleLang(selMobile.value));
}

/* ---------- Year update ---------- */
function updateYearIfPresent() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Active nav item detection (robuste, améliorée) ---------- */
function setActiveNavByPath() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll('.nav-item'));
  items.forEach(i => i.classList.remove('active'));

  // normalise un chemin : retire query/hash, remplace '/' final par 'index.html'
  function normalizePath(path) {
    if (!path) return 'index.html';
    let p = path.split('?')[0].split('#')[0];
    if (p.endsWith('/')) p = p + 'index.html';
    // si le path est juste '' ou '/', on veut index.html
    if (p === '' || p === '/') return 'index.html';
    return p;
  }

  const currentPathRaw = window.location.pathname || '/';
  const currentPath = normalizePath(currentPathRaw).toLowerCase();
  const currentFile = currentPath.split('/').pop();

  // Premier essai : matcher le pathname absolu des <a> si possible
  let matched = items.find(a => {
    try {
      const ahrefPath = normalizePath(new URL(a.href, window.location.origin).pathname).toLowerCase();
      return ahrefPath === currentPath;
    } catch (e) {
      return false;
    }
  });

  // Deuxième essai : matcher par nom de fichier (shop.html, index.html...)
  if (!matched) {
    matched = items.find(a => {
      const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
      const hrefNorm = href.endsWith('/') ? href + 'index.html' : href;
      const hrefFile = hrefNorm.split('/').pop().toLowerCase();
      return hrefFile === currentFile;
    });
  }

  // Troisième essai : matcher par présence du segment (ex: '/shop' vs '/shop.html' or '/shop/')
  if (!matched) {
    matched = items.find(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      return href && (currentPath.includes(href) || href.includes(currentPath) || href.includes(currentFile));
    });
  }

  if (matched) {
    matched.classList.add('active');
  } else {
    // fallback: mark Home if nothing matched
    const home = items.find(a => (a.getAttribute('href') || '').toLowerCase().endsWith('index.html'));
    if (home) home.classList.add('active');
  }
}

/* ---------- Nav puck (liquid hover) ---------- */
function initNavPuck() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const existingHover = nav.querySelector('.nav-hover');
  if (existingHover) existingHover.remove();

  const hover = document.createElement('div');
  hover.className = 'nav-hover';
  nav.appendChild(hover);

  let target = { x:0, y:0, w:0, h:0, opacity:0 };
  let current = { x:0, y:0, w:0, h:0, opacity:0 };
  const LERP = 0.99;
  const padX = 14, padY = 10;

  function measureTextRect(el){
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rect = range.getBoundingClientRect();
      if (!rect || rect.width === 0) return el.getBoundingClientRect();
      return rect;
    } catch {
      return el.getBoundingClientRect();
    }
  }

  function setTargetFromElement(el){
    const navR = nav.getBoundingClientRect();
    const tRect = measureTextRect(el);
    target.w = tRect.width + padX*2;
    target.h = tRect.height + padY*2;
    target.x = tRect.left - navR.left + (tRect.width/2) - (target.w/2);
    target.y = tRect.top - navR.top + (tRect.height/2) - (target.h/2);
    target.opacity = 1;
  }

  function setTargetFollowMouse(clientX){
    const navR = nav.getBoundingClientRect();
    if (current.w <= 0 || current.h <= 0){
      const first = nav.querySelector('.nav-item');
      if(first){
        const tr = measureTextRect(first);
        current.w = tr.width + padX*2;
        current.h = tr.height + padY*2;
      } else {
        current.w = 120; current.h = 44;
      }
    }
    target.w = current.w;
    target.h = current.h;
    target.x = clientX - navR.left - target.w/2;
    target.y = navR.height/2 - target.h/2;
    target.opacity = 1;
  }

  nav.addEventListener('mousemove', e=>{
    if(window.matchMedia('(max-width:768px)').matches) return;
    const item = e.target.closest('.nav-item');
    if(item && nav.contains(item)){
      setTargetFromElement(item);
    } else {
      setTargetFollowMouse(e.clientX);
    }
    hover.classList.add('visible');
  });

  nav.addEventListener('mouseleave', ()=>{
    target.opacity = 0;
    hover.classList.remove('visible');
  });

  nav.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      nav.querySelectorAll('.nav-item.active').forEach(a=>a.classList.remove('active'));
      item.classList.add('active');
    });
  });

  function applyCurrentToHover(){
    hover.style.transform = `translate3d(${Math.round(current.x)}px, ${Math.round(current.y)}px, 0)`;
    hover.style.width = `${Math.round(current.w)}px`;
    hover.style.height = `${Math.round(current.h)}px`;
    hover.style.opacity = String(current.opacity);
  }

  function raf(){
    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;
    current.w += (target.w - current.w) * LERP;
    current.h += (target.h - current.h) * LERP;
    current.opacity += (target.opacity - current.opacity) * LERP;
    applyCurrentToHover();
    requestAnimationFrame(raf);
  }

  raf();

  window.addEventListener('resize', () => {
    const active = nav.querySelector('.nav-item.active');
    if (active) {
      setTargetFromElement(active);
      current.w = target.w; current.h = target.h; current.x = target.x; current.y = target.y;
      applyCurrentToHover();
    }
  });
}

/* ---------- Init all ---------- */
function initAll() {
  injectHeader();
  injectSvgFiltersIfMissing();
  // small delay for injected DOM to be present
  requestAnimationFrame(() => {
    initOverlayMenu();
    initLanguageSelectors();
    updateYearIfPresent();
    setActiveNavByPath();
    initNavPuck();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}


