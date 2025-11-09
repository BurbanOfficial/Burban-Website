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

// script.js
(function () {
  'use strict';

  // Attendre que le DOM soit prêt pour éviter les null references
  document.addEventListener('DOMContentLoaded', () => {

    // --- EXEMPLE DE DONNÉES PRODUITS ---
    // (conservez votre liste complète; j'ai gardé votre exemple ci-dessous)
    const products = [
      {
        id: 'Different',
        name: 'Different',
        originalPrice: 39.99,
        price: 39.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/Te0tyuu.jpeg', hover: 'https://i.imgur.com/qreEVes.jpeg', url: 'https://burbanofficial.com/public/different-ar00066.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false,
        availableFrom: '10/11/2025 00:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'Purple Reign',
        name: 'Purple Reign',
        originalPrice: 47.99,
        price: 47.99,
        type: 'Hoodie',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/8AxApDD.jpeg', hover: 'https://i.imgur.com/Lb8RAPy.jpeg', url: 'https://burbanofficial.com/public/purple-reign-ar00065.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false,
        availableFrom: '10/11/2025 00:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'Lil Devil',
        name: 'Lil Devil',
        originalPrice: 39.99,
        price: 39.99,
        type: 'Hoodie',
        colors: [
          { name: 'Brown', code: '#9e7551', img: 'https://i.imgur.com/gvUglRW.jpeg', hover: 'https://i.imgur.com/fIGHb40.jpeg', url: 'https://burbanofficial.com/public/lil-devil-ar00061.html' },
          { name: 'Beige', code: '#f4e7d6', img: 'https://i.imgur.com/Z8Fls59.jpeg', hover: 'https://i.imgur.com/IaCQNRj.jpeg', url: 'https://burbanofficial.com/public/lil-devil-ar00062.html' },
          { name: 'Athletic Heather', code: '#f2f2f2', img: 'https://i.imgur.com/JLIt8jf.jpeg', hover: 'https://i.imgur.com/mESyzoh.jpeg', url: 'https://burbanofficial.com/public/lil-devil-ar00063.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/pKXcxSH.jpeg', hover: 'https://i.imgur.com/LubJebH.jpeg', url: 'https://burbanofficial.com/public/lil-devil-ar00064.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: false,
        badge_europe: false,
        availableFrom: '10/11/2025 00:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'ECHO//01',
        name: 'ECHO//01',
        originalPrice: 53.90,
        price: 53.90,
        type: 'Knitted T-Shirt',
        colors: [
          { name: 'Coral', code: '#d68785', img: 'https://i.imgur.com/7CC5NdZ.jpeg', hover: 'https://i.imgur.com/aNFX6SC.jpeg', url: 'https://burbanofficial.com/public/echo01-ar00060.html' }
        ],
        sizes: ['3XS','2XS','S','M','L','XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: false,
        badge_europe: false,
        availableFrom: '10/11/2025 00:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'K.O. Cutie',
        name: 'K.O. Cutie',
        originalPrice: 21.99,
        price: 14.99,
        type: 'T-Shirt',
        colors: [
          { name: 'Dark Heather Blue', code: '#7a8ca8', img: 'https://i.imgur.com/Lf8kP4J.jpeg', hover: 'https://i.imgur.com/IrUukCq.jpeg', url: 'https://burbanofficial.com/public/k.o.cutie-ar00059.html' },
          { name: 'Heather Grey', code: '#cfcbc8', img: 'https://i.imgur.com/BJY2e2R.jpeg', hover: 'https://i.imgur.com/I6yweGx.jpeg', url: 'https://burbanofficial.com/public/k.o.cutie-ar00060.html' },
          { name: 'Khaki', code: '#6e6b4d', img: 'https://i.imgur.com/NoStK28.jpeg', hover: 'https://i.imgur.com/VbYkBzD.jpeg', url: 'https://burbanofficial.com/public/k.o.cutie-ar00061.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/fk6K9DD.jpeg', hover: 'https://i.imgur.com/suT2lpo.jpeg', url: 'https://burbanofficial.com/public/k.o.cutie-ar00062.html' }
        ],
        sizes: ['S','M','L','XL','2XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: true,
        availableFrom: '14/09/2025 09:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },



      
      {
        id: 'No Fear',
        name: 'No Fear',
        originalPrice: 23.99,
        price: 19.99,
        type: 'T-Shirt',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/TWzptrk.jpeg', hover: 'https://i.imgur.com/Y6xCRWm.jpeg', url: 'https://burbanofficial.com/public/no-fear-ar00058.html' }
        ],
        sizes: ['XS','S','M','L','XL','2XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: true,
        availableFrom: '14/09/2025 09:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'Royal Drip',
        name: 'Royal Drip',
        originalPrice: 31.99,
        price: 24.99,
        type: 'Bucket Hat',
        colors: [
          { name: 'Denim', code: '#0c223C', img: 'https://i.imgur.com/8SuOQaX.jpeg', hover: 'https://i.imgur.com/3vD7kTT.jpeg', url: 'https://burbanofficial.com/public/royal-drip-ar00057.html' }
        ],
        sizes: ['Unique'],
        cut: 'Other',
        gender: 'Men',
        badge_eco: true,
        badge_europe: true,
        availableFrom: '14/09/2025 09:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'Diamond Mouth',
        name: 'Diamond Mouth',
        originalPrice: 22.99,
        price: 14.99,
        type: 'T-Shirt',
        colors: [
          { name: 'Dark Heather Blue', code: '#7a8ca8', img: 'https://i.imgur.com/8CnQaze.jpeg', hover: 'https://i.imgur.com/SHRNZY4.jpeg', url: 'https://burbanofficial.com/public/diamond-mouth-ar00053.html' },
          { name: 'Heather Grey', code: '#cfcbc8', img: 'https://i.imgur.com/8RKakKY.jpeg', hover: 'https://i.imgur.com/jucCb3h.jpeg', url: 'https://burbanofficial.com/public/diamond-mouth-ar00054.html' },
          { name: 'Lavender', code: '#f7ecff', img: 'https://i.imgur.com/TVk0zf8.jpeg', hover: 'https://i.imgur.com/IhKilKK.jpeg', url: 'https://burbanofficial.com/public/diamond-mouth-ar00055.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/hFsTDZv.jpeg', hover: 'https://i.imgur.com/iGFKqze.jpeg', url: 'https://burbanofficial.com/public/diamond-mouth-ar00056.html' }
        ],
        sizes: ['S','M','L','XL','2XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: true,
        availableFrom: '14/09/2025 09:00:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'metamorphosis',
        name: 'Metamorphosis',
        originalPrice: 23.99,
        price: 20.99,
        type: 'T-Shirt',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/3OueieQ.jpeg', hover: 'https://i.imgur.com/ol3tK3L.jpeg', url: 'https://burbanofficial.com/public/metamorphosis-ar00050.html' },
          { name: 'Lavender', code: '#f7ecff', img: 'https://i.imgur.com/ITx8c7r.jpeg', hover: 'https://i.imgur.com/yeYYPqa.jpeg', url: 'https://burbanofficial.com/public/metamorphosis-ar00051.html' },
          { name: 'Pastel Pink', code: '#ffe9eb', img: 'https://i.imgur.com/0dnXLh4.jpeg', hover: 'https://i.imgur.com/HKaRX8P.jpeg', url: 'https://burbanofficial.com/public/metamorphosis-ar00052.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false,
        // availableFrom: '27/08/2025 20:20:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'celestial-b',
        name: 'Celestial B',
        originalPrice: 21.99,
        price: 15.99,
        type: 'T-Shirt',
        colors: [
          { name: 'White', code: '#fffefa', img: 'https://i.imgur.com/zZ2tww6.jpeg', hover: 'https://i.imgur.com/3TRibcn.jpeg', url: 'https://burbanofficial.com/public/celestial-b-ar00049.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },




      {
        id: 'urban-crest',
        name: 'Urban Crest',
        originalPrice: 21.99,
        price: 21.99,
        type: 'Cap',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/asPiEue.jpeg', hover: 'https://i.imgur.com/U0oUcsA.jpeg', url: 'https://burbanofficial.com/public/urban-crest-ar00046.html' }
        ],
        sizes: ['Unique'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },




      {
        id: 'colorful-burst',
        name: 'Colorful Burst',
        originalPrice: 34.99,
        price: 34.99,
        type: 'Sweatshirt',
        colors: [
          { name: 'Dark Blue', code: '#171f2c', img: 'https://i.imgur.com/50AGnb5.jpeg', hover: 'https://i.imgur.com/WZgnZhx.jpeg', url: 'https://burbanofficial.com/public/colorful-burst-ar00045.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: false,
        badge_europe: false
      },




      {
        id: 'urban-hibiscus',
        name: 'Urban Hibiscus',
        originalPrice: 23.99,
        price: 23.99,
        type: 'Sweatshirt',
        colors: [
          { name: 'Dark Green', code: '#1a3626', img: 'https://i.imgur.com/UDBzhpS.jpeg', hover: 'https://i.imgur.com/uVeTzOQ.jpeg', url: 'https://burbanofficial.com/public/urban-hibiscus-ar00044.html' },
          { name: 'Indigo Blue', code: '#395d82', img: 'https://i.imgur.com/4j5IjyP.jpeg', hover: 'https://i.imgur.com/8a0UYy0.jpeg', url: 'https://burbanofficial.com/public/urban-hibiscus-ar00048.html' },
          { name: 'Sage Green', code: '#7e8560', img: 'https://i.imgur.com/62dxFU2.jpeg', hover: 'https://i.imgur.com/pMVsAJC.jpeg', url: 'https://burbanofficial.com/public/urban-hibiscus-ar00047.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },




      {
        id: 'universal-love',
        name: 'Universal Love',
        originalPrice: 44.99,
        price: 44.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/ZP4zVSK.jpeg', hover: 'https://i.imgur.com/r9HQUCq.jpeg', url: 'https://burbanofficial.com/public/universal-love-ar00043.html' }
        ],
        sizes: ['S','M','L','XL','2XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },



      
      {
        id: 'natural-glow',
        name: 'Natural Glow',
        originalPrice: 44.99,
        price: 44.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/m2tkvTm.jpeg', hover: 'https://i.imgur.com/EcjqfHS.jpeg', url: 'https://burbanofficial.com/public/natural-glow-ar00042.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },



      {
        id: 'mad-in-love',
        name: 'Mad In Love',
        originalPrice: 54.99,
        price: 54.99,
        type: 'Hoodie',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/7zR8liE.jpeg', hover: 'https://i.imgur.com/8GZ52nM.jpeg', url: 'https://burbanofficial.com/public/mad-in-love-ar00041.html' },
          { name: 'Dark Blue', code: '#132e57', img: 'https://i.imgur.com/a3O4ESv.jpeg', hover: 'https://i.imgur.com/Seortkg.jpeg', url: 'https://burbanofficial.com/public/mad-in-love-ar00040.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },




      {
        id: 'morning-sweets',
        name: 'Morning Sweets',
        originalPrice: 23.99,
        price: 23.99,
        type: 'T-Shirt',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/morning-sweets-ar00039.html' },
          // …
        ],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },




      {
        id: 'skate',
        name: 'Skate',
        originalPrice: 16.99,
        price: 16.99,
        type: 'T-Shirt',
        colors: [
          { name: 'Light Blue', code: '#c7d7ef', img: 'https://i.imgur.com/YTtg0ah.jpeg', hover: 'https://i.imgur.com/CHxj3Cs.jpeg', url: 'https://burbanofficial.com/public/skate-ar00033.html' },
          { name: 'Pastel Pink', code: '#ffd8e1', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00034.html' },
          { name: 'Silver', code: '#e3e3dd', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00035.html' },
          { name: 'Natural', code: '#fef1d1', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00036.html' },
          { name: 'Lemon', code: '#f7fee5', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00037.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00038.html' },
          { name: 'Dark Green', code: '#223e25', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00027.html' },
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00028.html' },
          { name: 'Oxblood Black', code: '#2c1013', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00029.html' },
          { name: 'Team Purple', code: '#230f46', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00030.html' },
          { name: 'Maroon', code: '#721d37', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00031.html' },
          { name: 'Heather Blue', code: '#536ba7', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: 'https://burbanofficial.com/public/skate-ar00032.html' },
          // …
        ],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: false,
        badge_europe: false
      },




      {
        id: 'starry',
        name: 'Starry',
        originalPrice: 23.99,
        price: 23.99,
        type: 'Beanie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/lArV95v.jpeg', hover: 'https://i.imgur.com/QIM5Xl4.jpeg', url: 'https://burbanofficial.com/public/starry-ar00026.html' },
          // …
        ],
        sizes: ['Unique'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },



      {
        id: 'cartoon',
        name: 'Cartoon',
        originalPrice: 47.99,
        price: 47.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/2kJ87qf.jpeg', hover: 'https://i.imgur.com/3A3fP9Z.jpeg', url: 'https://burbanofficial.com/public/cartoon-ar00025.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'white-shine',
        name: 'White Shine',
        originalPrice: 23.99,
        price: 23.99,
        type: 'Beanie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/3Tf7X89.jpeg', hover: 'https://i.imgur.com/h6QYpXG.jpeg', url: 'https://burbanofficial.com/public/white-shine-ar00024.html' },
          // …
        ],
        sizes: ['Unique'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'stay-cool',
        name: 'Stay Cool',
        originalPrice: 51.99,
        price: 51.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/ReqYkdu.jpeg', hover: 'https://i.imgur.com/wyMnPJT.jpeg', url: 'https://burbanofficial.com/public/stay-cool-ar00023.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'elegance',
        name: 'Elegance',
        originalPrice: 19.99,
        price: 19.99,
        type: 'Beanie',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/H5rlHBh.jpeg', hover: 'https://i.imgur.com/HEiFUHq.jpeg', url: 'https://burbanofficial.com/public/elegance-ar00022.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/uQugDr8.jpeg', hover: 'https://i.imgur.com/JmKvvP8.jpeg', url: 'https://burbanofficial.com/public/elegance-ar00021.html' },
          // …
        ],
        sizes: ['Unique'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'emerald',
        name: 'Emerald',
        originalPrice: 47.99,
        price: 47.99,
        type: 'Hoodie',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/5Ya85o8.jpeg', hover: 'https://i.imgur.com/pB50o1O.jpeg', url: 'https://burbanofficial.com/public/emerald-ar00002.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'lavender-glow',
        name: 'Lavender Glow',
        originalPrice: 53.99,
        price: 53.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/letVpMU.jpeg', hover: 'https://i.imgur.com/70YG2tk.jpeg', url: 'https://burbanofficial.com/public/lavender-glow-ar00003.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'harmony',
        name: 'Harmony',
        originalPrice: 53.99,
        price: 53.99,
        type: 'Hoodie',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/70hCMZv.jpeg', hover: 'https://i.imgur.com/4u6mGvR.jpeg', url: 'https://burbanofficial.com/public/harmony-ar00004.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
    
    
    
      {
        id: 'bunny-chic',
        name: 'Bunny Chic',
        originalPrice: 47.99,
        price: 47.99,
        type: 'Hoodie',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/WML7UGN.jpeg', hover: 'https://i.imgur.com/AX4e0vt.jpeg', url: 'https://burbanofficial.com/public/bunny-chic-ar00015.html' },
          { name: 'Beige', code: '#f5e8ce', img: 'https://i.imgur.com/UBqXkLv.jpeg', hover: 'https://i.imgur.com/AGHE9LR.jpeg', url: 'https://burbanofficial.com/public/bunny-chic-ar00014.html' },
          { name: 'Light Blue', code: '#d6edf7', img: 'https://i.imgur.com/hPiCIAc.jpeg', hover: 'https://i.imgur.com/20rKL01.jpeg', url: 'https://burbanofficial.com/public/bunny-chic-ar00013.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/pziI0qx.jpeg', hover: 'https://i.imgur.com/qP7p6N0.jpeg', url: 'https://burbanofficial.com/public/bunny-chic-ar00016.html' },
          // …
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Other',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },
      // Ajout d'articles ici
    ];

    // --- compléter originalPrice si nécessaire ---
    products.forEach(p => {
      if (typeof p.originalPrice !== 'number') {
        p.originalPrice = p.price;
      }
    });

    // STATE & DOM refs
    let filtered = [...products];
    const state = {
      colors: new Set(),
      sizes: new Set(),
      cuts: new Set(),
      genders: new Set(),
      types: new Set(),
      priceMin: null,
      priceMax: null
    };

    const grid       = document.getElementById('productGrid');
    const countSpan  = document.getElementById('resultCount');
    const noRes      = document.getElementById('noResults');
    const btnFilter  = document.getElementById('openFilters');
    const modal      = document.getElementById('filterModal');
    const btnClose   = document.getElementById('closeFilters');
    const applyBtn   = document.getElementById('applyFilters');
    const applyCount = document.getElementById('applyCount');
    const clearAll   = document.getElementById('clearAll');
    // Element optionnel: bouton "Show all results" (id ou classe)
    const showAllBtn = document.getElementById('showAllResults') || document.querySelector('.show-all-results');

    // --- TRI SPÉCIAL POUR LES TAILLES ---
    const sizeOrder = ['3XS','2XS','XS','S','M','L','XL','2XL','3XL','4XL'];
    function compareSizes(a, b) {
      if (a === 'Unique') return 1;
      if (b === 'Unique') return -1;
      const ia = sizeOrder.indexOf(a);
      const ib = sizeOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, 'fr');
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }

    // Rend l’UI de chaque groupe de filtres (sécurisé si élément manquant)
    function renderFilterOptions(id, items) {
      const container = document.getElementById(id);
      if (!container) return;
      if (id === 'filterSizes') items.sort(compareSizes);
      else items.sort((a, b) => a.localeCompare(b, 'fr'));
      items.forEach(item => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        container.append(label);
      });
    }

    renderFilterOptions('filterColors',  [...new Set(products.flatMap(p=> (p.colors||[]).map(c=>c.name)))]);
    renderFilterOptions('filterSizes',   [...new Set(products.flatMap(p=> p.sizes || []))]);
    renderFilterOptions('filterCuts',    [...new Set(products.map(p=>p.cut))]);
    renderFilterOptions('filterGenders', [...new Set(products.map(p=>p.gender))]);
    renderFilterOptions('filterTypes',   [...new Set(products.map(p=>p.type))]);

    // ------------------ PARSING DATE ROBUSTE (remplace l'ancienne) ------------------
function parseDateOrNull(dateInput) {
  if (!dateInput) return null;

  // Date object
  if (dateInput instanceof Date) {
    const t = dateInput.getTime();
    return Number.isFinite(t) ? t : null;
  }

  // Numeric timestamp (seconds ou ms)
  if (typeof dateInput === 'number') {
    // si > 1e12 on considère déjà des ms, sinon seconds -> *1000
    return dateInput > 1e12 ? dateInput : dateInput * 1000;
  }

  if (typeof dateInput !== 'string') return null;
  const s = dateInput.trim();

  // ---- 1) TRY FRENCH FORMATS FIRST (dd/mm/yyyy[ hh:mm[:ss]])
  const fr = s.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (fr) {
    const day = Number(fr[1]);
    const month = Number(fr[2]) - 1; // month index 0-11
    const year = Number(fr[3].length === 2 ? '20' + fr[3] : fr[3]); // support yy -> 20yy
    const hour = Number(fr[4] || 0);
    const minute = Number(fr[5] || 0);
    const second = Number(fr[6] || 0);

    const dt = new Date(year, month, day, hour, minute, second);
    const ms = dt.getTime();
    if (Number.isFinite(ms)) return ms;
  }

  // ---- 2) TRY ISO-LIKE (replace space by T) then Date.parse (browser ISO)
  const iso = s.replace(/\s+/, 'T');
  const parsedIso = Date.parse(iso);
  if (!Number.isNaN(parsedIso)) return parsedIso;

  // ---- 3) FALLBACK to Date.parse original (some browsers may accept other locales)
  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) return parsed;

  // nothing worked
  console.warn('parseDateOrNull: could not parse date:', dateInput);
  return null;
}

// ------------------ VISIBILITÉ SELON DATE (avec debug) ------------------
function isProductActive(product, nowMs = Date.now()) {
  const from = parseDateOrNull(product.availableFrom);
  const until = parseDateOrNull(product.availableUntil);

  // debug pour savoir pourquoi un produit est masqué
  if (product.availableFrom && from === null) {
    console.warn(`Product "${product.id}" availableFrom non-parsable:`, product.availableFrom);
  }
  if (product.availableUntil && until === null) {
    console.warn(`Product "${product.id}" availableUntil non-parsable:`, product.availableUntil);
  }

  if (from !== null && nowMs < from) return false;   // pas encore disponible
  if (until !== null && nowMs > until) return false; // expiré
  return true;
}

    // ------------------ FILTRAGE (AVEC DATE) ------------------
    function getFilteredByState() {
      return products.filter(p => {
        // disponibilité par date
        if (!isProductActive(p)) return false;

        // filtres classiques
        if (state.colors.size && ![...state.colors].some(c => (p.colors||[]).some(pc => pc.name === c))) return false;
        if (state.sizes.size  && ![...state.sizes].some(s => (p.sizes||[]).includes(s)))                 return false;
        if (state.cuts.size   && !state.cuts.has(p.cut))                                                 return false;
        if (state.genders.size&& !state.genders.has(p.gender))                                           return false;
        if (state.types.size  && !state.types.has(p.type))                                               return false;
        if (state.priceMin!==null && p.price < state.priceMin)                                           return false;
        if (state.priceMax!==null && p.price > state.priceMax)                                           return false;

        return true;
      });
    }


    // ------------------ UTILITAIRES D'AFFICHAGE ------------------
    // IMPORTANT FIX: previewCount doit utiliser getFilteredByState() (les filtres courants)
    function previewCount() {
      const temp = getFilteredByState();
      // appliquer contrainte date aussi pour la prévisualisation
      return temp.filter(p => isProductActive(p)).length;
    }

    // met à jour les UI counts (applyCount, showAllBtn si présent)
    function updateCountsUI() {
      const c = previewCount();
      if (applyCount) applyCount.textContent = c;
      if (showAllBtn) {
        const existing = showAllBtn.getAttribute('data-original-text') || showAllBtn.textContent || '';
        if (!showAllBtn.getAttribute('data-original-text')) {
          showAllBtn.setAttribute('data-original-text', existing.trim());
        }
        const baseText = showAllBtn.getAttribute('data-original-text') || 'Show all results';
        showAllBtn.textContent = `${baseText} (${c})`;
      }
    }

    // ------------------ GESTION DES INPUTS (FILTRES) ------------------
    document.querySelectorAll('#filterForm input').forEach(input => {
      input.addEventListener('change', () => {
        const groupEl = input.closest('.filter-group') && input.closest('.filter-group').querySelector('summary');
        const group = groupEl ? groupEl.textContent.trim() : null;
        const val   = input.value;
        if (input.type === 'checkbox' && group) {
          const map = { 'Colors':'colors','Sizes':'sizes','Fits':'cuts','Genders':'genders','Types':'types' };
          const key = map[group];
          if (key) input.checked ? state[key].add(val) : state[key].delete(val);
        } else if (input.id==='priceMin') {
          state.priceMin = input.value?Number(input.value):null;
        } else if (input.id==='priceMax') {
          state.priceMax = input.value?Number(input.value):null;
        }
        // mise à jour dynamique du compteur dans la modal / bouton
        updateCountsUI();
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        filtered = getFilteredByState();
        renderProducts();
        if (modal) modal.classList.remove('open');
        // après appliquer, assurez-vous que le bouton "show all" et applyCount sont à jour
        updateCountsUI();
      });
    }

    // ------------------ RENDER PRODUCTS ------------------
    function getVisibleProducts(nowMs = Date.now()) {
      return filtered.filter(p => isProductActive(p, nowMs));
    }

    function renderProducts() {
      if (!grid) return;
      const visible = getVisibleProducts();
      grid.innerHTML = '';
      if (!visible.length) {
        if (noRes) noRes.classList.remove('hidden');
        if (countSpan) countSpan.textContent = '0 articles';
        if (applyCount) applyCount.textContent = '0';
        return;
      }
      if (noRes) noRes.classList.add('hidden');
      if (countSpan) countSpan.textContent  = `${visible.length} article${visible.length>1?'s':''}`;
      if (applyCount) applyCount.textContent = visible.length;
      if (showAllBtn) {
        updateCountsUI();
      }

      visible.forEach(p => {
        const card = document.createElement('a');
        card.className = 'product-card';
        const dc = (p.colors && p.colors[0]) ? p.colors[0] : { url: '#', name: '', img: '', hover: '' };
        card.href = `${dc.url || '#'}?color=${encodeURIComponent(dc.name || '')}`;

        let priceHTML;
        if (p.price < p.originalPrice) {
          const discount = Math.round((p.originalPrice - p.price) / p.originalPrice * 100);
          priceHTML = `
            <p class="price">
              <span class="original">${p.originalPrice}€</span>
              <span class="sale">${p.price}€</span>
              <span class="discount">-${discount}%</span>
            </p>`;
        } else {
          priceHTML = `<p>${p.price}€</p>`;
        }

        card.innerHTML = `
          <div class="img-wrap">
            <img src="${dc.img || ''}" data-hover="${dc.hover || ''}" alt="${p.name || ''}">
          </div>
          <div class="info">
            <h3>${p.name}</h3>
            ${priceHTML}
            <div class="swatches"></div>
          </div>`;

        const badges = document.createElement('div');
        badges.className = 'badges';
        if (p.badge_eco) {
          const ecoBadge = document.createElement('div');
          ecoBadge.className = 'badge eco';
          ecoBadge.innerHTML = `<i class="fas fa-leaf"></i><span>ecological</span>`;
          badges.append(ecoBadge);
        }
        if (p.badge_europe) {
          const euroBadge = document.createElement('div');
          euroBadge.className = 'badge europe';
          euroBadge.innerHTML = `<i class="fa-solid fa-earth-africa"></i><span>Made&nbsp;in&nbsp;Europe</span>`;
          badges.append(euroBadge);
        }
        if (badges.children.length) card.prepend(badges);

        const sw = card.querySelector('.swatches');
        if (sw && p.colors && p.colors.length) {
          p.colors.slice(0,6).forEach(c => {
            const a = document.createElement('a');
            a.className = 'swatch';
            a.style.backgroundColor = c.code || '#ccc';
            a.title = c.name || '';
            a.href = `${c.url || '#'}?color=${encodeURIComponent(c.name || '')}`;
            sw.append(a);
          });
          if (p.colors.length > 6) {
            const more = document.createElement('span');
            more.className = 'swatch more';
            more.textContent = `+${p.colors.length-6}`;
            sw.append(more);
          }
        }

        const prodImg = card.querySelector('.img-wrap img');
        if (prodImg) {
          prodImg.addEventListener('mouseenter', () => { if (prodImg.dataset && prodImg.dataset.hover) prodImg.src = prodImg.dataset.hover; });
          prodImg.addEventListener('mouseleave', () => { if (dc && dc.img) prodImg.src = dc.img; });
        }

        grid.append(card);
      });
    }

    // ------------------ CLEAR / MODAL / INIT ------------------
    if (clearAll) {
      clearAll.addEventListener('click', () => {
        ['colors','sizes','cuts','genders','types'].forEach(k => state[k].clear());
        state.priceMin = state.priceMax = null;
        document.querySelectorAll('#filterForm input').forEach(i => {
          i.checked = false;
          if (i.type==='number') i.value = '';
        });
        filtered = [...products];
        renderProducts();
        updateCountsUI();
        const visibleCount = getVisibleProducts().length;
        if (applyCount) applyCount.textContent = visibleCount;
        if (countSpan) countSpan.textContent  = `${visibleCount} article${visibleCount>1?'s':''}`;
      });
    }

    if (btnFilter) btnFilter.addEventListener('click', () => modal && modal.classList.add('open'));
    if (btnClose) btnClose.addEventListener('click', () => modal && modal.classList.remove('open'));

    // Initialisation
    filtered = getFilteredByState();
    renderProducts();
    updateCountsUI();

    // ------------------ MISE À JOUR AUTOMATIQUE CHAQUE SECONDE (précision seconde) ------------------
    let lastVisibleKey = null;
    setInterval(() => {
      try {
        const now = Date.now();
        const visible = getVisibleProducts(now);
        const key = visible.map(p => p.id).join(',') + '|' + visible.length;
        if (key !== lastVisibleKey) {
          lastVisibleKey = key;
          renderProducts();
          updateCountsUI();
        }
      } catch (err) {
        console.error('Erreur périodique:', err);
      }
    }, 1000);
    
    // expose pour la search (necessaire pour que la recherche sache quels produits sont "disponibles")
    window.BURBAN_PRODUCTS = products;
    window.BURBAN_IS_PRODUCT_ACTIVE = isProductActive;

  }); // end DOMContentLoaded

})(); // end IIFE

