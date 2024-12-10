import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import {useState} from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setIsProcessing(true);  // Disable the button to prevent multiple submissions

    // Ensure Stripe and Elements are loaded before proceeding
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      setIsProcessing(false);
      return;
    }

    try {
      // Confirm the payment with Stripe
      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect URL after successful payment
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        // Display error message if payment fails
        setMessage(`Payment failed: ${error.message}`);
      } else {
        // Successful message (if you want to show it before redirect)
        setMessage('Payment processing...');
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    }

    setIsProcessing(false); // Re-enable the button after processing
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form id="payment-form" onSubmit={handleSubmit}>
        {/* Stripe PaymentElement handles the UI */}
        <PaymentElement />

        {/* Submit Button */}
        <button
          disabled={isProcessing || !stripe || !elements}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>

        {/* Display payment message */}
        {message && (
          <div
            id="payment-message"
            style={{
              marginTop: '20px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
