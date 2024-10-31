import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="homepage-container">
            <div className="welcome-message-container">
                <h1>Welcome to EVSphere</h1>
            </div>
            <div className="account-message-container">
                <h3>Login to manage your account</h3>
                <h3>Don't have an account? <Link className="create-account-link" to="/signupform">Create one now</Link></h3>
            </div>

        </div>
    );
};

export default Home;