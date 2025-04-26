require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const geoip   = require('geoip-lite');
const https   = require('https');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Route de test GeoIP (facultative) ---
app.get('/geoip', (req, res) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = xForwardedFor
    ? xForwardedFor.split(',')[0].trim()
    : req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  res.json({ ip, geo });
});

// --- Configuration des tarifs d'expédition ---
const shippingRates = {
  category1: { us: { unique: 4.49, additional: 2.10 }, europe: { unique: 4.29, additional: 1.25 }, uk: { unique: 4.19, additional: 1.25 }, efta: { unique: 8.99, additional: 1.00 }, canada: { unique: 7.69, additional: 1.70 }, australia: { unique: 6.19, additional: 1.15 }, japan: { unique: 3.99, additional: 1.25 }, brazil: { unique: 4.09, additional: 2.25 }, worldwide: { unique: 10.59, additional: 5.30 } },
  category2: { us: { unique: 8.09, additional: 2.20 }, europe: { unique: 6.29, additional: 2.00 }, uk: { unique: 5.99, additional: 2.00 }, efta: { unique: 9.99, additional: 2.00 }, canada: { unique: 9.49, additional: 2.05 }, australia: { unique: 9.79, additional: 1.80 }, japan: { unique: 5.99, additional: 2.00 }, brazil: { unique: 5.39, additional: 2.70 }, worldwide: { unique: 6.29, additional: 2.00 } },
  category3: { us: { unique: 9.79, additional: 4.90 }, europe: { unique: 10.19, additional: 5.10 }, uk: { unique: 9.79, additional: 4.90 }, efta: { unique: 15.79, additional: 8.35 }, canada: { unique: 9.79, additional: 4.90 }, australia: { unique: 9.79, additional: 4.90 }, japan: { unique: 9.79, additional: 4.90 }, worldwide: { unique: 12.49, additional: 5.80 } },
  category4: { us: { unique: 7.09, additional: 2.20 }, europe: { unique: 5.99, additional: 2.00 }, uk: { unique: 5.99, additional: 2.00 }, efta: { unique: 9.99, additional: 2.00 }, canada: { unique: 8.19, additional: 2.05 }, australia: { unique: 9.79, additional: 1.80 }, japan: { unique: 5.99, additional: 2.00 }, brazil: { unique: 5.39, additional: 2.70 }, worldwide: { unique: 14.99, additional: 7.05 } },
  category5: { us: { unique: 7.09, additional: 7.09 }, europe: { unique: 7.99, additional: 7.99 }, uk: { unique: 7.99, additional: 7.99 }, efta: { unique: 7.99, additional: 7.99 }, canada: { unique: 7.09, additional: 7.09 }, australia: { unique: 7.09, additional: 7.09 }, japan: { unique: 7.09, additional: 7.09 }, worldwide: { unique: 7.99, additional: 7.99 } },
  category6: { us: { unique: 3.59, additional: 1.80 }, europe: { unique: 3.99, additional: 1.25 }, uk: { unique: 3.69, additional: 1.25 }, efta: { unique: 8.99, additional: 1.00 }, canada: { unique: 6.09, additional: 1.70 }, australia: { unique: 6.19, additional: 1.15 }, japan: { unique: 3.99, additional: 1.25 }, brazil: { unique: 4.09, additional: 2.25 }, worldwide: { unique: 10.59, additional: 5.30 } }
};

/**
 * Détermine la catégorie d'un article selon son nom.
 */
function getCategory(item) {
  const name = item.name.toLowerCase();
  if (name.includes("t-shirt") || name.includes("tshirt") || name.includes("débardeur") || name.includes("polo") || name.includes("crop-top")) {
    return "category1";
  }
  if (name.includes("sweat") || name.includes("pull") || name.includes("veste") || name.includes("pantalon")) {
    return "category2";
  }
  if (name.includes("hoodie") || name.includes("jacket") || name.includes("joggers")) {
    return "category4";
  }
  if (name.includes("coupe-vent") || name.includes("pyjama")) {
    return "category5";
  }
  if (name.includes("casquette") || name.includes("bonnet") || name.includes("bob")) {
    return "category6";
  }
  return "category3";
}

/**
 * Calcule le coût total d'expédition en combinant les catégories.
 */
function getCombinedShippingCost(items, region) {
  const groups = {};
  items.forEach(item => {
    const cat = getCategory(item);
    groups[cat] = (groups[cat] || 0) + item.quantity;
  });
  const cats = Object.keys(groups);
  let total = 0;

  if (cats.length === 1) {
    const rates = shippingRates[cats[0]][region] || shippingRates[cats[0]].worldwide;
    total = rates.unique + (groups[cats[0]] - 1) * rates.additional;
  } else {
    let maxCat = cats[0], maxU = 0;
    cats.forEach(cat => {
      const rates = shippingRates[cat][region] || shippingRates[cat].worldwide;
      if (rates.unique > maxU) { maxU = rates.unique; maxCat = cat; }
    });
    const maxRates = shippingRates[maxCat][region] || shippingRates[maxCat].worldwide;
    total += maxRates.unique + (groups[maxCat] - 1) * maxRates.additional;
    cats.filter(c => c !== maxCat).forEach(cat => {
      const rates = shippingRates[cat][region] || shippingRates[cat].worldwide;
      total += groups[cat] * rates.additional;
    });
  }

  return Math.round(total * 100);
}

