// script.js
(function () {
  'use strict';

  // Attendre que le DOM soit prêt pour éviter les null references
  document.addEventListener('DOMContentLoaded', () => {

    // --- DONNÉES PRODUITS (exemple complet; conservez le vôtre, mais faites attention aux virgules) ---
    const products = [
      {
        id: 'metamorphosis',
        name: 'Metamorphosis',
        originalPrice: 20.99,
        price: 20.99,
        type: 'T-Shirt',
        colors: [
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/3OueieQ.jpeg', hover: 'https://i.imgur.com/ol3tK3L.jpeg', url: '/public/metamorphosis-ar00050.html' },
          { name: 'Lavender', code: '#f7ecff', img: 'https://i.imgur.com/ITx8c7r.jpeg', hover: 'https://i.imgur.com/yeYYPqa.jpeg', url: '/public/metamorphosis-ar00051.html' },
          { name: 'Pastel Pink', code: '#ffe9eb', img: 'https://i.imgur.com/0dnXLh4.jpeg', hover: 'https://i.imgur.com/HKaRX8P.jpeg', url: '/public/metamorphosis-ar00052.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false,
        availableFrom: '26/08/2025 13:48'
      },

      {
        id: 'celestial-b',
        name: 'Celestial B',
        originalPrice: 15.99,
        price: 15.99,
        type: 'T-Shirt',
        colors: [
          { name: 'White', code: '#fffefa', img: 'https://i.imgur.com/zZ2tww6.jpeg', hover: 'https://i.imgur.com/3TRibcn.jpeg', url: '/public/celestial-b-ar00049.html' }
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: false
      },

      // ... (Ajoutez ici les autres produits - veillez à la syntaxe)
    ];

    // --- sécurité : compléter originalPrice s'il manque ---
    products.forEach(p => {
      if (typeof p.originalPrice !== 'number') p.originalPrice = p.price;
    });

    // STATE & DOM refs (chargées après DOMContentLoaded donc sûres, mais on check quand même)
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

    // --- TRI SPÉCIAL POUR LES TAILLES ---
    const sizeOrder = ['XS','S','M','L','XL','2XL','3XL','4XL'];
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

    // Rend l’UI de chaque groupe de filtres (si présent)
    function renderFilterOptions(id, items) {
      const container = document.getElementById(id);
      if (!container) return;
      if (id === 'filterSizes') items.sort(compareSizes);
      else items.sort((a,b) => a.localeCompare(b, 'fr'));
      items.forEach(item => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        container.append(label);
      });
    }

    renderFilterOptions('filterColors',  [...new Set(products.flatMap(p => (p.colors||[]).map(c => c.name)))]);
    renderFilterOptions('filterSizes',   [...new Set(products.flatMap(p => p.sizes || []))]);
    renderFilterOptions('filterCuts',    [...new Set(products.map(p => p.cut))]);
    renderFilterOptions('filterGenders', [...new Set(products.map(p => p.gender))]);
    renderFilterOptions('filterTypes',   [...new Set(products.map(p => p.type))]);

    // ------------------ PARSING DATE ROBUSTE ------------------
    function parseDateOrNull(value) {
      if (value === null || value === undefined || value === '') return null;
      if (typeof value === 'number') {
        // seconds -> ms
        return value > 1e12 ? value : value * 1000;
      }
      if (value instanceof Date) {
        const t = value.getTime();
        return Number.isFinite(t) ? t : null;
      }
      if (typeof value !== 'string') return null;
      const s = value.trim();
      // try native parse (ISO)
      let t = Date.parse(s);
      if (Number.isFinite(t)) return t;
      // replace space with T
      t = Date.parse(s.replace(' ', 'T'));
      if (Number.isFinite(t)) return t;
      // french format DD/MM/YYYY[ HH:MM(:SS)]
      const fr = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
      if (fr) {
        const day = Number(fr[1]), month = Number(fr[2]) - 1, year = Number(fr[3]), hour = Number(fr[4]||0), minute = Number(fr[5]||0), second = Number(fr[6]||0);
        const dt = new Date(year, month, day, hour, minute, second);
        return Number.isFinite(dt.getTime()) ? dt.getTime() : null;
      }
      // fallback warn
      console.warn('parseDateOrNull: impossible de parser la date:', value);
      return null;
    }

    // ------------------ VISIBILITÉ SELON DATE ------------------
    function isProductActive(product, nowMs = Date.now()) {
      const from = parseDateOrNull(product.availableFrom);
      const until = parseDateOrNull(product.availableUntil);
      if (from !== null && nowMs < from) return false;
      if (until !== null && nowMs > until) return false;
      return true;
    }

    // ------------------ FILTRAGE (SANS DATE) ------------------
    function getFilteredByState() {
      return products.filter(p => {
        if (state.colors.size && ![...state.colors].some(c => (p.colors||[]).some(pc => pc.name === c))) return false;
        if (state.sizes.size && ![...state.sizes].some(s => (p.sizes||[]).includes(s))) return false;
        if (state.cuts.size && !state.cuts.has(p.cut)) return false;
        if (state.genders.size && !state.genders.has(p.gender)) return false;
        if (state.types.size && !state.types.has(p.type)) return false;
        if (state.priceMin !== null && p.price < state.priceMin) return false;
        if (state.priceMax !== null && p.price > state.priceMax) return false;
        return true;
      });
    }

    // ------------------ AFFICHAGE ------------------
    function getVisibleProducts(nowMs = Date.now()) {
      // on applique d'abord les filtres actuels (variable filtered),
      // puis on retire ceux dont la date ne colle pas
      return filtered.filter(p => isProductActive(p, nowMs));
    }

    function previewCount() {
      return getVisibleProducts().length;
    }

    // ------------------ GESTION DES INPUTS (FILTRES) ------------------
    const filterFormInputs = document.querySelectorAll('#filterForm input');
    if (filterFormInputs && filterFormInputs.length) {
      filterFormInputs.forEach(input => {
        input.addEventListener('change', () => {
          const groupEl = input.closest('.filter-group') && input.closest('.filter-group').querySelector('summary');
          const group = groupEl ? groupEl.textContent.trim() : null;
          const val = input.value;
          if (input.type === 'checkbox' && group) {
            const map = { 'Colors':'colors','Sizes':'sizes','Fits':'cuts','Genders':'genders','Types':'types' };
            const key = map[group];
            if (key) input.checked ? state[key].add(val) : state[key].delete(val);
          } else if (input.id === 'priceMin') {
            state.priceMin = input.value ? Number(input.value) : null;
          } else if (input.id === 'priceMax') {
            state.priceMax = input.value ? Number(input.value) : null;
          }
          if (applyCount) applyCount.textContent = previewCount();
        });
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        filtered = getFilteredByState();
        renderProducts();
        if (modal) modal.classList.remove('open');
      });
    }

    // ------------------ RENDER PRODUCTS ------------------
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
      if (countSpan) countSpan.textContent = `${visible.length} article${visible.length > 1 ? 's' : ''}`;
      if (applyCount) applyCount.textContent = visible.length;

      visible.forEach(p => {
        const card = document.createElement('a');
        card.className = 'product-card';
        const dc = (p.colors && p.colors[0]) ? p.colors[0] : { url: '#', name: '', img: '', hover: '' };
        card.href = `${dc.url || '#'}?color=${encodeURIComponent(dc.name || '')}`;

        // Prix
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
            <img src="${dc.img || ''}" data-hover="${dc.hover || ''}" alt="${(p.name || '')}">
          </div>
          <div class="info">
            <h3>${p.name}</h3>
            ${priceHTML}
            <div class="swatches"></div>
          </div>`;

        // Badges
        const badges = document.createElement('div');
        badges.className = 'badges';
        if (p.badge_eco) {
          const eco = document.createElement('div');
          eco.className = 'badge eco';
          eco.innerHTML = `<i class="fas fa-leaf"></i><span>ecological</span>`;
          badges.append(eco);
        }
        if (p.badge_europe) {
          const euro = document.createElement('div');
          euro.className = 'badge europe';
          euro.innerHTML = `<i class="fa-solid fa-earth-africa"></i><span>Made&nbsp;in&nbsp;Europe</span>`;
          badges.append(euro);
        }
        if (badges.children.length) card.prepend(badges);

        // Swatches
        const sw = card.querySelector('.swatches');
        if (sw && p.colors && p.colors.length) {
          p.colors.slice(0,6).forEach(c => {
            const a = document.createElement('a');
            a.className = 'swatch';
            a.style.backgroundColor = c.code || '#ccc';
            a.title = c.name || '';
            a.href = `${c.url || '#'}?color=${encodeURIComponent(c.name||'')}`;
            sw.append(a);
          });
          if (p.colors.length > 6) {
            const more = document.createElement('span');
            more.className = 'swatch more';
            more.textContent = `+${p.colors.length - 6}`;
            sw.append(more);
          }
        }

        const prodImg = card.querySelector('.img-wrap img');
        if (prodImg) {
          prodImg.addEventListener('mouseenter', () => { if (prodImg.dataset && prodImg.dataset.hover) prodImg.src = prodImg.dataset.hover; });
          prodImg.addEventListener('mouseleave', () => { if (dc.img) prodImg.src = dc.img; });
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
          if (i.type === 'number') i.value = '';
        });
        filtered = [...products];
        renderProducts();
        const vc = getVisibleProducts().length;
        if (applyCount) applyCount.textContent = vc;
        if (countSpan) countSpan.textContent = `${vc} article${vc > 1 ? 's' : ''}`;
      });
    }

    if (btnFilter) btnFilter.addEventListener('click', () => { if (modal) modal.classList.add('open'); });
    if (btnClose) btnClose.addEventListener('click', () => { if (modal) modal.classList.remove('open'); });

    // INIT
    filtered = getFilteredByState();
    renderProducts();
    if (applyCount) applyCount.textContent = getVisibleProducts().length;

    // ------------------ CHECK CHANGEMENTS DE VISIBILITÉ CHAQUE SECONDE ------------------
    let lastVisibleKey = null;
    setInterval(() => {
      try {
        const now = Date.now();
        const visible = getVisibleProducts(now);
        const key = visible.map(p => p.id).join(',') + '|' + visible.length;
        if (key !== lastVisibleKey) {
          lastVisibleKey = key;
          renderProducts();
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour périodique :', err);
      }
    }, 1000);

  }); // end DOMContentLoaded

})(); // end IIFE
