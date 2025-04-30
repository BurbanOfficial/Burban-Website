// --- EXEMPLE DE DONNÉES PRODUITS ---
const products = [
  {
    id: 'metamorphosis',
    name: 'Metamorphosis',
    price: 20.99,
    type: 'T-Shirt',
    colors: [
      { name: 'Blanc',        code: '#fff',         img: 'https://i.imgur.com/3OueieQ.jpeg', hover: 'https://i.imgur.com/ol3tK3L.jpeg', url: 'https://burbanofficial.com/' },
      { name: 'Lavande',      code: '#f7ecff',      img: 'https://i.imgur.com/hoodie2.jpg',  hover: 'https://i.imgur.com/hoodie2_hover.jpg', url: 'https://burbanofficial.com/' },
      { name: 'Rose Pastel',  code: '#ffe9eb',      img: 'https://i.imgur.com/hoodie2.jpg',  hover: 'https://i.imgur.com/hoodie2_hover.jpg', url: 'https://burbanofficial.com/' },
      // ...
    ],
    sizes: ['S','M','L','XL','2XL','3XL'],
    cut: 'Droite',
    gender: 'Unisexe'
  },
  // ... autres produits
];

let filtered = [...products];
const state = { colors: new Set(), sizes: new Set(), cuts: new Set(), genders: new Set(), types: new Set(), priceMin: null, priceMax: null };

const grid       = document.getElementById('productGrid');
const countSpan  = document.getElementById('resultCount');
const noRes      = document.getElementById('noResults');
const btnFilter  = document.getElementById('openFilters');
const modal      = document.getElementById('filterModal');
const btnClose   = document.getElementById('closeFilters');
const applyBtn   = document.getElementById('applyFilters');
const applyCount = document.getElementById('applyCount');
const clearAll   = document.getElementById('clearAll');

// Rend l’UI de chaque groupe de filtres
function renderFilterOptions(id, items) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  items.sort((a,b) => a.localeCompare(b, 'fr')).forEach(item => {
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
    } else if (input.id==='priceMin') state.priceMin = input.value?Number(input.value):null;
      else if (input.id==='priceMax') state.priceMax = input.value?Number(input.value):null;
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
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${dc.img}" data-hover="${dc.hover}" alt="${p.name}">
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.price}€</p>
        <div class="swatches"></div>
      </div>`;

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

    const img = card.querySelector('img');
    img.addEventListener('mouseenter', () => img.src = img.dataset.hover);
    img.addEventListener('mouseleave', () => img.src = dc.img);
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