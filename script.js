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
  
  // --- ÉTAT & SÉLECTEURS ---
  let filtered = [...products];
  const state = {
    colors: new Set(),
    sizes: new Set(),
    cuts: new Set(),
    genders: new Set(),
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
  
  // --- RENDER FILTRES (même code que précédemment) ---
  function renderFilterOptions(id, items) {
    const container = document.getElementById(id);
    container.innerHTML = '';
    items.forEach(item => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
      container.append(label);
    });
  }
  renderFilterOptions('filterColors', [...new Set(products.flatMap(p => p.colors.map(c=>c.name)))]);
  renderFilterOptions('filterSizes',  [...new Set(products.flatMap(p => p.sizes))]);
  renderFilterOptions('filterCuts',   [...new Set(products.map(p => p.cut))]);
  renderFilterOptions('filterGenders',[...new Set(products.map(p => p.gender))]);
  
  // --- LOGIQUE DE FILTRAGE DYNAMIQUE ---
  function applyFilters() {
    filtered = products.filter(p => {
      // Couleurs
      if (state.colors.size) {
        if (![...state.colors].some(c => p.colors.some(pc => pc.name === c))) return false;
      }
      // Tailles
      if (state.sizes.size && ![...state.sizes].some(s => p.sizes.includes(s))) return false;
      // Coupes
      if (state.cuts.size && !state.cuts.has(p.cut)) return false;
      // Genres
      if (state.genders.size && !state.genders.has(p.gender)) return false;
      // Prix
      if (state.priceMin !== null && p.price < state.priceMin) return false;
      if (state.priceMax !== null && p.price > state.priceMax) return false;
      return true;
    });
    renderProducts();
  }
  
  // On déclenche applyFilters à CHAQUE changement
  document.querySelectorAll('#filterForm input').forEach(input => {
    input.addEventListener('change', () => {
      // Mise à jour de l'état
      const id = input.closest('.filter-group').querySelector('summary').textContent.trim();
      const val = input.value;
      if (input.type === 'checkbox') {
        const setMap = { 'Couleurs': 'colors', 'Tailles': 'sizes', 'Coupes': 'cuts', 'Sexe': 'genders' };
        const key = setMap[id];
        input.checked ? state[key].add(val) : state[key].delete(val);
      } else if (input.id === 'priceMin') {
        state.priceMin = input.value ? Number(input.value) : null;
      } else if (input.id === 'priceMax') {
        state.priceMax = input.value ? Number(input.value) : null;
      }
      applyFilters();
    });
  });
  
  // --- FERMER LA MODAL AU CLIC SUR LE BOUTON APPLIQUER ---
  applyBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });
  
  // --- OUVRIR / FERMER LA MODAL FILTRES ---
  btnFilter.addEventListener('click', () => modal.classList.add('open'));
  btnClose .addEventListener('click', () => modal.classList.remove('open'));
  
  // --- RENDER DES PRODUITS ---
  function renderProducts() {
    grid.innerHTML = '';
    if (!filtered.length) {
      noRes.classList.remove('hidden');
      applyBtn.disabled = true;
      applyCount.textContent = 0;
      countSpan.textContent = '0 articles';
      return;
    }
    noRes.classList.add('hidden');
    applyBtn.disabled = false;
    applyCount.textContent = filtered.length;
    countSpan.textContent = `${filtered.length} article${filtered.length>1?'s':''}`;
  
    filtered.forEach(product => {
      const card = document.createElement('a');
      card.className = 'product-card';
      // Choix de la couleur par défaut (première de la liste)
      const defColor = product.colors[0];
      card.href = defColor.url; // utilise TON url défini dans les données
      card.innerHTML = `
        <div class="img-wrap">
          <img src="${defColor.img}" data-hover="${defColor.hover}" alt="${product.name}">
        </div>
        <div class="info">
          <h3>${product.name}</h3>
          <p>${product.price}€</p>
          <div class="swatches"></div>
        </div>`;
      // Ronds de couleur
      const sw = card.querySelector('.swatches');
      const maxShow = 6;
      product.colors.forEach((c,i) => {
        if (i < maxShow) {
          const dot = document.createElement('span');
          dot.className = 'swatch';
          dot.style.backgroundColor = c.code;
          dot.title = c.name;
          dot.addEventListener('click', e => {
            e.stopPropagation();
            window.location.href = c.url; // URL *toi‑même* définie
          });
          sw.append(dot);
        }
      });
      if (product.colors.length > maxShow) {
        const more = document.createElement('span');
        more.className = 'swatch more';
        more.textContent = `+${product.colors.length - maxShow}`;
        sw.append(more);
      }
      // Swap image au hover
      const img = card.querySelector('img');
      img.addEventListener('mouseenter', () => {
        if (img.dataset.hover) img.src = img.dataset.hover;
      });
      img.addEventListener('mouseleave', () => {
        img.src = defColor.img;
      });
      grid.append(card);
    });
  }
  
  // --- INIT ---
  renderProducts();
  countSpan.textContent  = `${products.length} articles`;
  applyCount.textContent = products.length;
  