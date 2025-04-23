import express from 'express';
import bodyParser from 'body-parser';
import mollieModule from '@mollie/api-client';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const mollieClient = mollieModule.default({ apiKey: process.env.MOLLIE_API_KEY });

app.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, orderId } = req.body;
    const value = amount.toFixed(2);

    const payment = await mollieClient.payments.create({
      amount: { currency: 'EUR', value },
      description,
      redirectUrl: `https://burbanofficial.com/checkout-success?order=${orderId}`,
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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
