import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import EvStationIcon from '@mui/icons-material/EvStation';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from 'P:/GitHub/EVSphere/frontend/src/assets/logo-final.png';
import LogoutHandler from '../../utils/LogoutHandler';
import '../BaseComponents/Sidebar.css';

const BuyerSidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        LogoutHandler();
        navigate('/');
    };

    return (
        <div className="sidebar-nav-container">
            <div className="sidebar-top-section">
                <div className="sidebar-nav-logo">
                    <img src={logo} alt="evsphere-logo" />
                </div>
                <div className="logo-divider"></div>
                <nav className="sidebar-main-nav">
                    <ul>
                        <li>
                            <HomeIcon />
                            <NavLink to="/buyer-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <AssessmentIcon />
                            <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Sessions
                            </NavLink>
                        </li>
                        <li>
                            <EvStationIcon />
                            <NavLink to="/host-services" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Host Services
                            </NavLink>
                        </li>
                        <li>
                            <AssessmentIcon />
                            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Reports
                            </NavLink>
                        </li>
                        <li>
                            <ReceiptLongIcon />
                            <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Invoices
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <nav className="sidebar-util-nav">
                <ul>
                    <li>
                        <HelpIcon />
                        <NavLink to="/help" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            Help
                        </NavLink>
                    </li>
                    <li>
                        <MessageIcon />
                        <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            Messages
                        </NavLink>
                    </li>
                    <li>
                        <SettingsIcon />
                        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            Settings
                        </NavLink>
                    </li>
                    <li>
                        <LogoutIcon />
                        <NavLink to="/" onClick={handleLogout} className="logout-link">
                            Log out
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default BuyerSidebar;
