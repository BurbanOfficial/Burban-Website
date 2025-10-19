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
