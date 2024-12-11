const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json()); // For parsing JSON bodies

// Get all invoices
router.get('/', async(req, res) => {
  try {
    const invoices = await stripe.invoices.list({
        limit: 10, // Adjust the limit as needed
    });
    res.status(200).send(invoices);
} catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).send({ error: error.message });
}
});

// Get a specific invoice
router.get('/:id', async(req, res) => {
    try {
      const invoice = await stripe.invoices.retrieve(req.params.id);
      res.status(200).send(invoice);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

// Update an invoice
router.put('/:id', async(req, res) => {
    try {
      const { id } = req.params; // Extract the ID from the request parameters
      const { amount } = req.body; // Extract the amount from the request body

      const invoice = await stripe.invoices.update(id, {
        amount
      });
      res.status(200).send(invoice);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

// Delete an invoice
router.delete('/:id', async(req, res) => {
    try {
      const deletedInvoice = await stripe.invoices.del(req.params.id);
      res.status(200).send(deletedInvoice);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

// Create a new invoice
router.post('/', async(req, res) => {
    try {
      const { customer } = req.body; // Extract fields from the request body

      const invoice = await stripe.invoices.create({
        customer // Replace with the ID of your customer
      });
      res.status(200).send(invoice);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

module.exports = router;