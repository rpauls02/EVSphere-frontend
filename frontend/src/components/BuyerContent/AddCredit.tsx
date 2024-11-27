import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const AddCreditForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(0);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('CardElement is not available');
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        'YOUR_CLIENT_SECRET_FROM_SERVER',
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'User Name',
            },
          },
        }
      );

      if (error) {
        console.error('Payment failed:', error.message);
      } else {
        console.log('Payment successful:', paymentIntent);
        // Update user's credit balance in your database
      }
    } catch (err) {
      console.error('Error during payment confirmation:', err);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <button type="submit" disabled={!stripe}>
        Add Credit
      </button>
    </form>
  );
};

export default AddCreditForm;
