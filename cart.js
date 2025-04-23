// cart.js

// 1) Récupérer le panier depuis localStorage (ou tableau vide)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// 2) Références DOM
const cartItemsEl    = document.getElementById('cartItems');
const emptyMessage   = document.getElementById('emptyMessage');
const cartContainer  = document.getElementById('cartContainer');
const subTotalEl     = document.getElementById('subTotal');
const taxEl          = document.getElementById('tax');
const totalEl        = document.getElementById('total');
const checkoutBtn    = document.getElementById('checkoutBtn');

// 3) Afficher ou cacher la section du panier selon son contenu
function toggleCartDisplay() {
  if (cart.length === 0) {
    emptyMessage.classList.remove('hidden');
    cartContainer.classList.add('hidden');
  } else {
    emptyMessage.classList.add('hidden');
    cartContainer.classList.remove('hidden');
  }
}

// 4) Calculer sous-total, TVA et total
function calculateTotals() {
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax      = subTotal * 0.20;
  const total    = subTotal + tax;
  subTotalEl.textContent = subTotal.toFixed(2) + '€';
  taxEl.textContent      = tax.toFixed(2) + '€';
  totalEl.textContent    = total.toFixed(2) + '€';
}

// 5) Rendre les lignes du panier
function renderCart() {
  cartItemsEl.innerHTML = '';

  cart.forEach((item, index) => {
    // Création de la ligne
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image || 'https://i.imgur.com/ol3tK3L.jpeg'}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <div class="meta">Couleur : ${item.color}, Taille : ${item.size}</div>
      </div>
      <div class="item-price">${(item.price * item.quantity).toFixed(2)}€</div>
      <div class="quantity-control">
        <button class="decrease">–</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
      </div>
      <button class="remove-btn">&times;</button>
    `;

    // Supprimer l'article
    row.querySelector('.remove-btn').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });

    // Diminuer quantité
    row.querySelector('.decrease').addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });

    // Augmenter quantité
    row.querySelector('.increase').addEventListener('click', () => {
      item.quantity++;
      updateCart();
    });

    cartItemsEl.appendChild(row);
  });
}

// 6) Mettre à jour localStorage et interface
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  calculateTotals();
  toggleCartDisplay();
}

// 7) Initialisation à l’ouverture de la page
toggleCartDisplay();
renderCart();
calculateTotals();

// 8) Passage à la validation / paiement
checkoutBtn.addEventListener('click', () => {
  // Exemple de redirection vers votre endpoint de paiement (Mollie)
  // Vous pouvez remplacer par votre logique de création de paiement
  fetch('/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      description: 'Commande Burban',
      orderId: Date.now().toString()
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      alert('Erreur lors de la création du paiement.');
    }
  })
  .catch(err => {
    console.error(err);
    alert('Une erreur est survenue.');
  });
});
