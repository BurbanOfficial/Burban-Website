// Récupération des articles du panier (localStorage ou autre)
function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

document.addEventListener('DOMContentLoaded', async () => {
  const stripe = Stripe('pk_test_51Q9ORzRwel3656rYJlUj8k1U3WIaRCLY3VyXH5iaBOujGY6mgaYAMXeJSvfbz6kUgNdXW6VWXqWheXhAa3gGZSmH001jacudkb'); // Remplacez par votre clé publique
  const elements = stripe.elements();
  const cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#a0aec0' },
      },
      invalid: { color: '#fa755a' }
    }
  });
  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.getElementById('submit');

  // 1. Créer un PaymentIntent sur le serveur
  const { clientSecret, error: backendError } = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: getCartItems() })
  }).then(r => r.json());

  if (backendError) {
    errorMessage.textContent = backendError;
    submitBtn.disabled = true;
    return;
  }

  // 2. Gérer la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (error) {
      // Afficher l'erreur
      errorMessage.textContent = error.message;
      submitBtn.disabled = false;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Paiement réussi – redirection ou message
      window.location.href = 'https://burbanofficial.com/public/success.html';
    }
  });
});
