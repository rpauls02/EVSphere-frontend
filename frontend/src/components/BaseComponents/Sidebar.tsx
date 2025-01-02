import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import EvStationIcon from '@mui/icons-material/EvStation';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../assets/logo.png';
import LogoutHandler from '../../utils/LogoutHandler';
import '../BaseComponents/Sidebar.css';

const Sidebar: React.FC = () => {
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
                    <Link to="/dashboard">
                        <img src={logo} alt="evsphere-logo" />
                    </Link>
                </div>
                <div className="logo-divider"></div>
                <nav className="sidebar-main-nav">
                    <ul>
                        <li className="sidebar-nav-item">
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
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
                            <NavLink to="/balances" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AccountBalanceWalletIcon />
                                Balance
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <AccessTimeFilledIcon />
                                Sessions
                            </NavLink>
                        </li>
                        <li className="sidebar-nav-item">
                            <NavLink to="/chargers" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <ElectricalServicesIcon />
                                Chargers
                            </NavLink>
                        </li>
                        {/*<li className="sidebar-nav-item">
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
                        </li>*/}
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

export default Sidebar;
