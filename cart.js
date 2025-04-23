document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalAmountElement = document.getElementById('totalAmount');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Récupérer le panier depuis le localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
      totalAmountElement.textContent = '0.00';
      checkoutBtn.disabled = true;
      return;
    }

    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');

      const name = document.createElement('p');
      name.textContent = `${item.name} - ${item.price.toFixed(2)} €`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Supprimer';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
      });

      itemDiv.appendChild(name);
      itemDiv.appendChild(removeBtn);
      cartItemsContainer.appendChild(itemDiv);

      total += item.price;
    });

    totalAmountElement.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;
  }

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    fetch('/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // En centimes
        description: 'Commande Burban',
        redirectUrl: `${window.location.origin}/success`,
        webhookUrl: `https://burban-mollie-payments.onrender.com/webhook` // Remplace par ton URL réelle
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.checkoutUrl) {
          // Vide le panier et redirige vers Mollie
          localStorage.removeItem('cart');
          window.location.href = data.checkoutUrl;
        } else {
          alert('Erreur lors de la création du paiement.');
        }
      })
      .catch(error => {
        console.error('Erreur :', error);
        alert('Erreur serveur.');
      });
  });

  // Initialiser l'affichage du panier
  updateCartDisplay();
});
