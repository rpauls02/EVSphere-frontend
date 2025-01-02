import React, { useState, useEffect } from 'react';
import Sidebar from '../BaseComponents/Sidebar'
import './Chargers.css';

const Chargers: React.FC = () => {

    return (
        <div className="chargers-page-container">
            <div className="sidebar-container">
                <Sidebar />
            </div>
            <div className="user-options-container">
                <h1>Chargers</h1>
                <p>Find chargers on the go</p>
                <div className="hr-div"></div>
                <div className="user-options-grid">
                    <div className="gmaps-container">

                    </div>
                </div>
            </div>
        </div>
    );

};


export default Chargers;