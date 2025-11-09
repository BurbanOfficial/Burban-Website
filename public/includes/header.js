// header.js (ES module) - injecte header + svg filters + init nav interactions
// Remplace les anciens header.js qui utilisaient document.write

const HEADER_HTML = `
  <!-- Header -->
<header class="header">
  <!-- Logo -->
  <a href="index.html" class="logo-link">
    <img src="https://i.imgur.com/Kl9kTBg.png" alt="Burban Logo" class="logo-img">
  </a>

  <!-- Nav desktop -> déplacé à gauche -->
  <nav class="nav nav-left">
    <a href="https://burbanofficial.com/index.html" class="nav-item active">Home</a>
    <a href="https://burbanofficial.com/shop.html" class="nav-item">Shop</a>
    <a href="https://burbanofficial.com/about-burban.html" class="nav-item">About Burban</a>
    <a href="https://burbanofficial.com/contact.html" class="nav-item">Contact Us</a>
  </nav>

  <!-- Icônes + hamburger + MINI barre de recherche à droite -->
  <div class="actions">
    <!-- mini search (cliquable - ouvrira l'overlay central) -->
    <button id="openSearchShort" class="search-short" aria-label="Search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder="Search" aria-hidden="true" readonly />
    </button>

    <a href="https://burbanofficial.com/account.html" class="account-btn" aria-label="Mon compte"><i class="fa-solid fa-user"></i></a>
    <a href="https://burbanofficial.com/public/index.html" class="cart-btn" aria-label="Mon panier"><i class="fa-solid fa-bag-shopping"></i></a>
    <button class="hamburger" aria-label="Ouvrir le menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <!-- <div class="lang-switcher desktop-lang">
      <select id="languageSelector" aria-label="Changer de langue">
        <option value="EN">EN</option>
        <option value="FR">FR</option>
      </select>
    </div> -->
  </div>
</header>

  <!-- Overlay menu mobile -->
<div class="overlay-menu" id="overlayMenu">
  <button class="close-btn" aria-label="Fermer le menu">&times;</button>
  <ul class="overlay-nav">
    <li><a href="https://burbanofficial.com/index.html">Home</a></li>
    <li><a href="https://burbanofficial.com/shop.html">Shop</a></li>
    <li><a href="https://burbanofficial.com/about-burban.html">About Burban</a></li>
    <li><a href="https://burbanofficial.com/contact.html">Contact Us</a></li>
    <!-- <li class="mobile-lang">
      <label for="languageSelectorMobile">Language:</label>
      <select id="languageSelectorMobile" aria-label="Changer de langue">
        <option value="EN">EN</option>
        <option value="FR">FR</option>
      </select>
    </li> -->
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

/* ---------- Active nav item detection (robuste) ---------- */
function setActiveNavByPath() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll('.nav-item'));
  items.forEach(i => i.classList.remove('active'));

  const currentPath = window.location.pathname || '/shop.html';
  // try to match exact pathname first, else fallback to filename match
  let matched = items.find(a => {
    try {
      const ahref = new URL(a.href, window.location.origin).pathname;
      return ahref === currentPath;
    } catch { return false; }
  });

  if (!matched) {
    const file = currentPath.split('/').pop() || 'shop.html';
    matched = items.find(a => {
      const href = a.getAttribute('href') || '';
      return href.endsWith(file) || href.includes(file);
    });
  }

  if (matched) matched.classList.add('active');
  else {
    // fallback: mark Home if nothing matched
    const home = items.find(a => (a.getAttribute('href') || '').endsWith('shop.html'));
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

/* ---------- Inject external scripts ---------- */
function injectExternalScripts() {
  const scripts = [
    "https://burbanofficial.com/script.js"
  ];

  scripts.forEach(src => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true; // évite de bloquer le parsing HTML
      document.head.appendChild(s);
    }
  });
}

/* ---------- Init all ---------- */
function initAll() {
  injectHeader();
  injectSvgFiltersIfMissing();
  injectExternalScripts();
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

document.addEventListener('DOMContentLoaded', () => {
  // build overlay DOM
  const overlay = document.createElement('div');
overlay.className = 'search-overlay';
overlay.innerHTML = `
  <div class="search-panel" role="dialog" aria-modal="true" aria-label="Recherche de produits">
    <div style="width:100%;">
      <input id="searchInputLarge" class="search-input-large" placeholder="Find your next Burban piece..." autocomplete="off" />
      <!-- Message d'erreur / "aucun résultat" placé directement sous l'input -->
      <div id="searchNoResults" class="search-no-results" style="display:none;"></div>
    </div>

    <div class="search-results" aria-live="polite" aria-atomic="true">
      <div id="searchResults" class="results-grid"></div>
    </div>
  </div>
