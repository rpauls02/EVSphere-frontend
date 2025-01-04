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

router.post("/create-checkout-session", async (req, res) => {
    const { line_items, mode, success_url, cancel_url } = req.body;

    if (!line_items || !mode || !success_url || !cancel_url) {
        return res.status(400).send({ error: "Missing required parameters" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // Adjust if you want to add more payment methods
            line_items,
            mode,
            success_url,
            cancel_url,
        });

        res.status(200).send({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
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