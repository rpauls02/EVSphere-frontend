import React from 'react';
import UserNavbar from './UserSidebar';
import './UserDashboard.css';

const UserDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <UserNavbar/>
            <div className="welcome-message-container">
                <h1>Welcome back, User</h1>
            </div>
            
        </div>
    );
};

export default UserDashboard;