<!-- Scripts -->
    // Année automatique
    document.getElementById('year').textContent = new Date().getFullYear();

    // Overlay mobile
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

    // Ajouter au panier + localStorage
    document.getElementById('addToCart').addEventListener('click', () => {
      const sizeEl = document.querySelector('.size-swatch.active');
      if (!sizeEl) {
        document.getElementById('sizeError').classList.remove('hidden');
        return;
      }
      const container = document.querySelector('.product-page');
      const id    = container.dataset.productId;
      const name  = container.dataset.productName;
      const price = parseFloat(container.dataset.productPrice);
      const color = document.querySelector('.color-swatch.active').dataset.colorName;
      const size  = sizeEl.dataset.size;

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const exist = cart.find(item =>
        item.id===id && item.color===color && item.size===size
      );
      if (exist) {
        exist.quantity += 1;
      } else {
        cart.push({ id, name, price, color, size, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Ajouté au panier : ${name} (${color}, ${size})`);
    });