// server.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import geoip from 'geoip-lite';

const app = express();

// Mollie API client
import Mollie from '@mollie/api-client';
const mollieClient = Mollie({ apiKey: process.env.MOLLIE_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route de test GeoIP (inchangée)
app.get('/geoip', (req, res) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  res.json({ ip, geo });
});

// --- TARIFS D'EXPÉDITION & FONCTIONS ASSOCIEES (inchangés) ---
const shippingRates = { /* … comme avant … */ };
function getCategory(item) { /* … */ }
function getShippingCost(item, region) { /* … */ }
function getCombinedShippingCost(items, region) { /* … */ }
const countryToRegion = { /* … */ };
const euCountries = [ /* … */ ];

// Endpoint de création de paiement Mollie
app.post('/create-payment', async (req, res) => {
  try {
    const { items, voucher } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: "Aucun article dans le panier." });
    }

    // 1) Détection région utilisateur
    const xff = req.headers['x-forwarded-for'];
    const ip = xff ? xff.split(',')[0].trim() : req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    let region = 'worldwide';
    if (geo && geo.country) {
      const cc = geo.country.toLowerCase();
      if (countryToRegion[cc]) region = countryToRegion[cc];
      else if (euCountries.includes(cc)) region = 'europe';
    }

    // 2) Calcul des totaux
    const subTotalEuros = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxCents    = Math.round(subTotalEuros * 100 * 0.20);
    const shippingCents = getCombinedShippingCost(items, region);
    const totalCents  = Math.round(subTotalEuros * 100) + taxCents + shippingCents;

    // 3) Gestion des vouchers (on pourrait les passer en metadata si besoin)
    // … tu peux ajouter ici ta logique de coupons si tu veux l’intégrer côté Mollie …

    // 4) Création du paiement Mollie
    const orderId = Date.now().toString();
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: (totalCents / 100).toFixed(2)
      },
      description: `Commande Burban #${orderId}`,
      redirectUrl: `https://burbanofficial.com/public/success.html?order=${orderId}`,
      webhookUrl:  `https://burbanofficial.com/webhook-mollie`,
      metadata: {
        orderId,
        items: JSON.stringify(items)
      }
    });

    // 5) On renvoie l’URL de redirection front
    res.json({ checkoutUrl: payment.getCheckoutUrl() });

  } catch (err) {
    console.error("Erreur create-payment :", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

// Keep-alive ping (inchangé)
const https = require('https');
const SERVER_URL = 'https://burban-mollie-payments.onrender.com'; // mets ici ton URL publique

function pingSelf() {
  https.get(SERVER_URL, res => {
    console.log(`Ping réussi : ${res.statusCode}`);
  }).on('error', err => {
    console.error('Erreur ping :', err.message);
  });
}
setInterval(pingSelf, 180000);
pingSelf();
