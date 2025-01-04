require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");

router.post('/createInvoiceItem', async (req, res) => {
    try {
        const { customer, price } = req.body;

        if (!customer || !price) {
            return res.status(400).send({ error: 'Customer and price are required.' });
        }

        // Create the invoice item
        const invoiceItem = await stripe.invoiceItems.create({
            customer,
            price,
        });

        res.status(200).send(invoiceItem);
    } catch (error) {
        console.error('Error creating invoice item:', error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;