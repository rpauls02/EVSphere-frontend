import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CountryCodeSelect from './CountryCodeSelect';
import { handleSignup } from '../../../utils/SignupHandler';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import logo from '../../../assets/logo.png';
import './Signup.css';

const SignupForm: React.FC = () => {
    const [currentPhase, setCurrentPhase] = useState<'roleSelection' | 'form'>('roleSelection');
    const [role, setUserRole] = useState<'buyer' | 'seller'>('buyer');
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');
    const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const passwordsMatch = password === confirmPassword;

    const resetForm = () => {
        setCompanyName('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCountryCode('+44');
        setMobileNumber('');
    };

    const requirements = {
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialCharacter: /[-/\\!@\u00a3\'\u20ac#$%^;&*(),.?":{}|<>]/.test(password),
        numerics: /\d/.test(password),
        minLength: password.length >= 12,
        maxLength: password.length <= 64,
    };

    const renderIcon = (condition: boolean) => {
        return condition ? <CheckIcon style={{ color: 'green' }} /> : <CloseIcon style={{ color: 'red' }} />;
    };

    const renderOptionalIcon = (condition: boolean) => {
        return condition ? <RadioButtonUncheckedIcon style={{ color: 'gray' }} /> : <CheckIcon style={{ color: 'green' }} />;
    };

    const handleSignupSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        await handleSignup(
            event,
            role,
            firstName,
            lastName,
            email,
            countryCode,
            mobile,
            password,
            confirmPassword,
            companyName,
            (message, type) => setPopup({ message, type }),
            resetForm
        );
    };

    if (currentPhase === 'roleSelection') {
        return (
            <div className="signup-page-container">
                <div className="signup-form-container">
                    <div className="logo-container">
                        <img src={logo} alt="sec-logo" />
                    </div>
                    <h1>Select your role</h1>
                    <div className="user-role-select-container">
                        <button
                            className="role-button"
                            onClick={() => {
                                setUserRole('buyer');
                                setCurrentPhase('form');
                            }}
                        >
                            Buyer
                        </button>
                        <button
                            className="role-button"
                            onClick={() => {
                                setUserRole('seller');
                                setCurrentPhase('form');
                            }}
                        >
                            Seller
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="signup-page-container">
            <div className="signup-form-container">
                <div className="logo-container">
                    <img src={logo} alt="sec-logo" />
                </div>
                <div className="existing-user-option-container">
                    <p>
                        <strong>Already have an account?</strong>{' '}
                        <Link className="react-link" to="/login">
                            <strong>Login</strong>
                        </Link>
                    </p>
                </div>
                <h1>Create your {role === 'seller' ? 'Seller' : 'Buyer'} Account</h1>

                {popup && (
                    <div className={`popup ${popup.type}`}>
                        {popup.message}
                    </div>
                )}

                <form onSubmit={handleSignupSubmission} className="signup-form">
                    {role === 'seller' && (
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="input-field company-name-input"
                        />
                    )}
                    <input
                        type="text"
                        placeholder="First Name*"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="input-field first-name-input"
                    />
                    <input
                        type="text"
                        placeholder="Last Name*"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="input-field last-name-input"
                    />
                    <input
                        type="email"
                        placeholder="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field email-input"
                    />
                    <div className="mobile-input-container">
                        <div className="input-group">
                            <CountryCodeSelect countryCode={countryCode} setCountryCode={setCountryCode} />
                            <input
                                type="tel"
                                placeholder="Mobile Number*"
                                value={mobile}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="input-field mobile-input"
                            />
                        </div>
                    </div>
                    <div className="password-input-container">
                        <input
                            type="password"
                            placeholder="Password*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`input-field password-input ${!passwordsMatch && confirmPassword ? 'error' : ''}`}
                        />
                        <input
                            type="password"
                            placeholder="Confirm password*"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`input-field confirm-password-input ${!passwordsMatch && confirmPassword ? 'error' : ''}`}
                        />
                        <div className="password-requirements-container">
                            <div className="left-col">
                                <p className="password-requirements-item">{renderIcon(requirements.uppercase)}One uppercase letter</p>
                                <p className="password-requirements-item">{renderIcon(requirements.lowercase)}One lowercase letter</p>
                                <p className="password-requirements-item">{renderIcon(requirements.specialCharacter)}One special character</p>
                            </div>
                            <div className="right-col">
                                <p className="password-requirements-item">{renderIcon(requirements.numerics)}One numeric character</p>
                                <p className="password-requirements-item">{renderIcon(requirements.minLength)} Minimum length: 12 characters</p>
                                <p className="password-requirements-item">{renderOptionalIcon(requirements.maxLength)} Maximum length: 64 characters</p>
                            </div>
                        </div>
                    </div>
                    <div id="recaptcha-container"></div>
                    <button className="submit-signup-button" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
