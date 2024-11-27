import React, { useState } from 'react';
import BuyerSidebar from '../BuyerContent/BuyerSidebar';
import './HostServices.css';

const HostServices: React.FC = () => {
    const [address, setAddress] = useState('');
    const [chargerCount, setChargerCount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Selected address:', address);
        console.log('Charger count:', chargerCount);
    };

    return (
        <div className="host-services-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Host Services</h1>
                <p>Host your own EV charging services</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="host-services-container">
                        <form className="host-services-form" onSubmit={handleSubmit}>
                            <h2>Select address to host services at</h2>

                            <div className="user-address-select">
                                <label htmlFor="address">Select address</label>
                                <select
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                >
                                    <option value="">Select address</option>
                                    <option value="address-1">Address 1</option>
                                    <option value="address-2">Address 2</option>
                                    <option value="address-3">Address 3</option>
                                </select>
                            </div>

                            <div className="user-charger-count-input">
                                <label htmlFor="chargerCount">How many chargers?</label>
                                <input
                                    id="chargerCount"
                                    type="number"
                                    value={chargerCount}
                                    onChange={(e) => setChargerCount(e.target.value)}
                                    placeholder="Number of chargers"
                                />
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    </div>

                    <div className="current-host-services-container">
                        <h2>Your currently hosted chargers</h2>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default HostServices;
