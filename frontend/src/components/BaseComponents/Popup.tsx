import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './Popup.css';

interface PopupProps {
    title: string;
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, message, type, onClose }) => {
    return (
        <div className={`popup-container ${type}`}>
            <div className="popup-content">
                <div className="popup-header">
                    <h2 className="popup-title">{title}</h2>
                    <CloseIcon className="popup-close" onClick={onClose} />
                </div>
                <p className="popup-message">{message}</p>
            </div>
        </div>
    );
};

export default Popup;