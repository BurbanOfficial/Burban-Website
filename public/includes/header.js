// header.js (ES module) - injecte header + svg filters + init nav interactions + search overlay
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
  </ul>
</div>
`;

// Search overlay HTML (injected once)
const SEARCH_OVERLAY_HTML = `
  <div id="searchOverlay" class="search-overlay" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="search-overlay-backdrop" data-action="close"></div>
    <div class="search-overlay-panel" role="document" aria-labelledby="searchOverlayLabel">
      <button class="search-close" aria-label="Fermer la recherche" data-action="close">&times;</button>
      <h2 id="searchOverlayLabel" class="visually-hidden">Recherche</h2>

      <div class="search-box">
        <input id="searchInput" type="search" placeholder="Search products, styles or keywords..." aria-label="Search" autocomplete="off" />
        <button id="searchSubmit" aria-label="Lancer la recherche"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>

      <div id="searchSuggestions" class="search-suggestions" aria-live="polite"></div>
      <div id="searchResults" class="search-results" aria-live="polite"></div>
    </div>
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
  const hasLiquid = !!document.getElementById('liquid');
  const hasGoo = !!document.querySelector('filter#goo');
  if (!hasLiquid || !hasGoo) {
    const tmp = document.createElement('div');
    tmp.innerHTML = SVG_FILTERS;
    document.body.insertBefore(tmp, document.body.firstChild);
  }
}

function injectSearchOverlayIfMissing() {
  if (document.getElementById('searchOverlay')) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = SEARCH_OVERLAY_HTML;
  // insert after header to keep DOM order predictable
  const header = document.querySelector('header.header');
  if (header && header.parentNode) header.parentNode.insertBefore(tmp, header.nextSibling);
  else document.body.insertBefore(tmp, document.body.firstChild);
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

/* ---------- Search (overlay) ---------- */
function initSearchOverlay() {
  const openBtn = document.getElementById('openSearchShort');
  const overlay = document.getElementById('searchOverlay');
  if (!openBtn || !overlay) return;

  const panel = overlay.querySelector('.search-overlay-panel');
  const input = overlay.querySelector('#searchInput');
  const submit = overlay.querySelector('#searchSubmit');
  const suggestions = overlay.querySelector('#searchSuggestions');
  const results = overlay.querySelector('#searchResults');

  let lastQuery = '';
  let debounceTimer = null;

  function openOverlay() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus
    setTimeout(() => input && input.focus(), 50);
    // emit event for external search logic (search.js) if needed
    window.dispatchEvent(new CustomEvent('searchOverlayOpened'));
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // clear UI
    if (suggestions) suggestions.innerHTML = '';
    // emit close event
    window.dispatchEvent(new CustomEvent('searchOverlayClosed'));
  }

  openBtn.addEventListener('click', () => openOverlay());

  // close buttons / backdrop
  overlay.querySelectorAll('[data-action="close"]').forEach(el => el.addEventListener('click', closeOverlay));
  overlay.querySelector('.search-close').addEventListener('click', closeOverlay);

  // keyboard: Esc closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });

  function renderNoResults(q) {
    results.innerHTML = `<div class="no-results">No results for "${escapeHtml(q)}"</div>`;
  }

  function renderResults(items) {
    if (!items || items.length === 0) {
      renderNoResults(lastQuery);
      return;
    }
    results.innerHTML = items.map(i => (
      `<a class="search-result-item" href="${escapeHtml(i.url || '#')}">
         <div class="sr-thumb"><img src="${escapeHtml(i.image || '')}" alt="" loading="lazy"/></div>
         <div class="sr-meta"><strong>${escapeHtml(i.title || i.name || '')}</strong><div class="sr-price">${escapeHtml(i.price || '')}</div></div>
       </a>`
    )).join('');
  }

  // Basic escape helper
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  // Try to call a search provider from search.js if present.
  // search.js can expose window.search or window.performSearch(query) returning a Promise that resolves to an array of items.
  function callSearchProvider(q) {
    if (window.search && typeof window.search.query === 'function') {
      return Promise.resolve(window.search.query(q));
    }
    if (typeof window.performSearch === 'function') {
      return Promise.resolve(window.performSearch(q));
    }
    // fallback: no provider available -> show helpful message
    return Promise.resolve([]);
  }

  function doSearch(q) {
    lastQuery = q;
    if (!q || q.trim().length < 1) {
      suggestions.innerHTML = '';
      results.innerHTML = '';
      return;
    }

    // show a simple "searching" state
    suggestions.innerHTML = `<div class="searching">Searching…</div>`;
    results.innerHTML = '';

    return callSearchProvider(q).then(items => {
      suggestions.innerHTML = '';
      renderResults(items);
    }).catch(err => {
      suggestions.innerHTML = `<div class="search-error">Search unavailable</div>`;
      console.error('Search provider error', err);
    });
  }

  // debounce input
  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => doSearch(q), 250);
    });

    // submit on enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch(input.value);
      }
    });
  }

  if (submit) {
    submit.addEventListener('click', (e) => {
      e.preventDefault();
      if (input) doSearch(input.value);
    });
  }

  // Expose a small API so external scripts can open/close the overlay
  window.__BURBAN_SEARCH = window.__BURBAN_SEARCH || {};
  window.__BURBAN_SEARCH.open = openOverlay;
  window.__BURBAN_SEARCH.close = closeOverlay;
}

/* ---------- Inject optional external scripts (search.js + script.js) ---------- */
function injectExternalScripts() {
  // Avoid double injection
  const existing = Array.from(document.querySelectorAll('script')).map(s => s.src || '').filter(Boolean);
  if (!existing.includes('search.js') && !existing.some(s => s.endsWith('/search.js'))) {
    const s = document.createElement('script');
    s.src = 'search.js';
    s.defer = true;
    document.body.appendChild(s);
  }
  if (!existing.includes('script.js') && !existing.some(s => s.endsWith('/script.js'))) {
    const s2 = document.createElement('script');
    s2.src = 'script.js';
    s2.defer = true;
    document.body.appendChild(s2);
  }
}

/* ---------- Init all ---------- */
function initAll() {
  injectHeader();
  injectSvgFiltersIfMissing();
  injectSearchOverlayIfMissing();
  injectExternalScripts();

  // small delay for injected DOM to be present
  requestAnimationFrame(() => {
    initOverlayMenu();
    initLanguageSelectors();
    updateYearIfPresent();
    setActiveNavByPath();
    initNavPuck();
    initSearchOverlay();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
