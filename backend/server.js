require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

app.use(express.json()); // For parsing JSON bodies

const invoiceRoutes = require('./routes/StripeInvoices');
const customerRoutes = require('./routes/StripeCustomers');
const paymentIntentRoutes = require('./routes/StripePaymentIntent');
const stripeCheckoutSessionRoutes = require('./routes/StripeCheckoutSession');
const priceRoutes = require('./routes/StripePrices');
const productRoutes = require('./routes/StripeProduct');

app.use('/StripeInvoices', invoiceRoutes); 
app.use('/StripeCustomers', customerRoutes);
app.use('/StripePaymentIntent', paymentIntentRoutes);
app.use('/StripeCheckoutSession', stripeCheckoutSessionRoutes);
app.use('/StripePrices', priceRoutes);
app.use('/StripeProduct', productRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve the React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});