import React, { useState, useEffect } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { handleUpdateEmail, handleDeleteAccount } from '../../../utils/UserDetailsFunctions';
import { fetchUserDetails } from '../../../utils/UserFetchFunctions';
import { useNavigate } from 'react-router-dom';
import BuyerSidebar from '../../BuyerContent/BuyerSidebar'
import SellerSidebar from '../../SellerContent/SellerSidebar'
import './Settings.css';

const Settings: React.FC = () => {
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState<string>('');
    const [currentEmail, setCurrentEmail] = useState<string>('');
    /*const [newEmail, setNewEmail] = useState<string>('');*/
    const [currentUname, setCurrentUname] = useState<string>('');
    const [currentFname, setCurrentFname] = useState<string>('');
    const [currentLname, setCurrentLname] = useState<string>('');
    const [currentMobile, setCurrentMobile] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    // Handler for settings navigation
    const [selectedOption, setSelectedOption] = useState<string>('account');
    const handleMenuClick = (option: string) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        const loadUserDetails = async () => {
            const details = await fetchUserDetails();
            if (details) {
                setCurrentUname(details.userName);
                setCurrentFname(details.firstName);
                setCurrentLname(details.lastName);
                setCurrentMobile(details.mobile);
                setCurrentEmail(details.email);
                setUserRole(details.role);
            }
        };

        loadUserDetails();
    }, []);

    /*const handleUpdateEmailSubmission = () => {
        handleUpdateEmail(currentEmail, newEmail, setErrorMessage, setLoading, () => {
        });
    };*/

    const handleDeleteAccountSubmission = () => {
        handleDeleteAccount(setErrorMessage, setLoading, () => {
            navigate('/');
        });
    };

    return (
        <div className="settings-page-container">
            <div className="sidebar-container">
                {userRole === 'buyer' && <BuyerSidebar />}
                {userRole === 'seller' && <SellerSidebar />}
            </div>

            <div className="settings-menu-container">
                <h1>Settings</h1>
                <div className="divider"></div>
                <nav className="settings-navbar">
                    <ul>
                        <li
                            className={`nav-option ${selectedOption === 'account' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('account')}
                        >
                            Account
                        </li>
                        <li
                            className={`nav-option ${selectedOption === 'profile' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('profile')}
                        >
                            Profile
                        </li>
                        <li
                            className={`nav-option ${selectedOption === 'notifications' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('notifications')}
                        >
                            Notifications
                        </li>
                        <li
                            className={`nav-option ${selectedOption === 'preferences' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('preferences')}
                        >
                            Preferences
                        </li>
                    </ul>
                </nav>

                {selectedOption === 'account' && (
                    <div className="account-menu-container">
                        <h2>General</h2>
                        <span className="settings-item account-email-item">
                            <div className="item-text-container">
                                Email address
                                <small>{currentEmail}</small>
                            </div>
                            <KeyboardArrowRightIcon className="right-arrow-icon" />
                        </span>

                        <div className="divider"></div>

                        <span className="settings-item account-password-item" >
                            Change password
                            <KeyboardArrowRightIcon className="right-arrow-icon" />
                        </span>

                        <h2>Security</h2>
                        <span className="settings-item two-fa-item">
                            <div className="item-text-container">
                                Two-factor Authentication (2FA)
                                <small>Enable 2FA methods</small>
                            </div>
                            <KeyboardArrowRightIcon className="right-arrow-icon" />
                        </span>

                        <h2>Linked Accounts</h2>
                        <span className="settings-item link-google-account-item">
                            <div className="item-text-container">
                                Link Google account
                                <small></small>
                            </div>
                            <button className="link-account-button">
                                Link
                            </button>
                        </span>

                        <h2>Advanced</h2>
                        <span className="settings-item delete-account-item">
                            <div className="item-text-container">
                                Delete account
                                <small>Delete your account</small>
                            </div>
                            <button className="delete-account-button" onClick={handleDeleteAccountSubmission}>
                                Delete
                            </button>
                        </span>
                        {errorMessage && (
                            <p className="error-message">{errorMessage}</p>
                        )}
                    </div>
                )}

                {selectedOption === 'profile' && (
                    <div className="profile-menu-container">
                        <h2>Appearance</h2>
                        <span className="settings-item appearance-avatar-item">
                            <div className="item-text-container">
                                Avatar
                                <small>Change your avatar</small>
                            </div>
                            <KeyboardArrowRightIcon
                                className="right-arrow-icon"
                            />
                        </span>

                        <span className="settings-item appearance-dname-item">
                            <div className="item-text-container">
                                Display Name
                                <small>{currentUname}</small>
                            </div>
                            <KeyboardArrowRightIcon
                                className="right-arrow-icon"
                            />
                        </span>

                        <h2>Personal Details</h2>
                        <span className="settings-item profile-fname-item">
                            <div className="item-text-container">
                                First Name
                                <small>{currentFname}</small>
                            </div>
                            <KeyboardArrowRightIcon
                                className="right-arrow-icon"
                            />
                        </span>

                        <span className="settings-item profile-lname-item">
                            <div className="item-text-container">
                                Last Name
                                <small>{currentLname}</small>
                            </div>
                            <KeyboardArrowRightIcon
                                className="right-arrow-icon"
                            />
                        </span>

                        <span className="settings-item profile-mobile-item">
                            <div className="item-text-container">
                                Mobile Number
                                <small>{currentMobile}</small>
                            </div>
                            <KeyboardArrowRightIcon
                                className="right-arrow-icon"
                            />
                        </span>
                    </div>
                )}

                {selectedOption === 'notifications' && (
                    <div className="notifications-menu-container">
                        <h2>Charging Session Updates</h2>

                        <span className="settings-item">
                            <div className="item-text-container">
                                Charger Status
                                <small>Get updates on your booked charger(s) status</small>
                            </div>
                            <select className="item-select-container">
                                <option value="None">None</option>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="Email + SMS">Email + SMS</option>
                            </select>
                        </span>

                        <span className="settings-item">
                            <div className="item-text-container">
                                Charging Status
                                <small>Get updates on your current charging session</small>
                            </div>
                            <select className="item-select-container">
                                <option value="None">None</option>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="Email + SMS">Email + SMS</option>
                            </select>
                        </span>

                        <span className="settings-item">
                            <div className="item-text-container">
                                Transaction Status
                                <small>Get updates on status of current transaction</small>
                            </div>
                            <select className="item-select-container">
                                <option value="None">None</option>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="Email + SMS">Email + SMS</option>
                            </select>
                        </span>

                        <h2>Chat Messages</h2>
                    </div>
                )}

                {selectedOption === 'preferences' && (
                    <div className="preferences-menu-container">
                        <h2>Date</h2>
                        <span className="settings-item timezone-item">
                            <div className="item-text-container">
                                Date
                                <small>Set your preferred date format</small>
                            </div>
                            <select className="item-select-container">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                                <option value="dddd, MMMM d, yyyy">Full Date (e.g., Tuesday, November 20, 2024)</option>
                            </select>
                        </span>
                        <h2>Time</h2>
                        <span className="settings-item timezone-item">
                            <div className="item-text-container">
                                Timezone
                                <small>Set your preferred timezone</small>
                            </div>
                            <select className="item-select-container">
                                <option value="GMT">GMT</option>
                                <option value="PST">PST</option>
                                <option value="EST">EST</option>
                            </select>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
