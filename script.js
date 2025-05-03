// script.js

// --- EXEMPLE DE DONNÉES PRODUITS ---
// Ajoutez pour chaque produit badge_eco et badge_europe à true ou false
const products = [
  {
    id: 'metamorphosis',
    name: 'Metamorphosis',
    price: 20.99,
    type: 'T-Shirt',
    colors: [
      { name: 'Blanc', code: '#fff', img: 'https://i.imgur.com/3OueieQ.jpeg', hover: 'https://i.imgur.com/ol3tK3L.jpeg', url: 'https://burbanofficial.com/Burban-Website/public/metamorphosis-ar00050.html' },
      { name: 'Lavande', code: '#f7ecff', img: 'https://i.imgur.com/ITx8c7r.jpeg', hover: 'https://i.imgur.com/yeYYPqa.jpeg', url: '/public/metamorphosis-ar00051.html' },
      { name: 'Rose Pastel', code: '#ffe9eb', img: 'https://i.imgur.com/0dnXLh4.jpeg', hover: 'https://i.imgur.com/HKaRX8P.jpeg', url: '/public/metamorphosis-ar00052.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL','3XL'],
    cut: 'Droite',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },




  {
    id: 'celestial-b',
    name: 'Celestial B',
    price: 15.99,
    type: 'T-Shirt',
    colors: [
      { name: 'Blanc', code: '#fffefa', img: 'https://i.imgur.com/zZ2tww6.jpeg', hover: 'https://i.imgur.com/3TRibcn.jpeg', url: '/public/celestial-b-ar00049.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL','3XL'],
    cut: 'Droite',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },



  
  {
    id: 'urban-crest',
    name: 'Urban Crest',
    price: 21.99,
    type: 'Casquette',
    colors: [
      { name: 'Noir', code: '#000', img: 'https://i.imgur.com/asPiEue.jpeg', hover: 'https://i.imgur.com/U0oUcsA.jpeg', url: '/public/urban-crest-ar00046.html' },
      // …
    ],
    sizes: ['Unique'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },




  {
    id: 'colorful-burst',
    name: 'Colorful Burst',
    price: 34.99,
    type: 'Sweat sans capuche',
    colors: [
      { name: 'Bleu Foncé', code: '#171f2c', img: 'https://i.imgur.com/50AGnb5.jpeg', hover: 'https://i.imgur.com/WZgnZhx.jpeg', url: '/public/colorful-burst-ar00045.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL','3XL'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: false,
    badge_europe: false
  },



  {
    id: 'urban-hibiscus',
    name: 'Urban Hibiscus',
    price: 23.99,
    type: 'Sweat sans capuche',
    colors: [
      { name: 'Vert Foncé', code: '#1a3626', img: 'https://i.imgur.com/ltGJ2UA.jpeg', hover: 'https://i.imgur.com/uVeTzOQ.jpeg', url: '/public/urban-hibiscus-ar00044.html' },
      { name: 'Bleu Indigo', code: '#395d82', img: 'https://i.imgur.com/4j5IjyP.jpeg', hover: 'https://i.imgur.com/8a0UYy0.jpeg', url: '/public/urban-hibiscus-ar00048.html' },
      { name: 'Sauge', code: '#7e8560', img: 'https://i.imgur.com/62dxFU2.jpeg', hover: 'https://i.imgur.com/pMVsAJC.jpeg', url: '/public/urban-hibiscus-ar00047.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL','3XL'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: false,
    badge_europe: false
  },



  {
    id: 'universal-love',
    name: 'Universal Love',
    price: 44.99,
    type: 'Sweat à capuche',
    colors: [
      { name: 'Blanc', code: '#fff', img: 'https://i.imgur.com/ZP4zVSK.jpeg', hover: 'https://i.imgur.com/r9HQUCq.jpeg', url: '/public/universal-love-ar00043.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },



  {
    id: 'natural-glow',
    name: 'Natural Glow',
    price: 44.99,
    type: 'Sweat à capuche',
    colors: [
      { name: 'Blanc', code: '#fff', img: 'https://i.imgur.com/m2tkvTm.jpeg', hover: 'https://i.imgur.com/EcjqfHS.jpeg', url: '/public/natural-glow-ar00042.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },



  {
    id: 'mad-in-love',
    name: 'Mad In Love',
    price: 54.99,
    type: 'Sweat à capuche',
    colors: [
      { name: 'Noir', code: '#000', img: 'https://i.imgur.com/7zR8liE.jpeg', hover: 'https://i.imgur.com/8GZ52nM.jpeg', url: '/public/mad-in-love-ar00041.html' },
      { name: 'Bleu Foncé', code: '#132e57', img: 'https://i.imgur.com/a3O4ESv.jpeg', hover: 'https://i.imgur.com/Seortkg.jpeg', url: '/public/mad-in-love-ar00040.html' },
      // …
    ],
    sizes: ['S','M','L','XL','2XL'],
    cut: 'Autre',
    gender: 'Unisexe',
    badge_eco: true,
    badge_europe: false
  },
  // … autres produits, toujours avec badge_eco et badge_europe
];

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
  if (a === 'Unique') return 1;   // "Unique" toujours en dernier
  if (b === 'Unique') return -1;
  const ia = sizeOrder.indexOf(a);
  const ib = sizeOrder.indexOf(b);
  if (ia === -1 && ib === -1) {
    return a.localeCompare(b, 'fr'); // fallback alphabétique
  }
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;             // ordre défini par sizeOrder
}

// Rend l’UI de chaque groupe de filtres
function renderFilterOptions(id, items) {
  const container = document.getElementById(id);
  if (id === 'filterSizes') {
    items.sort(compareSizes);
  } else {
    items.sort((a, b) => a.localeCompare(b, 'fr'));
  }
  items.forEach(item => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
    container.append(label);
  });
}

renderFilterOptions('filterColors',  [...new Set(products.flatMap(p=>p.colors.map(c=>c.name)))]);
renderFilterOptions('filterSizes',   [...new Set(products.flatMap(p=>p.sizes))]);
renderFilterOptions('filterCuts',    [...new Set(products.map(p=>p.cut))]);
renderFilterOptions('filterGenders', [...new Set(products.map(p=>p.gender))]);
renderFilterOptions('filterTypes',   [...new Set(products.map(p=>p.type))]);

function previewCount() {
  return products.filter(p => {
    if (state.colors.size && ![...state.colors].some(c=>p.colors.some(pc=>pc.name===c))) return false;
    if (state.sizes.size  && ![...state.sizes].some(s=>p.sizes.includes(s)))         return false;
    if (state.cuts.size   && !state.cuts.has(p.cut))                                    return false;
    if (state.genders.size&& !state.genders.has(p.gender))                               return false;
    if (state.types.size  && !state.types.has(p.type))                                  return false;
    if (state.priceMin!==null && p.price < state.priceMin)                              return false;
    if (state.priceMax!==null && p.price > state.priceMax)                              return false;
    return true;
  }).length;
}

document.querySelectorAll('#filterForm input').forEach(input => {
  input.addEventListener('change', () => {
    const group = input.closest('.filter-group').querySelector('summary').textContent.trim();
    const val   = input.value;
    if (input.type === 'checkbox') {
      const map = { 'Couleurs':'colors','Tailles':'sizes','Coupes':'cuts','Sexe':'genders','Types':'types' };
      input.checked ? state[map[group]].add(val) : state[map[group]].delete(val);
    } else if (input.id==='priceMin') {
      state.priceMin = input.value?Number(input.value):null;
    } else if (input.id==='priceMax') {
      state.priceMax = input.value?Number(input.value):null;
    }
    applyCount.textContent = previewCount();
  });
});

applyBtn.addEventListener('click', () => {
  filtered = products.filter(p => {
    if (state.colors.size && ![...state.colors].some(c=>p.colors.some(pc=>pc.name===c))) return false;
    if (state.sizes.size  && ![...state.sizes].some(s=>p.sizes.includes(s)))         return false;
    if (state.cuts.size   && !state.cuts.has(p.cut))                                    return false;
    if (state.genders.size&& !state.genders.has(p.gender))                               return false;
    if (state.types.size  && !state.types.has(p.type))                                  return false;
    if (state.priceMin!==null && p.price < state.priceMin)                              return false;
    if (state.priceMax!==null && p.price > state.priceMax)                              return false;
    return true;
  });
  renderProducts();
  modal.classList.remove('open');
});

function renderProducts() {
  grid.innerHTML = '';
  if (!filtered.length) {
    noRes.classList.remove('hidden');
    countSpan.textContent = '0 articles';
    return;
  }
  noRes.classList.add('hidden');
  countSpan.textContent  = `${filtered.length} article${filtered.length>1?'s':''}`;
  applyCount.textContent = filtered.length;

  filtered.forEach(p => {
    const card = document.createElement('a');
    card.className = 'product-card';

    // lien par défaut sur la première couleur
    const dc = p.colors[0];
    card.href = `${dc.url}?color=${encodeURIComponent(dc.name)}`;

    // Contenu de la carte
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${dc.img}" data-hover="${dc.hover}" alt="${p.name}">
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.price}€</p>
        <div class="swatches"></div>
      </div>`;

    // --- BADGES conditionnels ---
    const badges = document.createElement('div');
    badges.className = 'badges';

    if (p.badge_eco) {
      const ecoBadge = document.createElement('div');
      ecoBadge.className = 'badge eco';
      ecoBadge.innerHTML = `<i class="fas fa-leaf"></i><span>écologique</span>`;
      badges.append(ecoBadge);
    }
    if (p.badge_europe) {
      const euroBadge = document.createElement('div');
      euroBadge.className = 'badge europe';
      euroBadge.innerHTML = `<i class="fa-solid fa-earth-africa"></i><span>Fabriqué&nbsp;en&nbsp;Europe</span>`;
      badges.append(euroBadge);
    }

    // Si au moins un badge, on les insère
    if (badges.children.length) {
      card.prepend(badges);
    }
    // --- FIN BADGES ---

    // Swatches et hover images
    const sw = card.querySelector('.swatches');
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
      more.textContent = `+${p.colors.length-6}`;
      sw.append(more);
    }

    const prodImg = card.querySelector('.img-wrap img');
    prodImg.addEventListener('mouseenter', () => prodImg.src = prodImg.dataset.hover);
    prodImg.addEventListener('mouseleave', () => prodImg.src = dc.img);

    grid.append(card);
  });
}

clearAll.addEventListener('click', () => {
  ['colors','sizes','cuts','genders','types'].forEach(k => state[k].clear());
  state.priceMin = state.priceMax = null;
  document.querySelectorAll('#filterForm input').forEach(i => {
    i.checked = false;
    if (i.type==='number') i.value = '';
  });
  filtered = [...products];
  renderProducts();
  applyCount.textContent = products.length;
  countSpan.textContent  = `${products.length} article${products.length>1?'s':''}`;
});

btnFilter.addEventListener('click', () => modal.classList.add('open'));
btnClose.addEventListener('click', () => modal.classList.remove('open'));

// Initialisation
renderProducts();
applyCount.textContent = products.length;
