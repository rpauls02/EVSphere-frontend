import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin, handleGoogleAuth } from '../../../utils/LoginHandler';
import { FaGoogle } from 'react-icons/fa';
import Popup from '../../BaseComponents/Popup';
import logo from '../../../assets/logo.png';
import './Login.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupData, setPopupData] = useState<{ title: string; message: string; type: 'error' | 'success'; visible: boolean }>({
    title: '',
    message: '',
    type: 'success',
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showPopup = (title: string, message: string, type: 'error' | 'success') => {
    setPopupData({ title, message, type, visible: true });
    setTimeout(() => {
      setPopupData((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLoginSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await handleLogin(email, password);

    if (result.success) {
      if (result.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (result.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      showPopup('Login Error', result.message, 'error');
    }
  };

  const handleGoogleAuthSubmission = async () => {
    setLoading(true);
    const response = await handleGoogleAuth();

    if (response.success) {
      showPopup('Login Success', response.message, 'success');
      navigate('/signup');
    } else {
      showPopup('Login Error', response.message, 'error');
    }

    setLoading(false);
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
        <div className="login-options-container">
          <div className="email-login-container">
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

              <div className="remember-me-option-container">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button className="login-button" type="submit">Login</button>

              <div className="forgot-password-option-container">
                <Link className="forgot-password-link" to="/reset-password">Forgot password?</Link>
              </div>
            </form>
          </div>

          <div className="separator"></div>

          <div className="social-login-container">
            <div className="social-login-buttons">
              <button className="social-button google-auth-button" onClick={handleGoogleAuthSubmission} disabled={loading}>
                <div className="social-icon"><FaGoogle size={24} /></div>
                <span>{loading ? 'Loading...' : 'Login with Google'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {popupData.visible && (
        <Popup
          title={popupData.title}
          message={popupData.message}
          type={popupData.type}
          onClose={() => setPopupData((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
};

export default LoginForm;
