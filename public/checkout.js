const STORAGE_KEY = 'cartItems';
const items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function formatAmount(cents) {
  return (cents/100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
function calculateTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax      = Math.round(subtotal * 0.2);
  const shipping = 500;
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}
function renderOrderSummary() {
  const { subtotal, tax, shipping, total } = calculateTotals(items);
  const container = document.getElementById('summary-container');
  let html = '';
  items.forEach(i => {
    html += `<div class="item-row"><span>${i.name} x${i.quantity}</span><span>${formatAmount(i.price*i.quantity)}</span></div>`;
  });
  html += `
    <div class="summary-row"><span>Sous-total</span><span>${formatAmount(subtotal)}</span></div>
    <div class="summary-row"><span>TVA (20%)</span><span>${formatAmount(tax)}</span></div>
    <div class="summary-row"><span>Livraison</span><span>${formatAmount(shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatAmount(total)}</span></div>
  `;
  container.innerHTML = html;
}

let stripe, elements;
let shippingComplete = false, billingComplete = false;

async function initialize() {
  const { publishableKey } = await fetch(`${BACKEND_URL}/config`).then(r=>r.json());
  stripe = Stripe(publishableKey);

  const { clientSecret } = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items })
  }).then(r=>r.json());

  elements = stripe.elements({ clientSecret });

  elements.create('address', { mode: 'shipping' }).mount('#shipping-element')
    .on('change', e=>{ shippingComplete = e.complete; document.getElementById('address-error').textContent = ''; });
  elements.create('address', { mode: 'billing' }).mount('#billing-element')
    .on('change', e=>{ billingComplete = e.complete; document.getElementById('address-error').textContent = ''; });

  elements.create('linkAuthentication').mount('#link-auth-element');

  const appearance = {};
  const layoutOpts = { type:'accordion', defaultCollapsed:false, radios:false, spacedAccordionItems:true };
  elements.create('payment', { appearance, layout: layoutOpts }).mount('#payment-element');
}

document.getElementById('to-step-2').addEventListener('click', e=>{
  e.preventDefault();
  if (!shippingComplete||!billingComplete) {
    document.getElementById('address-error').textContent = 'Veuillez renseigner les deux adresses.';
    return;
  }
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  document.getElementById('step-2').classList.add('active');
});

document.getElementById('back-button').addEventListener('click', e=>{
  e.preventDefault();
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');
});

document.getElementById('pay-button').addEventListener('click', async e=>{
  e.preventDefault(); document.getElementById('pay-button').disabled = true;
  const { error } = await stripe.confirmPayment({ elements, confirmParams:{ return_url: window.location.origin + '/success.html' } });
  if (error) {
    document.getElementById('error-message').textContent = error.message;
    document.getElementById('pay-button').disabled = false;
  }
});

renderOrderSummary();
initialize();