import React from 'react';
import './ToggleUserRole.css';

interface ToggleUserRoleProps {
    role: 'buyer' | 'seller';
    setUserRole: (role: 'buyer' | 'seller') => void;
}

const ToggleUserRole: React.FC<ToggleUserRoleProps> = ({ role, setUserRole }) => {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={role === 'seller'}
                onChange={() => setUserRole(role === 'buyer' ? 'seller' : 'buyer')}
            />
            <span className="slider round">
                <span className="role-label">{role === 'buyer' ? 'Buyer' : 'Seller'}</span>
            </span>
        </label>
    );
};

export default ToggleUserRole;
