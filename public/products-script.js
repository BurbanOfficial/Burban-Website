// Année automatique + overlay
document.getElementById('year').textContent = new Date().getFullYear();
const hamburger = document.querySelector('.hamburger');
const overlay   = document.getElementById('overlayMenu');
const closeOv   = overlay.querySelector('.close-btn');
hamburger.addEventListener('click', () => overlay.classList.add('open'));
closeOv.addEventListener('click', () => overlay.classList.remove('open'));

// Galerie
document.querySelectorAll('.gallery-thumbs img').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelector('.gallery-thumbs img.active').classList.remove('active');
    thumb.classList.add('active');
    document.getElementById('mainImage').src = thumb.dataset.src;
  });
});

// Couleurs
document.querySelectorAll('.color-swatch').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelector('.color-swatch.active').classList.remove('active');
    s.classList.add('active');
  });
});

// Tailles
document.querySelectorAll('.size-swatch').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.size-swatch').forEach(x => x.classList.remove('active'));
    document.getElementById('sizeError').classList.add('hidden');
    s.classList.add('active');
  });
});

// ----- Fonctions d'ouverture/fermeture du modal -----
function showCartModal() {
  const modal = document.getElementById('cartModal');
  modal.classList.remove('hidden');
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  // on enlève l'animation si besoin, puis on cache
  modal.classList.add('hidden');
}

// Ajouter au panier + localStorage sous key 'cartItems'
document.getElementById('addToCart').addEventListener('click', () => {
  const sizeEl = document.querySelector('.size-swatch.active');
  if (!sizeEl) return document.getElementById('sizeError').classList.remove('hidden');

  const container = document.querySelector('.product-page');
  const id    = container.dataset.productId;
  const name  = container.dataset.productName;
  const price = parseFloat(container.dataset.productPrice);
  const color = document.querySelector('.color-swatch.active').dataset.colorName;
  const size  = sizeEl.dataset.size;

  // **NOUVEAU** : on récupère l'URL de l'image affichée
  const image = document.getElementById('mainImage').src;

  const STORAGE_KEY = 'cartItems';
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const exist = cart.find(item =>
    item.id===id && item.color===color && item.size===size
  );
  if (exist) exist.quantity += 1;
  else cart.push({ id, name, price, color, size, image, quantity: 1 });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  
  // Affichage du modal
  showCartModal();
});

document.querySelectorAll(".accordion-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const content = document.getElementById(targetId);
    const wrapper = content.parentElement;

    const isOpen = wrapper.style.height && wrapper.style.height !== "0px";

    if (isOpen) {
      wrapper.style.height = `${wrapper.scrollHeight}px`; // reset height to start transition
      requestAnimationFrame(() => {
        wrapper.style.height = "0px";
      });
    } else {
      wrapper.style.height = "auto";
      const height = wrapper.scrollHeight;
      wrapper.style.height = "0px";
      requestAnimationFrame(() => {
        wrapper.style.height = `${height}px`;
      });
    }
  });
});

/* Tactile */
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".gallery-thumbs img");

  let currentIndex = 0;
  const images = Array.from(thumbnails).map(img => img.getAttribute("data-src"));

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateMainImage();
    });
  });

  function updateMainImage() {
    mainImage.style.opacity = 0;
    setTimeout(() => {
      mainImage.src = images[currentIndex];
      thumbnails.forEach(img => img.classList.remove("active"));
      thumbnails[currentIndex].classList.add("active");
      mainImage.style.opacity = 1;
    }, 150);
  }

  // Swipe detection
  let startX = 0;

  mainImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  mainImage.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        // Swipe left
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        // Swipe right
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      updateMainImage();
    }
  });

  function handleLanguageChange(value) {
    if (value === 'EN') {
      window.location.href = 'https://burbanofficial.com/';
    } else if (value === 'FR') {
      window.location.href = 'https://burbanofficial.com/FR-fr/';
    }
  }

  document.getElementById('languageSelector').addEventListener('change', function () {
    handleLanguageChange(this.value);
  });

  document.getElementById('languageSelectorMobile').addEventListener('change', function () {
    handleLanguageChange(this.value);
  });

  document.querySelectorAll('.delivery-carbon-box').forEach(box => {
    const value     = parseFloat(box.dataset.carbon);
    const label     = box.querySelector('.carbon-label');
    const indicator = box.querySelector('.carbon-indicator');
    const valueText = box.querySelector('.carbon-value');
    const leafIcon  = box.querySelector('.carbon-info i');
  
    let text = '', dots = '', color = '';
  
    if (value <= 2) {
      text  = " Very low";
      dots  = '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-regular fa-circle"></i> ' +
              '<i class="fa-regular fa-circle"></i>';
      color = "#4CAF50";
    } else if (value <= 4) {
      text  = "Low";
      dots  = '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-regular fa-circle"></i>';
      color = "#8BC34A";
    } else if (value <= 6) {
      text  = "Medium";
      dots  = '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i>';
      color = "#FFC107";
    } else if (value <= 8) {
      text  = "High";
      dots  = '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i>';
      color = "#FF5722";
    } else {
      text  = "Very high";
      dots  = '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i> ' +
              '<i class="fa-solid fa-circle"></i>';
      color = "#F44336";
    }
  
    // Set text and value
    label.textContent            = text;
    valueText.textContent        = `(${value.toFixed(1)} kg CO₂)`;
  
    // Render the icons as HTML
    indicator.innerHTML          = dots;
    indicator.style.color        = color;
  
    // Colour the info icon
    leafIcon.style.color         = color;

  });

import gsap from 'https://cdn.skypack.dev/gsap@3.13.0'

(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return console.warn('Nav not found');

  // Création / cleanup du hover Liquid Glass
  const existingHover = nav.querySelector('.nav-hover');
  if (existingHover) existingHover.remove();
  const hover = document.createElement('div');
  hover.className = 'nav-hover';
  nav.appendChild(hover);

  // état cible / actuel pour le "puck"
  let target = { x:0, y:0, w:0, h:0, opacity:0 };
  let current = { x:0, y:0, w:0, h:0, opacity:0 };

  // LERP pour interpolation (vitesse)
  const LERP = 0.99; // augmentez légèrement pour un déplacement plus réactif
  const padX = 14, padY = 10; // padding autour du texte -> définit taille du rectangle

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
    // si on n'a encore aucune taille calculée, on prend la première nav-item comme fallback
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

  // Events
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

  // click => changer uniquement la classe active (change la couleur du texte)
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
    const easeFactor = 0.99;
    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP * easeFactor;
    current.w += (target.w - current.w) * LERP;
    current.h += (target.h - current.h) * LERP;
    current.opacity += (target.opacity - current.opacity) * LERP;
    applyCurrentToHover();
    requestAnimationFrame(raf);
  }

  raf();

  // Recalage simple au resize (évite que hover soit mal positionné après redim)
  window.addEventListener('resize', () => {
    const active = nav.querySelector('.nav-item.active');
    if (active) {
      // repositionne le hover si la souris est au-dessus
      const itemUnderMouse = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2)?.closest?.('.nav-item');
      // on force un update minimal : si active existe, calcule sa cible pour garder fallback propre
      setTargetFromElement(active);
      // et réinitialise current pour éviter glitchs visuels extrêmes
      current.w = target.w; current.h = target.h;
      current.x = target.x; current.y = target.y;
      applyCurrentToHover();
    }
  });

})();
