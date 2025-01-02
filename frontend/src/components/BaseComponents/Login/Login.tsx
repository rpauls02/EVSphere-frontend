import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin, handleGoogleAuth } from '../../../utils/LoginHandler';
import GoogleIcon from '@mui/icons-material/Google';
import ErrorIcon from '@mui/icons-material/Error';
import logo from '../../../assets/logo.png';
import './Login.css';

const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, showPopup] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    showPopup(null);

    try {
      const result = await handleLogin(identifier, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        showPopup(result.message || 'Invalid user credentials entered. Try again.');
      }
    } catch (error) {
      showPopup('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuthSubmission = async () => {
    setLoading(true);
    showPopup(null);
    try {
      const googleAuthResult = await handleGoogleAuth();

      if (googleAuthResult.success) {
        navigate('/buyer-dashboard');
      } else {
        showPopup(googleAuthResult.message || 'Invalid user credentials entered. Try again.');
      }
    } catch (error) {
      showPopup('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src={logo} alt="sec-logo" />
        </div>
        <div className="new-user-option-container">
          <p>
            <strong>New to us?</strong> <Link className="react-link" to="/signup"><strong>Create an account</strong></Link>
          </p>
        </div>

        {popup && (
          <div className="login-error-popup-container">
            <div className="error-popup-icon">
              <ErrorIcon />
            </div>
            <div className="error-popup-message">
              <p>{popup}</p>
            </div>
          </div>
        )}

        <div className="login-options-container">
          <div className="email-login-container">
            <form onSubmit={handleLoginSubmission}>
              <div className="form-group">
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email or Phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  inputMode="email"
                  pattern="^(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}|[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$"
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

              <div className="remember-me-option-container">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <div className="recaptcha-container"></div>

              <button className="login-button" type="submit">Login</button>
            </form>
          </div>

          <div className="separator"></div>

          <div className="social-login-container">
            <div className="social-login-buttons">
              <button className="social-button google-auth-button" onClick={handleGoogleAuthSubmission} disabled={loading}>
                <div className="social-icon"><GoogleIcon /></div>
                <span>{loading ? 'Loading...' : 'Login with Google'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
