import React, { useState, useEffect } from 'react';
import BuyerSidebar from './BuyerSidebar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

import './HostServices.css';

const HostServices = () => {
    const [userChargers, setUserChargers] = useState([]);
    const [expandedChargerIDs, setExpandedChargerIDs] = useState(new Set());
    const [address, setAddress] = useState('');
    const [addressAccess, setAddressAccess] = useState('');
    const [chargerCount, setChargerCount] = useState(0);
    const [connectorCount, setConnectorCount] = useState(0);
    const [connectorTypes, setConnectorTypes] = useState('');
    const [popup, setPopup] = useState(null);
   
    const auth = getAuth();
    const db = getDatabase();

    useEffect(() => {
        // Fetch hosted chargers from Firebase Realtime Database
        const chargersRef = ref(db, 'hostedChargers');
        onValue(chargersRef, (snapshot) => {
            const chargersData = snapshot.val();
            if (chargersData) {
                const chargersList = Object.keys(chargersData).map((key) => ({
                    id: key,
                    ...chargersData[key],
                }));
                setUserChargers(chargersList);
            } else {
                setUserChargers([]);
                setPopup({
                    title: 'Info',
                    message: 'No hosted chargers found.',
                    type: 'info',
                });
            }
        });
    }, [db]);

    const toggleCharger = (chargerID) => {
        setExpandedChargerIDs((prevExpanded) => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(chargerID)) {
                newExpanded.delete(chargerID);
            } else {
                newExpanded.add(chargerID);
            }
            return newExpanded;
        });
    };

    const handleAddChargerSubmission = async (e) => {
        e.preventDefault();
    
        if (!address || !addressAccess || !connectorTypes) {
            setPopup({
                title: 'Error',
                message: 'Please fill out all required fields.',
                type: 'error',
            });
            return;
        }
    
        try {
            // Add new charger to Firebase Realtime Database
            const chargersRef = ref(db, 'hostedChargers');
            const newChargerRef = push(chargersRef);
    
            await set(newChargerRef, {
                address,
                addressAccess,
                connectorCount,
                connectorTypes,
                isAvailable: true, // Initially available
                currentUsers: 0, // Tracks connected users
                hostId: auth.currentUser.uid, // Store host's user ID
              });
              
    
            setPopup({
                title: 'Success',
                message: 'Charging point added successfully!',
                type: 'success',
            });
    
            // Reset form fields
            setAddress('');
            setAddressAccess('');
            setConnectorCount(0);
            setConnectorTypes('');
        } catch (error) {
            setPopup({
                title: 'Error',
                message: 'Failed to add charging point.',
                type: 'error',
            });
            console.error('Error adding charging point:', error);
        }
    };
    
    return (
        <div className="host-services-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Host Services</h1>
                <p>Host your own EV charging services.</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="host-services-container">
                        <h2>Host your own services</h2>
                        <small>If you'd like to host multiple charging points, register each one separately</small>
                        <div className="hr-div"></div>
                        <form className="host-services-form" onSubmit={handleAddChargerSubmission}>

                            <div className="host-services-form-item address-input-container">
                                <div>
                                    <label htmlFor="address">Where are you hosting from?</label>
                                    <small>Enter address (e.g 23 Xanford Road, XS12 4HJ)</small>
                                </div>
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item address-access-input-container">
                                <div className="">
                                    <label htmlFor="address-access">Is the address accessible?</label>
                                    <small>Public(open to everyone) or Private(Gated/permission required)</small>
                                </div>
                                <input
                                    id="address-access"
                                    type="text"
                                    value={addressAccess}
                                    onChange={(e) => setAddressAccess(e.target.value)}
                                />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item connector-count-input-container">
                                <label htmlFor="connector-count">How many connectors on your charger?</label>
                                <input
                                    id="connector-count"
                                    type="number"
                                    min="0"
                                    onChange={(e) => setConnectorCount(Number(e.target.value))}
                                />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item connector-types-input-container">
                                <label htmlFor="connector-types">{connectorCount > 1
                                    ? "What connectors are available?"
                                    : "What connector is available?"}</label>
                                <select
                                    id="connector-types"
                                    value={connectorTypes}
                                    onChange={(e) => setConnectorTypes(e.target.value)}
                                >
                                    <option value="">Select Connector Type</option>
                                    <option value="Type1">Type 1</option>
                                    <option value="Type2">Type 2</option>
                                    <option value="CCS">CCS</option>
                                    <option value="CHAdeMO">CHAdeMO</option>
                                    <option value="Tesla">Tesla</option>
                                </select>
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>

                <div className="user-options-hr-div"></div>

                <div className="user-options-grid">
                    <div className="current-hosted-chargers-container">
                        <h2>Your Hosted Chargers</h2>
                        <div className="hr-div"></div>
                        <div className="view-hosted-chargers-container">
                            {userChargers.map((charger, index) => {
                                return (
                                    <div key={charger.id} className="charger-wrapper">
                                        <div className="charger-tab-container">
                                            <div
                                                className="charger-header-container"
                                                onClick={() => toggleCharger(charger.id)}
                                            >
                                                <h3><strong>Charger {charger.id}</strong></h3>
                                                <button className="toggle-charger-button-container">
                                                    {expandedChargerIDs.has(charger.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </button>
                                            </div>

                                            {expandedChargerIDs.has(charger.id) && (
                                                <div className="charger-details-container">
                                                    <p><strong>Address:</strong> {charger.address}</p>
                                                    <p><strong>Charger Type:</strong> {charger.connector}</p>
                                                    <div className="charger-actions-buttons-container">
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

export default HostServices;
