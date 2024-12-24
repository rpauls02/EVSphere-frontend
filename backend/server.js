require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3002; // Fallback to 3002 for local testing



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
const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from 'public' folder in production
const buildPath = isProduction
  ? path.join(__dirname, 'public')  // When in Docker (production), serve from 'public'
  : path.join(__dirname, '..', 'frontend', 'build'); // During local development, serve from frontend/build
app.use(express.static(buildPath));

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});