// Import necessary libraries
const express = require('express');
const OCPP = require('ocpp-js');
const stripe = require('stripe')('sk_test_51QS6QYCOqnnRhi6j3f3Tf1C0IfoCZrMtBCN43BOH18pUp0r7k7zDufEMx8F1SKnjWoNTHMcEmTaAjANwMxzIfBFt007WKvgYmr'); // Replace with your actual secret key

// Set up the Express app
const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up OCPP configuration options
const options = {
  centralSystem: {
    port: 9220
  },
  chargingPoint: {
    serverURI: 'http://localhost:9221/Ocpp/ChargePointService',
    name: 'Simulator 1'
  },
  chargingPointServer: {
    port: 9221
  }
};

// Create OCPP instance
const ocppJS = new OCPP(options);

// Create Central System
const centralSystem = ocppJS.createCentralSystem();

// Create Charging Point Client
const chargingPoint1 = ocppJS.createChargingPoint('http://127.0.0.1:8081/ChargeBox/Ocpp', "chargingPoint1-Simulator");
const chargingPoint2 = ocppJS.createChargingPoint('http://localhost:9221/Ocpp/ChargePointService', "chargingPoint2-Simulator");

// Create Charging Point Server
const chargingPointServer = ocppJS.createChargingPointServer(9221);

// Express route for handling Stripe payments (example)
app.post('/charge', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      payment_method: req.body.payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Express route for fetching user invoices
app.get('/invoices', async (req, res) => {
  const { customerId } = req.query; // Get customer ID from the query parameter

  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    // Fetch invoices from Stripe using the customer ID
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10, // You can adjust the number of invoices to fetch
    });

    // Send the invoices as a response
    res.json({ invoices: invoices.data });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
