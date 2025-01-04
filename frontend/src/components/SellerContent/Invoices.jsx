import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import axios from "axios";
import { db } from "../../firebaseConfig";

const UserInvoices = () => {
    const [stripeCustomerId, setStripeCustomerId] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const auth = getAuth();

        const fetchStripeCustomerId = async (userId) => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const stripeId = userDoc.data().stripeCustomerId;
                    setStripeCustomerId(stripeId);
                    console.log("Fetched Stripe Customer ID:", stripeId);
                } else {
                    console.error("User document not found.");
                    setError("User document not found.");
                }
            } catch (err) {
                console.error("Error fetching Stripe Customer ID:", err);
                setError("Error fetching Stripe Customer ID. Please try again.");
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user.uid);
                fetchStripeCustomerId(user.uid);
            } else {
                console.error("No user is signed in.");
                setError("No user is signed in.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!stripeCustomerId) {
                console.log("Stripe Customer ID is not available.");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3002/StripeInvoices/invoices/${stripeCustomerId}`);
                if (response.data && response.data.data) {
                    setInvoices(response.data.data);
                    console.log("Fetched Invoices:", response.data.data);
                } else {
                    console.error("Invalid response format from Stripe API:", response.data);
                    setError("Failed to fetch invoices. Please try again.");
                }
            } catch (err) {
                console.error("Error fetching invoices:", err);
                setError("Error fetching invoices. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [stripeCustomerId]);

    const handlePayNow = async (invoice) => {
        setError("");
    
        try {
            if (!invoice || !invoice.amount_due) {
                console.error("Invalid invoice data:", invoice);
                setError("Invoice amount is missing or invalid. Please try again.");
                return;
            }
    
            const response = await axios.post("http://localhost:3002/StripeCheckoutSession/create-checkout-session", {
                line_items: [
                    {
                        price_data: {
                            currency: "gbp",
                            product_data: {
                                name: `Invoice #${invoice.id}`,
                                description: `Payment for invoice ${invoice.id}`,
                            },
                            unit_amount: invoice.amount_due, // Stripe expects amount in pence for GBP
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: "http://localhost:3002/success",
                cancel_url: "http://localhost:3002/cancel",
            });
    
            console.log("Checkout Session Response:", response.data.url);
            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (err) {
            console.error("Error redirecting to Stripe Checkout:", err.response || err);
            setError("Failed to create Checkout Session. Please try again.");
        }
    };
    
    if (loading) return <p>Loading invoices...</p>;

    return (
        <div>
            <h1>Your Invoices</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {invoices.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Status</th>
                            <th>Amount Due</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.status.toUpperCase()}</td>
                                <td>£{(invoice.amount_due / 100).toFixed(2)}</td>
                                <td>
                                    {invoice.status === "open" ? (
                                        <button
                                            onClick={() => handlePayNow(invoice)}
                                            disabled={loading || !stripeCustomerId}
                                        >
                                            Pay Now
                                        </button>
                                    ) : (
                                        "Paid"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No invoices found.</p>
            )}
        </div>
    );
};

export default UserInvoices;
