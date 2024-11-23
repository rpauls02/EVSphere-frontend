import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BuyerSidebar from './BuyerSidebar';
import axios from 'axios';
import './Reports.css';

const Reports: React.FC = () => {
    return (
        <div className="reports-page-container">
            <BuyerSidebar/>
            <h2>Generate Charging Reports</h2>
            {/* Add date range and other filters */}
            <button>Generate Report</button>
            {/* Display generated reports here */}
        </div>
    );
}

export default Reports;