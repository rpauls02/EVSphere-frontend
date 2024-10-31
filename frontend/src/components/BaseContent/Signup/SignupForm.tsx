import React, { useState } from 'react';
import './Signup.css';
import CountryCodeSelect from './CountryCodeSelect';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CombinedSignupForm = () => {
    const [userType, setUserType] = useState('buyer'); // Toggle between "buyer" and "seller"
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();
        const mobileNumber = `${countryCode}${mobile}`;

        try {
            // Firebase Auth: Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocData = {
                firstName,
                lastName,
                email,
                mobile: mobileNumber,
                userType,
            };

            if (userType === 'seller') {
                userDocData.companyName = companyName;
            }

            // Save user information to Firestore
            await setDoc(doc(db, 'users', user.uid), userDocData);

            console.log("User created and data saved to Firestore");
            alert("Signup successful!");

        } catch (error) {
            console.error("Error signing up:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="form-group">
            <button className="signup-return-role-select">
                <Link to="/signup"><ArrowBackIcon /></Link>
            </button>
            <h2>Create your {userType === 'seller' ? "Seller" : "Buyer"} Account</h2>
            
            {/* Toggle between Buyer and Seller */}
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

            <form onSubmit={handleSignup}>
                {/* Conditionally render company name input for sellers */}
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

export default CombinedSignupForm;
