import React, { useState, useEffect } from 'react';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import { fetchUpcomingChargingSessions, fetchUserMessages, fetchUserBalance, fetchUserDetails } from "../../utils/UserFetchFunctions";
import './BuyerDashboard.css';

interface UserBalance {
    pointsBalance: number;
    creditsBalance: number;
}

const BuyerDashboard: React.FC = () => {
    const [currentFname, setCurrentFname] = useState<string>('');
    const [currentPBalance, setCurrentPBalance] = useState<number>(0);
    const [currentCBalance, setCurrentCBalance] = useState<number>(0);
    const [userMessages, setUserMessages] = useState<string[]>([]);
    const [upcomingChargingSessions, setUpcomingChargingSessions] = useState<any[]>([]);
    const [selectedButton, setSelectedButton] = useState(null);
    const [isSessionStarted, setIsSessionStarted] = useState(false)
    const [sessionTime, setSessionTime] = useState(0);


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
        const loadUserMessages = async () => {
            const messages = await fetchUserMessages();
            setUserMessages(messages);
        };

        loadUserMessages();
    }, []);

    useEffect(() => {
        const loadUpcomingChargingSessions = async () => {
            const sessions = await fetchUpcomingChargingSessions();
            setUpcomingChargingSessions(sessions);
        };

        loadUpcomingChargingSessions();
    }, []);

    const handleButtonClick = (buttonType: any) => {
        setSelectedButton(buttonType);
    };

    const handleSessionToggle = () => {
        if (!isSessionStarted) {
            setSessionTime(0);
        }
        setIsSessionStarted((prev) => !prev);
    };

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

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="dashboard-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Welcome back, {currentFname}</h1>
                <p>Use the sidebar to navigate through your options, or view a quick summary here</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="user-messages-container">
                        <h2>Messages</h2>
                        <div className="hr-div"></div>
                        <ul>
                            {userMessages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}

                        </ul>
                    </div>

                    <div className="upcoming-sessions-container">
                        <h2>Upcoming Sessions</h2>
                        <div className="hr-div"></div>
                        <ul>
                            {upcomingChargingSessions.map((session, index) => {
                                const date = session.bookedAt.toDate();
                                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                                // Extract time with AM/PM
                                let hours = date.getHours();
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12 || 12; // Convert to 12-hour format, replacing 0 with 12

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

                <div className="user-options-hr-div"></div>

                <div className="user-options-grid">
                    <div className="account-balance-container">
                        <h2>Your balance</h2>
                        <div className="hr-div"></div>
                        <div className="balance-pairs-container">
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
                            <button className="balance-history-button" type="button">View history</button>
                        </div>
                    </div>

                    <div className="quick-session-container">
                        <h2>Start session now</h2>
                        <div className="hr-div"></div>
                        <div className="create-session-container">
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
                                        <p className="quick-charge-item">Price per kWh: €</p>
                                        <p className="quick-charge-item">Current Consumption: </p>
                                        <p className="quick-charge-item">Session Time: {formatTime(sessionTime)}</p>
                                        <p className="quick-charge-item">Price: €</p>
                                    </div>
                                )}
                                {selectedButton === "exchangePayment" && (
                                    <div className="session-info-container">
                                        <p className="quick-charge-item">Points per kWh: </p>
                                        <p className="quick-charge-item">Current Consumption: </p>
                                        <p className="quick-charge-item">Session Time: {formatTime(sessionTime)}</p>
                                        <p className="quick-charge-item">Points: </p>
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
