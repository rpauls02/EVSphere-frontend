import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
import './NotFound.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="logo-container">
                <img src={logo} alt="sec-logo" />
            </div>
            <h1>404 - Page Not Found</h1>
            <h2>Sorry, the page you are looking for does not exist.</h2>
            <button
                onClick={() => navigate(-1)}
                className="return-button"
            >
                Return
            </button>
        </div>
    );
}

export default NotFound;