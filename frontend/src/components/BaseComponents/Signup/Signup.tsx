import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CountryCodeSelect from './CountryCodeSelect';
import { handleSignup } from '../../../utils/SignupHandler';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import logo from '../../../assets/logo.png';
import './Signup.css';

const SignupForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneCode, setPhoneCode] = useState('+44');
    const [mobile, setMobileNumber] = useState('');
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [passwordRequirementsClass, setPasswordRequirementsClass] = useState('');
    const passwordsMatch = password === confirmPassword;
    const navigate = useNavigate();

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneCode('+44');
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

    const handleRequirementsShow = () => {
        setShowPasswordRequirements(true);
        setPasswordRequirementsClass('expanded');
    };

    const handleRequirementsHide = () => {
        setShowPasswordRequirements(false);
        setPasswordRequirementsClass('');
    };

    const renderIcon = (condition: boolean) => {
        return condition ? <CheckIcon style={{ color: 'green' }} /> : <CloseIcon style={{ color: 'red' }} />;
    };

    const renderOptionalIcon = (condition: boolean) => {
        return condition ? <RadioButtonUncheckedIcon style={{ color: 'gray' }} /> : <CheckIcon style={{ color: 'green' }} />;
    };

    const verifyPasswordMatch = () => {
        return password === confirmPassword;
    };

    const handleSignupSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        await handleSignup(
            event,
            firstName,
            lastName,
            email,
            phoneCode,
            mobile,
            password
        );
        navigate('/dashboard');
    };

    return (
        <div className="signup-page-container">
            <div className="signup-form-container">
                <h1>Create your account</h1>
                <div className="existing-user-option-container">
                    <p>
                        <strong>Already have an account?</strong>{' '}
                        <Link className="react-link" to="/login">
                            <strong>Login</strong>
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSignupSubmission} className="signup-form">
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
                            <CountryCodeSelect phoneCode={phoneCode} setPhoneCode={setPhoneCode} />
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
                            onFocus={handleRequirementsShow}
                            onBlur={handleRequirementsHide}
                            required
                            className={`input-field password-input ${!passwordsMatch && confirmPassword ? 'error' : ''}`}
                        />
                        {showPasswordRequirements && (
                            <div className={`password-requirements-container ${passwordRequirementsClass}`}>
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
                        )}
                        <input
                            type="password"
                            placeholder="Confirm password*"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`input-field confirm-password-input ${!passwordsMatch && confirmPassword ? 'error' : ''}`}
                        />
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
