import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51QSikuP5cm5w1aGd05kHYyoTblPDqmZ2BeTvuTCLentg8hPsFA6ED6hdCGJHTnD2eSHOg3E4qnfp2WqGDcfHrC1a007Zxt3Rzk");

function App() {
    const [clientSecret, setClientSecret] = useState('');

    // Fetch the client secret when the component mounts
    useEffect(() => {
        fetch('/checkout?amount=1099') // Update the endpoint and amount as necessary
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error('Error fetching client secret:', error));
    }, []);

    const options = {
        clientSecret, // This will dynamically inject the secret
        appearance: {/* optional appearance settings */ },
    };

    return (
        <div>
            {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            setMessage('Stripe has not loaded yet.');
            setIsProcessing(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`, // Redirect after payment
            },
        });

        if (error) {
            setMessage(`Payment failed: ${error.message}`);
        } else {
            setMessage('Payment succeeded!');
        }

        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
};

// Render the App Component
ReactDOM.render(<App />, document.getElementById('root'));

export default CheckoutForm;
