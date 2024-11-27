import React, { useState, useEffect } from 'react';
import { fetchUpcomingChargingSessions, fetchRecentChargingSessions, fetchUserBalance, } from "../../utils/UserFetchFunctions";
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import './Sessions.css';

interface UserBalance {
    pointsBalance: number;
    creditsBalance: number;
}

const Sessions: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [currentPBalance, setCurrentPBalance] = useState<number>(0);
    const [currentCBalance, setCurrentCBalance] = useState<number>(0);
    const [recentChargingSessions, setRecentChargingSessions] = useState<any[]>([]);
    const [upcomingChargingSessions, setUpcomingChargingSessions] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

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
        const loadRecentChargingSessions = async () => {
            const sessions = await fetchRecentChargingSessions();
            setRecentChargingSessions(sessions);
        };

        loadRecentChargingSessions();
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

    const handleSessionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sessionId = event.target.value;
        const selectedSessionData = recentChargingSessions.find((session) => session.id === sessionId);
        setSelectedSession(selectedSessionData || null);
    };

    return (
        <div className="sessions-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Sessions</h1>
                <p>Book a charging session, or view your previous sessions</p>
                <div className="hr-div"></div>
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

                            <div className="manage-balance-buttons">
                                <button className="add-credit-button" type="button">Add credit</button>
                                <button className="balance-history-button" type="button">View history</button>
                            </div>
                        </div>
                    </div>

                    <div className="upcoming-sessions-container">
                        <h2>Upcoming Sessions</h2>
                        <div className="hr-div"></div>
                        <ul>
                            {upcomingChargingSessions.map((session, index) => {
                                const date = session.bookedAt.toDate();
                                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                                return (
                                    <li key={index} className="session-item">
                                        {formattedDate} | {session.duration} minutes | {session.energyConsumed} kWh
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="book-session-container">
                        <h2>Book Charging Session</h2>
                        <div className="hr-div"></div>
                        <form className="booking-form">
                            <div className="form-group">
                                <label htmlFor="session-date">Date</label>
                                <input
                                    type="date"
                                    id="session-date"
                                    name="session-date"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="session-time">Time</label>
                                <input
                                    type="time"
                                    id="session-time"
                                    name="session-time"
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-button">Book Session</button>
                        </form>
                    </div>

                    <div className="quick-session-container">
                        <h2>Start a charging session now</h2>
                        <div className="hr-div"></div>
                        <div className="create-session-container">
                            <div className="choose-session-type-container">
                                <button
                                    className="session-payment-type-button"
                                    type="button"
                                    onClick={() => handleButtonClick('cardPayment')}
                                >
                                    Card Payment
                                </button>
                                <button
                                    className="session-payment-type-button"
                                    type="button"
                                    onClick={() => handleButtonClick('exchangePayment')}
                                >
                                    Exchange Payment
                                </button>
                            </div>

                            <div className={`session-type-info-container ${selectedButton ? 'expanded' : ''}`}>
                                {selectedButton === 'cardPayment' && (
                                    <div>
                                        <h3>Card Payment</h3>
                                        <p>Price per kWh: </p><label></label>
                                        <p>Current Consumption: </p><label></label>
                                        <p>Session Time: </p><label></label>
                                        <p>Price: </p><label></label>
                                    </div>
                                )}
                                {selectedButton === 'exchangePayment' && (
                                    <div>
                                        <h3>Exchange Payment</h3>
                                        <p>Points per kWh: </p><label></label>
                                        <p>Current Consumption: </p><label></label>
                                        <p>Session Time: </p><label></label>
                                        <p>Points: </p><label></label>
                                    </div>
                                )}

                                <div className="manage-session-buttons">
                                    <button className="start-session-button">Start Session</button>
                                    <button className="end-session-button">End Session</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="past-sessions-container">
                        <h2>Past Sessions</h2>
                        <div className="hr-div"></div>
                        <div className="previous-sessions-container">
                            <select
                                className="previous-session-select"
                                onChange={handleSessionSelect}
                            >
                                <option value="">Select a session</option>
                                {recentChargingSessions.map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {`${session.date} ${session.time}`}
                                    </option>
                                ))}
                            </select>
                            <div className="previous-session-info-container">
                                {selectedSession ? (
                                    <div>
                                        <p><strong>Session Date:</strong> {selectedSession.date}</p>
                                        <p><strong>Session Time:</strong> {selectedSession.time}</p>
                                        <p><strong>Energy Consumed:</strong> {selectedSession.energy_consumed} kWh</p>
                                        <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
                                        <p><strong>Total:</strong> {selectedSession.total}</p>
                                    </div>
                                ) : (
                                    <p>Select a session to view details</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sessions;