// Mapping pays → régions, et liste pays EU
const countryToRegion = { us: 'us', ca: 'canada', gb: 'uk', uk: 'uk', jp: 'japan', au: 'australia', br: 'brazil' };
const euCountries = [ 'at','be','bg','cy','cz','dk','ee','fi','fr','de','gr','hr','hu','ie','it','lv','lt','lu','mt','nl','pl','pt','ro','sk','si','es','se' ];

/**
 * Ancien endpoint Stripe Checkout Session (inchangé).
 */
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, voucher } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Aucun article dans le panier." });
    }
    
    // GeoIP pour région
    const xForwardedFor = req.headers['x-forwarded-for'];
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    let region = 'worldwide';
    if (geo && geo.country) {
      const countryCode = geo.country.toLowerCase();
      if (countryToRegion[countryCode]) region = countryToRegion[countryCode];
      else if (euCountries.includes(countryCode)) region = 'europe';
    }
    
    // Line items produits
    const productLineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: "Size : " + item.size,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
      tax_rates: [process.env.TAX_RATE_ID]
    }));

    // Shipping total
    const shippingTotal = getCombinedShippingCost(items, region);

    let lineItems = productLineItems;
    if (shippingTotal > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: "Shipping Cost" },
          unit_amount: shippingTotal,
        },
        quantity: 1,
        tax_rates: [process.env.TAX_RATE_ID]
      });
    }

    // Coupons
    let discounts = [];
    if (voucher && voucher.voucherValue) {
      if (voucher.voucherValue === "5") discounts.push({ coupon: process.env.COUPON_5 });
      else if (voucher.voucherValue === "10") discounts.push({ coupon: process.env.COUPON_10 });
      else if (voucher.voucherValue === "20") discounts.push({ coupon: process.env.COUPON_20 });
      else if (voucher.voucherValue === "30") discounts.push({ coupon: process.env.COUPON_30 });
    }

    // Création de la session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [ 'US','CA','AC','AD','AE','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BM','BN','BO','BR','BS','BV','BW','BZ','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CV','CW','CY','CZ','DE','DJ','DK','DM','DO','DZ','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GW','GY','HK','HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KR','KW','KY','KZ','LB','LC','LI','LK','LR','LS','LT','LU','LV','MA','MC','MD','ME','MF','MG','MK','ML','MM','MO','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PS','PT','PY','QA','RE','RO','RS','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','ST','SV','SZ','TA','TF','TG','TH','TK','TL','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UY','UZ','VA','VC','VE','VG','VN','VU','WF','XK','YT','ZA','ZM','ZW','ZZ' ]
      },
      line_items: lineItems,
      ...(discounts.length > 0 ? { discounts } : { allow_promotion_codes: true }),
      mode: 'payment',
      success_url: 'https://burbanofficial.com/public/success.html',
      cancel_url: 'https://burbanofficial.com/public/cancel.html'
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Nouveau endpoint Stripe Elements ---
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, voucher } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Panier vide.' });
    if (!shippingAddress || !billingAddress) return res.status(400).json({ error: 'Adresses manquantes.' });

    const subtotal = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
    const tax      = Math.round(subtotal * 0.20);
    let region     = 'worldwide';
    const cc       = (shippingAddress.country || '').toLowerCase();
    if (countryToRegion[cc]) region = countryToRegion[cc];
    else if (euCountries.includes(cc)) region = 'europe';
    const shippingCost = getCombinedShippingCost(items, region);
    const amount       = subtotal + tax + shippingCost;

    const params = {
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { items: JSON.stringify(items), voucher: voucher?.voucherValue || '' },
      shipping: {
        name: shippingAddress.recipient || '',
        phone: shippingAddress.phone || '',
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country
        }
      },
      billing: {
        name: billingAddress.recipient || '',
        address: {
          line1: billingAddress.line1,
          line2: billingAddress.line2,
          city: billingAddress.city,
          postal_code: billingAddress.postal_code,
          country: billingAddress.country
        }
      }
    };
    if (voucher?.voucherValue) {
      const map = {
        '5': process.env.COUPON_5,
        '10': process.env.COUPON_10,
        '20': process.env.COUPON_20,
        '30': process.env.COUPON_30
      };
      if (map[voucher.voucherValue]) {
        params.discounts = [{ coupon: map[voucher.voucherValue] }];
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(params);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('PaymentIntent error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Démarrage du serveur ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

// --- Ping pour garder le serveur actif (Render) ---
const SERVER_URL = 'https://burban-mollie-payments.onrender.com'; // Remplace par ton URL Render
function pingSelf() {
  https.get(SERVER_URL, res => {
    console.log(`Ping effectué avec succès. Statut: ${res.statusCode}`);
  }).on('error', err => {
    console.error('Erreur lors du ping :', err.message);
  });
}
setInterval(pingSelf, 180000);
pingSelf();
