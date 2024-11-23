import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../BaseComponents/Header'
import Footer from '../BaseComponents/Footer'
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="homepage-container">
            <Header />
            <div className="welcome-message-container">
                <h1>Welcome to EVSphere</h1>
            </div>
            <div className="account-message-container">
                <h3><Link className="login-link" to="/login">Login</Link> to manage your account</h3>
                <h3>Don't have an account? <Link className="create-account-link" to="/signup">Create one now</Link></h3>
            </div>
            <Footer />
        </div>
    );
};

export default Home;