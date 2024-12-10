require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const app = express();
const port = 3002;

app.use(express.json()); // For parsing JSON bodies

const stripeRoutes = require('./routes/stripe');


app.use('/stripe', stripeRoutes); 

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve the React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Get or create a PaymentIntent and return its client secret
app.get('/checkout', async (req, res) => {
  try {
    const amount = req.query.amount; // Retrieve amount from query parameters
    if (!amount) {
      return res.status(400).send({ error: 'Amount is required' });
    }

    // Create a new PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10), // Ensure the amount is in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Respond with the client secret
    res.send({ clientSecret: paymentIntent.client_secret });
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