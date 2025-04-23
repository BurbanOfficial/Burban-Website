// server.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import geoip from 'geoip-lite';
// On importe correctement la fonction par défaut
import createMollieClient from '@mollie/api-client';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// On crée l'instance Mollie avec createMollieClient
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY
});

// Exemple de route de test GeoIP
app.get('/geoip', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim();
  res.json({ ip, geo: geoip.lookup(ip) });
});

// Votre logique d'expédition et de calcul...
// ...

// Endpoint de création de paiement
app.post('/create-payment', async (req, res) => {
  try {
    // … calcul de totalCents, etc.
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: (totalCents / 100).toFixed(2)
      },
      description: `Commande #${orderId}`,
      redirectUrl: `https://burbanofficial.com/success?o=${orderId}`,
      webhookUrl:  `https://burbanofficial.com/webhook-mollie`,
      metadata: { orderId }
    });
    res.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
