import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../../../utils/LoginHandler';
import { FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa'; // Material Icons for social logins
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isErrorPopup, setIsErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin(email, password, setPopupMessage, setShowPopup, setIsErrorPopup, navigate);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-section">
          <p className="new-user-option">
            New to EVSphere? <Link className="react-link" to="/signup">Create an account</Link>
          </p>
          <form onSubmit={handleSubmission}>
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
            <small><Link className="forgot-password-link" to="/reset-password">Forgot password?</Link></small>
            <div className="remember-me-checkbox">
              <label htmlFor="remember">Remember me</label>
              <input type="checkbox" id="remember" />
            </div>
            <button className="login-button" type="submit">Login</button>
          </form>
        </div>

        <div className="separator"></div>

        <div className="social-login-section">
          <div className="social-login-buttons">
            <button className="social-button">
              <div className="social-icon"><FaGoogle size={24} /></div>
              <span>Continue with Google</span>
            </button>
            <button className="social-button">
              <div className="social-icon"><FaFacebook size={24} /></div>
              <span>Continue with Facebook</span>
            </button>
            <button className="social-button">
              <div className="social-icon"><FaMicrosoft size={24} /></div>
              <span>Continue with Microsoft</span>
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={`popup ${isErrorPopup ? 'popup-error' : ''}`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
