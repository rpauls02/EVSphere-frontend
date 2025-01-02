import axios from 'axios';
import Stripe from 'stripe';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { UserInvoice } from './types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-11-20.acacia',
});

export const hasStripeCustomerId = async (customerID: string) => {
    try {
        // Access the "users" collection
        const userCollection = collection(db, "users");

        // Query Firestore for the user document by email
        const userQuery = query(userCollection, where("stripe_cID", "==", customerID));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            throw new Error("Customer not found");
        }

        // Get the first matching document
        const userDoc = userSnapshot.docs[0].data();

        // Check if the Stripe Customer ID exists
        return !!userDoc.stripeCustomerId;
    } catch (error: any) {
        console.error("Error checking Stripe customer ID:", error.message);
        throw error;
    }
};

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

/* Delete Stripe customer by email */
export const deleteStripeCustomer = async (customerId: string) => {
    try {
        // Delete the customer using Stripe's API
        await stripe.customers.del(customerId);
        console.log(`Customer with ID ${customerId} deleted successfully.`);
        return { success: true, message: "Customer deleted successfully." };
    } catch (error) {
        console.error("Error deleting Stripe customer:", error);
        throw new Error("Failed to delete customer. Please try again later.");
    }
};

/* Fetch user invoices from Stripe */
export const fetchUserInvoices = async (stripeCustomerID: string): Promise<UserInvoice[]> => {
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

        const invoices: UserInvoice[] = response.data.map((invoice: any) => ({
            id: invoice.id,
            userID: invoice.userID,
            customerID: invoice.customerID,
            customerEmail: invoice.customer_email,
            createdAt: invoice.createdAt ? new Date(invoice.createdAt) : new Date(),
            currency: invoice.currency,
            status: invoice.status,
            total: invoice.total,
            amount_due: invoice.amount_due,
            energyConsumed: invoice.metadata.energyConsumed ? parseFloat(invoice.metadata.energyConsumed) : 0,
            pricePerKwh: invoice.metadata.pricePerKwh ? parseFloat(invoice.metadata.pricePerKwh) : 0,
            invoicePDF: invoice.invoicePDF || '',
        }));

        return invoices;
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


export const generateInvoice = async ({
    customerId,
    customerEmail,
    pricePerKwh,
    energyConsumed,
    currency = "EUR",
}: {
    customerId: string;
    customerEmail: string;
    pricePerKwh: number;
    energyConsumed: number;
    currency?: string;
}): Promise<Stripe.Invoice> => {
    try {
        const totalAmount = Math.round(pricePerKwh * energyConsumed);

        const metadata = {
            customerEmail,
            pricePerKwh: `${pricePerKwh} cents`,
            energyConsumed: `${energyConsumed} kWh`,
            total: `${(totalAmount / 100).toFixed(2)} ${currency.toUpperCase()}`,
        };

        await stripe.invoiceItems.create({
            customer: customerId,
            amount: totalAmount,
            currency: currency,
            description: `Energy Consumption Invoice: ${energyConsumed} kWh at ${pricePerKwh} cents/kWh`,
            metadata,
        });

        const invoice = await stripe.invoices.create({
            customer: customerId,
            auto_advance: true,
            metadata,
            footer: "Thank you for your transaction!",
        });

        // Finalize the invoice (optional if auto_advance is true)
        await stripe.invoices.finalizeInvoice(invoice.id);

        return invoice;
    } catch (error: any) {
        console.error("Error generating energy invoice:", error.message);
        throw error;
    }
};



