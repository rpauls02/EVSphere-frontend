import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import './Sessions.css';

const Sessions: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [currentPBalance, setCurrentPBalance] = useState<string>('');
    const [currentCBalance, setCurrentCBalance] = useState<string>('');
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCurrentPBalance(userData.points_balance || '')
                        setCurrentCBalance(userData.credits_balance || '')
                    } else {
                        console.error("Could not find user record.");
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                }
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchUserSessions = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const sessionsRef = collection(db, 'users', user.uid, 'user_sessions');
                    const q = query(sessionsRef);
                    const querySnapshot = await getDocs(q);

                    const sessionsData: any[] = [];
                    querySnapshot.forEach((doc) => {
                        sessionsData.push({ id: doc.id, ...doc.data() });
                    });

                    setSessions(sessionsData);
                } catch (error) {
                    console.error('Error fetching sessions from Firestore:', error);
                }
            }
        };

        fetchUserSessions();
    }, []);

    const handleButtonClick = (buttonType: any) => {
        setSelectedButton(buttonType);
    };

    const handleSessionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sessionId = event.target.value;
        const selectedSessionData = sessions.find((session) => session.id === sessionId);
        setSelectedSession(selectedSessionData || null);
    };

    return (
        <div className="sessions-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Sessions</h1>
                <hr className="hr-div"></hr>
                <div className="user-options-columns">
                    <div className="user-options-left-column">

                        <h2>Book Charging Session</h2>

                        <hr className="hr-div"></hr>

                        <h2>Past Charging Sessions</h2>
                        <div className="previous-sessions-container">
                            <select
                                className="previous-session-select"
                                onChange={handleSessionSelect}
                            >
                                <option value="">Select a session</option>
                                {sessions.map((session) => (
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

                    <div className="vr-div"></div>

                    <div className="user-options-right-column">
                        <h2>Your balance</h2>
                        <div className="account-balance-container">
                            <div className="balance-pair">
                                <p>Credits:</p>
                                <label>€{currentCBalance}</label>
                            </div>

                            <div className="balance-pair">
                                <p>Points:</p>
                                <label>{currentPBalance}</label>
                            </div>
                        </div>

                        <hr className="hr-div"></hr>

                        <h2>Start a charging session now</h2>
                        <div className="session-container">
                            <div className="create-session-container">
                                <button
                                    className="session-button card-payment-button"
                                    type="button"
                                    onClick={() => handleButtonClick('cardPayment')}
                                >
                                    Card Payment
                                </button>
                                <button
                                    className="session-button exchange-payment-button"
                                    type="button"
                                    onClick={() => handleButtonClick('exchangePayment')}
                                >
                                    Exchange Payment
                                </button>
                            </div>

                            <div className={`button-info-container ${selectedButton ? 'expanded' : ''}`}>
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
                </div>
            </div>
        </div>
    );
};

export default Sessions;
