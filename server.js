import express from 'express';
import { createMollieClient } from '@mollie/api-client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

app.use(express.json());
app.use(express.static('public')); // Pour servir les fichiers statiques du frontend

// Route pour créer un paiement
app.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, redirectUrl, webhookUrl } = req.body;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amount,
      },
      description,
      redirectUrl,
      webhookUrl,
      method: 'creditcard', // Ou tout autre méthode supportée
    });

    res.json({ checkoutUrl: payment._links.checkout.href });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Webhook pour recevoir les notifications de paiement
app.post('/webhook', (req, res) => {
  const paymentId = req.body.id;

  mollieClient.payments.get(paymentId)
    .then(payment => {
      if (payment.isPaid()) {
        // Traiter la commande comme payée
        console.log('Paiement réussi:', payment);
      } else {
        // Traiter la commande comme échouée ou annulée
        console.log('Paiement échoué ou annulé:', payment);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du paiement:', error);
    });

  res.status(200).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
