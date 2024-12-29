require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3002; // Fallback to 3002 for local testing

const { initOcppServer } = require('./ocpp-server');

// Start OCPP server
initOcppServer();

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

const stations = [
  { id: 1, name: "Station A", slots: 5 },
  { id: 2, name: "Station B", slots: 2 },
];

// Routes
app.post("/book-slot", (req, res) => {
  const { stationId } = req.body;

  if (!stationId || typeof stationId !== "number") {
    return res.status(400).json({ message: "Invalid station ID." });
  }

  const station = stations.find((s) => s.id === stationId);

  if (station && station.slots > 0) {
    station.slots -= 1;
    res.status(200).json({ message: "Slot booked successfully!", availableSlots: station.slots });
  } else {
    res.status(400).json({ message: "No slots available." });
  }
});

app.get("/get-stations", (req, res) => {
  res.status(200).json(stations.map(({ id, name, slots }) => ({ id, name, slots })));
});

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