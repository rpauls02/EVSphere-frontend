import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import EvStationIcon from '@mui/icons-material/EvStation';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from 'P:/GitHub/EVSphere/frontend/src/assets/logo-name.png';
import '../BaseComponents/Sidebar.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Sidebar: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async (userId: string) => {
            try {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, 'users', userId));

                if (userDoc.exists()) {
                    setRole(userDoc.data()?.role);
                } else {
                    console.error('User document not found');
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserRole(user.uid);
            } else {
                console.error('No user is signed in.');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="sidebar-nav-container">
            <div className="sidebar-top-section">
                <div className="sidebar-nav-logo">
                    <img src={logo} alt="evsphere-logo" />
                </div>
                <div className="logo-divider"></div>
                <nav className="sidebar-main-nav">
                    <ul>
                        {role === 'buyer' ? (
                            <>
                                <li><HomeIcon /><NavLink to="/buyer-dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink></li>
                                <li><EvStationIcon /><NavLink to="/chargers" className={({ isActive }) => isActive ? 'active-link' : ''}>Chargers</NavLink></li>
                                <li><AssessmentIcon /><NavLink to="/reports" className={({ isActive }) => isActive ? 'active-link' : ''}>Reports</NavLink></li>
                                <li><ReceiptLongIcon /><NavLink to="/invoices" className={({ isActive }) => isActive ? 'active-link' : ''}>Invoices</NavLink></li>
                            </>
                        ) : (
                            <>
                                <li><HomeIcon /><NavLink to="/seller-dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink></li>
                                <li><EvStationIcon /><NavLink to="/stations" className={({ isActive }) => isActive ? 'active-link' : ''}>Stations</NavLink></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
            <nav className="sidebar-util-nav">
                <ul>
                    <li><span><HelpIcon /><NavLink to="/help" className={({ isActive }) => isActive ? 'active-link' : ''}>Help</NavLink></span></li>
                    <li><span><MessageIcon /><NavLink to="/messages" className={({ isActive }) => isActive ? 'active-link' : ''}>Messages</NavLink></span></li>
                    <li><span><SettingsIcon /><NavLink to="/settings" className={({ isActive }) => isActive ? 'active-link' : ''}>Settings</NavLink></span></li>
                    <li><span><LogoutIcon /><NavLink to="/home" className={({ isActive }) => isActive ? 'active-link' : ''}>Log out</NavLink></span></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
