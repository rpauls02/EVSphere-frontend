require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");

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

router.get('/invoices/:stripeCustomerId', async (req, res) => {
  const { stripeCustomerId } = req.params; // Get from params

  try {
      if (!stripeCustomerId) {
          return res.status(400).send({ error: 'Stripe Customer ID is required.' });
      }

      const invoices = await stripe.invoices.list({
          customer: stripeCustomerId,
          limit: 10,
      });

      res.status(200).send(invoices);
  } catch (error) {
      console.error('Error fetching invoices:', error);
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

router.post('/createInvoice', async (req, res) => {
  try {
      const { customer, price } = req.body;

      // Validate inputs
      if (!customer || !price) {
          return res.status(400).send({ error: 'Customer and price are required.' });
      }

      // Step 1: Create the Invoice Item
      const invoiceItem = await stripe.invoiceItems.create({
          customer,
          price, // Price ID
      });
      console.log('Invoice Item created:', invoiceItem.id);

      // Step 2: Create the Invoice
      const invoice = await stripe.invoices.create({
          customer,
          auto_advance: true, // Automatically finalize the invoice
      });

      res.status(200).send(invoice);
  } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).send({ error: error.message });
  }
});

router.post('/createInvoiceWithItem', async (req, res) => {
  try {
    const { customer, priceId } = req.body;

    if (!customer || !priceId) {
      return res.status(400).send({ error: 'Customer and priceId are required.' });
    }

    // Step 1: Add Invoice Item
    const invoiceItem = await stripe.invoiceItems.create({
      customer,
      price: priceId,
    });
    console.log("Invoice Item Created:", invoiceItem);

    // Step 2: Fetch Pending Invoice Items
    const pendingItems = await stripe.invoiceItems.list({
      customer,
      pending: true,
    });
    console.log("Pending Invoice Items for Customer:", pendingItems.data);

    if (pendingItems.data.length === 0) {
      return res.status(400).send({
        error: 'No pending invoice items found for the customer. Cannot create an invoice.',
      });
    }

    // Step 3: Create the Draft Invoice
    const draftInvoice = await stripe.invoices.create({
      customer,
      auto_advance: false,
      pending_invoice_items_behavior: 'include', // Explicitly include pending items
    });
    console.log("Draft Invoice Created:", draftInvoice);

    // Step 4: Finalize the Invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(draftInvoice.id);
    console.log("Finalized Invoice:", finalizedInvoice);

    res.status(200).send({ invoiceItem, finalizedInvoice });
  } catch (error) {
    console.error('Error creating invoice with item:', error);
    res.status(500).send({ error: error.message });
  }
});

// router.post('/createInvoiceWithItem', async (req, res) => {
//   try {
//       const { customer, priceId } = req.body;

//       // Step 1: Add Invoice Item
//       const invoiceItem = await stripe.invoiceItems.create({
//           customer,
//           price: priceId, // Ensure priceId is valid and exists
//       });
//       console.log("Invoice Item Created:", invoiceItem); // Debug log for invoice item
      
//       // Step 2: Create the Invoice
//       const invoice = await stripe.invoices.create({
//           customer,
//           auto_advance: true, // Automatically finalize the invoice
//       });
//       console.log("Invoice Created:", invoice); // Debug log for invoice

//       res.status(200).send({ invoiceItem, invoice }); // Return both objects
//   } catch (error) {
//       console.error('Error creating invoice with item:', error);
//       res.status(500).send({ error: error.message });
//   }
// });



module.exports = router;