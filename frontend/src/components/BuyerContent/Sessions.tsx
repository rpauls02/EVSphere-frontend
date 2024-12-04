import React, { useState, useEffect } from 'react';
import { fetchUpcomingChargingSessions, fetchPastChargingSessions } from "../../utils/UserFetchFunctions";
import { addChargingSession } from '../../utils/UserActionsFunctions';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './Sessions.css';

const Sessions: React.FC = () => {
    const [pastChargingSessions, setPastChargingSessions] = useState<any[]>([]);
    const [upcomingChargingSessions, setUpcomingChargingSessions] = useState<any[]>([]);
    const [isSessionStarted, setIsSessionStarted] = useState(false)
    const [sessionTimer, setSessionTimer] = useState(0);
    const [expandedSessionIDs, setExpandedSessionIDs] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDateAndTime = (bookedAt: any) => {
        const date = bookedAt.toDate();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedTime = `${hours}:${minutes}${ampm}`;

        return { formattedDate, formattedTime };
    };

    const toggleSession = (sessionID: string) => {
        setExpandedSessionIDs((prevExpanded) => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(sessionID)) {
                newExpanded.delete(sessionID); // Collapse session
            } else {
                newExpanded.add(sessionID); // Expand session
            }
            return newExpanded;
        });
    };

    const handleInvoice = (sessionId: any) => {
        console.log(`Viewing invoice for session ID: ${sessionId}`);
        // Add logic for displaying the invoice here
    };

    const handleReport = (sessionId: any) => {
        console.log(`Viewing report for session ID: ${sessionId}`);
        // Add logic for displaying the report here
    };

    const handleBookingSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const sessionDate = formData.get('session-date') as string;
        const sessionTime = formData.get('session-time') as string;

        try {
            const response = await addChargingSession(sessionDate, sessionTime);
            alert(response.message);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        const loadPastChargingSessions = async () => {
            const sessions = await fetchPastChargingSessions();
            setPastChargingSessions(sessions);
        };

        loadPastChargingSessions();
    }, []);

    useEffect(() => {
        const loadUpcomingChargingSessions = async () => {
            const sessions = await fetchUpcomingChargingSessions();
            setUpcomingChargingSessions(sessions);
        };

        loadUpcomingChargingSessions();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isSessionStarted) {
            timer = setInterval(() => {
                setSessionTimer((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isSessionStarted]);

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
                    <div className="upcoming-sessions-container">
                        <h2>Upcoming Sessions</h2>
                        <div className="hr-div"></div>
                        <ul>
                            {upcomingChargingSessions.map((session, index) => {
                                const { formattedDate, formattedTime } = formatDateAndTime(session.bookedAt);

                                return (
                                    <li key={index} className="session-item">
                                        {formattedDate} @ {formattedTime}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="book-session-container">
                        <h2>Book Charging Session</h2>
                        <div className="hr-div"></div>
                        <form className="book-session-form" onSubmit={handleBookingSubmission}>
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
                </div>

                <div className="hr-div"></div>

                <div className="user-options-grid">
                    <div className="past-sessions-container">
                        <h2>Past Sessions</h2>
                        <div className="hr-div"></div>
                        <div className="view-past-sessions-container">
                            {pastChargingSessions.map((session, index) => {
                                const { formattedDate, formattedTime } = formatDateAndTime(session.bookedAt);

                                return (
                                    <div key={session.id} className="session-wrapper">
                                        <div className="session-tab-container">
                                            <div
                                                className="session-header-container"
                                                onClick={() => toggleSession(session.id)}
                                            >
                                                <h3><strong>{formattedDate} @ {formattedTime}</strong></h3>
                                                <button className="toggle-session-button-container">
                                                    {expandedSessionIDs.has(session.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </button>
                                            </div>

                                            {expandedSessionIDs.has(session.id) && (
                                                <div className="session-details-container">
                                                    <p><strong>Session Date:</strong> {formattedDate}</p>
                                                    <p><strong>Session Time:</strong> {formattedTime}</p>
                                                    <p><strong>Energy Consumed:</strong> {session.energy_consumed} kWh</p>
                                                    <p><strong>Duration:</strong> {session.duration} minutes</p>
                                                    <p><strong>Total:</strong> {session.total}</p>
                                                    <div className="session-actions-buttons-container">
                                                        <button onClick={() => handleInvoice(session.id)}>View Invoice</button>
                                                        <button onClick={() => handleReport(session.id)}>View Report</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="hr-div"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sessions;
