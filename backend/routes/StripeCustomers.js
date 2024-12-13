require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await stripe.customers.list({
            limit: 10, // Adjust the limit as needed
        });
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get a specific customer
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const customer = await stripe.customers.retrieve(id);
        res.status(200).send(customer);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
// Update a customer
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const { name } = req.body; // Extract the name from the request body

        const customer = await stripe.customers.update(id, {
            name,
        });
        res.status(200).send(customer);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
    // Delete a customer
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params; // Extract the ID from the request parameters

            const deletedCustomer = await stripe.customers.del(id);
            res.status(200).send(deletedCustomer);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Create a new customer
    router.post('/', async (req, res) => {
        try {
            const { name, email } = req.body; // Extract fields from the request body

            // Use these fields to create a customer
            const customer = await stripe.customers.create({
                name,
                email,
            });

            res.status(200).send(customer);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

module.exports = router;
