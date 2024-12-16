require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");

// Get all CheckoutSessions
router.get('/', async (req, res) => {
    try {
        const checkoutSessions = await stripe.checkout.sessions.list({
            limit: 10,
        });
        res.status(200).send(checkoutSessions); // Corrected: Changed res.send(200) to res.status(200)
    } catch (error) {
        console.error('Error fetching CheckoutSessions:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get a specific CheckoutSession
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const checkoutSession = await stripe.checkout.sessions.retrieve(id);
        res.status(200).send(checkoutSession);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Create a CheckoutSession
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { line_items, mode } = req.body; // Extract fields from the request body

        if (!line_items || line_items.length === 0) {
            return res.status(400).send({ error: 'line_items is required and cannot be empty.' });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: "cus_RNMkdIEQTKBlNC",
            line_items, // Use line_items from the body dynamically
            mode,
            success_url: "http://localhost:3002/success", // Replace with the success page URL
            cancel_url: "http://localhost:3002/cancel", // Replace with the cancel page URL
        });
        console.log('CheckoutSession created with the properties:', req.body);
        console.log('URL to redirect to Checkout:', checkoutSession.url);
        res.status(200).send({ url: checkoutSession.url });
    } catch (error) {
        console.error('Error creating CheckoutSession:', error);
        res.status(500).send({ error: error.message });
    }
});

// Retrieve a CheckoutSession's line items
router.get('/:id/line_items', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const lineItems = await stripe.checkout.sessions.listLineItems(id);
        res.status(200).send(lineItems);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a CheckoutSession
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const { customer, line_items, mode } = req.body; // Extract fields from the request body

        const checkoutSession = await stripe.checkout.sessions.update(id, {
            customer,
            line_items,
            mode,
        });

        res.status(200).send(checkoutSession);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;