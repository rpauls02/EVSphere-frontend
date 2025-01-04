require('dotenv').config(); // Load .env variables into process.env
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_51QSikuP5cm5w1aGdLgvApcaCT3T7ox0FievRjyAJCi5TjgnZwH9PRpnc71KYRriFtD4f5vctNmGCs0ahqpiNdxAD001BLiJ02A");


// Getting a single product
router.get('/get-product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await stripe.products.retrieve(id);
        res.status(200).send(product);
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send({ error: 'Error retrieving product' });
    }
});


// Getting all products
router.get('/get-products', async (req, res) => {
    try {
        const products = await stripe.products.list();
        res.status(200).send(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send({ error: 'Error retrieving products' });
    }
});


// Create a product
router.post('/createProduct', async (req, res) => {
    try {
        const { description } = req.body;

        // Step 1: Create the Product
        const product = await stripe.products.create({
            name: "EV Charging Session",
            description
        });

        // // Step 2: Create a Price for the Product
        // const price = await stripe.prices.create({
        //     unit_amount: amount, // Amount in cents (e.g., 5025 for £50.25)
        //     currency: 'gbp',
        //     product: product.id,
        // });

        res.status(200).send({ productId: product.id});
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send({ error: error.message });
    }
});

// Updating a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, images } = req.body;

    try {
        const updatedProduct = await stripe.products.update(id, {
            name,
            description,
            images: images || [],  // Optional: update images if provided
        });

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ error: 'Error updating product' });
    }
});

module.exports = router;