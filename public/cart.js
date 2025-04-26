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
  
    const STORAGE_KEY = 'cartItems';
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
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
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
          <span class="item-name">${item.name}</span>
          <span class="item-price">${item.price.toFixed(2)} €</span>
          <button class="remove-btn">×</button>
        `;
        itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
          cart.splice(index, 1);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
          updateCartDisplay();
        });
        cartItemsContainer.appendChild(itemDiv);
        subTotal += item.price * (item.quantity || 1);
      });
  
      const tax      = subTotal * 0.20;
      const shipping = 0;
      const total    = subTotal + tax + shipping;
  
      subTotalEl.textContent = subTotal.toFixed(2) + ' €';
      taxEl.textContent      = tax.toFixed(2) + ' €';
      shippingEl.textContent = 'Gratuit';
      totalEl.textContent    = total.toFixed(2) + ' €';
    }
  
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      if (cart.length === 0) return;
      window.location.href = 'checkout.html';
    });
  
    updateCartDisplay();
  });