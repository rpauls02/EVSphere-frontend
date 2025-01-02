import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-form">
      <h2>Payment Details</h2>
      <CardElement />
    </div>
  );
};

const PaymentPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;