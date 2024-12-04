import axios from 'axios';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-09-30.acacia',
});

/* Generate Stripe customer ID for user */
export const createStripeCustomer = async (email: string) => {
    try {
        const customer = await stripe.customers.create({
            email,
        });
        return customer.id;
    } catch (error) {
        console.error("Error creating Stripe customer:", error);
        throw new Error("Failed to create customer. Please try again later.");
    }
};

interface Invoice {
    id: string;
    amount_due: number;
    currency: string;
    status: string;
    energyConsumed: number;
}

/* Fetch user invoices from Stripe */
export const fetchUserInvoices = async (stripeCustomerID: string): Promise<Invoice[]> => {
    if (!stripeCustomerID) {
        throw new Error("Stripe Customer ID is required to fetch invoices.");
    }

    try {
        const response = await axios.get(`/api/invoices`, {
            params: { customerId: stripeCustomerID }
        });
        
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error fetching invoices:", error.response?.data);
            throw new Error(`Failed to fetch invoices: ${error.response?.data || 'An error occurred'}`);
        } else {
            console.error("Unexpected error:", error);
            throw new Error("Failed to fetch invoices. Please try again later.");
        }
    }
};




