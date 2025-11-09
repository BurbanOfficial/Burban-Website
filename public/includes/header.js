// header.js (ES module) - injecte header + svg filters + init nav interactions + search integration
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

    <!-- Icônes + hamburger + mini barre de recherche -->
    <div class="actions">
      <!-- MINI barre de recherche (identique à index.html) -->
      <button id="openSearchShort" class="search-short" aria-label="Search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search" aria-hidden="true" readonly />
      </button>

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

/* ---------- SVG filters (injected once) ---------- */
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
  const hasLiquid = !!document.getElementById('liquid');
  const hasGoo = !!document.querySelector('filter#goo');
  if (!hasLiquid || !hasGoo) {
    const tmp = document.createElement('div');
    tmp.innerHTML = SVG_FILTERS;
    document.body.insertBefore(tmp, document.body.firstChild);
  }
}

/* ---------- SCRIPTS EXTERNES (search.js + script.js) ---------- */
function appendScriptOnce(src, attrs = {}) {
  // évite les doublons
  if (Array.from(document.scripts).some(s => s.src && s.src.indexOf(src) !== -1)) return null;
  const s = document.createElement('script');
  s.src = src;
  // copier attributs (defer/async etc)
  Object.keys(attrs).forEach(k => s.setAttribute(k, attrs[k]));
  s.setAttribute('data-burban', 'injected');
  document.head.appendChild(s);
  return s;
}

function ensureSearchAndMainScripts() {
  // si tu héberges search.js et script.js à la racine comme discuté :
  const base = 'https://burbanofficial.com/';
  appendScriptOnce(base + 'search.js');
  appendScriptOnce(base + 'script.js');
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

/* ---------- SEARCH : fallback si search.js n'a pas été exécuté ---------- */
/*
  Raison : certaines pages produit peuvent ne pas charger search.js avant DOMContentLoaded.
  Ce fallback crée une overlay minimale et la logique de recherche (empreintée de ton search.js).
  Si search.js est présent et s'exécute, il prendra le pas (on vérifie l'existence de .search-overlay).
*/
function initSearchFallbackIfNeeded() {
  // si search.js a déjà injecté l'overlay, ne rien faire
  if (document.querySelector('.search-overlay')) return;

  const openBtn = document.getElementById('openSearchShort');
  if (!openBtn) return; // si pas de bouton, rien à faire

  // crée overlay minimal
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Recherche de produits">
      <div style="width:100%;">
        <input id="searchInputLarge" class="search-input-large" placeholder="Find your next Burban piece..." autocomplete="off" />
        <div id="searchNoResults" class="search-no-results" style="display:none;"></div>
      </div>
      <div class="search-results" aria-live="polite" aria-atomic="true">
        <div id="searchResults" class="results-grid"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const inputLarge = document.getElementById('searchInputLarge');
  const resultsGrid = document.getElementById('searchResults');
  const noResBox = document.getElementById('searchNoResults');

  function openOverlay() {
    overlay.classList.add('open');
    requestAnimationFrame(() => inputLarge.focus());
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    resultsGrid.innerHTML = '';
    if (noResBox) noResBox.style.display = 'none';
    inputLarge.value = '';
  }

  openBtn.addEventListener('click', openOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // debounce util
  let timer = null;
  function debounce(fn, ms=160) {
    return function(...args){
      clearTimeout(timer);
      timer = setTimeout(()=>fn(...args), ms);
    };
  }

  // fonctions de rendu (simplifiées mais compatibles avec BURBAN_PRODUCTS)
  function absoluteUrl(u) {
    if (!u) return '#';
    if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) {
      if (u.startsWith('/')) return window.location.origin + u;
      return u;
    }
    if (u.startsWith('/')) return window.location.origin + u;
    const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    return new URL(u, base).href;
  }

  function renderResults(list) {
    resultsGrid.innerHTML = '';
    if (!list.length) {
      noResBox.style.display = 'block';
      noResBox.innerHTML = `<strong>We couldn’t find that one. Maybe another keyword?</strong>`;
      return;
    }
    noResBox.style.display = 'none';
    list.forEach(p => {
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
        closeOverlay();
        setTimeout(()=>{ window.location.href = href; }, 120);
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
        closeOverlay();
        setTimeout(()=>{ window.location.href = href; }, 120);
      });
      resultsGrid.appendChild(a);
    });

    const seeMoreWrap = document.createElement('div');
    seeMoreWrap.style.gridColumn = '1 / -1';
    seeMoreWrap.style.display = 'flex';
    seeMoreWrap.style.justifyContent = 'center';
    seeMoreWrap.innerHTML = `<a class="see-more-btn" href="https://burbanofficial.com/shop.html">Discover more you might like</a>`;
    resultsGrid.appendChild(seeMoreWrap);
  }

  // search core (utilise window.BURBAN_PRODUCTS si disponible)
  function performSearch(q) {
    resultsGrid.innerHTML = '';
    if (noResBox) noResBox.style.display = 'none';
    q = String(q || '').trim().toLowerCase();
    const products = window.BURBAN_PRODUCTS || [];
    const isActive = typeof window.BURBAN_IS_PRODUCT_ACTIVE === 'function';
    const pool = products.filter(p => isActive ? window.BURBAN_IS_PRODUCT_ACTIVE(p) : true);
    if (!q) {
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
    if (results.length) renderResults(results);
    else {
      if (noResBox) {
        noResBox.style.display = 'block';
        noResBox.innerHTML = `<strong>We couldn’t find that one. Maybe another keyword?</strong>`;
      }
      renderSuggestions(pool);
    }
  }

  const debouncedSearch = debounce((e) => performSearch(e.target.value), 180);
  inputLarge.addEventListener('input', debouncedSearch);

  // show suggestions on open
  overlay.addEventListener('transitionend', () => {
    if (overlay.classList.contains('open')) performSearch('');
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
    // ensure the search and main scripts are present (avoid duplicates)
    ensureSearchAndMainScripts();
    // si search.js pour X raison n'a pas injecté le DOM (exécution différée),
    // on installe un fallback léger qui crée l'overlay + recherche (simple)
    // on retarde légèrement pour laisser une chance à search.js de s'exécuter normalement
    setTimeout(() => {
      if (!document.querySelector('.search-overlay')) {
        initSearchFallbackIfNeeded();
      }
    }, 600); // 600ms : assez court, ajuste si nécessaire
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
