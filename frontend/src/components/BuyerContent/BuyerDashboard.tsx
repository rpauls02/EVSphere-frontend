import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../BaseComponents/Sidebar';
import { fetchUpcomingChargingSessions, fetchRecentSystemMessages, fetchUserBalance, fetchUserDetails } from "../../utils/UserFetchFunctions";
import { updateUserCreditBalance } from '../../utils/UserActionsFunctions';
import { startChargingSession } from '../../utils/OCPPFunctions';
import { verifyEmail } from '../../utils/UserVerifyFunctions';
import './BuyerDashboard.css';
import { PastMessageData } from '../../utils/types';

interface UserBalance {
    pointsBalance: number;
    creditsBalance: number;
}

const BuyerDashboard: React.FC = () => {
    const [currentFname, setCurrentFname] = useState<string>('');
    const [currentPBalance, setCurrentPBalance] = useState<number>(0);
    const [newCBalance, setNewCBalance] = useState<number>(0);
    const [currentCBalance, setCurrentCBalance] = useState<number>(0);
    const [userMessages, setUserMessages] = useState<PastMessageData[]>([]);
    const [upcomingChargingSessions, setUpcomingChargingSessions] = useState<any[]>([]);
    const [selectedButton, setSelectedButton] = useState("cardPayment");
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [pricePerKwh, setPricePerKwh] = useState<number | null>(null);
    const [currentConsumption, setCurrentConsumption] = useState<number | null>(null);
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState<'error' | 'success'>('success');
    const navigate = useNavigate();

    const handleButtonClick = (buttonType: any) => {
        setSelectedButton(buttonType);
    };

    const handleSessionToggle = () => {
        if (!isSessionStarted) {
            setSessionTime(0);
        }
        setIsSessionStarted((prev) => !prev);
    };

    const handleViewHistory = () => {
        navigate('/balances');
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {
        const loadUserDetails = async () => {
            const details = await fetchUserDetails();
            if (details) {
                setCurrentFname(details.firstName);
            }
        };
        loadUserDetails();
    }, []);

    useEffect(() => {
        const checkEmailVerification = async () => {
            if (await verifyEmail()) {
                setShowNotification(true);
            }
        };
        checkEmailVerification();
    }, []);

    useEffect(() => {
        const loadUserBalance = async () => {
            const balance: UserBalance | null = await fetchUserBalance();
            if (balance) {
                setCurrentPBalance(balance.pointsBalance);
                setCurrentCBalance(balance.creditsBalance);
            }
        };

        loadUserBalance();
    }, []);

    useEffect(() => {
        const loadRecentMessages = async () => {
            const messages = await fetchRecentSystemMessages();
            setUserMessages(messages);
        };
        loadRecentMessages();
    }, []);

    useEffect(() => {
        const loadUpcomingChargingSessions = async () => {
            const sessions = await fetchUpcomingChargingSessions();
            setUpcomingChargingSessions(sessions);
        };
        loadUpcomingChargingSessions();
    }, []);

    useEffect(() => {
        const handleCreditBalanceUpdate = async () => {
            try {
                const success = await updateUserCreditBalance(newCBalance);
                if (success) {
                    setPopupTitle('Success');
                    setPopupMessage('Balance updated successfully!');
                    setPopupType('success');
                    setShowPopup(true);
                } else {
                    setPopupTitle('Error');
                    setPopupMessage('Failed to update balance.');
                    setPopupType('error');
                    setShowPopup(true);
                }
            } catch (error) {
                console.error('Error updating balance:', error);
                setPopupTitle('Error');
                setPopupMessage('An error occurred while updating the balance.');
                setPopupType('error');
                setShowPopup(true);
            }
        };

        if (newCBalance !== 0) {
            handleCreditBalanceUpdate();
        }
    }, [newCBalance]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isSessionStarted) {
            timer = setInterval(() => {
                setSessionTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isSessionStarted]);

    return (
        <div className="dashboard-page-container">
            <div className="sidebar-container">
                <Sidebar />
            </div>
            <div className="user-options-container">
                <h1>Welcome back, {currentFname}</h1>
                <p>Use the sidebar to navigate through your options, or view a quick summary here</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="user-messages-container">
                        <div className="container-header">
                            <h2>System Messages</h2>
                        </div>

                        <div className="hr-div"></div>

                        <div className="container-content">
                            <ul>
                                {userMessages.map((message, index) => (
                                    <li key={index} className="message-item">
                                        {message.content}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="upcoming-sessions-container">
                        <div className="container-header">
                            <h2>Upcoming Sessions</h2>
                        </div>

                        <div className="hr-div"></div>

                        <div className="container-content">
                            <ul>
                                {upcomingChargingSessions.map((session, index) => {
                                    const date = session.bookedAt.toDate();
                                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                                    let hours = date.getHours();
                                    const minutes = date.getMinutes().toString().padStart(2, '0');
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12 || 12;

                                    const formattedTime = `${hours}:${minutes}${ampm}`;

                                    return (
                                        <li key={index} className="session-item">
                                            {formattedDate} @ {formattedTime}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="user-options-hr-div"></div>

                <div className="user-options-grid">
                    <div className="account-balance-container">
                        <div className="container-header">
                            <h2>Your Balances</h2>
                        </div>
                        <div className="hr-div"></div>
                        <div className="container-content">
                            <div className="balance-pair-container">
                                <p>Credit:</p>
                                <label>€{currentCBalance}</label>
                            </div>

                            <div className="balance-pair-container">
                                <p>Points:</p>
                                <label>{currentPBalance}</label>
                            </div>
                        </div>
                        <div className="manage-balance-buttons-container">
                            <button className="add-credit-button" type="button">Add credit</button>
                            <button className="balance-history-button" type="button" onClick={handleViewHistory}>View history</button>
                        </div>
                    </div>

                    <div className="quick-session-container">
                        <div className="container-header">
                            <h2>Quick Session</h2>
                        </div>
                        <div className="hr-div"></div>
                        <div className="container-content">
                            <div className="session-payment-type-container">
                                <button
                                    className={`session-payment-type-button card-payment-type ${selectedButton === "cardPayment" ? "active" : ""}`}
                                    onClick={() => handleButtonClick("cardPayment")}
                                >
                                    Card Payment
                                </button>
                                <button
                                    className={`session-payment-type-button exchange-payment-type ${selectedButton === "exchangePayment" ? "active" : ""}`}
                                    onClick={() => handleButtonClick("exchangePayment")}
                                >
                                    Exchange Payment
                                </button>
                            </div>

                            <div className={`session-type-info-container ${selectedButton ? "expanded" : ""}`}>
                                {selectedButton === "cardPayment" && (
                                    <div className="session-info-container">
                                        <p className="quick-charge-item">Status: {pricePerKwh !== null ? pricePerKwh.toFixed(2) : 'Waiting...'}</p>
                                        <p className="quick-charge-item">Price per kWh: €{pricePerKwh !== null ? pricePerKwh.toFixed(2) : 'Loading...'}</p>
                                        <p className="quick-charge-item">Current Consumption: {currentConsumption !== null ? `${currentConsumption.toFixed(2)} kWh` : 'Loading...'}</p>
                                        <p className="quick-charge-item">Session Time: {sessionTime !== null ? formatTime(sessionTime) : 'Loading...'}</p>
                                        <p className="quick-charge-item">Total Price: €{totalCost !== null ? totalCost.toFixed(2) : 'Loading...'}</p>
                                    </div>
                                )}
                                {selectedButton === "exchangePayment" && (
                                    <div className="session-info-container">
                                        <p className="quick-charge-item">Status: {pricePerKwh !== null ? pricePerKwh.toFixed(2) : 'Waiting...'}</p>
                                        <p className="quick-charge-item">Points per kWh: </p>
                                        <p className="quick-charge-item">Current Consumption: </p>
                                        <p className="quick-charge-item">Session Time: {sessionTime !== null ? formatTime(sessionTime) : 'Loading...'}</p>
                                        <p className="quick-charge-item">Total Points: </p>
                                    </div>
                                )}

                                <div className="manage-quick-session-button">
                                    <button
                                        className={`session-button ${isSessionStarted ? "end-session" : "start-session"}`}
                                        onClick={handleSessionToggle}
                                    >
                                        {isSessionStarted ? "End Session" : "Start Session"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
