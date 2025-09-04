// script.js
(function () {
  'use strict';

  // Attendre que le DOM soit prêt pour éviter les null references
  document.addEventListener('DOMContentLoaded', () => {

    // --- EXEMPLE DE DONNÉES PRODUITS ---
    // (conservez votre liste complète; j'ai gardé votre exemple ci-dessous)
    const products = [
      {
        id: 'metamorphosis',
        name: 'Metamorphosis',
        originalPrice: 20.99,
        price: 18.99,
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
        // availableFrom: '27/08/2025 20:20:00',
        // availableUntil: '27/08/2025 20:20:40'
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




      {
        id: 'urban-crest',
        name: 'Urban Crest',
        originalPrice: 21.99,
        price: 21.99,
        type: 'Cap',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/asPiEue.jpeg', hover: 'https://i.imgur.com/U0oUcsA.jpeg', url: '/public/urban-crest-ar00046.html' }
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
          { name: 'Dark Blue', code: '#171f2c', img: 'https://i.imgur.com/50AGnb5.jpeg', hover: 'https://i.imgur.com/WZgnZhx.jpeg', url: '/public/colorful-burst-ar00045.html' }
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
          { name: 'Dark Green', code: '#1a3626', img: 'https://i.imgur.com/UDBzhpS.jpeg', hover: 'https://i.imgur.com/uVeTzOQ.jpeg', url: '/public/urban-hibiscus-ar00044.html' },
          { name: 'Indigo Blue', code: '#395d82', img: 'https://i.imgur.com/4j5IjyP.jpeg', hover: 'https://i.imgur.com/8a0UYy0.jpeg', url: '/public/urban-hibiscus-ar00048.html' },
          { name: 'Sage Green', code: '#7e8560', img: 'https://i.imgur.com/62dxFU2.jpeg', hover: 'https://i.imgur.com/pMVsAJC.jpeg', url: '/public/urban-hibiscus-ar00047.html' }
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/ZP4zVSK.jpeg', hover: 'https://i.imgur.com/r9HQUCq.jpeg', url: '/public/universal-love-ar00043.html' }
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/m2tkvTm.jpeg', hover: 'https://i.imgur.com/EcjqfHS.jpeg', url: '/public/natural-glow-ar00042.html' },
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
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/7zR8liE.jpeg', hover: 'https://i.imgur.com/8GZ52nM.jpeg', url: '/public/mad-in-love-ar00041.html' },
          { name: 'Dark Blue', code: '#132e57', img: 'https://i.imgur.com/a3O4ESv.jpeg', hover: 'https://i.imgur.com/Seortkg.jpeg', url: '/public/mad-in-love-ar00040.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/morning-sweets-ar00039.html' },
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
          { name: 'Light Blue', code: '#c7d7ef', img: 'https://i.imgur.com/YTtg0ah.jpeg', hover: 'https://i.imgur.com/CHxj3Cs.jpeg', url: '/public/skate-ar00033.html' },
          { name: 'Pastel Pink', code: '#ffd8e1', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00034.html' },
          { name: 'Silver', code: '#e3e3dd', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00035.html' },
          { name: 'Natural', code: '#fef1d1', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00036.html' },
          { name: 'Lemon', code: '#f7fee5', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00037.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00038.html' },
          { name: 'Dark Green', code: '#223e25', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00027.html' },
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00028.html' },
          { name: 'Oxblood Black', code: '#2c1013', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00029.html' },
          { name: 'Team Purple', code: '#230f46', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00030.html' },
          { name: 'Maroon', code: '#721d37', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00031.html' },
          { name: 'Heather Blue', code: '#536ba7', img: 'https://i.imgur.com/IYQp1Om.jpeg', hover: 'https://i.imgur.com/3EAiQad.jpeg', url: '/public/skate-ar00032.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/lArV95v.jpeg', hover: 'https://i.imgur.com/QIM5Xl4.jpeg', url: '/public/starry-ar00026.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/2kJ87qf.jpeg', hover: 'https://i.imgur.com/3A3fP9Z.jpeg', url: '/public/cartoon-ar00025.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/3Tf7X89.jpeg', hover: 'https://i.imgur.com/h6QYpXG.jpeg', url: '/public/white-shine-ar00024.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/ReqYkdu.jpeg', hover: 'https://i.imgur.com/wyMnPJT.jpeg', url: '/public/stay-cool-ar00023.html' },
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
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/H5rlHBh.jpeg', hover: 'https://i.imgur.com/HEiFUHq.jpeg', url: '/public/elegance-ar00022.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/uQugDr8.jpeg', hover: 'https://i.imgur.com/JmKvvP8.jpeg', url: '/public/elegance-ar00021.html' },
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
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/5Ya85o8.jpeg', hover: 'https://i.imgur.com/pB50o1O.jpeg', url: '/public/emerald-ar00002.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/letVpMU.jpeg', hover: 'https://i.imgur.com/70YG2tk.jpeg', url: '/public/lavender-glow-ar00003.html' },
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
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/70hCMZv.jpeg', hover: 'https://i.imgur.com/4u6mGvR.jpeg', url: '/public/harmony-ar00004.html' },
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
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/WML7UGN.jpeg', hover: 'https://i.imgur.com/AX4e0vt.jpeg', url: '/public/bunny-chic-ar00015.html' },
          { name: 'Beige', code: '#f5e8ce', img: 'https://i.imgur.com/UBqXkLv.jpeg', hover: 'https://i.imgur.com/AGHE9LR.jpeg', url: '/public/bunny-chic-ar00014.html' },
          { name: 'Light Blue', code: '#d6edf7', img: 'https://i.imgur.com/hPiCIAc.jpeg', hover: 'https://i.imgur.com/20rKL01.jpeg', url: '/public/bunny-chic-ar00013.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/pziI0qx.jpeg', hover: 'https://i.imgur.com/qP7p6N0.jpeg', url: '/public/bunny-chic-ar00016.html' },
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

    // ------------------ PARSING DATE ROBUSTE ------------------
    function parseDateOrNull(dateInput) {
      if (dateInput === null || dateInput === undefined || dateInput === '') return null;
      if (typeof dateInput === 'number') return dateInput > 1e12 ? dateInput : dateInput * 1000;
      if (dateInput instanceof Date) {
        const t = dateInput.getTime();
        return Number.isFinite(t) ? t : null;
      }
      if (typeof dateInput !== 'string') return null;
      const s = dateInput.trim();
      let t = Date.parse(s);
      if (Number.isFinite(t)) return t;
      t = Date.parse(s.replace(' ', 'T'));
      if (Number.isFinite(t)) return t;
      const fr = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
      if (fr) {
        const day = Number(fr[1]), month = Number(fr[2]) - 1, year = Number(fr[3]), hour = Number(fr[4]||0), minute = Number(fr[5]||0), second = Number(fr[6]||0);
        const dt = new Date(year, month, day, hour, minute, second);
        return Number.isFinite(dt.getTime()) ? dt.getTime() : null;
      }
      console.warn('parseDateOrNull: impossible de parser la date:', dateInput);
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
        if (state.colors.size && ![...state.colors].some(c=> (p.colors||[]).some(pc=>pc.name===c))) return false;
        if (state.sizes.size  && ![...state.sizes].some(s=> (p.sizes||[]).includes(s)))         return false;
        if (state.cuts.size   && !state.cuts.has(p.cut))                                    return false;
        if (state.genders.size&& !state.genders.has(p.gender))                               return false;
        if (state.types.size  && !state.types.has(p.type))                                  return false;
        if (state.priceMin!==null && p.price < state.priceMin)                              return false;
        if (state.priceMax!==null && p.price > state.priceMax)                              return false;
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

  }); // end DOMContentLoaded

})(); // end IIFE

