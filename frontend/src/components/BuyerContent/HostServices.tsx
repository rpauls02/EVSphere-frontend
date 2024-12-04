import React, { useState, useEffect } from 'react';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchUserChargers } from '../../utils/UserFetchFunctions';
import { handleAddChargers } from '../../utils/UserDetailsFunctions';
import { UserChargers } from '../../utils/types'

import './HostServices.css';

const HostServices: React.FC = () => {
    const [userChargers, setUserChargers] = useState<UserChargers[]>([]);
    const [expandedChargerIDs, setExpandedChargerIDs] = useState<Set<string>>(new Set());
    const [address, setAddress] = useState<string>('');
    const [addressAccess, setAddressAccess] = useState<string>('');
    const [chargerType, setChargerType] = useState<string>('');
    const [chargerCount, setChargerCount] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getUserChargingPoints = async () => {
            try {
                const fetchedChargers = await fetchUserChargers();
                if (Array.isArray(fetchedChargers)) {
                    setUserChargers(fetchedChargers);
                } else {
                    console.error("No chargers found for this user.");
                }
            } catch (error) {
                console.error("Error retrieving user chargers:", error);
            }
        };

        getUserChargingPoints();
    }, []);

    const toggleCharger = (chargerID: string) => {
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


    const handleAddChargerSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await handleAddChargers(
                address,
                addressAccess,
                chargerCount,
                chargerType,
                setError,
                setLoading,
                () => {
                    setError('');
                    alert('Charging points added successfully!');
                    setChargerCount(0);
                }
            );
        } catch (error) {
            console.error('Failed to add charging points:', error);
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
                        <div className="hr-div"></div>
                        <form className="host-services-form" onSubmit={handleAddChargerSubmission}>

                            <div className="host-services-form-item address-input-container">
                                <div>
                                    <label htmlFor="address">Where are you hosting from?</label>
                                    <small>Enter address (e.g 23 Xanford Road, XS12 4HJ)</small>
                                </div>
                                <input id="address" type="text" />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item address-access-input-container">
                                <div className="">
                                    <label htmlFor="address-access">Is the address accessible?</label>
                                    <small>Public(open to everyone) or Private(Gated/permission required)</small>
                                </div>
                                <input id="address-access" type="text" />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item charger-count-input-container">
                                <label htmlFor="charger-count">How many chargers?</label>
                                <input
                                    id="charger-count"
                                    type="number"
                                    min="0"
                                    onChange={(e) => setChargerCount(Number(e.target.value))}
                                />
                            </div>

                            <div className="hr-div"></div>

                            <div className="host-services-form-item charger-type-input-container">
                                <label htmlFor="charger-type">{chargerCount > 1
                                    ? "What connectors are available?"
                                    : "What connector is available?"}</label>
                                <small>Enter supported connectors separated by commas (e.g. CCS2, Type 2, Type 1)</small>
                                <input id="charger-type" type="text" />
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
                                                    <p><strong>Charger Type:</strong> {charger.chargerType}</p>
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
