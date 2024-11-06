import React from 'react';
import { Link } from 'react-router-dom';
import '../BaseComponents/Navbar.css';

const SellerSidebar: React.FC = () => {
    return (
        <nav className="nav-options">
            <ul>
                <li><Link to="/stations">Stations</Link></li>
                <li><Link to="">Tab 2</Link></li>
                <li><Link to="">Tab 3</Link></li>
                <li><Link to="">Tab 4</Link></li>
            </ul>
        </nav>
    );
};

export default SellerSidebar;
