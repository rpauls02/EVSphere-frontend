import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css';

const UserSidebar: React.FC = () => {
    return (
        <nav className="nav-options">
            <ul>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/messages">Messages</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="">Tab 4</Link></li>
            </ul>
        </nav>
    );
};

export default UserSidebar;
