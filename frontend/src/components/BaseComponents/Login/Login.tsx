import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin, handleGoogleAuth } from '../../../utils/LoginHandler';
import { FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa';
import logo from '../../../assets/logo.png'
import Footer from '../Footer';
import './Login.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isErrorPopup, setIsErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin(email, password, setPopupMessage, setShowPopup, setIsErrorPopup, navigate);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleGoogleAuthSubmission = async () => {
    setLoading(true);
    await handleGoogleAuth(setPopupMessage, setLoading, () => {
      setShowPopup(true);
      setIsErrorPopup(false);
    }, navigate);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };


  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <div className="login-logo-container">
          <img src={logo} alt="evsphere-logo" />
        </div>
        <p className="new-user-option-container">
          New to us? <Link className="react-link" to="/signup">Create an account</Link>
        </p>
        <div className="login-options-container">
          <div className="email-login-section">
            <form onSubmit={handleLoginSubmission}>
              <div className="form-group">
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="input-field"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="forgot-password-link">
                <Link className="forgot-password-link" to="/reset-password">Forgot password?</Link>
              </div>

              <button className="login-button" type="submit">Login</button>

              <div className="remember-me-checkbox">
                <label htmlFor="remember">Remember me</label>
                <input type="checkbox" id="remember" />
              </div>
            </form>
          </div>

          <div className="separator"></div>

          <div className="social-login-section">
            <div className="social-login-buttons">
              <button className="social-button google-auth-button" onClick={handleGoogleAuthSubmission} disabled={loading}>
                <div className="social-icon"><FaGoogle size={24} /></div>
                <span>{loading ? 'Loading...' : 'Continue with Google'}</span>
              </button>
              <button className="social-button facebook-auth-button">
                <div className="social-icon"><FaFacebook size={24} /></div>
                <span>Continue with Facebook</span>
              </button>
              <button className="social-button microsoft-auth-button">
                <div className="social-icon"><FaMicrosoft size={24} /></div>
                <span>Continue with Microsoft</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={`popup ${isErrorPopup ? 'popup-error' : ''}`}>
          {popupMessage}
        </div>
      )}

      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default LoginForm;
