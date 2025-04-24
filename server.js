import express from 'express';
import { createMollieClient } from '@mollie/api-client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS : Autorise toutes les origines (ou mets l'URL exacte de ton frontend si tu veux restreindre)
app.use(cors({
  origin: '*',
}));

app.use(express.json());
app.use(express.static('public')); // Sert les fichiers statiques (HTML, JS, etc.)

// Crée un client Mollie avec ta clé API
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

// Route pour créer un paiement
app.post('/create-payment', async (req, res) => {
  try {
    const { amount, description } = req.body;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: Number(amount).toFixed(2), // Toujours une string au format "00.00"
      },
      description,
      redirectUrl: `https://burbanofficial.com/render-success`, // Remplace par l’URL vers ta page de succès
      webhookUrl: `https://burban-mollie-payments.onrender.com/webhook`, // Ton URL Render
    });

    res.json({ checkoutUrl: payment._links.checkout.href });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Webhook Mollie : notifie l'état du paiement
app.post('/webhook', async (req, res) => {
  const paymentId = req.body.id;

  try {
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.isPaid()) {
      console.log('✅ Paiement réussi :', payment);
      // TODO : mettre à jour base de données, envoyer confirmation...
    } else {
      console.log('❌ Paiement échoué ou annulé :', payment);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement :', error);
  }

  res.status(200).send(); // Toujours répondre à Mollie
});

// (Facultatif) Route de succès si tu veux servir une page statique
app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/public/success.html');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});