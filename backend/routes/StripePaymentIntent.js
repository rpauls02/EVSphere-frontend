require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");


// Get all PaymentIntents
router.get('/', async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 10, // Adjust the limit as needed
        });
        res.status(200).send(paymentIntents);
    } catch (error) {
        console.error('Error fetching PaymentIntents:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get a specific PaymentIntent
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.status(200).send(paymentIntent);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Create a PaymentIntent
router.post('/', async (req, res) => {
    console.log('Creating PaymentIntent');
    try {
        const { customer, amount, currency } = req.body; // Extract fields from the request body

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer,
        });
        res.status(200).send(paymentIntent);
    } catch (e) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).send({ error: error.message });
    }
});
    // Update a PaymentIntent
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params; // Extract the ID from the request parameters
            const { amount } = req.body; // Extract the amount from the request body

            const paymentIntent = await stripe.paymentIntents.update(id, {
                amount,
            });
            res.status(200).send(paymentIntent);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Delete a PaymentIntent
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params; // Extract the ID from the request parameters
            const paymentIntent = await stripe.paymentIntents.cancel(id);
            res.status(200).send(paymentIntent);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    
module.exports = router;