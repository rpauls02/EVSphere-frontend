import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Invoices.css';

const Invoice: React.FC = () => {
    return (
        <div className="section">
            <h2>Generate Invoices</h2>
            {/* Add date selection or specific filters */}
            <button>Generate Invoice</button>
            {/* Display invoices, allow download option */}
        </div>
    );
}

export default Invoice;