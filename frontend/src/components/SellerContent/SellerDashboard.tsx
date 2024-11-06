import React from 'react';
import SellerNavbar from './SellerSidebar';
import './SellerDashboard.css';

const UserDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <SellerNavbar/>
            <div className="welcome-message-container">
                <h1>Welcome back, User</h1>
            </div>
            
        </div>
    );
};

export default UserDashboard;