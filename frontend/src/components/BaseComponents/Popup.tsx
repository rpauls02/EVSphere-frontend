import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './Popup.css';

interface PopupProps {
    title: string;
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
    autoDismiss?: boolean; // Optional prop to auto-dismiss the popup
    dismissDelay?: number; // Time in ms before auto-dismiss, default is 60000ms
}

const Popup: React.FC<PopupProps> = ({
    title,
    message,
    type,
    onClose,
    autoDismiss = true,
    dismissDelay = 5000,
}) => {
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (autoDismiss) {
            timer = setTimeout(onClose, dismissDelay);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoDismiss, dismissDelay, onClose]);

    return (
        <div className={`popup-container ${type}`}>
            <div className="popup-content">
                <div className="popup-header">
                    <h2 className="popup-title">{title}</h2>
                    <CloseIcon
                        className="popup-close"
                        onClick={onClose}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <p className="popup-message">{message}</p>
            </div>
        </div>
    );
};

export default Popup;
