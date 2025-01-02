import React, { useState, useEffect } from 'react';
import Sidebar from '../../BaseComponents/Sidebar'
import { fetchUserMessages } from '../../../utils/UserFetchFunctions';
import { UserMessage } from '../../../utils/types';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Messages.css';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [selectedMessageID, setSelectedMessageID] = useState<number | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            const userMessages = await fetchUserMessages(true);
            setMessages(userMessages);
        };

        loadMessages();
    }, []);

    return (
        <div className="messages-page-container">
            <div className="sidebar-container">
                <Sidebar />
            </div>
            <div className="user-options-container">
                <h1>Messages</h1>
                <p>View and manage your messages</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="user-messages-container">
                        <div className="message-sidebar">
                            <ul className="message-list">
                                {messages.map((message, index) => {
                                    const receivedDate = new Date(message.received);
                                    const formattedDate = receivedDate.toLocaleDateString();
                                    const formattedTime = receivedDate.toLocaleTimeString();

                                    return (
                                        <li
                                            key={index}
                                            className={`message-summary ${selectedMessageID === index ? "active" : ""}`}
                                            onClick={() => setSelectedMessageID(index)}
                                        >
                                            <p><strong>{formattedDate}</strong> @ {formattedTime}</p>
                                            <p><strong>From: </strong>{message.sender}</p>
                                            <small></small>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="message-details-container">
                            {selectedMessageID !== null ? (
                                <div className="message-details-content">
                                    <h2>Message Details</h2>
                                    <div className="hr-div"></div>
                                    <p><strong>Sender:</strong> {messages[selectedMessageID].sender}</p>
                                    <p>
                                        <strong>Received:</strong>{" "}
                                        {new Date(messages[selectedMessageID].received).toLocaleDateString()}{" "}
                                        @ {new Date(messages[selectedMessageID].received).toLocaleTimeString()}
                                    </p>
                                    <p><strong>Message:</strong> {messages[selectedMessageID].content}</p>
                                </div>
                            ) : (
                                <div className="no-message-selected">
                                    <p>Select a message to view its details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;