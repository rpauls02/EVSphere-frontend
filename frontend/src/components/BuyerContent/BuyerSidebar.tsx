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
import logo from '../../assets/logo.png';
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
                            <NavLink to="/buyer-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <HomeIcon />
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AssessmentIcon />
                                Sessions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/host-services" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <EvStationIcon />
                                Host Services
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AssessmentIcon />
                                Reports
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <ReceiptLongIcon />
                                Invoices
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <nav className="sidebar-util-nav">
                <ul>
                    <li>
                        <NavLink to="/help" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <HelpIcon />
                            Help
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <MessageIcon />
                            Messages
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <SettingsIcon />
                            Settings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" onClick={handleLogout} className="logout-link">
                            <LogoutIcon />
                            Log out
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default BuyerSidebar;
