// --- EXEMPLE DE DONNÉES PRODUITS ---
// Chaque couleur contient désormais une propriété `url` que TU choisis.
const products = [
    {
      id: 'metamorphosis',
      name: 'Metamorphosis',
      price: 20.99,
      colors: [
        {
          name: 'Blanc',
          code: '#fff',
          img: 'https://i.imgur.com/3OueieQ.jpeg',
          hover: 'https://i.imgur.com/ol3tK3L.jpeg',
          url: 'product-eclat-lavande-lavande.html'
        },
        {
          name: 'Lavande',
          code: '#f7ecff',
          img: 'https://i.imgur.com/hoodie2.jpg',
          hover: 'https://i.imgur.com/hoodie2_hover.jpg',
          url: 'product-eclat-lavande-noir.html'
        },
        {
          name: 'Rose Pastel',
          code: '#ffe9eb',
          img: 'https://i.imgur.com/hoodie2.jpg',
          hover: 'https://i.imgur.com/hoodie2_hover.jpg',
          url: 'product-eclat-lavande-noir.html'
        },
        // ...
      ],
      sizes: ['S','M','L','XL','2XL','3XL'],
      cut: 'Droite',
      gender: 'Unisexe'
    },



    {
        id: 'celestial-b',
        name: 'Celestial B',
        price: 27.99,
        colors: [
          {
            name: 'Blanc',
            code: '#fff',
            img: 'https://i.imgur.com/yXuKp06.jpeg',
            hover: 'https://i.imgur.com/sfV3Vfw.jpeg',
            url: 'product-eclat-lavande-lavande.html'
          },
          // ...
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Droite',
        gender: 'Unisexe'
      },



      {
        id: 'urban-crest',
        name: 'Urban Crest',
        price: 21.99,
        colors: [
          {
            name: 'Noir',
            code: '#000',
            img: 'https://i.imgur.com/BhsaSDc.jpeg',
            hover: 'https://i.imgur.com/U0oUcsA.jpeg',
            url: 'product-eclat-lavande-lavande.html'
          },
          // ...
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Droite',
        gender: 'Unisexe'
      },



      {
        id: 'colorful-burst',
        name: 'Colorful Burst',
        price: 34.99,
        colors: [
          {
            name: 'Bleu Marine',
            code: '#171f2c',
            img: 'https://i.imgur.com/50AGnb5.jpeg',
            hover: 'https://i.imgur.com/WZgnZhx.jpeg',
            url: 'product-eclat-lavande-lavande.html'
          },
          // ...
        ],
        sizes: ['S','M','L','XL','2XL','3XL'],
        cut: 'Droite',
        gender: 'Unisexe'
      },
    // ... autres produits
  ];
  
 // État et variables
let filtered = [...products];
const state = {
  colors:  new Set(),
  sizes:   new Set(),
  cuts:    new Set(),
  genders: new Set(),
  priceMin:null,
  priceMax:null
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

// Affichage des options
function renderFilterOptions(id, items) {
  const c = document.getElementById(id);
  c.innerHTML = '';
  items.forEach(i => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="checkbox" value="${i}"> ${i}`;
    c.append(lbl);
  });
}
renderFilterOptions('filterColors',  [...new Set(products.flatMap(p=>p.colors.map(c=>c.name)))]);
renderFilterOptions('filterSizes',   [...new Set(products.flatMap(p=>p.sizes))]);
renderFilterOptions('filterCuts',    [...new Set(products.map(p=>p.cut))]);
renderFilterOptions('filterGenders', [...new Set(products.map(p=>p.gender))]);

// Calcul du nombre de produits correspondant
function previewCount() {
  return products.filter(p => {
    if (state.colors.size && ![...state.colors].some(c => p.colors.some(pc=>pc.name===c))) return false;
    if (state.sizes.size  && ![...state.sizes].some(s => p.sizes.includes(s))) return false;
    if (state.cuts.size   && !state.cuts.has(p.cut)) return false;
    if (state.genders.size&& !state.genders.has(p.gender)) return false;
    if (state.priceMin !== null && p.price < state.priceMin) return false;
    if (state.priceMax !== null && p.price > state.priceMax) return false;
    return true;
  }).length;
}

// Mise à jour compteur aperçu
document.querySelectorAll('#filterForm input').forEach(inp => {
  inp.addEventListener('change', () => {
    const grp = inp.closest('.filter-group').querySelector('summary').textContent.trim();
    const val = inp.value;
    if (inp.type==='checkbox') {
      const map = {'Couleurs':'colors','Tailles':'sizes','Coupes':'cuts','Sexe':'genders'};
      if (inp.checked) state[map[grp]].add(val);
      else             state[map[grp]].delete(val);
    } else if (inp.id==='priceMin') {
      state.priceMin = inp.value ? Number(inp.value) : null;
    } else if (inp.id==='priceMax') {
      state.priceMax = inp.value ? Number(inp.value) : null;
    }
    applyCount.textContent = previewCount();
  });
});

// Appliquer les filtres au clic
applyBtn.addEventListener('click', () => {
  filtered = products.filter(p => {
    if (state.colors.size && ![...state.colors].some(c => p.colors.some(pc=>pc.name===c))) return false;
    if (state.sizes.size  && ![...state.sizes].some(s => p.sizes.includes(s))) return false;
    if (state.cuts.size   && !state.cuts.has(p.cut)) return false;
    if (state.genders.size&& !state.genders.has(p.gender)) return false;
    if (state.priceMin !== null && p.price < state.priceMin) return false;
    if (state.priceMax !== null && p.price > state.priceMax) return false;
    return true;
  });
  renderProducts();
  modal.classList.remove('open');
});

// Rendu des produits
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
    const dc = p.colors[0];
    card.href = dc.url;
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
      const dot = document.createElement('span');
      dot.className='swatch'; dot.style.backgroundColor=c.code; dot.title=c.name;
      dot.addEventListener('click', e => { e.stopPropagation(); window.location.href=c.url; });
      sw.append(dot);
    });
    if (p.colors.length>6) {
      const more = document.createElement('span');
      more.className='swatch more'; more.textContent=`+${p.colors.length-6}`;
      sw.append(more);
    }
    const img = card.querySelector('img');
    img.addEventListener('mouseenter',() => img.src=img.dataset.hover);
    img.addEventListener('mouseleave',() => img.src=dc.img);
    grid.append(card);
  });
}

// Listener "Tout supprimé" : Vider, réafficher, réinitialiser UI
clearAll.addEventListener('click', () => {
  // 1) Vider l'état
  state.colors.clear();
  state.sizes.clear();
  state.cuts.clear();
  state.genders.clear();
  state.priceMin = null;
  state.priceMax = null;

  // 2) Vider les inputs du formulaire
  document.querySelectorAll('#filterForm input').forEach(i => {
    i.checked = false;
    if (i.type === 'number') i.value = '';
  });

  // 3) Réafficher tous les produits
  filtered = [...products];
  renderProducts();

  // 4) Réinitialiser les compteurs
  applyCount.textContent = products.length;
  countSpan.textContent  = `${products.length} article${products.length>1?'s':''}`;
});

// Ouvrir/fermer modal
btnFilter.addEventListener('click', () => modal.classList.add('open'));
btnClose .addEventListener('click', () => modal.classList.remove('open'));

// Initialisation
renderProducts();
applyCount.textContent = products.length;