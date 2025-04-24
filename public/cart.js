document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyMessage       = document.getElementById('emptyMessage');
  const cartContainer      = document.getElementById('cartContainer');
  const subTotalEl         = document.getElementById('subTotal');
  const taxEl              = document.getElementById('tax');
  const shippingEl         = document.getElementById('shipping');
  const totalEl            = document.getElementById('total');
  const checkoutBtn        = document.getElementById('checkoutBtn');

  // Récupérer le panier depuis le localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      emptyMessage.classList.remove('hidden');
      cartContainer.classList.add('hidden');
      return;
    }
    emptyMessage.classList.add('hidden');
    cartContainer.classList.remove('hidden');

    let subTotal = 0;
    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <span>${item.name}</span>
        <span>${item.price.toFixed(2)} €</span>
        <button class="remove-btn">Supprimer</button>
      `;
      // Supprimer un article
      itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
      });
      cartItemsContainer.appendChild(itemDiv);
      subTotal += item.price;
    });

    const tax       = subTotal * 0.20;            // 20% TVA
    const shipping  = 0;                          // Gratuit
    const total     = subTotal + tax + shipping;

    subTotalEl.textContent = subTotal.toFixed(2) + ' €';
    taxEl.textContent      = tax.toFixed(2) + ' €';
    shippingEl.textContent = 'Gratuit';
    totalEl.textContent    = total.toFixed(2) + ' €';

    checkoutBtn.disabled = false;
  }

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    // Montant en centimes
    const totalValue = Math.round(
      cart.reduce((sum, item) => sum + item.price, 0) * 100
    );

    fetch('https://burban-mollie-payments.onrender.com/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: (totalValue / 100).toFixed(2),    // Mollie veut une string "00.00"
        description: 'Commande Burban',
        // Redirection après paiement :
        redirectUrl: `${window.location.origin}/success`,
        // Webhook :
        webhookUrl: 'https://burban-mollie-payments.onrender.com/webhook'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.checkoutUrl) {
        localStorage.removeItem('cart');
        window.location.href = data.checkoutUrl;
      } else {
        alert('Erreur lors de la création du paiement.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Erreur serveur.');
    });
  });

  // Affichage initial
  updateCartDisplay();
});
