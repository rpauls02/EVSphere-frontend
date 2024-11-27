import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import EvStationIcon from '@mui/icons-material/EvStation';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../assets/logo.png';
import '../BaseComponents/Sidebar.css';

const SellerSidebar: React.FC = () => {
    return (
        <div className="sidebar-nav-container">
            <div className="sidebar-top-section">
                <div className="sidebar-nav-logo">
                        <img src={logo} alt="evsphere-logo" />
                </div>
                <div className="logo-divider"></div>
                <nav className="sidebar-main-nav">
                    <ul>
                        <li><HomeIcon /><NavLink to="/seller-dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink></li>
                        <li><EvStationIcon /><NavLink to="/stations" className={({ isActive }) => isActive ? 'active-link' : ''}>Stations</NavLink></li>
                    </ul>
                </nav>
            </div>
            <nav className="sidebar-util-nav">
                <ul>
                    <li><HelpIcon /><NavLink to="/help" className={({ isActive }) => isActive ? 'active-link' : ''}>Help</NavLink></li>
                    <li><MessageIcon /><NavLink to="/messages" className={({ isActive }) => isActive ? 'active-link' : ''}>Messages</NavLink></li>
                    <li><SettingsIcon /><NavLink to="/settings" className={({ isActive }) => isActive ? 'active-link' : ''}>Settings</NavLink></li>
                    <li><LogoutIcon /><NavLink to="/home" className={({ isActive }) => isActive ? 'active-link' : ''}>Log out</NavLink></li>
                </ul>
            </nav>
        </div>
    );
};

export default SellerSidebar;
