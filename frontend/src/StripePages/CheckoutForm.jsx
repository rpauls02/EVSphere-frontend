import {useEffect, useState} from 'react';
import {useStripe, useElements} from '@stripe/react-stripe-js';
import { PaymentElement} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({cart}),
    });

    const data = await response.json();
    setIsProcessing(false);

    if (data.error) {
      setMessage(data.error);
    } else {
      window.location = data.url;
    }
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `${window.location.origin}/checkout?success=true`,
        },
    })
    if (error) {
        setMessage(`Payment failed: ${error.message}`);
        setIsProcessing(false);
        return;
    }
    setIsProcessing(false);
  }
  return (
    <div>
        <form id = "payment-form" onSubmit={handleSubmit}>
            <button disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
      <h1>Checkout</h1>
        <PaymentElement />
 
        {message && <div id="payment-message">{message}</div>}
        </form>
    </div>
  );
}