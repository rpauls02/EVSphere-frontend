import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AppRoutes from './AppRoutes';
import './App.css';

const stripePromise = loadStripe('your_publishable_key_here'); // Replace with your actual Stripe publishable key

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Elements stripe={stripePromise}>
                    <main className="content">
                        <AppRoutes />
                    </main>
                </Elements>
            </div>
        </Router>
    );
};

export default App;
