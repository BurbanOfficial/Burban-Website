// server.js
require('dotenv').config();

const express = require('express');
const path    = require('path');
const createMollieClient = require('@mollie/api-client');

const app = express();
const port = process.env.PORT || 3000;

// 1) Initialisation Mollie
const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY
});

// 2) Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3) Endpoint : création du paiement
app.post('/create-payment', async (req, res) => {
  const { amount, description, orderId } = req.body;
  if (!amount || !description || !orderId) {
    return res.status(400).json({ error: 'Données manquantes.' });
  }

  try {
    const payment = await mollie.payments.create({
      amount: {
        value: amount.toFixed(2),  // chaîne "10.00"
        currency: 'EUR'
      },
      description,
      redirectUrl: `${process.env.BASE_URL}/payment-success?order=${orderId}`,
      webhookUrl:  `${process.env.BASE_URL}/webhook/mollie`,
      metadata: { orderId }
    });

    // On renvoie l'URL du Checkout
    res.json({ checkoutUrl: payment._links.checkout.href });
  } catch (err) {
    console.error('Erreur création paiement Mollie :', err);
    res.status(500).json({ error: 'Impossible de créer le paiement.' });
  }
});

// 4) Endpoint : webhook Mollie
app.post('/webhook/mollie', async (req, res) => {
  const paymentId = req.body.id;
  if (!paymentId) {
    return res.status(400).end();
  }

  try {
    const payment = await mollie.payments.get(paymentId);
    console.log(`Webhook reçu : paiement ${paymentId} → statut ${payment.status}`);
    // TODO : mettre à jour votre base de données selon payment.status
    res.sendStatus(200);
  } catch (err) {
    console.error('Erreur traitement webhook Mollie :', err);
    res.sendStatus(500);
  }
});

// 5) Page de succès de paiement
app.get('/payment-success', (req, res) => {
  const { order } = req.query;
  res.send(`
    <h1>Paiement réussi !</h1>
    <p>Votre commande #${order} a bien été enregistrée.</p>
    <a href="/">Retour à l'accueil</a>
  `);
});

// 6) Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
