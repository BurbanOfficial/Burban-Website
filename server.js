// This is your test secret API key.
const stripe = require("stripe")("sk_test_51Q9ORzRwel3656rYCv3vUCOZm5eKMS2KjlqbOcbI3MXLVFy5TZDQFth7DUwCSP5HlIBRrslN2NplWwHfLfaWarL900J9Q4Ns99", {
  apiVersion: "2025-03-31.basil",
});
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",
    line_items: [
      {
        // Provide the exact Price ID (e.g. price_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/return.html?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: {enabled: true},
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log("Running on port 4242"));