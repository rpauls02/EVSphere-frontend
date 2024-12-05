import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuyerSidebar from './BuyerSidebar';
import './Invoices.css';

const Invoice: React.FC = () => {
    const [invoices, setInvoices] = useState<string[]>([])
    const [expandedInvoiceIDs, setExpandedInvoiceIDs] = useState<Set<string>>(new Set());

    const formatDateAndTime = (bookedAt: any) => {
        const date = bookedAt.toDate();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedTime = `${hours}:${minutes}${ampm}`;

        return { formattedDate, formattedTime };
    };

    const toggleInvoice = (invoiceID: string) => {
        setExpandedInvoiceIDs((prevExpanded) => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(invoiceID)) {
                newExpanded.delete(invoiceID);
            } else {
                newExpanded.add(invoiceID);
            }
            return newExpanded;
        });
    };

    return (
        <div className="invoices-page-container">
            <div className="sidebar-container">
                <BuyerSidebar />
            </div>
            <div className="user-options-container">
                <h1>Invoices</h1>
                <p>View and download your invoices</p>
                <div className="hr-div"></div>
                <div className="invoices-list-container">
                    {invoices.map((invoice, index) => {
                        const { formattedDate, formattedTime } = formatDateAndTime(invoice.issuedAt);

                        return (
                            <div key={invoice.id} className="invoice-wrapper">
                                <div className="invoice-tab-container">
                                    <div
                                        className="invoice-header-container"
                                        onClick={() => toggleInvoice(invoice.id)}
                                    >
                                        <h3><strong>{formattedDate} @ {formattedTime}</strong></h3>
                                        <button className="toggle-invoice-button-container">
                                            {expandedInvoiceIDs.has(invoice.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </button>
                                    </div>

                                    {expandedInvoiceIDs.has(invoice.id) && (
                                        <div className="invoice-details-container">
                                            <p><strong>Invoice Date:</strong> {formattedDate}</p>
                                            <p><strong>Invoice Time:</strong> {formattedTime}</p>
                                            <p><strong>Total:</strong> {invoice.total}</p>
                                            <p><strong>Status:</strong> {invoice.status}</p>
                                            <div className="invoice-actions-buttons-container">
                                                <button onClick={() => handleDownload(invoice.id)}>Download Invoice</button>
                                                <button onClick={() => handleDispute(invoice.id)}>Raise Dispute</button>
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
    );
}

export default Invoice;