`;
document.body.appendChild(overlay);


  const openBtn = document.getElementById('openSearchShort');
  const inputLarge = document.getElementById('searchInputLarge');
  const resultsGrid = document.getElementById('searchResults');
  const noResBox = document.getElementById('searchNoResults');

  // helper : open / close overlay
  function openOverlay() {
    overlay.classList.add('open');
    // allow animation frame then focus
    requestAnimationFrame(() => inputLarge.focus());
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    resultsGrid.innerHTML = '';
    noResBox.style.display = 'none';
    inputLarge.value = '';
  }

  openBtn.addEventListener('click', openOverlay);

  // close when Esc or click outside panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // debounce
  let timer = null;
  function debounce(fn, ms=160) {
    return function(...args){
      clearTimeout(timer);
      timer = setTimeout(()=>fn(...args), ms);
    };
  }

  // search function (uses window.BURBAN_PRODUCTS and window.BURBAN_IS_PRODUCT_ACTIVE)
  function performSearch(q) {
    resultsGrid.innerHTML = '';
    noResBox.style.display = 'none';
    q = String(q || '').trim().toLowerCase();
    const products = window.BURBAN_PRODUCTS || [];
    const isActive = typeof window.BURBAN_IS_PRODUCT_ACTIVE === 'function';

    // only consider "available" items if helper exists
    const pool = products.filter(p => isActive ? window.BURBAN_IS_PRODUCT_ACTIVE(p) : true);

    if (!q) {
      // show nothing on empty query (or show top nouveautés)
      renderSuggestions(pool);
      return;
    }

    const results = pool.filter(p => {
      const hay = [
        (p.name||''),
        (p.id||''),
        (p.type||''),
        (p.gender||''),
        (p.colors||[]).map(c=>c.name).join(' ')
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });

    if (results.length) {
      renderResults(results);
    } else {
      // no results => show message and suggestions (nouveautés en tête du fichier)
      noResBox.style.display = 'block';
      noResBox.innerHTML = `
        <strong>We couldn’t find that one. Maybe another keyword?</strong>
      `;
      renderSuggestions(pool);
    }
  }

  // helper : normalise une url (retourne une url absolue si possible)
function absoluteUrl(u) {
  if (!u) return '#';
  // déjà absolue
  if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) {
    // si commence par '/' -> préfixe l'origine
    if (u.startsWith('/')) return window.location.origin + u;
    return u;
  }
  // commence par '/' (cas fréquent dans ton script.js)
  if (u.startsWith('/')) return window.location.origin + u;
  // relatif -> résout par rapport au path courant
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  return new URL(u, base).href;
}

function renderResults(list) {
  resultsGrid.innerHTML = '';
  noResBox.style.display = 'none';
  list.forEach(p => {
    const color = (p.colors && p.colors[0]) ? p.colors[0] : { img:'', url:'#' };
    const href = absoluteUrl(color.url || '#');

    const a = document.createElement('a');
    a.className = 'result-card';
    a.href = href;                 // href propre (utile pour SEO / ouverture onglet droit)
    a.setAttribute('target', '_self');
    a.setAttribute('rel', 'noopener noreferrer');
    a.innerHTML = `
      <img src="${color.img || ''}" alt="${p.name || ''}">
      <div class="result-info">
        <h4>${p.name || ''}</h4>
        <p>${(p.price!=null?Number(p.price).toFixed(2)+'€':'')} • ${p.gender||''} • ${p.type||''}</p>
      </div>
    `;

    // Force la navigation propre (ferme overlay puis navigue)
    a.addEventListener('click', (e) => {
      // Empêche problèmes d'événements concurrents mais navigue explicitement
      e.preventDefault();
      // fermer l'overlay si défini
      try { if (typeof closeOverlay === 'function') closeOverlay(); } catch(e){ /* ignore */ }
      // une courte attente pour laisser l'animation se faire proprement
      setTimeout(() => { window.location.href = href; }, 120);
    });

    resultsGrid.appendChild(a);
  });
}

  function renderSuggestions(pool) {
  const suggestions = (pool.slice(0,6));
  resultsGrid.innerHTML = '';
  suggestions.forEach(p => {
    const color = (p.colors && p.colors[0]) ? p.colors[0] : { img:'', url:'#' };
    const href = absoluteUrl(color.url || '#');

    const a = document.createElement('a');
    a.className = 'result-card';
    a.href = href;
    a.setAttribute('target', '_self');
    a.setAttribute('rel', 'noopener noreferrer');
    a.innerHTML = `
      <img src="${color.img || ''}" alt="${p.name || ''}">
      <div class="result-info">
        <h4>${p.name || ''}</h4>
        <p>${(p.price!=null?Number(p.price).toFixed(2)+'€':'')} • ${p.gender||''} • ${p.type||''}</p>
      </div>
    `;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { if (typeof closeOverlay === 'function') closeOverlay(); } catch(e){ /* ignore */ }
      setTimeout(() => { window.location.href = href; }, 120);
    });

    resultsGrid.appendChild(a);
  });

  // bouton "voir plus"
  const seeMoreWrap = document.createElement('div');
  seeMoreWrap.style.gridColumn = '1 / -1';
  seeMoreWrap.style.display = 'flex';
  seeMoreWrap.style.justifyContent = 'center';
  seeMoreWrap.innerHTML = `<a class="see-more-btn" href="https://burbanofficial.com/shop.html">Discover more you might like</a>`;
  resultsGrid.appendChild(seeMoreWrap);
}

  const debouncedSearch = debounce((e) => performSearch(e.target.value), 180);

  inputLarge.addEventListener('input', debouncedSearch);

  // init: when overlay opens, focus + show suggestions
  const obs = new MutationObserver((mut) => {
    if (overlay.classList.contains('open')) {
      // small delay then show suggestions
      setTimeout(()=>performSearch(''), 50);
    }
  });
  obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
});
