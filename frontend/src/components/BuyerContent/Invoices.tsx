import React from 'react';
import BuyerSidebar from './BuyerSidebar';
import './Invoices.css';

const Invoice: React.FC = () => {
    return (
        <div className="invoices-page-container">
            <BuyerSidebar/>
            <h2>Select a month to view your invoices for</h2>
            <select className="select-invoice-menu">
                <option className="invoice-option" value="invoice-1"> </option>
                <option className="invoice-option" value="invoice-2"> </option>
                <option className="invoice-option" value="invoice-3"> </option>
            </select>
        </div>
    );
}

export default Invoice;