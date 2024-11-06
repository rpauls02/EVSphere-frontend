import React from 'react';
import BuyerNavbar from './BuyerNavbar';
import './BuyerDashboard.css';

const BuyerDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <BuyerNavbar/>
            <div className="welcome-message-container">
                <h1>Welcome back, User</h1>
            </div>
            
        </div>
    );
};

export default BuyerDashboard;