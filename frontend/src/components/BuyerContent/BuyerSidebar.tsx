import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import EvStationIcon from '@mui/icons-material/EvStation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../assets/logo.png';
import LogoutHandler from '../../utils/LogoutHandler';
import '../BaseComponents/Sidebar.css';

const BuyerSidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogoutSubmission = (e: React.MouseEvent) => {
        e.preventDefault();
        LogoutHandler();
        navigate('/');
    };

    return (
        <div className="sidebar-nav-container">
            <div className="sidebar-top-section">
                <div className="sidebar-nav-logo">
                    <Link to="/buyer-dashboard">
                    <img src={logo} alt="evsphere-logo" />
                    </Link>
                </div>
                <div className="logo-divider"></div>
                <nav className="sidebar-main-nav">
                    <ul>
                        <li className="sidebar-nav-item">
                            <NavLink to="/buyer-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <HomeIcon />
                                Home
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/host-services" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <EvStationIcon />
                                Host
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AccessTimeIcon />
                                Sessions
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/balances" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AccountBalanceWalletIcon />
                                Balance
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <ReceiptLongIcon />
                                Invoices
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AssessmentIcon />
                                Reports
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <nav className="sidebar-util-nav">
                <ul>
                    <li className="sidebar-nav-item">
                        <NavLink to="/help" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <HelpIcon />
                            Help
                        </NavLink>
                    </li>
                    <li className="sidebar-nav-item">
                        <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <MessageIcon />
                            Messages
                        </NavLink>
                    </li>
                    <li className="sidebar-nav-item">
                        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            <SettingsIcon />
                            Settings
                        </NavLink>
                    </li>
                    <li className="sidebar-nav-item">
                        <NavLink to="/" onClick={handleLogoutSubmission} className="logout-link">
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
