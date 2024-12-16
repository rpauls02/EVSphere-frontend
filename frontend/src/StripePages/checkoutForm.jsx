import React, { useState } from "react";
import axios from "axios";

export default function CheckoutPage() {
    const [error, setError] = useState("");

    const handleExampleCheckout = async () => {
        setError("");

        try {
            const response = await axios.post("/StripeCheckoutSession/create-checkout-session", {
                customer: "cus_RNMkdIEQTKBlNC", // Replace with a valid customer ID
                line_items: [{
                    "price": "price_1QWPZ8P5cm5w1aGdcGS9yclj",
                    "quantity": 1
                }],
                mode: "payment",
                success_url: "http://localhost:3002/success",
                cancel_url: "http://localhost:3002/cancel",
            });
            console.log("Checkout Session Response:", response.data.url);
            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (err) {
            console.error("Error redirecting to Stripe Checkout:", err);
            setError("Failed to create Checkout Session. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Stripe Checkout</h1>

            <h2>Example Product</h2>
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
                <p>
                    <strong>Product Name:</strong> Example Product
                </p>
                <p>
                    <strong>Description:</strong> This is a test product for $50.00
                </p>
                <p>
                    <strong>Price:</strong> $50.00
                </p>
                <button
                    onClick={handleExampleCheckout}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Buy Now
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
