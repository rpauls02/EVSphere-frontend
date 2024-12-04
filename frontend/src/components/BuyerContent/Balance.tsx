import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchUserBalance, fetchUserTransactions } from '../../utils/UserFetchFunctions';
import { UserBalance, UserTransactions } from '../../utils/types';
import './Balance.css'

const Balance: React.FC = () => {

    const [currentPBalance, setCurrentPBalance] = useState<number>(0);
    const [currentCBalance, setCurrentCBalance] = useState<number>(0);
    const [expandedTransactionID, setExpandedTransactionID] = useState(null);
    const [pastTransactions, setPastTransactions] = useState<any[]>([]);

    const toggleTransaction = (transactionID: any) => {
        setExpandedTransactionID((prevId) => (prevId === transactionID ? null : transactionID));
    };

    const formatDateAndTime = (createdAt: any) => {
        const date = createdAt.toDate();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedTime = `${hours}:${minutes}${ampm}`;

        return { formattedDate, formattedTime };
    };

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
        const loadUserTransactions = async () => {
            const transactions: UserTransactions[] | null = await fetchUserTransactions();
            if (transactions.length > 0) {
                setPastTransactions(transactions);
            }
        };

        loadUserTransactions();
    }, []);

    return (
        <div className="balances-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Balance</h1>
                <p>View your balances, add credit, and see previous transactions</p>
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

                            <div className="vr-div"></div>

                            <div className="balance-pair-container">
                                <p>Points:</p>
                                <label>{currentPBalance}</label>
                            </div>
                            <div className="manage-balance-buttons-container">
                                <button className="add-credit-button" type="button">Add credit</button>
                            </div>
                        </div>
                    </div>

                    <div className="transaction-history-container">
                        <h2>Transaction history</h2>
                        <div className="hr-div"></div>
                        <div className="view-past-transactions-container">
                            {pastTransactions.map((transaction, index) => {
                                const { formattedDate, formattedTime } = formatDateAndTime(transaction.createdAt);
                                return (
                                    <div key={transaction.id} className="transaction-tab-container">
                                        <div
                                            className="transaction-header-container"
                                            onClick={() => toggleTransaction(transaction.id)}
                                        >
                                            <h3><strong>{formattedDate} @ {formattedTime}</strong></h3>
                                            <button className="toggle-transaction-button-container">
                                                {expandedTransactionID === transaction.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </button>
                                        </div>

                                        {expandedTransactionID === transaction.id && (
                                            <div className="transaction-details-container">
                                                <p><strong>Transaction Date:</strong> {formattedDate}</p>
                                                <p><strong>Transaction Time:</strong> {formattedTime}</p>
                                                <p><strong>Total(credits):</strong> {transaction.total}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="hr-div"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Balance;