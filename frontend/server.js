// Import necessary libraries
const express = require('express');
const WebSocket = require('ws'); // WebSocket package for real-time communication
const OCPP = require('ocpp-js');
const stripe = require('stripe')('sk_test_51QS6QYCOqnnRhi6j3f3Tf1C0IfoCZrMtBCN43BOH18pUp0r7k7zDufEMx8F1SKnjWoNTHMcEmTaAjANwMxzIfBFt007WKvgYmr'); // Replace with your actual secret key
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

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

// Set up WebSocket server for real-time communication
const wss = new WebSocket.Server({ port: 9000 }); // WebSocket server on port 9000

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  // Listen for messages from the client
  ws.on('message', async (message) => {
    console.log('Received message:', message);

    if (message === 'getChargingStatus') {
      try {
        // Get the charging status from the charging point
        const status = await chargingPoint1.sendMessage('GetChargingStatus', { connectorId: 1 });
        ws.send(JSON.stringify(status)); // Send the status back to the client
      } catch (error) {
        console.error('Error fetching charging status:', error);
        ws.send(JSON.stringify({ error: 'Failed to get charging status' }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

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

// Stripe webhook endpoint
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const endpointSecret = 'whsec_0cdf4096ef0c4fb412dbc92f76752bf246d38ae10497f4de8a429c1974f38345'; // Replace with your actual webhook secret
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'invoice.created') {
    const invoice = event.data.object;

    // Save invoice details to Firestore
    const invoiceData = {
      id: invoice.id,
      customerId: invoice.customer,
      total: invoice.amount_due,
      currency: invoice.currency,
      status: invoice.status,
      createdAt: new Date(invoice.created * 1000),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      invoicePdf: invoice.invoice_pdf,
      metadata: invoice.metadata || null,
    };

    try {
      await db.collection('invoices').doc(invoice.id).set(invoiceData);
      console.log(`Invoice ${invoice.id} stored successfully!`);
    } catch (error) {
      console.error('Error saving invoice to Firestore:', error);
    }
  }

  res.status(200).send('Webhook received');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
