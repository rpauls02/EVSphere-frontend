import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import './BuyerDashboard.css';

const BuyerDashboard: React.FC = () => {
    const [currentFname, setCurrentFname] = useState<string>('');
    const [currentPBalance, setCurrentPBalance] = useState<string>('');
    const [currentCBalance, setCurrentCBalance] = useState<string>('');
    const [userMessages, setUserMessages] = useState<string[]>([]);
    const [userSessions, setUserSessions] = useState<any[]>([]);
    const [selectedButton, setSelectedButton] = useState(null);


    useEffect(() => {
        const fetchUserBalance = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCurrentFname(userData.firstName || '');
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

        fetchUserBalance();
    }, []);

    useEffect(() => {
        const fetchUserMessages = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const userMessagesRef = collection(db, "users", user.uid, "user_messages");

                    const messagesQuery = query(
                        userMessagesRef,
                        orderBy("sent", "desc"),
                        limit(5)
                    );

                    const querySnapshot = await getDocs(messagesQuery);

                    const messagesContent: string[] = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return data.content;
                    });

                    console.log("Retrieved message contents:", messagesContent);
                    setUserMessages(messagesContent);
                } catch (error) {
                    console.error("Error fetching user messages from Firestore:", error);
                }
            }
        };

        fetchUserMessages();
    }, []);

    useEffect(() => {
        const fetchUserSessions = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const userSessionsRef = collection(db, "users", user.uid, "user_sessions");

                    const sessionsQuery = query(
                        userSessionsRef,
                        orderBy("sessionBookedAt", "desc"),
                        limit(5)
                    );

                    const querySnapshot = await getDocs(sessionsQuery);

                    const sessionsData = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            sessionBookedAt: data.sessionBookedAt,
                            duration: data.duration,
                            energyConsumed: data.energy_consumed,
                        };
                    });

                    console.log("Retrieved session data:", sessionsData);
                    setUserSessions(sessionsData);
                } catch (error) {
                    console.error("Error fetching user sessions from Firestore:", error);
                }
            }
        };

        fetchUserSessions();
    }, []);

    const handleButtonClick = (buttonType: any) => {
        setSelectedButton(buttonType);
    };

    return (
        <div className="dashboard-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Welcome back, {currentFname}</h1>
                <div className="hr-div"></div>
                <div className="user-options-columns">
                    <div className="user-options-left-column">
                        <div className="user-messages-container">
                            <h2>Messages</h2>
                            <ul>
                                {userMessages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="recent-sessions-container">
                            <h2>Recent sessions</h2>
                            <ul>
                                {userSessions.map((session, index) => (
                                    <li key={index} className="session-item">
                                        <span>{session.sessionBookedAt.toDate().toLocaleString()} |</span>
                                        <span> {session.duration} minutes |</span>
                                        <span> {session.energyConsumed} kWh</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="user-options-right-column">
                        <div className="account-balance-container">
                            <h2>Your balance</h2>
                            <div className="balance-pair">
                                <p>Credits:</p>
                                <label>€{currentCBalance}</label>
                            </div>

                            <div className="balance-pair">
                                <p>Points:</p>
                                <label>{currentPBalance}</label>
                            </div>
                        </div>

                        <div className="session-container">
                            <h2>Start a charging session now</h2>
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

export default BuyerDashboard;
