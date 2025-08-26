// script.js

// --- EXEMPLE DE DONNÉES PRODUITS ---
// Ajoutez pour chaque produit badge_eco et badge_europe à true ou false
// Vous pouvez optionnellement ajouter : availableFrom et/ou availableUntil
// Formats acceptés :
//  - ISO 8601 string (ex: '2025-08-26T18:00:00+02:00')
//  - 'YYYY-MM-DD HH:MM' ou 'YYYY-MM-DDTHH:MM'
//  - 'DD/MM/YYYY HH:MM' ou 'DD/MM/YYYY'
//  - timestamp en ms ou en s (number)
//  - objet Date
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
    badge_europe: false
    availableFrom: '26/08/2025 13:42'
  },

  // ... (gardez le reste de vos produits ici, inchangés)
  // vous pouvez ajouter availableFrom / availableUntil sur n'importe quel produit
];

// Remplissage automatique originalPrice si absent
products.forEach(p => {
  if (typeof p.originalPrice !== 'number') p.originalPrice = p.price;
});

let filtered = [...products]; // résultat des filtres (sans contrainte de date)
const state = {
  colors: new Set(),
  sizes: new Set(),
  cuts: new Set(),
  genders: new Set(),
  types: new Set(),
  priceMin: null,
  priceMax: null
};

// DOM targets (peuvent être absents dans certains environnements, protections ajoutées)
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

// Rend l’UI de chaque groupe de filtres (si le conteneur existe)
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

renderFilterOptions('filterColors',  [...new Set(products.flatMap(p => p.colors.map(c => c.name)))]);
renderFilterOptions('filterSizes',   [...new Set(products.flatMap(p => p.sizes))]);
renderFilterOptions('filterCuts',    [...new Set(products.map(p => p.cut))]);
renderFilterOptions('filterGenders', [...new Set(products.map(p => p.gender))]);
renderFilterOptions('filterTypes',   [...new Set(products.map(p => p.type))]);

// ------------------ PARSING DATE ROBUSTE ------------------
function parseDateOrNull(dateInput) {
  if (dateInput === null || dateInput === undefined || dateInput === '') return null;

  // number => ms ou s
  if (typeof dateInput === 'number') {
    // si < 1e12 on suppose que c'est en secondes
    return dateInput > 1e12 ? dateInput : dateInput * 1000;
  }

  // Date object
  if (dateInput instanceof Date) {
    const t = dateInput.getTime();
    return Number.isFinite(t) ? t : null;
  }

  if (typeof dateInput !== 'string') return null;
  const s = dateInput.trim();

  // 1) Try native Date.parse (handles ISO)
  let t = Date.parse(s);
  if (Number.isFinite(t)) return t;

  // 2) Try replace space with T for formats like 'YYYY-MM-DD HH:MM'
  t = Date.parse(s.replace(' ', 'T'));
  if (Number.isFinite(t)) return t;

  // 3) Try common french format DD/MM/YYYY[ HH:MM(:SS)]
  const fr = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (fr) {
    const day = Number(fr[1]), month = Number(fr[2]) - 1, year = Number(fr[3]), hour = Number(fr[4] || 0), minute = Number(fr[5] || 0), second = Number(fr[6] || 0);
    const dt = new Date(year, month, day, hour, minute, second);
    const ms = dt.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  // 4) Try 'MM/DD/YYYY' US fallback
  const us = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (us) {
    const month = Number(us[1]) - 1, day = Number(us[2]), year = Number(us[3]), hour = Number(us[4] || 0), minute = Number(us[5] || 0), second = Number(us[6] || 0);
    const dt = new Date(year, month, day, hour, minute, second);
    const ms = dt.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  // Non parsable
  console.warn('Date non parsable pour:', dateInput);
  return null;
}

// ------------------ VISIBILITÉ SELON DATE ------------------
function isProductActive(product, nowMs = Date.now()) {
  const fromMs = parseDateOrNull(product.availableFrom);
  const untilMs = parseDateOrNull(product.availableUntil);
  if (fromMs !== null && nowMs < fromMs) return false; // pas encore en ligne
  if (untilMs !== null && nowMs > untilMs) return false; // expiré
  return true;
}

// ------------------ FILTRAGE (SANS DATE) ------------------
function getFilteredByState() {
  return products.filter(p => {
    if (state.colors.size && ![...state.colors].some(c => p.colors.some(pc => pc.name === c))) return false;
    if (state.sizes.size && ![...state.sizes].some(s => p.sizes.includes(s))) return false;
    if (state.cuts.size && !state.cuts.has(p.cut)) return false;
    if (state.genders.size && !state.genders.has(p.gender)) return false;
    if (state.types.size && !state.types.has(p.type)) return false;
    if (state.priceMin !== null && p.price < state.priceMin) return false;
    if (state.priceMax !== null && p.price > state.priceMax) return false;
    return true;
  });
}

// ------------------ UTILITAIRES D'AFFICHAGE ------------------
function getVisibleProducts(nowMs = Date.now()) {
  // On applique d'abord les filtres, puis on enlève les produits non actifs (dates)
  return filtered.filter(p => isProductActive(p, nowMs));
}

function previewCount() {
  return getVisibleProducts().length;
}

// ------------------ GESTION DES INPUTS (FILTRES) ------------------
document.querySelectorAll('#filterForm input').forEach(input => {
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
    // Met à jour le nombre en prévisualisation (filtres + dates)
    if (applyCount) applyCount.textContent = previewCount();
  });
});

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
    const dc = p.colors && p.colors[0] ? p.colors[0] : { url: '#', name: '', img: '', hover: '' };
    card.href = `${dc.url}?color=${encodeURIComponent(dc.name || '')}`;

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
        <img src="${dc.img}" data-hover="${dc.hover}" alt="${(p.name || '')}">
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
        a.style.backgroundColor = c.code;
        a.title = c.name;
        a.href = `${c.url}?color=${encodeURIComponent(c.name)}`;
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
    const visibleCount = getVisibleProducts().length;
    if (applyCount) applyCount.textContent = visibleCount;
    if (countSpan) countSpan.textContent = `${visibleCount} article${visibleCount > 1 ? 's' : ''}`;
  });
}

if (btnFilter) btnFilter.addEventListener('click', () => { if (modal) modal.classList.add('open'); });
if (btnClose) btnClose.addEventListener('click', () => { if (modal) modal.classList.remove('open'); });

// Initialisation
filtered = getFilteredByState();
renderProducts();
if (applyCount) applyCount.textContent = getVisibleProducts().length;

// ------------------ MISE À JOUR AUTOMATIQUE CHAQUE SECONDE ------------------
// Mise à jour seulement si la liste visible change (optimisation)
let lastVisibleKey = null;
setInterval(() => {
  const now = Date.now();
  const visible = getVisibleProducts(now);
  const key = visible.map(p => p.id).join(',') + '|' + visible.length;
  if (key !== lastVisibleKey) {
    lastVisibleKey = key;
    renderProducts();
  }
}, 1000);
