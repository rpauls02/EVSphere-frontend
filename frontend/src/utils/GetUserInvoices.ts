import Stripe from 'stripe';

// Initialize Stripe with your secret API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27', // Use the latest API version
});

const getUserInvoices = async (): Promise<Stripe.Invoice[]> => {
  try {
    // Fetch invoices using the Stripe SDK
    const invoices = await stripe.invoices.list({
      limit: 100,  // Set the number of invoices to retrieve per request (max 100)
    });
    
    return invoices.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Could not fetch invoices');
  }
};

export default{ getUserInvoices };
