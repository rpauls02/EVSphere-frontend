import React, { useState } from 'react';
import './Signup.css';
import CountryCodeSelect from './CountryCodeSelect';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import onSignup from './onSignup';

const SellerSignupForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Add password state
    const [countryCode, setCountryCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();
        const mobileNumber = `${countryCode}${mobile}`;

        try {
            // Firebase Auth: Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user information to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                email,
                mobile: mobileNumber,
            });

            onSignup && onSignup({ uid: user.uid, firstName, lastName, email, mobile: mobileNumber });
            console.log("User created and data saved to Firestore");

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error signing up:", error);
                alert(`Error: ${error.message}`);
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="form-group">
            <button className="signup-return-role-select">
                <Link to="/signup"><ArrowBackIcon /></Link>
            </button>
            <h2>Create your Buyer Account</h2>
            <form onSubmit={handleSignup}>
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

export default SellerSignupForm;
