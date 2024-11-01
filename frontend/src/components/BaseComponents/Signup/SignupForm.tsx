import React, { useState } from 'react';
import CountryCodeSelect from './CountryCodeSelect';
import { handleSignup } from './SignupHandler';
import ToggleUserRole from './ToggleUserRole';
import './SignupForm.css';

const SignupForm = () => {
    const [role, setUserRole] = useState<'buyer' | 'seller'>('buyer');
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');
    const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const onSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        await handleSignup(
            event, 
            role, 
            firstName, 
            lastName, 
            email, 
            countryCode, 
            mobile, 
            password, 
            companyName, 
            (message, type) => setPopup({ message, type })
        );
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Create your {role === 'seller' ? "Seller" : "Buyer"} Account</h2>

                {popup && (
                    <div className={`popup ${popup.type}`}>
                        {popup.message}
                    </div>
                )}

                <ToggleUserRole role={role} setUserRole={setUserRole} />

                <form onSubmit={onSignup} className="signup-form">
                    {role === 'seller' && (
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="input-field"
                        />
                    )}
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <div className="mobile-input-container">
                        <div className="input-group">
                            <CountryCodeSelect countryCode={countryCode} setCountryCode={setCountryCode} />
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>
                    <button type="submit" className="signup-button">
                        Continue
                    </button>
                </form>

                <p className="already-member">
                    Already a member? <a href="/login" className="react-link">Sign in here</a>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
