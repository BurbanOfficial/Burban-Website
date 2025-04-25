document.addEventListener('DOMContentLoaded', async () => {
  const stripe = Stripe('pk_test_51Q9ORzRwel3656rYJlUj8k1U3WIaRCLY3VyXH5iaBOujGY6mgaYAMXeJSvfbz6kUgNdXW6VWXqWheXhAa3gGZSmH001jacudkb'); // Remplace par ta clé Stripe

  // 1. Récupérer le clientSecret depuis votre serveur
  const { client_secret: clientSecret } = await fetch('/secret').then(r => r.json());

  // 2. Créer Elements avec apparence personnalisée
  const appearance = { theme: 'flat' };
  const elements = stripe.elements({ clientSecret, appearance, loader: 'auto' });

  // 3. Ajouter Link Authentication (email)
  const linkAuth = elements.create('linkAuthentication');
  linkAuth.mount('#link-authentication-element');
  linkAuth.on('change', (event) => {
    // event.value.email contient l'email entré
  });

  // 4. Adresse de livraison
  const shippingAddress = elements.create('address', {
    mode: 'shipping',
    phoneNumber: true,
    allowedCountries: ['FR']
  });
  shippingAddress.mount('#shipping-address-element');

  // 5. Adresse de facturation
  const billingAddress = elements.create('address', {
    mode: 'billing',
    phoneNumber: true,
    allowedCountries: ['FR']
  });
  billingAddress.mount('#billing-address-element');

  // 6. Élément de paiement
  const paymentElement = elements.create('payment', {
    layout: 'accordion',
    fields: {
      billingDetails: { address: 'never' }
    },
    paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna', 'revolut_pay', 'billie']
  });
  paymentElement.mount('#payment-element');

  // 7. Gestion des erreurs Stripe
  paymentElement.on('change', (event) => {
    const errorDiv = document.getElementById('error-message');
    if (event.error) {
      errorDiv.textContent = event.error.message;
    } else {
      errorDiv.textContent = '';
    }
  });

  // 8. Soumission du paiement
  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // return_url: 'https://votresite.com/merci' // à configurer
      }
    });

    if (error) {
      document.getElementById('error-message').textContent = error.message;
      submitButton.disabled = false;
    }
  });

  // 9. Code promo
  document.getElementById('apply-promo').addEventListener('click', async () => {
    const code = document.getElementById('promo-input').value;
    alert(`Code promo "${code}" appliqué (fonction serveur à implémenter).`);
  });
});
