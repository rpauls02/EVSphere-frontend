import React, { useState } from 'react';
import CountryCodeSelect from './CountryCodeSelect';
import { handleSignup } from './handleSignup';
import './SignupForm.css';

const SignupForm = () => {
    const [userType, setUserType] = useState('buyer');
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');

    const onSignup = (event: React.FormEvent<HTMLFormElement>) => {
        handleSignup(event, email, password, firstName, lastName, mobile, countryCode, userType, companyName);
    };

    return (
        <div className="signup-container">
            <h2>Create your {userType === 'seller' ? "Seller" : "Buyer"} Account</h2>
            
            <div className="user-type-toggle">
                <button
                    className={`toggle-button ${userType === 'buyer' ? 'active' : ''}`}
                    onClick={() => setUserType('buyer')}
                >
                    Buyer
                </button>
                <button
                    className={`toggle-button ${userType === 'seller' ? 'active' : ''}`}
                    onClick={() => setUserType('seller')}
                >
                    Seller
                </button>
            </div>

            <form className="signup-form" onSubmit={onSignup}>
                {userType === 'seller' && (
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
        </div>
    );
};

export default SignupForm;
