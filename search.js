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
