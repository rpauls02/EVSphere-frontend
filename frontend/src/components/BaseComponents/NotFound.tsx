import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
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