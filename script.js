// script.js
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // --- EXEMPLE DE DONNÉES PRODUITS ---
    // (conservez votre liste complète; j'ai gardé votre exemple ci-dessous)
    const products = [
      {
        id: 'No Fear',
        name: 'No Fear',
        originalPrice: 23.99,
        price: 19.99,
        type: 'T-Shirt',
        colors: [
          { name: 'Black', code: '#000', img: 'https://i.imgur.com/TWzptrk.jpeg', hover: 'https://i.imgur.com/Y6xCRWm.jpeg', url: '/public/no-fear-ar00058.html' }
        ],
        sizes: ['XS','S','M','L','XL','2XL'],
        cut: 'Straight',
        gender: 'Unisex',
        badge_eco: true,
        badge_europe: true,
        availableFrom: '11/09/2025 21:45:00',
        // availableUntil: '27/08/2025 20:20:40'
      },




      {
        id: 'Royal Drip',
        name: 'Royal Drip',
        originalPrice: 31.99,
        price: 24.99,
        type: 'Bucket Hat',
        colors: [
          { name: 'Denim', code: 'linear-gradient(45deg, #0c223C, #547da0)', img: 'https://i.imgur.com/8SuOQaX.jpeg', hover: 'https://i.imgur.com/3vD7kTT.jpeg', url: '/public/royal-drip-ar00057.html' }
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
          { name: 'Dark Heather Blue', code: '#7a8ca8', img: 'https://i.imgur.com/8CnQaze.jpeg', hover: 'https://i.imgur.com/SHRNZY4.jpeg', url: '/public/diamond-mouth-ar00053.html' },
          { name: 'Heather Grey', code: '#cfcbc8', img: 'https://i.imgur.com/8RKakKY.jpeg', hover: 'https://i.imgur.com/jucCb3h.jpeg', url: '/public/diamond-mouth-ar00054.html' },
          { name: 'Lavender', code: '#f7ecff', img: 'https://i.imgur.com/TVk0zf8.jpeg', hover: 'https://i.imgur.com/IhKilKK.jpeg', url: '/public/diamond-mouth-ar00055.html' },
          { name: 'White', code: '#fff', img: 'https://i.imgur.com/hFsTDZv.jpeg', hover: 'https://i.imgur.com/iGFKqze.jpeg', url: '/public/diamond-mouth-ar00056.html' }
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
        originalPrice: 21.99,
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
    const showAllBtn = document.getElementById('showAllResults') || document.querySelector('.show-all-results');

    const sizeOrder = ['XS','S','M','L','XL','2XL','3XL','4XL'];
    function compareSizes(a, b) {
      if (a === 'Unique') return 1;
      if (b === 'Unique') return -1;
      const ia = sizeOrder.indexOf(a), ib = sizeOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, 'fr');
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }

    function renderFilterOptions(id, items) {
      const container = document.getElementById(id);
      if (!container) return;
      if (id === 'filterSizes') items.sort(compareSizes);
      else items.sort((a,b)=>a.localeCompare(b,'fr'));
      items.forEach(item=>{
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

    function parseDateOrNull(dateInput) {
      if (!dateInput) return null;
      const t = Date.parse(dateInput);
      if (!isNaN(t)) return t;
      const fr = dateInput.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
      if (fr) {
        const day = +fr[1], month = +fr[2]-1, year = +fr[3], hour = +(fr[4]||0), min = +(fr[5]||0), sec = +(fr[6]||0);
        const dt = new Date(year, month, day, hour, min, sec);
        return isNaN(dt.getTime()) ? null : dt.getTime();
      }
      return null;
    }

    function isProductActive(product, now = Date.now()) {
      const from = parseDateOrNull(product.availableFrom);
      const until = parseDateOrNull(product.availableUntil);
      if (from && now < from) return false;
      if (until && now > until) return false;
      return true;
    }

    function getFilteredByState() {
      return products.filter(p => {
        if (!isProductActive(p)) return false;
        if (state.colors.size && ![...state.colors].some(c => (p.colors||[]).some(pc => pc.name === c))) return false;
        if (state.sizes.size && ![...state.sizes].some(s => (p.sizes||[]).includes(s))) return false;
        if (state.cuts.size && !state.cuts.has(p.cut)) return false;
        if (state.genders.size && !state.genders.has(p.gender)) return false;
        if (state.types.size && !state.types.has(p.type)) return false;
        if (state.priceMin!==null && p.price < state.priceMin) return false;
        if (state.priceMax!==null && p.price > state.priceMax) return false;
        return true;
      });
    }

    function previewCount() {
      return getFilteredByState().filter(p=>isProductActive(p)).length;
    }

    function updateCountsUI() {
      const c = previewCount();
      if (applyCount) applyCount.textContent = c;
      if (showAllBtn) {
        const baseText = showAllBtn.getAttribute('data-original-text') || showAllBtn.textContent || 'Show all results';
        if (!showAllBtn.getAttribute('data-original-text')) showAllBtn.setAttribute('data-original-text', baseText);
        showAllBtn.textContent = `${baseText} (${c})`;
      }
    }

    document.querySelectorAll('#filterForm input').forEach(input => {
      input.addEventListener('change', () => {
        const groupEl = input.closest('.filter-group')?.querySelector('summary');
        const group = groupEl?.textContent.trim();
        const val = input.value;
        const map = { 'Colors':'colors','Sizes':'sizes','Fits':'cuts','Genders':'genders','Types':'types' };
        if (input.type==='checkbox' && group && map[group]) {
          const key = map[group];
          input.checked ? state[key].add(val) : state[key].delete(val);
        } else if (input.id==='priceMin') state.priceMin = input.value ? +input.value : null;
        else if (input.id==='priceMax') state.priceMax = input.value ? +input.value : null;
        updateCountsUI();
      });
    });

    if (applyBtn) applyBtn.addEventListener('click', ()=>{
      renderProducts();
      if (modal) modal.classList.remove('open');
      updateCountsUI();
    });

    function getVisibleProducts(now = Date.now()) {
      return getFilteredByState().filter(p=>isProductActive(p, now));
    }

    function renderProducts() {
      if (!grid) return;
      const visible = getVisibleProducts();
      grid.innerHTML = '';
      if (!visible.length) {
        noRes?.classList.remove('hidden');
        if (countSpan) countSpan.textContent = '0 articles';
        if (applyCount) applyCount.textContent = '0';
        return;
      }
      noRes?.classList.add('hidden');
      countSpan && (countSpan.textContent = `${visible.length} article${visible.length>1?'s':''}`);
      applyCount && (applyCount.textContent = visible.length);
      showAllBtn && updateCountsUI();

      visible.forEach(p=>{
        const card = document.createElement('a');
        card.className = 'product-card';
        const dc = (p.colors && p.colors[0]) || { url:'#', name:'', img:'', hover:'' };
        card.href = `${dc.url}?color=${encodeURIComponent(dc.name)}`;
        const priceHTML = (p.price<p.originalPrice)
          ? `<p class="price"><span class="original">${p.originalPrice}€</span><span class="sale">${p.price}€</span><span class="discount">-${Math.round((p.originalPrice-p.price)/p.originalPrice*100)}%</span></p>`
          : `<p>${p.price}€</p>`;
        card.innerHTML = `<div class="img-wrap"><img src="${dc.img}" data-hover="${dc.hover}" alt="${p.name}"></div><div class="info"><h3>${p.name}</h3>${priceHTML}<div class="swatches"></div></div>`;
        const sw = card.querySelector('.swatches');
        p.colors?.slice(0,6).forEach(c=>{
          const a = document.createElement('a');
          a.className = 'swatch';
          a.style.backgroundColor = c.code;
          a.title = c.name;
          a.href = `${c.url}?color=${encodeURIComponent(c.name)}`;
          sw.append(a);
        });
        if (p.colors && p.colors.length>6) {
          const more = document.createElement('span');
          more.className='swatch more';
          more.textContent = `+${p.colors.length-6}`;
          sw.append(more);
        }
        const imgEl = card.querySelector('.img-wrap img');
        imgEl?.addEventListener('mouseenter',()=>{ if (imgEl.dataset.hover) imgEl.src = imgEl.dataset.hover; });
        imgEl?.addEventListener('mouseleave',()=>{ imgEl.src = dc.img; });
        grid.append(card);
      });
    }

    clearAll?.addEventListener('click', ()=>{
      ['colors','sizes','cuts','genders','types'].forEach(k=>state[k].clear());
      state.priceMin = state.priceMax = null;
      document.querySelectorAll('#filterForm input').forEach(i=>{ i.checked=false; if(i.type==='number') i.value=''; });
      renderProducts();
      updateCountsUI();
    });

    btnFilter?.addEventListener('click',()=>modal?.classList.add('open'));
    btnClose?.addEventListener('click',()=>modal?.classList.remove('open'));

    // Initial render
    renderProducts();
    updateCountsUI();

    // Auto-refresh chaque seconde
    let lastKey = null;
    setInterval(()=>{
      const visible = getVisibleProducts();
      const key = visible.map(p=>p.id).join(',')+'|'+visible.length;
      if(key!==lastKey){
        lastKey = key;
        renderProducts();
        updateCountsUI();
      }
    },1000);

  });
})();

