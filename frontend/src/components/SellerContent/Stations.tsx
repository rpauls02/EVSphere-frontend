import React from 'react';
import SellerSidebar from './SellerSidebar';
import './Stations.css';

const Stations: React.FC = () => {
    return (
        <div className="settings-page-container">
            <div className="sidebar-container">
                <SellerSidebar/>
            </div>
        </div>
    );
}

export default Stations