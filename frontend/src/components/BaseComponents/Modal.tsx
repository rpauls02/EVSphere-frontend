import React from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onConfirm: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, onConfirm, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>{title}</h2>
                {children}
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="modal-confirm-button">Confirm</button>
                    <button onClick={onClose} className="modal-cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};
