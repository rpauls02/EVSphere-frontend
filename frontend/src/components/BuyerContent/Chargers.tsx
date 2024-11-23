import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BuyerSidebar from './BuyerSidebar';
import axios from 'axios';
import './Chargers.css';

const Chargers: React.FC = () => {
    return (
        <div className="chargers-page-container">
            <BuyerSidebar />

            <div className="page-title-container">
                <h1>Manage your favourite chargers</h1>
            </div>
            <div className="user-options-container">
                <div className="fav-chargers-container">
                    <button>Add to Favorites</button>
                    <button>Remove from Favorites</button>
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Chargers;