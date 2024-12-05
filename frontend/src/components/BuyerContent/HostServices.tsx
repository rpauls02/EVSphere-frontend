import React, { useState, useEffect } from 'react';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchUserChargers } from '../../utils/UserFetchFunctions';
import { addChargingPoint } from '../../utils/UserActionsFunctions';
import { UserCharger } from '../../utils/types'

import './HostServices.css';

const HostServices: React.FC = () => {
    const [userChargers, setUserChargers] = useState<UserCharger[]>([]);
    const [expandedChargerIDs, setExpandedChargerIDs] = useState<Set<string>>(new Set());
    const [address, setAddress] = useState<string>('');
    const [addressAccess, setAddressAccess] = useState<string>('');
    const [chargerCount, setChargerCount] = useState<number>(0);
    const [connectorCount, setConnectorCount] = useState<number>(0);
    const [connectorTypes, setConnectorTypes] = useState<string>('');
    const [popup, setPopup] = useState<{
        title: string;
        message: string;
        type: 'error' | 'success';
    } | null>(null);

    useEffect(() => {
        const getUserChargingPoints = async () => {
            try {
                const fetchedChargers = await fetchUserChargers();
                if (Array.isArray(fetchedChargers)) {
                    setUserChargers(fetchedChargers);
                } else {
                    setPopup({
                        title: 'Error',
                        message: 'No chargers found for this user.',
                        type: 'error',
                    });
                }
            } catch (error) {
                setPopup({
                    title: 'Error',
                    message: 'Error retrieving user chargers.',
                    type: 'error',
                });
                console.error('Error retrieving user chargers:', error);
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
            await addChargingPoint(
                address,
                addressAccess,
                connectorCount,
                connectorTypes,
                () => {
                    setPopup({
                        title: 'Error',
                        message: 'Failed to add charging points.',
                        type: 'error',
                    });
                },
                () => {
                    setPopup({
                        title: 'Success',
                        message: 'Charging point added successfully!',
                        type: 'success',
                    });
                    setAddress('');
                    setAddressAccess('');
                    setConnectorCount(0);
                    setConnectorTypes("");
                }
            );
        } catch (error) {
            setPopup({
                title: 'Error',
                message: 'Unexpected error occurred while adding charging points.',
                type: 'error',
            });
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
                                <label htmlFor="connector-count">How many connectors on the charger?</label>
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
