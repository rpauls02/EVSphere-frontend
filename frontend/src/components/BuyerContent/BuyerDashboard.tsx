import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import './BuyerDashboard.css';

const BuyerDashboard: React.FC = () => {
    const [currentFname, setCurrentFname] = useState<string>('');
    const [currentPBalance, setCurrentPBalance] = useState<string>('');
    const [currentCBalance, setCurrentCBalance] = useState<string>('');
    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        const fetchUserDoc = async () => {
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

        fetchUserDoc();
    }, []);

    const handleButtonClick = (buttonType : any) => {
        setSelectedButton(buttonType);
    };

    return (
        <div className="dashboard-page-container">
            <BuyerSidebar />
            <div className="user-options-container">
                <h1>Welcome back, {currentFname}</h1>
                <div className="hr-div"></div>
                <div className="user-options-columns">
                    <div className="user-options-left-column">
                        <div className="user-messages-container">
                            <h2>Messages</h2>
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <hr className="hr-div"></hr>
                        <div className="user-sessions-container">
                            <h2>Recent sessions</h2>
                            <ul>
                                <li>13 Aug 2022 | </li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
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

export default BuyerDashboard;
