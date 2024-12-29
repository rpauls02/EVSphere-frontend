import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51QS6QYCOqnnRhi6jQVQdv2bFbs8zDEYiNhI8oCqFlW4yMAMpyoyuATagWetkI2XuHw6UAzwPgh6W4ba4L0zLBJSM00eji4LKgF'); // Replace with your actual public key

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

// Wrap the PaymentForm component in the Elements provider
const PaymentPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;