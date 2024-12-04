import React from 'react';
import BuyerSidebar from './BuyerSidebar';
import './Invoices.css';

const Reports: React.FC = () => {
    return (
        <div className="invoices-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Reports</h1>
                <p>View and download reports generated based on data collected about your charging trends</p>
                <div className="hr-div"></div>
                <div className="reports-list-container">

                </div>
            </div>
        </div>
    );
}

export default Reports;