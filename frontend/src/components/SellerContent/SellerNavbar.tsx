import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function BuyerNavbar() {
    return (
        <nav className="nav-options">
            <ul>
                <li><Link to="/stations">Stations</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
            </ul>
        </nav>
    );
}

export default BuyerNavbar;
