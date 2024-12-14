require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");


// Get all prices
router.get('/', async (req, res) => {
    try {
        const prices = await stripe.prices.list({
            limit: 10, // Adjust the limit as needed
        });
        res.status(200).send(prices);
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get a specific price
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const price = await stripe.prices.retrieve(id);
        res.status(200).send(price);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { unit_amount, currency, product } = req.body;

        const newPrice = await stripe.prices.create({
            unit_amount,
            currency,
            product,
          });
        res.status(200).send(newPrice);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Search for prices
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query; // Extract the query from the request query parameters
        const prices = await stripe.prices.search({
            query,
        });
        res.status(200).send(prices);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log('Error fetching prices:', error);
    }
});

// Dynamic pricing function
const calculateDynamicPricing = (kWhUsed, location, isPeakTime) => {
    let baseRate = 0.25; // Base rate per kWh
    if (isPeakTime) baseRate += 0.10; // Add surcharge for peak time
    const locationMultiplier = location === 'urban' ? 1.2 : 1.0; // Adjust rate for location
    return kWhUsed * baseRate * locationMultiplier;
};

// REST function for calculating the dynamic price
router.post('/calculate-price', async (req, res) => {
    const { kWhUsed, location, isPeakTime } = req.body;
    try {
        const price = calculateDynamicPricing(kWhUsed, location, isPeakTime);
        res.status(200).send({ price });
    } catch (error) {
        res.status(500).send({ error: 'Error calculating price' });
    }
});

module.exports = router;