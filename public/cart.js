// public/cart.js

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyMessage       = document.getElementById('emptyMessage');
  const cartContainer      = document.getElementById('cartContainer');
  const subTotalEl         = document.getElementById('subTotal');
  const taxEl              = document.getElementById('tax');
  const shippingEl         = document.getElementById('shipping');
  const totalEl            = document.getElementById('total');
  const checkoutBtn        = document.getElementById('checkoutBtn');

  // On utilise désormais la même clé partout
  const STORAGE_KEY = 'cartItems';

  // Récupérer le panier depuis le localStorage
  let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Met à jour l'affichage du panier et l'état du bouton
  function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      emptyMessage.classList.remove('hidden');
      cartContainer.classList.add('hidden');
      checkoutBtn.disabled = true;
      return;
    }

    emptyMessage.classList.add('hidden');
    cartContainer.classList.remove('hidden');
    checkoutBtn.disabled = false;

    let subTotal = 0;

    cart.forEach((item, index) => {
      // Création de la ligne d'article
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-price">${item.price.toFixed(2)} €</span>
        <button class="remove-btn">×</button>
      `;

      // Supprimer un article
      itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        updateCartDisplay();
      });

      cartItemsContainer.appendChild(itemDiv);
      subTotal += item.price * (item.quantity || 1);
    });

    const tax      = subTotal * 0.20;  // 20% TVA
    const shipping = 0;                // Gratuit
    const total    = subTotal + tax + shipping;

    subTotalEl.textContent = subTotal.toFixed(2) + ' €';
    taxEl.textContent      = tax.toFixed(2) + ' €';
    shippingEl.textContent = shipping > 0
                              ? shipping.toFixed(2) + ' €'
                              : 'Gratuit';
    totalEl.textContent    = total.toFixed(2) + ' €';
  }

  // Au clic sur "Passer à la validation", on redirige vers Stripe Elements
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    // On reste sur la clé STORAGE_KEY, checkout.js ira la récupérer
    window.location.href = 'https://burbanofficial.github.io/Burban-Website/public/checkout.html';
  });

  // Initialisation
  updateCartDisplay();
});
