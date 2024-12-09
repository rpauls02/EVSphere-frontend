require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const app = express();
const port = 3002;

app.use(express.json()); // For parsing JSON bodies

const stripeRoutes = require('./routes/stripe');


app.use('/stripe', stripeRoutes); 
// Route to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Amount in cents (e.g., $10.00 is 1000)
      currency: 'usd',
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
});

  res.redirect(303, session.url);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
